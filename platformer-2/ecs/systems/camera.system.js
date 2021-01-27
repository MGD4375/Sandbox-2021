import {
    System,
    TagComponent
} from "../../node_modules/ecsy/build/ecsy.module.js";
import {
    ColliderState
} from "../components/components.js";
import {
    PhysicsBody
} from "./physics.system.js";

export class CameraFocus extends TagComponent {}

export class CameraSystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        this.world = world
    }

    execute() {
        const game = this.world
        this.queries.subjects.results.forEach(entity => {
            //  TODO: Move this to sprite
            var sprite = entity.getComponent(ColliderState).ref
            game.pixi.stage.position.set(game.pixi.screen.width / 2, game.pixi.screen.height / 2);
            game.pixi.stage.pivot.copyFrom(sprite.position);
        });
    }
}

CameraSystem.queries = {
    subjects: {
        components: [CameraFocus, PhysicsBody]
    }
};