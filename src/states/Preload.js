class Preload extends Phaser.State {

	preload() {
		/* Preload required assets */
		//this.game.load.image('myImage', 'assets/my-image.png');
		//this.game.load.audio('myAudio', 'assets/my-audio.wav');
		//this.game.load.atlas('myAtlas', 'assets/my-atlas.png', 'assets/my-atlas.json');
    this.game.load.spritesheet('ship', 'assets/ship.png', 64, 64, 2);
    this.game.load.image('enemy', 'assets/popo.png');
	}

	create() {
		//NOTE: Change to GameTitle if required
		this.game.state.start("Main");
	}

}

export default Preload;
