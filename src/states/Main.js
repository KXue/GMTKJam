import Player from 'objects/Player';
import Explosion from 'objects/Explosion';
import Enemy from 'objects/Enemy';
import Game from '../index'

class Main extends Phaser.State {
	create() {
    this.MINEXPLOSIONDIAMETER = 30;
    this.MAXEXPLOSIONDIAMETER = 200;
    this.IMPULSEMAGNITUDE = 60;
    this.KILLSPEEDMULTIPLIER = 6;
    this.timeSlowFactor = 3.5;

		//Enable Physics
		this.physics.startSystem(Phaser.Physics.P2JS);
    this.physics.p2.setImpactEvents(true);
    this.physics.p2.restitution = 0.75;

    this.emitter = this.add.emitter(this.world.centerX, this.world.centerY, 800);
    this.emitter.makeParticles('spook');
    this.emitter.gravity = 0;

    this.emitter.setAlpha(1, 0.3, 500);
    this.emitter.setScale(1, 7, 1, 7, 2000, Phaser.Easing.Quintic.Out);
    this.emitter.setXSpeed(-100, 100);
    this.emitter.setYSpeed(-100, 100);
    this.emitter.start(false, 1000, 0.5);

		//Set the games background colour
    //midnight blue: 191970;
    //beige: F5F1DE
    //sky blue: 87CEEB
		this.stage.backgroundColor = '#87CEEB';

    this.playerGroup = this.physics.p2.createCollisionGroup();
    this.explosionGroup = this.physics.p2.createCollisionGroup();
    this.enemyGroup = this.physics.p2.createCollisionGroup();

    this.physics.p2.updateBoundsCollisionGroup();
    this.physics.p2.useElapsedTime = true;
    this.physics.p2.setPostBroadphaseCallback(this.checkExplosion, this);

    let player = new Player(this, 200, 200, 'ship', 0);

    this.game.physics.p2.enable(player);
    player.body.clearShapes();
    player.body.addCircle(player.width * 0.5);
    player.body.damping = 0.1;
    player.body.setCollisionGroup(this.playerGroup);
    player.body.collides([this.explosionGroup]);
    player.body.collides(this.enemyGroup, this.playerHitEnemy, this);
    player.name = "player";
    this.add.existing(player);

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

    this.spawnRate = 3;
    this.timeElapsed = 0;

    this.add.tween(this).to({spawnRate: 1}, 120000, "Linear", true, 1000);

    this.pointDown = false;
	}

	update() {
    this.graphics.clear();
    if(this.pointDown){
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

    this.timeElapsed += this.time.physicsElapsed;
    if(this.timeElapsed > this.spawnRate){
      this.timeElapsed -= this.spawnRate;
      this.spawnEnemy();
    }

    this.graphics.lineStyle(5, 0xFF0000, 1);
    this.graphics.drawCircle(this.world.centerX, this.world.centerY, 100 * (this.spawnRate - this.timeElapsed) / this.spawnRate);
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
    const explosion = this.add.existing(new Explosion(this, circle.x, circle.y));
    explosion.setCircle(circle);
    explosion.body.setCollisionGroup(this.explosionGroup);
    explosion.body.collides([this.playerGroup, this.enemyGroup]);
  }

  hitExplosion(explosionBody, otherBody){
    const distanceRatio = this.IMPULSEMAGNITUDE / this.math.distance(explosionBody.x, explosionBody.y, otherBody.x, otherBody.y);
    const xDistance = explosionBody.x - otherBody.x;
    const yDistance = explosionBody.y - otherBody.y;
    this.pauseBriefly(100);
    this.camera.shake(0.01, 100, false, Phaser.Camera.SHAKE_HORIZONTAL);
    otherBody.setZeroVelocity();
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

  playerHitEnemy(playerBody, enemyBody){
    let angleToTarget = Math.atan2(enemyBody.y - playerBody.y, enemyBody.x - playerBody.x) * (180 / Math.PI);
    let angleDifference = angleToTarget - playerBody.angle;
    angleDifference += (angleDifference > 180) ? -360 : (angleDifference < -180) ? 360 : 0
    this.pauseBriefly(500);
    this.camera.shake(0.01, 500, false, Phaser.Camera.SHAKE_HORIZONTAL);
    if(playerBody.sprite.isAsploded && Math.abs(angleDifference) < 90){
      enemyBody.sprite.pendingDestroy = true;
      playerBody.sprite.numKills++;
      playerBody.sprite.numCombo++;
      playerBody.velocity.x *= this.KILLSPEEDMULTIPLIER;
      playerBody.velocity.y *= this.KILLSPEEDMULTIPLIER;
    }
    else{
      this.game.destroy();
      new Game();
    }
  }

  spawnEnemy(){
    let enemy = new Enemy(this, 450, 300, 'enemy');
    enemy.body.setCollisionGroup(this.enemyGroup);
    enemy.body.collides([this.explosionGroup, this.playerGroup]);
    this.add.existing(enemy);
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
