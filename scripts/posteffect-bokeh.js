// --------------- POST EFFECT DEFINITION --------------- //
/**
 * @class
 * @name BokehEffect
 * @classdesc Implements the BokehEffect post processing effect.
 * @description Creates new instance of the post effect.
 * @augments PostEffect
 * @param {GraphicsDevice} graphicsDevice - The graphics device of the application.
 * @property {number} maxBlur The maximum amount of blurring. Ranges from 0 to 1.
 * @property {number} aperture Bigger values create a shallower depth of field.
 * @property {number} focus Controls the focus of the effect.
 */
function BokehEffect(graphicsDevice) {
    pc.PostEffect.call(this, graphicsDevice);

    this.needsDepthBuffer = true;

    // Shader author: alteredq / http://alteredqualia.com/
    // Depth-of-field shader with bokeh
    // ported from GLSL shader by Martins Upitis
    // http://artmartinsh.blogspot.com/2010/02/glsl-lens-blur-filter-with-bokeh.html
    var fshader = [
        pc.shaderChunks.screenDepthPS,
        `
        varying vec2 vUv0;

        uniform sampler2D uColorBuffer;

        uniform float uMaxBlur;  // max blur amount
        uniform float uAperture; // uAperture - bigger values for shallower depth of field

        uniform float uFocus;
        uniform float uAspect;

        float x_array[8] = float[8](0.15,-0.37,0.37,-0.15,-0.15,0.37,-0.37, 0.15);
        float y_array[8] = float[8](0.37,0.15,-0.15,-0.37,0.37,0.15,-0.15,-0.37);

        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main()
        {
            vec2 aspectCorrect = vec2( 1.0, uAspect );

            vec2 dofblur = vec2(0.0075,0.0075); //0.0095

            vec2 dofblur9 = dofblur * 0.9;

            float dpth = map(getLinearScreenDepth(vUv0) / camera_params.y, 0.004,0.0050,1.0,0.0);
            dpth = clamp(dpth, 0.0, 1.0);
            for (int i = 0; i < 8; i += 1) {
                float tmp_dpth = map(getLinearScreenDepth(vUv0 + ( vec2(  x_array[i],  y_array[i] ) * aspectCorrect) * dofblur9) / camera_params.y, 0.004,0.0050,1.0,0.0);
                dpth += clamp(tmp_dpth, 0.0, 1.0);
            }
            dpth = clamp(dpth / 9.0, 0.0, 1.0);
            dpth = map(dpth,0.0,0.99,0.0,1.0);
            dpth = clamp(dpth, 0.0, 1.0);


            dofblur9 = dofblur * 0.9 * (1.0 - dpth);
            vec2 dofblur7 = dofblur * 0.7 * (1.0 - dpth);
            vec2 dofblur4 = dofblur * 0.4 * (1.0 - dpth);

            vec4 col;

            col  = texture2D( uColorBuffer, vUv0 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.0,   0.4  ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.15,  0.37 ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.29,  0.29 ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.37,  0.15 ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.40,  0.0  ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.37, -0.15 ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.29, -0.29 ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.15, -0.37 ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.0,  -0.4  ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.15,  0.37 ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.29,  0.29 ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.37,  0.15 ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.4,   0.0  ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.37, -0.15 ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.29, -0.29 ) * aspectCorrect ) * dofblur );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.15, -0.37 ) * aspectCorrect ) * dofblur );

            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.15,  0.37 ) * aspectCorrect ) * dofblur9 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.37,  0.15 ) * aspectCorrect ) * dofblur9 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.37, -0.15 ) * aspectCorrect ) * dofblur9 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.15, -0.37 ) * aspectCorrect ) * dofblur9 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.15,  0.37 ) * aspectCorrect ) * dofblur9 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.37,  0.15 ) * aspectCorrect ) * dofblur9 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.37, -0.15 ) * aspectCorrect ) * dofblur9 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.15, -0.37 ) * aspectCorrect ) * dofblur9 );

            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.29,  0.29 ) * aspectCorrect ) * dofblur7 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.40,  0.0  ) * aspectCorrect ) * dofblur7 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.29, -0.29 ) * aspectCorrect ) * dofblur7 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.0,  -0.4  ) * aspectCorrect ) * dofblur7 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.29,  0.29 ) * aspectCorrect ) * dofblur7 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.4,   0.0  ) * aspectCorrect ) * dofblur7 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.29, -0.29 ) * aspectCorrect ) * dofblur7 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.0,   0.4  ) * aspectCorrect ) * dofblur7 );

            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.29,  0.29 ) * aspectCorrect ) * dofblur4 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.4,   0.0  ) * aspectCorrect ) * dofblur4 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.29, -0.29 ) * aspectCorrect ) * dofblur4 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.0,  -0.4  ) * aspectCorrect ) * dofblur4 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.29,  0.29 ) * aspectCorrect ) * dofblur4 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.4,   0.0  ) * aspectCorrect ) * dofblur4 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2( -0.29, -0.29 ) * aspectCorrect ) * dofblur4 );
            col += texture2D( uColorBuffer, vUv0 + ( vec2(  0.0,   0.4  ) * aspectCorrect ) * dofblur4 );

            // gl_FragColor = vec4(1.0 - dpth);
            gl_FragColor = mix(col / 41.0, texture2D( uColorBuffer, vUv0 ), dpth);
            gl_FragColor.a = 1.0;

        }
        `
    ].join("\n");

    this.shader = pc.createShaderFromCode(graphicsDevice, pc.PostEffect.quadVertexShader, fshader, 'BokehShader', {
        aPosition: pc.SEMANTIC_POSITION
    });

    // Uniforms
    this.maxBlur = 0.02;
    this.aperture = 1;
    this.focus = 1;
}

BokehEffect.prototype = Object.create(pc.PostEffect.prototype);
BokehEffect.prototype.constructor = BokehEffect;

Object.assign(BokehEffect.prototype, {
    render: function (inputTarget, outputTarget, rect) {
        var device = this.device;
        var scope = device.scope;

        scope.resolve("uMaxBlur").setValue(this.maxBlur);
        scope.resolve("uAperture").setValue(this.aperture);
        scope.resolve("uFocus").setValue(this.focus);
        scope.resolve("uAspect").setValue(device.width / device.height);
        scope.resolve("uColorBuffer").setValue(inputTarget.colorBuffer);

        this.drawQuad(outputTarget, this.shader, rect);
    }
});

// ----------------- SCRIPT DEFINITION ------------------ //
var Bokeh = pc.createScript('bokeh');

Bokeh.attributes.add('maxBlur', {
    type: 'number',
    default: 0.02,
    min: 0,
    max: 1,
    title: 'Max Blur'
});

Bokeh.attributes.add('aperture', {
    type: 'number',
    default: 1,
    min: 0,
    max: 1,
    title: 'Aperture'
});

Bokeh.attributes.add('focus', {
    type: 'number',
    default: 1,
    title: 'Focus'
});

Bokeh.prototype.initialize = function () {
    this.effect = new BokehEffect(this.app.graphicsDevice);
    this.effect.maxBlur = this.maxBlur;
    this.effect.aperture = this.aperture;
    this.effect.focus = this.focus;

    this.on('attr', function (name, value) {
        this.effect[name] = value;
    }, this);

    var queue = this.entity.camera.postEffects;

    queue.addEffect(this.effect);

    this.on('state', function (enabled) {
        if (enabled) {
            queue.addEffect(this.effect);
        } else {
            queue.removeEffect(this.effect);
        }
    });

    this.on('destroy', function () {
        queue.removeEffect(this.effect);
    });
};
