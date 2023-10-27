var MainScene = pc.createScript('Main-Scene-Script');

MainScene.attributes.add('speed', { 
    type: 'number', default: 10 
});

MainScene.prototype.initialize = function() {
    //return;
    const bolt = assets.bolt.resource.instantiateRenderEntity({});
    bolt.rotate(0,180,0);
    bolt.setLocalScale(0.3,0.3,0.3);
    bolt.setPosition(0.0,-2.0,0.0);
    
    var shaderDefinition = {
        attributes: {
            vVertex: pc.SEMANTIC_POSITION,
            vNormal: pc.SEMANTIC_NORMAL,
            vTexCoord: pc.SEMANTIC_TEXCOORD0,
            vertex_boneIndices: pc.SEMANTIC_BLENDINDICES,
            vertex_boneWeights: pc.SEMANTIC_BLENDWEIGHT
        },
        vshader: assets.vs.resource,
        fshader: assets.fs.resource
    };
    
    var newShader = new pc.Shader(device, shaderDefinition);
    app.root.addChild(bolt);

    const customMat = new pc.Material();
    customMat.shader = newShader;
    customMat.update();

    let setupCustom = true;

    bolt.children[0].render.meshInstances[0].material = new pc.StandardMaterial();
    // bolt.children[0].render.meshInstances[0].material.specular.set(1, 1, 1);
    bolt.children[1].render.meshInstances[0].material = new pc.BasicMaterial();
    // bolt.children[1].render.meshInstances[0].material.diffuse.set(1.0,0.0,0.0);
    bolt.children[1].render.meshInstances[0].material.color.set(0.5333, 0.2901, 0.2862); // Outline
    bolt.children[1].render.meshInstances[0].material.cull = pc.CULLFACE_FRONT;
    bolt.children[2].render.meshInstances[0].material = new pc.StandardMaterial();
    bolt.children[2].render.meshInstances[0].material.diffuseMap = assets.boltMatCap.resource;


    // app.on('update', dt => bolt.children[0].children[1].children[0].children[1].children[0].rotate(50 * dt, 0, 0));
    

    app.on('update', dt => bolt.rotate(0, 20 * dt, 0));
    app.on('update', dt => camPivot.rotate(0, -10 * dt, 0));


    const light = new pc.Entity('light');
    light.addComponent('light',{
        type: "directional",
        intensity: 1,
        castShadows: true,
        shadowResolution: 2048,
        shadowBias: 0.51,
        shadowDistance: 8,
        shadowIntensity: 0.85,
        color: new pc.Color(1, 1, 1),
    });
    app.root.addChild(light);
    light.setEulerAngles(35, 59, 0);

    if(setupCustom){
        bolt.children[0].render.meshInstances[0].material.chunks.combinePS = assets.sdrInject.resource;
        bolt.children[0].render.meshInstances[0].material.chunks.opacityPS = assets.opaInject.resource;
        bolt.children[0].render.meshInstances[0].material.diffuseMap = new pc.Texture(this.app.graphicsDevice, {
            width: 1,
            height: 1,
            format: pc.PIXELFORMAT_R8_G8_B8
        }); // What does this force a recompile of? shader chunk? A: To give it the vUv0 varying 
        bolt.children[0].render.meshInstances[0].material.setParameter('uSkinMap', assets.boltMatCap.resource);
        bolt.children[0].render.meshInstances[0].material.setParameter('uEnvironmentMap', assets.envMap.resource);
        //bolt.children[0].children[0].render.meshInstances[1].material.chunks.combinePS = assets.sdrInject.resource;

        //let uRes = new Float32Array([canvas.width, canvas.height]);
        //bolt.children[0].children[0].render.meshInstances[0].material.setParameter('uResolution', uRes);
        
    }else{
        bolt.children[0].render.meshInstances[0].material.blendType = pc.BLEND_NONE; // BLEND_NORMAL
        bolt.children[0].render.meshInstances[0].material.opacity = 1.0;
        bolt.children[0].render.meshInstances[0].material.opacityMap = assets.opaMapTest.resource;
        bolt.children[0].render.meshInstances[0].material.opacityMapChannel = 'r';
        bolt.children[0].render.meshInstances[0].material.alphaTest = 0.175;
    }
    
    bolt.children[0].render.meshInstances[0].material.update();

    app.scene.toneMapping = pc.TONEMAP_FILMIC; //TONEMAP_FILMIC
    app.scene.gammaCorrection = pc.GAMMA_SRGB;
    // app.scene.exposure = 0.390;

    
    // console.log(plane.model.material);
    var sphereMat = new pc.StandardMaterial();
    sphere.model.material = sphereMat;
    sphere.model.material.chunks.combinePS = assets.sdrInject.resource;
    sphere.model.material.diffuseMap = new pc.Texture(this.app.graphicsDevice, {
        width: 1,
        height: 1,
        format: pc.PIXELFORMAT_R8_G8_B8
    }); // What does this force a recompile of? shader chunk?
    
    // bolt.children[0].children[0].render.meshInstances[0].material = customMat;

    // bolt.children[0].children[0].render.meshInstances[0].material.setParameter('uShadowMap', assets.boltMatCap.resource);
    
    // console.log(bolt.children[0].children[0].render.meshInstances[0].material);
    
    // bolt.children[0].children[0].render.meshInstances[1].material.update();
    
    // console.log(bolt.children[0].children[1].children[0].children[1].children[0].name);
    
    //app.on('update', dt => bolt.children[0].children[1].children[0].children[1].children[0].rotate(50 * dt, 0, 0));
    //app.on('update', dt => bolt.rotate(0, 20 * dt, 0));



    const clonedChar = bolt.clone();
    clonedChar.setPosition(0,-2,-2);
    app.root.addChild(clonedChar);


    //app.on('update', dt => clonedChar.children[0].children[1].children[0].children[1].children[0].rotate(50 * dt, 0, 0));
    app.on('update', dt => clonedChar.rotate(0, -20 * dt, 0));

    /*
    
    */

    // bolt.children[0].children[0].render.meshInstances[0].material = customMat;
    // console.log(bolt.children[0].children[0].render.meshInstances[0].material.shader);


    // bolt.render.meshInstances[0].material = new pc.Material();
    // bolt.render.meshInstances[0].material.shader = newShader;
    
    // bolt.render.meshInstances[0].material.setParameter('uTime', 0);
    // bolt.render.meshInstances[0].material.setParameter('uDiffuseMap', assets.boltMatCap.resource);

    const topText = new pc.Entity('toptext');
    topText.addComponent('element', {
        pivot: new pc.Vec2(0.5, 0.5),
        anchor: new pc.Vec4(0.5, 1, 0.5, 1),
        type: pc.ELEMENTTYPE_TEXT,
        font: assets.bpFont.resource,
        fontSize: 52,
        text: "PWA Template",
        color: [0.9901,0.9901,0.9901],
        alignment: [0.5,0.5],
    });
    uiGroup.addChild(topText);
    topText.setLocalPosition(0,-105,0);


    
    
    // console.log(light);

    /*
    const pointLight = new pc.Entity('light');
    pointLight.addComponent('light',{
        type: "omni",
        range: 1,
        intensity: 2,
        castShadows: false,
        color: new pc.Color(1, 0, 0),
    });
    app.root.addChild(pointLight);
    pointLight.setPosition(0,0,0.5);
    */



    // app.on('update', dt => bolt.rotate(10 * dt, 20 * dt, 10 * dt));

    //Device resize and orientation listeners
    //window.addEventListener('resize', () => this.resizeMethod());
    //window.addEventListener('orientationchange', () => this.resizeMethod());
    
    window.addEventListener('click', () => this.captureGLSL());

};

MainScene.prototype.update = function(dt) {

};

MainScene.prototype.captureGLSL = function() {
    let bolt = app.root.findByName("BodySkin");
    // console.log(bolt.children[0].children[0].render.meshInstances[0].material);

    app.render();

    const variants = Object.values(bolt.render.meshInstances[0].material.variants);
    const { fshader, vshader } = variants[0].definition;
    const fragmentSource = fshader;
    const vertexSource = vshader;
    console.log(fragmentSource);

    return;

    // console.log(bolt.children[0].children[0].render.meshInstances[0].material.chunks);
    var shadowMap = undefined;
    device.textures.forEach((elmt) => {
        if(elmt.name == "ShadowMap2D")
            shadowMap = elmt;
    });
    console.log(shadowMap);
    console.log(shadowMap._glTexture);
    console.log(device.textures);

    // bolt.children[0].children[0].render.meshInstances[0].material.setParameter('uShadowMap', assets.boltMatCap.resource);
    return;
    
    
    bolt.children[0].children[0].render.meshInstances[0].material.setParameter('uShadowMap', shadowMap);
    bolt.children[0].children[0].render.meshInstances[0].material.update();


    
};

MainScene.prototype.swap = function(old) {

};