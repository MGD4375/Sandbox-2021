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
import { Collisions, CollisionsState } from "./ecs/components/collisions.component.js";
import Attack from "./ecs/components/attack.component.js";
import AttackSystem from "./ecs/systems/attack.system.js";
import Enemy from "./ecs/components/enemy.component.js";
import Knockback from "./ecs/components/knockback.component.js";
import CameraSystem from "./ecs/systems/camera.system.js";
import Health from "./ecs/components/health.component.js";
import Blocker from "./ecs/components/blocker.component.js";
import random from "./random.js";
import Player from "./ecs/components/player.component.js";
import UiSystem from "./ecs/systems/ui.system.js";
import { CameraFocusComponent, UI } from "./ecs/components/camera.component.js";
import { SpriteState } from "./ecs/components/sprite.component.js";
import EnemySystem from "./ecs/systems/enemy.system.js";
import Faction from "./ecs/components/faction.component.js";
import DeathSystem from "./ecs/systems/death.system.js";
import GlobalCooldown from "./ecs/components/globalCooldown.component.js";

const world = new World()
  .registerComponent(Player)
  .registerComponent(GlobalCooldown)
  .registerComponent(Faction)
  .registerComponent(Blocker)
  .registerComponent(Health)
  .registerComponent(Knockback)
  .registerComponent(UI)
  .registerComponent(CameraFocusComponent)
  .registerComponent(Enemy)
  .registerComponent(Attack)
  .registerComponent(LifeSpan)
  .registerComponent(InputComponent)
  .registerComponent(Transform)
  .registerComponent(Angle)
  .registerComponent(Velocity)

  //  Graphics
  .registerComponent(SpriteState)

  //  Collisions

  .registerComponent(Collider)
  .registerComponent(ColliderState)
  .registerComponent(Collisions)
  .registerComponent(CollisionsState)

  .registerSystem(EnemySystem)
  .registerSystem(InputSystem)
  .registerSystem(PlayerMovementSystem)
  .registerSystem(PlayerAttackSystem)
  .registerSystem(CollisionsSystem)
  .registerSystem(MotionSystem)
  .registerSystem(AttackSystem)
  .registerSystem(LifeSpanSystem)
  .registerSystem(DebugSystem)
  .registerSystem(CameraSystem)
  .registerSystem(UiSystem)
  .registerSystem(DeathSystem)


PIXI.Loader.shared
  .load(setup);

function setup() {

  world.createEntity()
    .addComponent(UI)

  //  Create Hero
  world.createEntity()
    .addComponent(CameraFocusComponent)
    .addComponent(GlobalCooldown)
    .addComponent(Faction, Faction.create(Faction.PLAYERS))
    .addComponent(Player)
    .addComponent(Health, Health.create(120, 120))
    .addComponent(Collisions)
    .addComponent(Collider, Collider.create(48, 48))
    .addComponent(Transform, Transform.create(CONFIG.WIDTH / 2, CONFIG.HEIGHT / 2))
    .addComponent(Velocity)
    .addComponent(Angle)
    .addComponent(InputComponent)

  //  Create enemies

  for (let index = 0; index < 20; index++) {
    world.createEntity()
      .addComponent(Enemy)
      .addComponent(GlobalCooldown)
      .addComponent(Health, Health.create(30, 30))
      .addComponent(Collisions)
      .addComponent(Faction, Faction.create(Faction.ENEMIES))
      .addComponent(Collider, Collider.create(48, 48))
      .addComponent(Transform, Transform.create(random(0, CONFIG.WIDTH), random(0, CONFIG.HEIGHT)))
      .addComponent(Velocity)
      .addComponent(Angle)

  }

 




  // for (let x = 0; x < CONFIG.WIDTH; x += 120) {
  //   for (let y = 0; y < CONFIG.HEIGHT; y += 120) {

  //     if (x < 1 * 120 || y < 1 * 120 || x === (11 * 120) || y === (6 * 120)) {
  //       world.createEntity()
  //         .addComponent(Blocker)
  //         .addComponent(Collider, Collider.create(120, 120))
  //         .addComponent(Transform, Transform.create(x, y))

  //     }
  //   }
  // }

  for (let x = 0; x < CONFIG.WIDTH - 0; x += 120) {
    for (let y = 0; y < CONFIG.HEIGHT - 0; y += 120) {
      if (random(0, 10) === 6) {
        world.createEntity()
          .addComponent(Blocker)
          .addComponent(Collider, Collider.create(120, 120))
          .addComponent(Transform, Transform.create(x, y))
      }
    }
  }


  pixiApp.ticker.add(delta => gameLoop(delta))

  function gameLoop(delta) {
    world.execute(delta)
  }
}
