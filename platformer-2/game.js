import {
    ColliderState
} from "./ecs/components/components.js";
import {
    ColliderSystem
} from "./ecs/systems/collider.system.js";
import {
    ControlSystem
} from "./ecs/systems/control.system.js";
import {
    InputState,
    KeyboardState,
    KeyboardSystem
} from "./ecs/systems/keyboard.system.js";
import {
    PhysicsBody,
    PhysicsSystem
} from "./ecs/systems/physics.system.js";
import {
    World
} from "./node_modules/ecsy/build/ecsy.module.js";

export default class Platformer extends World {
    static create(width = 480 * 3, height = 270 * 3) {
        return new Promise((resolve) => {

            const game = new Platformer()
                .registerComponent(PhysicsBody)
                .registerComponent(ColliderState)
                .registerComponent(InputState)
                .registerComponent(KeyboardState)
                .registerSystem(ControlSystem)
                .registerSystem(KeyboardSystem)
                .registerSystem(PhysicsSystem)
                .registerSystem(ColliderSystem)

            game.height = height
            game.width = width

            PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

            const pixiApp = new PIXI.Application({
                width: width, // default: 800
                height: height, // default: 600
                antialias: true, // default: false
                transparent: false, // default: false
                resolution: 1 // default: 1
            });

            document.body.appendChild(pixiApp.view);
            pixiApp.renderer.backgroundColor = 0x7F7F7F;

            game.pixi = pixiApp

            PIXI.Loader.shared.load(() => {
                resolve(game);
            });

        })
    }
}