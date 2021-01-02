import { World } from "../node_modules/ecsy/build/ecsy.module.js";
import appConfig from "./app.config.js";
import QueenTemplate from "./ecs/assemblages/queen.assemblage.js";
import Age from "./ecs/components/age.component.js";
import Angle from "./ecs/components/angle.component.js";
import Colour from "./ecs/components/colour.component.js";
import Queen from "./ecs/components/queen.component.js";
import Sprite from "./ecs/components/sprite.component.js";
import SpriteState from "./ecs/components/sprite.state.js";
import Transform from "./ecs/components/transform.component.js";
import Velocity from "./ecs/components/velocity.component.js";
import Worker from "./ecs/components/worker.component.js";
import pixiApp from "./ecs/singletons/pixi.js";
import MotionSystem from "./ecs/systems/motion.system.js";
import SpriteSystem from "./ecs/systems/sprite.system.js";
import AgeSystem from "./ecs/systems/age.system.js";
import random from "./random.js";
import Intent from "./ecs/components/intent.component.js";
import QueenSystem from "./ecs/systems/queen.system.js";
import EggSystem from "./ecs/systems/egg.system.js";
import Egg from "./ecs/components/egg.component.js";
import WorkerSystem from "./ecs/systems/worker.system.js";
import Energy from "./ecs/components/energy.component.js";
import DeathSystem from "./ecs/systems/death.system.js";
import SoldierSystem from "./ecs/systems/soldier.system.js";
import Feeder from "./ecs/components/feeder.component.js";
import Food from "./ecs/components/food.component.js";
import FeederSystem from "./ecs/systems/feeder.system.js";
import DrawableSystem from "./ecs/systems/drawable.system.js";
import Drawable from "./ecs/components/drawable.component.js";
import FeederTemplate from "./ecs/assemblages/feeder.assemblage.js";
import Cargo from "./ecs/components/cargo.component.js";
import TargetState from "./ecs/components/targetState.component.js";
import Soldier from "./ecs/components/soldier.component.js";
import FoodTemplate from "./ecs/assemblages/food.assemblage.js";
import CONFIG from "./app.config.js";
import Ant from "./ecs/components/ant.component.js";
import TerritorySystem from "./ecs/systems/territory.system.js";
import { Collisions, CollisionsActor, CollisionsState } from "./ecs/components/collisions.component.js";
import CollisionsSystem from "./ecs/systems/collisions.system.js";
import { Sense, SenseColliderState, SensedState } from "./ecs/components/sense.component.js";
import SenseSystem from "./ecs/systems/sense.system.js";
import WorkerTemplate from "./ecs/assemblages/worker.assemblage.js";

const world = new World()
  .registerComponent(Sense)
  .registerComponent(SenseColliderState)
  .registerComponent(SensedState)
  .registerComponent(Queen)
  .registerComponent(Worker)
  .registerComponent(Age)
  .registerComponent(Colour)
  .registerComponent(Intent)
  .registerComponent(Energy)
  .registerComponent(TargetState)
  .registerComponent(Egg)
  .registerComponent(Ant)
  .registerComponent(Drawable)
  .registerComponent(Feeder)
  .registerComponent(Food)
  .registerComponent(Sprite)
  .registerComponent(Soldier)
  .registerComponent(Cargo)
  .registerComponent(Collisions)
  .registerComponent(CollisionsState)
  .registerComponent(CollisionsActor)
  .registerComponent(SpriteState)
  .registerComponent(Transform)
  .registerComponent(Velocity)
  .registerComponent(Angle)
  .registerSystem(SpriteSystem)
  .registerSystem(DrawableSystem)
  .registerSystem(CollisionsSystem)
  .registerSystem(SenseSystem)
  .registerSystem(QueenSystem)
  .registerSystem(WorkerSystem)
  .registerSystem(FeederSystem)
  .registerSystem(DeathSystem)
  .registerSystem(EggSystem)
  .registerSystem(SoldierSystem)
  .registerSystem(MotionSystem)
  .registerSystem(AgeSystem)
  .registerSystem(TerritorySystem)

PIXI.Loader.shared
  .add("resources/sprites/ant-walk.json")
  .load(setup);

function setup() {

  FeederTemplate.create(world)

  for (let i = 0; i < 50; i++) {
    const height = random(0, appConfig.HEIGHT)
    const width = random(0, appConfig.WIDTH)
    const colour = random(0, 360)
    const queen = QueenTemplate.create(world,
      width,
      height,
      colour
    )

    queen.getMutableComponent(Age).value = 300

    WorkerTemplate.create(world,
      width,
      height,
      colour
    )

    FoodTemplate.create(world,
      random(0, appConfig.HEIGHT),
      random(0, appConfig.WIDTH)
    )
    FoodTemplate.create(world,
      random(0, appConfig.HEIGHT),
      random(0, appConfig.WIDTH)
    )
  }

  var foo;

  if (Colour.difference(180, 0) !== 180 / 180) throw new Error('unexpected value')

  foo = Colour.difference(360, 10)
  if (foo !== 10 / 180) throw new Error('unexpected value', foo)

  foo = Colour.difference(10, 360)
  if (foo !== 10 / 180) throw new Error('unexpected value', foo)
  if (Colour.difference(180, 180) !== 0) throw new Error('unexpected value')

  for (let foo = 0; foo < 0; foo++) {
    FoodTemplate.create(world,
      random(10, CONFIG.WIDTH - 10),
      random(10, CONFIG.HEIGHT - 10)
    )
  }

  pixiApp.ticker.add(delta => gameLoop(delta))

  function gameLoop(delta) {
    world.execute(delta)
  }
}
