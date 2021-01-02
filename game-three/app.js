import { World } from "../node_modules/ecsy/build/ecsy.module.js";
import CONFIG from "./app.config.js";
import Angle from "./ecs/components/angle.component.js";
import { Collider, ColliderState } from "./ecs/components/collider.component.js";
import InputComponent from "./ecs/components/input.component.js";
import LifeSpan from "./ecs/components/lifespan.component.js";
import Transform from "./ecs/components/transform.component.js";
import Velocity from "./ecs/components/velocity.component.js";
import pixiApp from "./ecs/singletons/pixi.js";
import DebugSystem from "./ecs/systems/debug.system.js";
import InputSystem from "./ecs/systems/input.system.js";
import MotionSystem from "./ecs/systems/motion.system.js";
import PlayerAttackSystem from "./ecs/systems/playerAttack.system.js";
import PlayerMovementSystem from "./ecs/systems/playerMovement.system.js";
import LifeSpanSystem from "./ecs/systems/lifespan.system.js";
import CollisionsSystem from "./ecs/systems/collisions.system.js";
import { Collisions, CollisionsActor, CollisionsState } from "./ecs/components/collisions.component.js";
import Attack from "./ecs/components/attack.component.js";
import AttackSystem from "./ecs/systems/attack.system.js";
import Enemy from "./ecs/components/enemy.component.js";
import Knockback from "./ecs/components/knockback.component.js";
import CameraFocusComponent from "./ecs/components/cameraFocus.component.js";
import CameraSystem from "./ecs/systems/camera.system.js";

const world = new World()
  .registerComponent(Knockback)
  .registerComponent(CameraFocusComponent)
  .registerComponent(Enemy)
  .registerComponent(Attack)
  .registerComponent(LifeSpan)
  .registerComponent(InputComponent)
  .registerComponent(Transform)
  .registerComponent(Angle)
  .registerComponent(Velocity)

  //  Collisions
  .registerComponent(Collider)
  .registerComponent(CollisionsActor)
  .registerComponent(ColliderState)
  .registerComponent(Collisions)
  .registerComponent(CollisionsState)

  .registerSystem(InputSystem)
  .registerSystem(PlayerMovementSystem)
  .registerSystem(PlayerAttackSystem)
  .registerSystem(MotionSystem)
  .registerSystem(CollisionsSystem)
  .registerSystem(AttackSystem)
  .registerSystem(DebugSystem)
  .registerSystem(LifeSpanSystem)
  .registerSystem(CameraSystem)


PIXI.Loader.shared
  .load(setup);

function setup() {

  //  Create Hero
  world.createEntity()
    .addComponent(CameraFocusComponent)
    .addComponent(CollisionsActor)
    .addComponent(Collisions)
    .addComponent(Collider, Collider.create(48, 72))
    .addComponent(Transform, Transform.create(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2))
    .addComponent(Velocity)
    .addComponent(Angle)
    .addComponent(InputComponent)


  //  Create enemies
  world.createEntity()
    .addComponent(Enemy)
    .addComponent(CollisionsActor)
    .addComponent(Collisions)
    .addComponent(Collider, Collider.create(48, 72))
    .addComponent(Transform, Transform.create(CONFIG.WIDTH / 1.5, CONFIG.HEIGHT / 2))
    .addComponent(Velocity)
    .addComponent(Angle)


  pixiApp.ticker.add(delta => gameLoop(delta))

  function gameLoop(delta) {
    world.execute(delta)
  }
}
