import Player from 'objects/Player';

class Main extends Phaser.State {
  let player;
	create() {

		//Enable Arcade Physics
		this.game.physics.startSystem(Phaser.Physics.P2JS);

		//Set the games background colour
		this.game.stage.backgroundColor = '#cecece';

		//Example of including an object
		//let exampleObject = new ExampleObject(this.game);
    player = new Player(this.game, 200, 200, );
	}

	update() {

	}

}

export default Main;
