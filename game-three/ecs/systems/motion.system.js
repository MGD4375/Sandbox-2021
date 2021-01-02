import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Transform from "../components/transform.component.js";
import Velocity from "../components/velocity.component.js";
import Angle from "../components/angle.component.js";

export default class MotionSystem extends System {
    execute() {
        this.queries.subjects.results.forEach(entity => {
            var velocity = entity.getMutableComponent(Velocity)
            var angle = entity.getMutableComponent(Angle)
            var transform = entity.getMutableComponent(Transform)

            const movement = transform.add(velocity.value, angle.value)

            transform.x = movement.x
            transform.y = movement.y
        });


    }

}

MotionSystem.queries = {
    subjects: { components: [Transform, Velocity, Angle] },
};