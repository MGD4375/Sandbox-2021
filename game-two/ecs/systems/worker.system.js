import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Transform from "../components/transform.component.js";
import SpriteState from "../components/sprite.state.js";
import Velocity from "../components/velocity.component.js";
import CONFIG from "../../app.config.js";
import Queen from "../components/queen.component.js";
import Angle from "../components/angle.component.js";
import Intent from "../components/intent.component.js";
import random from "../../random.js";
import Colour from "../components/colour.component.js";
import Worker from "../components/worker.component.js";
import Food from "../components/food.component.js";
import Cargo from "../components/cargo.component.js";
import TargetState from "../components/targetState.component.js";
import Energy from "../components/energy.component.js";
import Age from "../components/age.component.js";
import { CollisionsState } from "../components/collisions.component.js";

export default class WorkerSystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        this.world = world
    }

    execute() {
        this.queries.subjects.results.forEach(entity => {
            var angle = entity.getMutableComponent(Angle)
            var intent = entity.getMutableComponent(Intent)
            var transform = entity.getComponent(Transform)
            var colour = entity.getComponent(Colour)
            var age = entity.getComponent(Age)
            var cargo = entity.getMutableComponent(Cargo)
            var velocity = entity.getMutableComponent(Velocity)
            var targetState = entity.getMutableComponent(TargetState)


            //  Travel
            if (intent.value === Intent.EXPLORE) {
                angle.value = angle.add(random(-1, 1) / 10)
                velocity.value = 0.5

            }

            if (intent.value === Intent.EXPLORE && cargo.value === null) {
                targetState.ref = this.queries.food.results.find((fEntity) => { return transform.distanceTo(fEntity.getComponent(Transform)) < 100 })
                if (targetState.ref) { intent.value = Intent.GOTO }

            }

            if (intent.value === Intent.EXPLORE && cargo.value > 0) {
                const queens = this.queries.queens.results.filter(function (it) {
                    const diff = it.getComponent(Colour).difference(colour)
                    return diff < 0.6 && transform.distanceTo(it.getComponent(Transform)) < 300
                })
                const queen = queens.length > 1 ? queens[random(0, queens.length - 1)] : null

                if (!!queen) {
                    targetState.ref = queen
                    intent.value = Intent.GOTO

                }
            }


            if (intent.value === Intent.GOTO && (!targetState.ref || !targetState.ref.alive)) {
                intent.value = Intent.EXPLORE
                targetState.ref = null

            }

            if (intent.value === Intent.GOTO && targetState.ref && targetState.ref.alive) {
                const otherTransform = targetState.ref.getComponent(Transform)
                var dx = otherTransform.x - transform.x;
                var dy = otherTransform.y - transform.y;
                angle.value = Math.atan2(dy, dx);
                velocity.value = 1

            }

            if (intent.value === Intent.GOTO && targetState.ref && targetState.ref.alive && targetState.ref.getComponent(Food)) {
                try {
                    const collisions = entity.getComponent(CollisionsState);
                    var cont = collisions.value
                        .find(it => it === targetState.ref)
                    if (cont) {
                        cargo.value = 10
                        targetState.ref.remove()
                        targetState.ref = null
                    }

                } catch (ex) {
                    console.log('ngl, not sure why this happens.', ex)
                    entity.remove()

                }
            }

            if (intent.value === Intent.GOTO && targetState.ref && targetState.ref.alive && targetState.ref.getComponent(Queen)) {
                try {
                    const collisions = entity.getComponent(CollisionsState);
                    var cont = collisions.value
                        .find(it => it === targetState.ref)
                    if (cont) {
                        var queenEnergy = targetState.ref.getMutableComponent(Energy)
                        queenEnergy.value += cargo.value
                        targetState.ref = null
                        cargo.value = null
                        intent.value = Intent.EXPLORE
                    }
                } catch (ex) {
                    console.log('ngl, not sure why this happens.', ex)
                    entity.remove()

                }
            }


            //  Bounds
            if (transform.x < 0 || transform.x > CONFIG.WIDTH || transform.y < 0 || transform.y > CONFIG.HEIGHT) {
                angle.value = angle.add(Angle.HALF)
            }

        });
    }
}

WorkerSystem.queries = {
    subjects: { components: [Worker, Velocity, Angle, Transform, Colour, Cargo, TargetState, Age, CollisionsState] },
    food: { components: [Food, Transform] },
    queens: { components: [Queen] },
};