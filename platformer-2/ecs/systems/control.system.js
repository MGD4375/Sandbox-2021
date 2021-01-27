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

            body.xAcceleration = input.states.right ? 1.5 :
                input.states.left ? -1.5 : 0




            if (body.collisions.map(it => it.axis).includes('bottom')) {
                body.yAcceleration = input.states.down ? 4.5 :
                    input.states.up ? -4.5 : 0

                input.states.up = false
            }



        })
    }
}
ControlSystem.queries = {
    subjects: {
        components: [InputState, PhysicsBody]
    }

}