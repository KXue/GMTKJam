import Main from 'states/Main';
class GameOver extends Phaser.State {

	create() {
    this.restartGame();
	}

	restartGame() {
		this.game.state.start("GameTitle");
	}

}

export default GameOver;
