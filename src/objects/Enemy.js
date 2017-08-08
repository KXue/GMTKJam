class Enemy extends Phaser.Sprite{
  constructor(game, x, y, key){
    super(game, x, y, key);
    this.THRUSTCONSTANT = 200;
    this.SIDETHRUSTCONSTANT = 100;
    this.TURNCONSTANT = 50;
    this.game.physics.p2.enable(this);
    this.body.clearShapes();
    this.body.addCircle(this.height * 0.5);
    this.body.damping = 0.1;
  }
  create(){

  }
  update(){
    let player = this.game.world.getByName("player");
    if(player){
      const x = player.x;
      const y = player.y;
      let angleToTarget = Math.atan2(y - this.body.y, x - this.body.x) * (180 / Math.PI);
      let correctBodyAngle = this.body.angle - 90;
      if(correctBodyAngle < -180){
        correctBodyAngle = 360 + correctBodyAngle;
      }
      let angleDifference = angleToTarget - correctBodyAngle;
      angleDifference += (angleDifference > 180) ? -360 : (angleDifference < -180) ? 360 : 0
      if(Math.abs(angleDifference) > 10){
        if(angleDifference < 0){
          this.body.thrustLeft(this.SIDETHRUSTCONSTANT);
          this.body.rotateLeft(this.TURNCONSTANT);
        } else {
          this.body.thrustRight(this.SIDETHRUSTCONSTANT);
          this.body.rotateRight(this.TURNCONSTANT);
        }
      } else{
        this.body.angle = angleToTarget + 90;
      }
      this.body.thrust(this.THRUSTCONSTANT);
    }
  }
}

export default Enemy;
