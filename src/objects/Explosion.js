class Explosion extends Phaser.Graphics{
  constructor(game, circle){
    super(game, circle.x, circle.y);

    this.thicc = circle.diameter * 0.5;
    this.diameter = circle.diameter * 0.5;

    game.physics.p2.enable(this);
    this.body.clearShapes();
    this.body.addCircle(circle.diameter * 0.5);
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

export default Explosion
