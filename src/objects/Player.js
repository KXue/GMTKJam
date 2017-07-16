class Player extends Phaser.Sprite{

	constructor(game, x, y, key, frame, collisionGroup){
    super(game, x, y, key, frame);

    game.physics.p2.enable(this);
    this.body.clearShapes();
    this.body.addCircle(this.width * 0.5);
    this.body.damping = 0.1;

    this.m_minImpulse = 5;
    this.m_maxImpulse = 10;

    this.m_maxBombs = 3;
    this.m_numBombs = 3;

    this.m_bombTime = 2.0;
    this.m_timeCharged = 0;
    this.chargeBomb(0.1);

	}

  updateWithTime(deltaTime){
    this.chargeBomb(deltaTime);
    this.body.angle = Math.atan2(this.body.velocity.y, this.body.velocity.x) * (180 / Math.PI);
  }

  replenishBombs(){
    this.m_numBombs = this.m_maxBombs;
  }

  useBomb(x, y){
    if(this.m_numBombs > 0){
      this.m_numBombs--;
    }
  }

  chargeBomb(deltaTime){
    this.m_timeCharged += deltaTime;

    if (this.m_timeCharged >= this.m_bombTime){
      if(this.m_numBombs != this.m_maxBombs){
        this.m_timeCharged = 0;
        this.m_numBombs++;
      }else{
        this.m_timeCharged = this.m_bombTime;
      }
    }
  }
}

export default Player;
