import pixiApp from "./ecs/singletons/pixi.js";
import { World } from "./node_modules/ecsy/build/ecsy.module.js";
import Dummy from "./ecs/components/dummy.component.js";
import Transform from "./ecs/components/transform.component.js";
import Drawable from "./ecs/components/drawable.component.js";
import DrawableState from "./ecs/components/drawable.state.js";
import DrawableSystem from "./ecs/systems/drawable.system.js";
import WorkerSystem from "./ecs/systems/worker.system.js";
import random from "./random.js";
import CONFIG from "./app.config.js";
import ShadowSystem from "./ecs/systems/shadow.system.js";


const world = new World()
  .registerComponent(Dummy)
  .registerComponent(Transform)
  .registerComponent(Drawable)
  .registerComponent(DrawableState)
  .registerSystem(WorkerSystem)
  // .registerSystem(ShadowSystem)
  .registerSystem(DrawableSystem)

PIXI.Loader.shared
  // .add("resources/sprites/ant-walk.json")
  .load(setup);

function setup() {


  for (let foo = 0; foo < 5000; foo++) {
    world.createEntity()
      .addComponent(Dummy)
      .addComponent(Drawable)
      .addComponent(Transform, Transform.create(random(0, CONFIG.WIDTH), random(0, CONFIG.HEIGHT)))
  }


  pixiApp.ticker.add(delta => gameLoop(delta))

  function gameLoop(delta) {
    world.execute(delta)
  }
}
