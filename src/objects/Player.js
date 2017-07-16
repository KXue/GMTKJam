class Player extends Phaser.Sprite{

	constructor(game, x, y, key, frame){
    super(game, x, y, key, frame);

    game.physics.p2.enable(this);
    this.body.clearShapes();
    this.body.addCircle(this.width * 0.5);
    this.body.damping = 0.1;

    this.m_maxBombs = 3;
    this.m_numBombs = 3;

    this.m_bombTime = 2.0;
    this.m_timeCharged = 0;

    this.isAsploded = false;
    this.vincibleVelocitySquare = 200 * 200;
	}

  updateWithTime(deltaTime){
    this.chargeBomb(deltaTime);
    this.body.angle = Math.atan2(this.body.velocity.y, this.body.velocity.x) * (180 / Math.PI);
    if(this.isAsploded && this.body.velocity.x * this.body.velocity.x + this.body.velocity.y * this.body.velocity.y < this.vincibleVelocitySquare) {
      this.isAsploded = false;
      this.frame = 0;
    }
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
    if(this.m_numBombs == this.m_maxBombs){
      this.m_timeCharged += deltaTime;
      if (this.m_timeCharged >= this.m_bombTime){
        this.m_timeCharged = 0;
        this.m_numBombs++;
      }
    } else {
      this.m_timeCharged = 0;
    }
  }

  setExplosion(){
    this.isAsploded = true;
    this.frame = 1;
  }
}

export default Player;
