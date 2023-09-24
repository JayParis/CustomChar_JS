
precision mediump float;

uniform sampler2D uShadowMap;
uniform float uTime;

varying vec3 Normal;
varying vec2 TexCoord;
varying vec3 Position;



void main()
{
    vec3 lightDirection = vec3(0.0,1.0,0.0);
    float lighting = dot(Normal,lightDirection);
    float bright = 6.0;

    vec4 shadowMap0 = texture2D(uShadowMap, TexCoord);

    // gl_FragColor = vec4(lighting * bright, 0.0, 0.0, 1.0); //tmp5
    gl_FragColor = vec4(shadowMap0.rgb, 1.0);
}

