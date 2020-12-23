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

                if (cargo.value > 0) {
                } else if (age.value % 10 === 0) {
                    targetState.ref = this.queries.food.results.find((fEntity) => { return transform.distanceTo(fEntity.getComponent(Transform)) < 100 })
                    if (targetState.ref) { intent.value = Intent.GOTO }
                }

            } else if (cargo.value && (!targetState.ref || !targetState.ref.alive)) {
                const queen = this.queries.queens.results.filter(function (it) {
                    const diff = it.getComponent(Colour).difference(colour)
                    return diff < 0.2 && transform.distanceTo(it.getComponent(Transform)) < 300
                }).reverse()[0]

                if (!!queen) {
                    targetState.ref = queen
                    intent.value = Intent.GOTO

                } else {
                    intent.value = Intent.EXPLORE
                    velocity.value = 0.5

                }
            }

            else if (intent.value === Intent.GOTO && (!targetState.ref || !targetState.ref.alive)) {
                intent.value = Intent.EXPLORE

            } if (intent.value === Intent.GOTO && targetState.ref && targetState.ref.alive) {
                const otherTransform = targetState.ref.getComponent(Transform)
                var dx = otherTransform.x - transform.x;
                var dy = otherTransform.y - transform.y;
                angle.value = Math.atan2(dy, dx);
                velocity.value = 1

            }

            if (intent.value === Intent.GOTO && targetState.ref && targetState.ref.alive && targetState.ref.getComponent(Food)) {
                const entitySprite = entity.getComponent(SpriteState)
                const targetSprite = targetState.ref.getComponent(SpriteState)
                try {
                    if (entitySprite.collides(targetSprite.ref)) {
                        cargo.value = 10
                        targetState.ref.remove()

                    }
                } catch (ex) {
                    console.log('ngl, not sure why this happens.', ex)
                    entity.remove()

                }
            }
            else if (intent.value === Intent.GOTO && targetState.ref && targetState.ref.alive && targetState.ref.getComponent(Queen)) {
                const entitySprite = entity.getComponent(SpriteState)
                const targetSprite = targetState.ref.getComponent(SpriteState)

                try {
                    if (entitySprite.collides(targetSprite.ref)) {
                        var queenEnergy = targetState.ref.getMutableComponent(Energy)
                        queenEnergy.value += cargo.value
                        cargo.value = 0
                        targetState.ref = null
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
    subjects: { components: [Worker, Velocity, Angle, Transform, Colour, Cargo, SpriteState, TargetState, Age] },
    food: { components: [Food, Transform, SpriteState] },
    queens: { components: [Queen] },
};