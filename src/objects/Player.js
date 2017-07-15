class Player extends Phaser.Sprite{

	constructor(game, x, y, key, frame){
    super(game, x, y, key, frame);

    this.anchor.set(0.5);

    this.m_minImpulse = 5;
    this.m_maxImpulse = 10;

    this.m_maxBombs = 3;
    this.m_numBombs = 3;

    this.m_bombTime = 1000;
    this.m_timeCharged = 0;
	}

  update(deltaTime){
    chargeBomb(deltaTime);
  }

  replenishBombs(){
    this.m_numBombs = this.m_maxBombs;
  }

  useBomb(x, y){
    if(m_numBombs > 0){
      m_numBombs--;
    }
  }

  chargeBomb(deltaTime){
    this.m_timeCharged += this.deltaTime;

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
