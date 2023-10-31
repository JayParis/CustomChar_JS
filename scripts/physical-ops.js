var PhysicalOps = pc.createScript('Physical-Ops');

var box_R = undefined;
var box_RP = undefined;
var box_L = undefined;
var box_LP = undefined;

var simulate = false;
var LMBheld = false;

var chest_R_LocalPos = undefined;
var chest_L_LocalPos = undefined;

PhysicalOps.prototype.initialize = function(){
    box_R = new pc.Entity("Box-R");
    box_R.addComponent('model', {
        type: 'box' 
    });
    box_R.setPosition(0.0, 0.0, 0.0);
    box_R.setLocalScale(0.5, 0.5, 0.5);
    this.app.root.addChild(box_R);

    box_RP = new pc.Entity("Box-RP");
    box_RP.addComponent('model', {
        type: 'sphere' 
    });
    box_RP.setPosition(0.0, -2.5, 0.0);
    this.app.root.addChild(box_RP);


    box_L = new pc.Entity("Box-L");
    box_L.addComponent('model', {
        type: 'box' 
    });
    box_L.setPosition(2.0, 0.0, 0.0);
    box_L.setLocalScale(0.5, 0.5, 0.5);
    this.app.root.addChild(box_L);

    box_LP = new pc.Entity("Box-LP");
    box_LP.addComponent('model', {
        type: 'sphere' 
    });
    box_LP.setPosition(2.0, -2.5, 0.0);
    this.app.root.addChild(box_LP);


    var mat_A = new pc.StandardMaterial();
    mat_A.diffuse.set(1, 0, 0);
    var mat_B = new pc.StandardMaterial();
    mat_B.diffuse.set(0, 1, 0);

    box_R.model.material = mat_A;
    box_RP.model.material = mat_B;
    box_L.model.material = mat_A;
    box_LP.model.material = mat_B;

    // --- Lighting Setup

    const light = new pc.Entity("MainLight");
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
    this.app.root.addChild(light);
    light.setEulerAngles(35, 59, 0);

    // --- Character STATIC Mesh
    /*

    const charEntity = assets.charGLB.resource.instantiateRenderEntity({});
    charEntity.rotate(0,180,0);
    charEntity.setLocalScale(0.3,0.3,0.3);
    charEntity.setPosition(0.0,-2.0,0.0);
    this.app.root.addChild(charEntity);

    charEntity.children[0].render.meshInstances[0].material = new pc.StandardMaterial();
    // charEntity.children[0].render.meshInstances[0].material.specular.set(1, 1, 1);
    charEntity.children[1].render.meshInstances[0].material = new pc.BasicMaterial();
    // charEntity.children[1].render.meshInstances[0].material.diffuse.set(1.0,0.0,0.0);
    charEntity.children[1].render.meshInstances[0].material.color.set(0.5333, 0.2901, 0.2862); // Outline
    charEntity.children[1].render.meshInstances[0].material.cull = pc.CULLFACE_FRONT;
    charEntity.children[2].render.meshInstances[0].material = new pc.StandardMaterial();
    charEntity.children[2].render.meshInstances[0].material.diffuseMap = assets.charSkinTex.resource;

    charEntity.children[0].render.meshInstances[0].material.chunks.combinePS = assets.sdrInject.resource;
    charEntity.children[0].render.meshInstances[0].material.diffuseMap = new pc.Texture(this.app.graphicsDevice, {
        width: 1,
        height: 1,
        format: pc.PIXELFORMAT_R8_G8_B8
    }); // What does this force a recompile of? shader chunk? A: To give it the vUv0 varying 
    charEntity.children[0].render.meshInstances[0].material.setParameter('uSkinMap', assets.charSkinTex.resource);
    charEntity.children[0].render.meshInstances[0].material.setParameter('uEnvironmentMap', assets.envMap.resource);

    charEntity.children[0].render.meshInstances[0].material.update();

    // this.app.on('update', dt => charEntity.rotate(0, 20 * dt, 0));
    */

    // --- Character SKINNED Mesh

    const charSkinned = assets.charSkinnedGLB.resource.instantiateRenderEntity({});
    charSkinned.rotate(0,180,0);
    charSkinned.setLocalScale(0.06,0.06,0.06);
    charSkinned.setPosition(0.0,-2.0,0.0);
    this.app.root.addChild(charSkinned);

    charSkinned.children[0].render.meshInstances[0].material = new pc.StandardMaterial();
    // charSkinned.children[0].render.meshInstances[0].material.specular.set(1, 1, 1);
    charSkinned.children[1].render.meshInstances[0].material = new pc.BasicMaterial();
    // charSkinned.children[1].render.meshInstances[0].material.diffuse.set(1.0,0.0,0.0);
    charSkinned.children[1].render.meshInstances[0].material.color.set(0.5333, 0.2901, 0.2862); // Outline
    charSkinned.children[1].render.meshInstances[0].material.cull = pc.CULLFACE_BACK;
    charSkinned.children[5].render.meshInstances[0].material = new pc.StandardMaterial();
    charSkinned.children[5].render.meshInstances[0].material.diffuseMap = assets.charSkinTex.resource;
    charSkinned.children[5].render.meshInstances[0].material.emissiveMap = assets.charSkinTex.resource;

    charSkinned.children[0].render.meshInstances[0].material.chunks.combinePS = assets.sdrInject.resource;
    charSkinned.children[0].render.meshInstances[0].material.diffuseMap = new pc.Texture(this.app.graphicsDevice, {
        width: 1,
        height: 1,
        format: pc.PIXELFORMAT_R8_G8_B8
    }); // What does this force a recompile of? shader chunk? A: To give it the vUv0 varying 
    charSkinned.children[0].render.meshInstances[0].material.setParameter('uSkinMap', assets.charSkinTex.resource);
    charSkinned.children[0].render.meshInstances[0].material.setParameter('uEnvironmentMap', assets.envMap.resource);

    charSkinned.children[0].render.meshInstances[0].material.update();

    // this.app.on('update', dt => charSkinned.rotate(0, 20 * dt, 0));

    console.log(charSkinned.children[0].name);


    this.app.scene.toneMapping = pc.TONEMAP_FILMIC; //TONEMAP_FILMIC
    this.app.scene.gammaCorrection = pc.GAMMA_SRGB;

    // --- Physics Setup
    
    this.app.systems.rigidbody.gravity.set(0, 0, 0);
    box_RP.addComponent('rigidbody',{
        type: "dynamic",
        restitution: 0.5
    });
    box_RP.addComponent('collision', {
        type: 'sphere',
        radius: 0.75
    });

    box_LP.addComponent('rigidbody',{
        type: "dynamic",
        restitution: 0.5
    });
    box_LP.addComponent('collision', {
        type: 'sphere',
        radius: 0.75
    });

    

    // --- Debug Bindings

    this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
    this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
}

