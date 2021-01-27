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
    execute(delta, time) {
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

            // if(Math.random() > 0.5){
            //     inp.states['up'] = true

            // }else {
            //     inp.states['up'] = false

            // }

        })
    }
}
AISystem.queries = {
    subjects: {
        components: [InputState, AIComponent],
    },
}