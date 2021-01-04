import { PhaserInstance } from "./ecs/phaser.component.js";

export default class Game extends Phaser.Game {
  constructor(world) {
    super({
      type: Phaser.AUTO,
      parent: "phaser-example",
      width: 1280,
      height: 720,
    });

    // Add the ECSY world to the game so it's available everywhere
    this.world = world;
    this.scene
  }

  start() {
    // Create Phaser singleton entity so ECSY systems can interact with the scene and the renderer and stuff
    this.world.createEntity().addComponent(PhaserInstance, { game: this });
    this.scene.start('menu');

    // Run the ECS systems every frame
    this.events.on('step', (time, delta) => {
      this.world.execute(delta, time);
    });
  }
}
