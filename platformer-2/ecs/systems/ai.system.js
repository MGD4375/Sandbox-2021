import {
    Component,
    System
} from "../../node_modules/ecsy/build/ecsy.module.js"
import {
    AIComponent
} from "../components/components.js"
import {
    InputState
} from "./keyboard.system.js"
import {
    PhysicsBody
} from "./physics.system.js"


export class AISystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        this.tick = 0
    }
    execute(delta) {
        this.tick++
        const tick = this.tick

        this.queries.subjects.results.forEach(ent => {
            let body = ent.getComponent(PhysicsBody)
            let inp = ent.getMutableComponent(InputState)

            if (inp.states['right'] === undefined) {
                inp.states['right'] = true
            }

            if (body.collisions.map(it => it.axis).includes('left')) {
                inp.states['right'] = true
                inp.states['left'] = false


            } else if (body.collisions.map(it => it.axis).includes('right')) {
                inp.states['left'] = true
                inp.states['right'] = false
            }

            if (this.tick % 100 === 5) {
                inp.states['attack1'] = true
            }

        })
    }
}
AISystem.queries = {
    subjects: {
        components: [InputState, AIComponent],
    },
}