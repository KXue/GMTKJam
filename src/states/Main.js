import Player from 'objects/Player';
import Explosion from 'objects/Explosion';
import Enemy from 'objects/Enemy';

class Main extends Phaser.State {
	create() {
    this.MINEXPLOSIONDIAMETER = 30;
    this.MAXEXPLOSIONDIAMETER = 200;
    this.IMPULSEMAGNITUDE = 60;
    this.timeSlowFactor = 3.5;

		//Enable Physics
		this.physics.startSystem(Phaser.Physics.P2JS);
    this.physics.p2.setImpactEvents(true);
    this.physics.p2.restitution = 0.75;

		//Set the games background colour
    //midnight blue: 191970;
    //beige: F5F1DE
    //sky blue: 87CEEB
		this.stage.backgroundColor = '#87CEEB';

    this.playerGroup = this.physics.p2.createCollisionGroup();
    this.explosionGroup = this.physics.p2.createCollisionGroup();
    this.enemyGroup = this.physics.p2.createCollisionGroup();
    this.asteroidGroup = this.physics.p2.createCollisionGroup();

    this.physics.p2.updateBoundsCollisionGroup();
    this.physics.p2.useElapsedTime = true;
    this.physics.p2.setPostBroadphaseCallback(this.checkExplosion, this);

    this.player = new Player(this, 200, 200, 'ship', 0);
    this.player.body.setCollisionGroup(this.playerGroup);
    this.player.body.collides([this.explosionGroup, this.enemyGroup]);
    this.add.existing(this.player);

    this.enemy = new Enemy(this, 500, 500, 'enemy');
    this.enemy.body.setCollisionGroup(this.enemyGroup);
    this.enemy.body.collides([this.explosionGroup, this.playerGroup])
    this.add.existing(this.enemy);

    this.input.maxPointers = 1;
    this.input.onDown.add(this.justPressed, this);
    this.input.onUp.add(this.justReleased, this);

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(5, 0xffffff, 1);
    this.graphics.fixedToCamera = true;

    this.boundingBoxGraphics = this.add.graphics();
    this.boundingBoxGraphics.lineStyle(10, 0x000000, 1);
    this.boundingBoxGraphics.fixedToCamera = true;
    this.boundingBoxGraphics.drawRect(0, 0, this.camera.width, this.camera.height);

    this.pointDown = false;
	}

	update() {
    this.player.updateWithTime(this.time.physicsElapsed);
    this.enemy.updateTowards(this.player.x, this.player.y);
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
    this.pointDown = true;
    this.slowTween = this.add.tween(this.time).to({slowMotion: this.timeSlowFactor}, 200, "Sine.easeOut", true);
    this.explosionUI = new Phaser.Circle(this.input.x, this.input.y, this.MINEXPLOSIONDIAMETER);
    this.graphics.drawCircle(this.explosionUI.x, this.explosionUI.y, this.explosionUI.diameter);
    //confirmed working. spawn explosionUI
  }

  justReleased(){
    if(this.pointDown){
      this.pointDown = false;
      this.time.slowMotion = 1.0;
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
    const explosion = this.add.existing(new Explosion(this, circle));
    explosion.body.setCollisionGroup(this.explosionGroup);
    explosion.body.collides([this.playerGroup, this.enemyGroup]);
  }

  hitExplosion(explosionBody, otherBody){
    const distanceRatio = this.IMPULSEMAGNITUDE / this.math.distance(explosionBody.x, explosionBody.y, otherBody.x, otherBody.y);
    const xDistance = explosionBody.x - otherBody.x;
    const yDistance = explosionBody.y - otherBody.y;
    this.pauseBriefly(100);
    this.camera.shake(0.01, 100, false, Phaser.Camera.SHAKE_HORIZONTAL);
    otherBody.applyImpulse([xDistance * distanceRatio, yDistance * distanceRatio], 0, 0);
    if(otherBody.sprite instanceof Player){
      otherBody.sprite.setExplosion();
    }
  }

  checkExplosion(body1, body2){
    let explosionBody, otherBody;
    let retVal = true;
    if(body1.static || body2.static){
      explosionBody = body1.static? body1 : body2;
      explosionBody.removeNextStep = true;
      otherBody = body1.static? body2 : body1;
      // if(otherBody.sprite instanceof Asteroid){
      //   //asteroid check here
      // }
      // else{
      this.hitExplosion(explosionBody, otherBody);
      // }
      retVal = false;
    }
    return retVal;
  }

  pauseBriefly(time){
    if(!time || isNaN(time) || !isFinite(time)){
      time = 50;
    }
    if(!this.physics.p2.paused){
      this.physics.p2.pause();
      this.time.events.add(time, this.physics.p2.resume, this.physics.p2);
    }
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
