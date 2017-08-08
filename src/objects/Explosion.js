class Explosion extends Phaser.Graphics{
  setCircle(circle){
    this.thicc = circle.diameter * 0.5;
    this.diameter = circle.diameter * 0.5;

    this.game.physics.p2.enable(this);
    this.body.clearShapes();
    this.body.addCircle(circle.diameter * 0.5);
    this.body.dynamic = false;
    this.body.kinematic = false;
    this.body.static = true;
    this.body.motionState = Phaser.Physics.P2.Body.STATIC;
    let tween = this.game.add.tween(this).to({thicc: 0, diameter: circle.diameter}, 200, "Bounce.easeInOut", true);
    tween.onComplete.add(()=>{
      this.pendingDestroy = true;
    }, this);
    // this.body.debug = true;
  }
  update(){
    this.clear();
    this.lineStyle(this.thicc, 0xffffff, 1);
    this.arc(0, 0, this.diameter * 0.5, 0, 7, false, 20);
  }
}

export default Explosion;
