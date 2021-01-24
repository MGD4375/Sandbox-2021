import {
    System
} from "../../node_modules/ecsy/build/ecsy.module.js"
import {
    InputState
} from "./keyboard.system.js"
import {
    PhysicsBody
} from "./physics.system.js"

export class ControlSystem extends System {
    constructor(world, attrs) {
        super(world, attrs)
        this.world = world

    }

    execute() {

        this.queries.subjects.results.forEach(entity => {
            const body = entity.getMutableComponent(PhysicsBody)
            const input = entity.getMutableComponent(InputState)

            body.xAcceleration = input.states.right ? 1 :
                input.states.left ? -1 : 0

            body.yAcceleration = input.states.down ? 5 :
                input.states.up ? -5 : 0

        })
    }
}
ControlSystem.queries = {
    subjects: {
        components: [InputState, PhysicsBody]
    }

}