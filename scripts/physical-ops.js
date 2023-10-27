var PhysicalOps = pc.createScript('Physical-Ops');

PhysicalOps.prototype.initialize = function(){
    // console.log("Physical Ops Loaded");

    const rigi = new pc.Entity("Rigi");
    rigi.addComponent('model', {
        type: 'sphere'
    });
    rigi.addComponent('rigidbody', {
        type: "dynamic", //dynamic
        friction: 0.5,
        mass: 10,
        restitution: 0.0
    });
    // rigi.addComponent('collision',{
    //     type: "sphere"
    // });
    app.root.addChild(rigi);
    rigi.setPosition(-1, -0.05, 0);

    // rigi.rigidbody.applyForce(10, 0, 0);
    console.log(Ammo.btRigidBody);
}

PhysicalOps.prototype.update = function(dt){

}