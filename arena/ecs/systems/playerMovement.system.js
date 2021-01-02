import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Angle from "../components/angle.component.js";
import InputComponent from "../components/input.component.js";
import Velocity from "../components/velocity.component.js";

export default class PlayerMovementSystem extends System {
    execute(delta, time) {
        this.queries.subjects.results.forEach((entity) => {
            var input = entity.getComponent(InputComponent)
            var angle = entity.getMutableComponent(Angle)
            var velocity = entity.getMutableComponent(Velocity)

            const wasd = input.keys.filter(it => {
                return it === 'w'
                    || it === 'a'
                    || it === 's'
                    || it === 'd'
            })


            var newAngle = null
            if (wasd.includes('w') && wasd.includes('d')) { newAngle = Angle.NORTH_EAST }
            else if (wasd.includes('s') && wasd.includes('d')) { newAngle = Angle.SOUTH_EAST }
            else if (wasd.includes('s') && wasd.includes('a')) { newAngle = Angle.SOUTH_WEST }
            else if (wasd.includes('w') && wasd.includes('a')) { newAngle = Angle.NORTH_WEST }
            else if (wasd.includes('w')) { newAngle = Angle.NORTH }
            else if (wasd.includes('d')) { newAngle = Angle.EAST }
            else if (wasd.includes('s')) { newAngle = Angle.SOUTH }
            else if (wasd.includes('a')) { newAngle = Angle.WEST }

            if (wasd.length > 0) {
                velocity.value = 6
            } else {
                velocity.value = 0
            }

            if (newAngle !== null) {
                angle.value = newAngle
            }
        })
    }
}

PlayerMovementSystem.queries = {
    subjects: { components: [InputComponent, Velocity, Angle] }
}

