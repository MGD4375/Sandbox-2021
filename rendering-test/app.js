import { World } from './node_modules/ecsy/build/ecsy.module.js';
import Position from './ecs/position.js';
import Movement from './ecs/movement.js';
import PixiSprite from './ecs/pixiSprite.js';
import MoveSprite from './ecs/moveSprite.js';
import random from './random.js';
import GLOBALS from './globals.js'
import Destroy from './ecs/destroy.js';

const world = new World();
world.registerComponent(Position)
world.registerComponent(PixiSprite)
world.registerSystem(Movement)
world.registerSystem(MoveSprite)
world.registerSystem(Destroy)

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
let app = new PIXI.Application({
  width: GLOBALS.WORLD_WIDTH,         // default: 800
  height: GLOBALS.WORLD_HEIGHT,        // default: 600
  antialias: true,    // default: false
  transparent: false, // default: false
  resolution: 2       // default: 1
});

app.renderer.backgroundColor = 0x061639;
app.renderer.autoResize = true;

document.body.appendChild(app.view);

PIXI.loader
  .add("sprites/adventurer.json")
  .load(setup);


function setup() {
  let sheet = PIXI.loader.resources["sprites/adventurer.json"];
  app.ticker.add(delta => gameLoop(delta));

  function gameLoop(delta) {
    let animatedCapguy = new PIXI.AnimatedSprite(sheet.spritesheet.animations["adventurer-run"]);
    animatedCapguy.animationSpeed = 0.167;
    animatedCapguy.play();
    app.stage.addChild(animatedCapguy);

    world.createEntity()
      .addComponent(Position, Position.create(-50, random(0, GLOBALS.WORLD_HEIGHT)))
      .addComponent(PixiSprite, PixiSprite.create(animatedCapguy))


    world.execute(delta)
  }
}

