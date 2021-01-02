import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Transform from "../components/transform.component.js";
import Velocity from "../components/velocity.component.js";
import Angle from "../components/angle.component.js";
import { Collisions, CollisionsState } from "../components/collisions.component.js";
import Blocker from "../components/blocker.component.js";
import { Collider, ColliderState } from "../components/collider.component.js";

//  Collision resolution based on https://developer.ibm.com/languages/javascript/tutorials/wa-build2dphysicsengine/
export default class MotionSystem extends System {
    execute() {
        this.queries.subjects.results.forEach(entity => {
            var velocity = entity.getMutableComponent(Velocity)
            var angle = entity.getMutableComponent(Angle)
            var eTransform = entity.getMutableComponent(Transform)
            var collisions = entity.getComponent(CollisionsState)

            const movement = eTransform.add(velocity.value, angle.value)
            const blocker = collisions.value.find(it => it.getComponent(Blocker))
            if (blocker) {
                const eCollider = entity.getComponent(Collider)
                const bCollider = blocker.getComponent(Collider)
                const bTransform = blocker.getComponent(Transform)

                // Find the mid points of the entity and player
                const pMidX = eTransform.x;
                const pMidY = eTransform.y;
                const aMidX = bTransform.x;
                const aMidY = bTransform.y;

                // To find the side of entry calculate based on
                // the normalized sides
                var dx = (aMidX - pMidX) / (eCollider.width / 2);
                var dy = (aMidY - pMidY) / (eCollider.height / 2);

                // Calculate the absolute change in x and y
                var absDX = Math.abs(dx);
                var absDY = Math.abs(dy);

                if (dx < 0) {
                    eTransform.x = bTransform.x + (bCollider.width / 2) + (eCollider.width / 2);
                }
                else {
                    eTransform.x = bTransform.x - (bCollider.width / 2) - (eCollider.width / 2);
                }
                // if (dy < 0) {
                //     eTransform.y = bTransform.y + (bCollider.height / 2) + (eCollider.height / 2) + 1;
                // }
                // else {
                //     eTransform.y = bTransform.y - (bCollider.height / 2) - (eCollider.height / 2) - 1;
                // }

                velocity.value = 0

            } else {
                eTransform.x = movement.x
                eTransform.y = movement.y

            }

        });


    }

}

MotionSystem.queries = {
    subjects: { components: [Transform, Velocity, Angle, Collider, Collisions, CollisionsState] },
};