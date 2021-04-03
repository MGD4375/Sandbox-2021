import {
    BodyState
} from "../engine/physics.system.js";
import {
    System,
    TagComponent
} from "../node_modules/ecsy/build/ecsy.module.js";

export class Ant extends TagComponent {}

export default class DemoSystem extends System {
    execute() {
        this.queries.subjects.results.forEach(entity => {
            const bodyState = entity.getMutableComponent(BodyState);

            if (bodyState.collisions.length > 0) {
                entity.remove()
                console.log('Killing entity', entity.id)
            }
        })
    }
}

DemoSystem.queries = {
    subjects: {
        components: [Ant, BodyState]
    }
}