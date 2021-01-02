import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Transform from "../components/transform.component.js";
import Velocity from "../components/velocity.component.js";
import CONFIG from "../../app.config.js";
import Queen from "../components/queen.component.js";
import Angle from "../components/angle.component.js";
import random from "../../random.js";
import Colour from "../components/colour.component.js";
import Worker from "../components/worker.component.js";
import Food from "../components/food.component.js";
import Cargo from "../components/cargo.component.js";
import TargetState from "../components/targetState.component.js";
import Energy from "../components/energy.component.js";
import Age from "../components/age.component.js";
import { CollisionsActor, CollisionsState } from "../components/collisions.component.js";
import { SensedState } from "../components/sense.component.js";

export default class WorkerSystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        this.world = world

        this.strategies = [
            HuntStrategy,
            ReturnStrategy,
            RoamStrategy
        ]

    }

    execute() {
        this.queries.subjects.results.forEach(entity => {

            var result = WorkerStrategy.FAILED;
            var i = 0
            while (result === WorkerStrategy.FAILED) {
                result = this.strategies[i].handle(entity)
                i++
            }

            //  Bounds
            const angle = entity.getMutableComponent(Angle)
            const transform = entity.getComponent(Transform)

            if (transform.x < 0 || transform.x > CONFIG.WIDTH || transform.y < 0 || transform.y > CONFIG.HEIGHT) {
                angle.value = angle.add(Angle.HALF)
            }

        });
    }
}

WorkerSystem.queries = {
    subjects: { components: [Worker, Velocity, Angle, Transform, Colour, Cargo, TargetState, Age, CollisionsState, SensedState] },
};


class WorkerStrategy {
    static FAILED = 'failed'
    static SUCCESS = 'success'
}

class HuntStrategy extends WorkerStrategy {
    static handle(entity) {
        const cargo = entity.getMutableComponent(Cargo)
        if (cargo.value) return super.FAILED

        const sensed = entity.getComponent(SensedState).value
        const food = sensed.find(it => it.getComponent(Food))
        if (!food) return super.FAILED

        const velocity = entity.getMutableComponent(Velocity)
        const angle = entity.getMutableComponent(Angle)

        const transform = entity.getComponent(Transform)
        const otherTransform = food.getComponent(Transform)
        var dx = otherTransform.x - transform.x;
        var dy = otherTransform.y - transform.y;
        angle.value = Math.atan2(dy, dx);
        velocity.value = 1

        const collisions = entity.getComponent(CollisionsState).value
        collisions.filter(it => it.getComponent(Food))
            .forEach(it => {
                cargo.value = 10
                it.remove()
                angle.value += Angle.HALF
            })

        if (!entity.getComponent(CollisionsActor)) {
            entity.addComponent(CollisionsActor)
        }

        return super.SUCCESS
    }
}

class ReturnStrategy extends WorkerStrategy {
    static handle(entity) {
        const cargo = entity.getMutableComponent(Cargo)
        if (!cargo.value) return super.FAILED

        const sensed = entity.getComponent(SensedState).value
        const colour = entity.getComponent(Colour)
        const queen = sensed.find(it => it.getComponent(Queen) && it.getComponent(Colour).difference(colour) < 0.6)
        if (!queen) return super.FAILED

        const velocity = entity.getMutableComponent(Velocity)
        const angle = entity.getMutableComponent(Angle)

        const transform = entity.getComponent(Transform)
        const otherTransform = queen.getComponent(Transform)
        var dx = otherTransform.x - transform.x;
        var dy = otherTransform.y - transform.y;
        angle.value = Math.atan2(dy, dx);
        velocity.value = 1

        const collisions = entity.getComponent(CollisionsState).value
        collisions.filter(it => it.getComponent(Queen) && it.getComponent(Colour).difference(colour) < 0.6)
            .forEach(it => {
                it.getMutableComponent(Energy).value += cargo.value
                cargo.value = null
                angle.value += Angle.HALF
            })

        if (!entity.getComponent(CollisionsActor)) {
            entity.addComponent(CollisionsActor)
        }

        return super.SUCCESS
    }
}

class RoamStrategy extends WorkerStrategy {
    static handle(entity) {
        const velocity = entity.getMutableComponent(Velocity)
        const angle = entity.getMutableComponent(Angle)

        angle.value = angle.add(random(-1, 1) / 10)
        velocity.value = 0.5

        if (entity.getComponent(CollisionsActor)) {
            entity.removeComponent(CollisionsActor)
        }

        return super.SUCCESS
    }
}
