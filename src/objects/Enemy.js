class Enemy extends Phaser.Sprite{
  constructor(game, x, y, key, frame){
    super(game, x, y, key, frame);
    game.physics.p2.enable(this);
    this.body.clearShapes();
    this.body.addCircle(this.height * 0.5);
    this.body.damping = 0.1;

    this.THRUSTCONSTANT = 200;
    this.SIDETHRUSTCONSTANT = 100;
    this.TURNCONSTANT = 50;
  }

  //moves towards target using rotation and thrusting ( ͡° ͜ʖ ͡°)
  updateTowards(x, y){
    let angleToTarget = Math.atan2(y - this.y, x - this.x) * (180 / Math.PI);
    let correctBodyAngle = this.body.angle - 90;
    if(correctBodyAngle < -180){
      correctBodyAngle = 360 + correctBodyAngle;
    }
    let angleDifference = angleToTarget - correctBodyAngle;
    angleDifference = (angleDifference + 180) % 360 - 180;

    if(angleDifference < 0){
      this.body.thrustLeft(this.SIDETHRUSTCONSTANT);
      this.body.rotateLeft(this.TURNCONSTANT);
    } else {
      this.body.thrustRight(this.SIDETHRUSTCONSTANT);
      this.body.rotateRight(this.TURNCONSTANT);

    }
    this.body.thrust(this.THRUSTCONSTANT);
  }
}

export default Enemy
