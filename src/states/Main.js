import Player from 'objects/Player';
import Explosion from 'objects/Explosion';

class Main extends Phaser.State {
	create() {
    this.MINEXPLOSIONDIAMETER = 30;
    this.MAXEXPLOSIONDIAMETER = 200;
    this.timeSlowFactor = 3.5;

		//Enable Physics
		this.physics.startSystem(Phaser.Physics.P2JS);
    this.physics.p2.restitution = 0.8;

		//Set the games background colour
		this.stage.backgroundColor = '#cecece';

    this.player = new Player(this, 200, 200, 'ship');
    this.add.existing(this.player);

    this.input.maxPointers = 1;
    this.input.onDown.add(this.justPressed, this);
    this.input.onUp.add(this.justReleased, this);

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(5, 0xffffff, 1);
    this.graphics.fixedToCamera = true;


    this.pointDown = false;
	}

	update() {
    this.player.updateWithTime(this.time.physicsElapsed);
    if(this.pointDown){

      this.graphics.clear();
      this.graphics.lineStyle(5, 0xffffff, 1);

      this.explosionUI.diameter = Math.max(this.math.distance(this.explosionUI.x, this.explosionUI.y, this.input.x, this.input.y) * 2, this.MINEXPLOSIONDIAMETER);

      if(this.explosionUI.diameter > this.MAXEXPLOSIONDIAMETER){
        const distanceRatio = this.MAXEXPLOSIONDIAMETER / this.explosionUI.diameter;
        this.explosionUI.x = this.input.x - (this.input.x - this.explosionUI.x) * distanceRatio;
        this.explosionUI.y = this.input.y - (this.input.y - this.explosionUI.y) * distanceRatio;
        this.explosionUI.diameter = this.MAXEXPLOSIONDIAMETER;
      }
      this.graphics.drawCircle(this.explosionUI.x, this.explosionUI.y, this.explosionUI.diameter);
    }
	}

  justPressed(){
    console.log("pressed");
    console.log(this.pointDown);
    this.pointDown = true;
    this.MINEXPLOSIONDIAMETER = 30;
    this.slowTween = this.add.tween(this.time).to({slowMotion: this.timeSlowFactor}, 200, "Sine.easeOut", true);
    this.explosionUI = new Phaser.Circle(this.input.x, this.input.y, this.MINEXPLOSIONDIAMETER);
    this.graphics.drawCircle(this.explosionUI.x, this.explosionUI.y, this.explosionUI.diameter);
    //confirmed working. spawn explosionUI
  }

  justReleased(){
    console.log("released");
    console.log(this.pointDown);
    if(this.pointDown){
      this.pointDown = false;
      this.time.slowMotion = 1.0;
      console.log(this.explosionUI.x + " " + this.explosionUI.y);
      this.spawnExplosionAt(this.explosionUI);
      this.graphics.clear();
      this.graphics.lineStyle(5, 0xffffff, 1);
    }
    if(this.slowTween && this.slowTween.isRunning){
      this.tweens.remove(this.slowTween);
      this.time.slowMotion = 1.0;
    }
  }

  spawnExplosionAt(circle){
    const spawnX = this.camera.x + circle.x;
    const spawnY = this.camera.y + circle.y;
    this.add.existing(new Explosion(this, circle));
  }
//  var circ = new Phaser.Circle(body.center.x, body.center.y, body.halfWidth);

/*
var _container = game.add.sprite(0,0);var geom = game.add.graphics(game.width, game.height);
geom.beginFill(backgroundColor, backgroundOpacity);
geom.x = 0;
geom.y = 0;
geom.drawRect(0, 0, 100, 100);
_container.width = 100;
_container.height = 100;
_container.addChild(geom);
game.physics.enable(_container, Phaser.Physics.ARCADE);

*/
}

export default Main;
