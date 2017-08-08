class GameTitle extends Phaser.State {

	create() {
    this.startGame();
	}

	startGame() {
		this.game.state.start("Main");
	}

}

export default GameTitle;
