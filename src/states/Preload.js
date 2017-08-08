class Preload extends Phaser.State {

	preload() {
		/* Preload required assets */
		//this.game.load.image('myImage', 'assets/my-image.png');
		//this.game.load.audio('myAudio', 'assets/my-audio.wav');
		//this.game.load.atlas('myAtlas', 'assets/my-atlas.png', 'assets/my-atlas.json');
    this.game.load.spritesheet('ship', 'assets/ship.png', 64, 64, 2);
    this.game.load.image('enemy', 'assets/popo.png');
    this.game.load.image('explosion', 'assets/explosionParticle.png');
    this.game.load.image('spook', 'assets/spookParticle.png');
    this.game.load.audio('explode', 'assets/explosion.wav');
    this.game.load.audio('death', 'assets/death.wav');
    this.game.load.audio('background', 'assets/background.wav');
	}

	create() {
		//NOTE: Change to GameTitle if required
		this.game.state.start("Main");
	}

}

export default Preload;