PhysicalOps.prototype.onMouseMove = function(event){
    if(!LMBheld) return;

    let newPos = new pc.Vec3(0.0,0.0,0.0);
    var depth = 10;
    var cameraEntity = this.app.root.findByName('camera');
    cameraEntity.camera.screenToWorld(event.x, event.y, depth, newPos);

    box_R.setPosition(new pc.Vec3().add2(newPos, new pc.Vec3(0.25,0.0,0.0)));
    box_L.setPosition(new pc.Vec3().add2(newPos, new pc.Vec3(-0.25,0.0,0.0)));
}

PhysicalOps.prototype.onMouseDown = function(event){
    if(!simulate){
        chest_R_LocalPos = this.app.root.findByName("SWING000_R_Bust").getLocalPosition().clone();
        chest_L_LocalPos = this.app.root.findByName("SWING000_L_Bust").getLocalPosition().clone();
        this.showTransformDir();
        simulate = true;
    }
    LMBheld = true;
}

PhysicalOps.prototype.onMouseUp = function(event){
    LMBheld = false;
}

PhysicalOps.prototype.update = function(dt) {
    if(!simulate) return;

    let forceMul = 1.95;

    let R_Pos = box_R.getPosition().clone();
    let RP_Pos = box_RP.getPosition().clone();

    let dist_R = box_R.getPosition().distance(box_RP.getPosition());
    let diff_R = box_R.getPosition().sub(box_RP.getPosition());

    let yForce_R = Number(40 * (R_Pos.y > RP_Pos.y ? 1 : 1)); // Remove
    let forceDir_R = diff_R.clone().mul(new pc.Vec3(20,yForce_R,20));
    forceDir_R.add(new pc.Vec3(0.0,-34.0,0.0)); // -40.0 -10.0

    box_RP.rigidbody.linearDamping = 1.0 - (clamp(dist_R - 0.03,0.0,1.0) * 0.54);
    box_RP.rigidbody.applyForce(forceDir_R.mul(new pc.Vec3(forceMul,forceMul,forceMul)));



    let L_Pos = box_L.getPosition().clone();
    let LP_Pos = box_LP.getPosition().clone();

    let dist_L = box_L.getPosition().distance(box_LP.getPosition());
    let diff_L = box_L.getPosition().sub(box_LP.getPosition());

    let yForce_L = Number(40 * (L_Pos.y > LP_Pos.y ? 1 : 1)); // Remove
    let forceDir_L = diff_L.clone().mul(new pc.Vec3(20,yForce_L,20));
    forceDir_L.add(new pc.Vec3(0.0,-34.0,0.0)); // -40.0 -10.0

    box_LP.rigidbody.linearDamping = 1.0 - (clamp(dist_L - 0.03,0.0,1.0) * 0.54);
    box_LP.rigidbody.applyForce(forceDir_L.mul(new pc.Vec3(forceMul,forceMul,forceMul)));


    if(dist_R > 3){
        let containedOffset_R = diff_R.mul(new pc.Vec3(1,1,1)).normalize().mul(new pc.Vec3(2.9,2.9,2.9));
        box_RP.rigidbody.linearVelocity = new pc.Vec3(0,0,0);
        box_RP.rigidbody.teleport(R_Pos.sub(containedOffset_R));
    }
    if(dist_L > 3){
        let containedOffset_L = diff_L.mul(new pc.Vec3(1,1,1)).normalize().mul(new pc.Vec3(2.9,2.9,2.9));
        box_LP.rigidbody.linearVelocity = new pc.Vec3(0,0,0);
        box_LP.rigidbody.teleport(L_Pos.sub(containedOffset_L));
    }

    this.app.drawLine(R_Pos, RP_Pos, pc.Color.RED, false);
    this.app.drawLine(L_Pos, LP_Pos, pc.Color.GREEN, false);

    let offsetInt = 0.65; // 0.35
    var boneOffsetVect_R = diff_R.clone().mul(new pc.Vec3(-1,-1,-1)).mul(new pc.Vec3(offsetInt,offsetInt,offsetInt));
    // boneOffsetVect_R = new pc.Vec3(boneOffsetVect_R.x,boneOffsetVect_R.z,boneOffsetVect_R.y);
    this.app.root.findByName("SWING000_R_Bust").setLocalPosition(new pc.Vec3().add2(chest_R_LocalPos, boneOffsetVect_R));

    let xRotMod_R = clamp(diff_R.y * 0.5, -1.0, 1.0) * -1;
    let yRotMod_R = clamp(diff_R.x * 0.5, -1.0, 1.0);
    this.app.root.findByName("SWING000_R_Bust").setLocalEulerAngles(90 + (25 * xRotMod_R),50 * yRotMod_R,-180);

    var boneOffsetVect_L = diff_L.clone().mul(new pc.Vec3(-1,-1,-1)).mul(new pc.Vec3(offsetInt,offsetInt,offsetInt));
    // boneOffsetVect_L = new pc.Vec3(boneOffsetVect_L.x,boneOffsetVect_L.z,boneOffsetVect_L.y);
    this.app.root.findByName("SWING000_L_Bust").setLocalPosition(new pc.Vec3().add2(chest_L_LocalPos, boneOffsetVect_L));

    let xRotMod_L = clamp(diff_L.y * 0.5, -1.0, 1.0) * -1;
    let yRotMod_L = clamp(diff_L.x * 0.5, -1.0, 1.0);
    this.app.root.findByName("SWING000_L_Bust").setLocalEulerAngles(90 + (25 * xRotMod_L),50 * yRotMod_L,-180);
}

PhysicalOps.prototype.showTransformDir = function(){
    return;

    var chestBonePos = this.app.root.findByName("SWING000_R_Bust").getPosition().clone();
    var chestBoneFwd = this.app.root.findByName("SWING000_R_Bust").up.clone();
    // console.log(chestBonePos);

    var box_C = new pc.Entity("Box-C");
    box_C.addComponent('model', {
        type: 'box' 
    });
    box_C.setPosition(chestBonePos.add(chestBoneFwd));
    // box_C.setPosition(chestBonePos);
    box_C.setLocalScale(0.25, 0.25, 0.25);
    this.app.root.addChild(box_C);

    console.log(chest_R_LocalPos);
}