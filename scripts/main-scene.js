var MainScene = pc.createScript('Main-Scene-Script');

MainScene.attributes.add('speed', { 
    type: 'number', default: 10 
});

MainScene.prototype.initialize = function() {
    const bolt = assets.bolt.resource.instantiateRenderEntity({});
    bolt.rotate(0,180,0)
    
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

    bolt.children[0].children[0].render.meshInstances[0].material = new pc.StandardMaterial();
    bolt.children[0].children[0].render.meshInstances[1].material = customMat;
    // bolt.children[0].children[0].render.meshInstances[1].material.update();
    
    // console.log(bolt.children[0].children[1].children[0].children[4].children[0].children[0].name);
    console.log(bolt.children[0].children[0].render.meshInstances[0].material.variants)
    
    // app.on('update', dt => bolt.children[0].children[1].children[0].children[4].children[0].rotate(50 * dt, 0, 0));
    app.on('update', dt => bolt.rotate(0, 20 * dt, 0));


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
        color: [0.01,0.01,0.01],
        alignment: [0.5,0.5],
    });
    uiGroup.addChild(topText);
    topText.setLocalPosition(0,-105,0);


    const light = new pc.Entity('light');
    light.addComponent('light',{
        type: "directional",
        color: new pc.Color(1, 1, 1),
    });
    app.root.addChild(light);
    light.setEulerAngles(25, 120, 0);
    
    // app.on('update', dt => bolt.rotate(10 * dt, 20 * dt, 10 * dt));

    //Device resize and orientation listeners
    //window.addEventListener('resize', () => this.resizeMethod());
    //window.addEventListener('orientationchange', () => this.resizeMethod());
};

MainScene.prototype.update = function(dt) {

};

MainScene.prototype.swap = function(old) {

};