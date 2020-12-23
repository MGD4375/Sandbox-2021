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
import TargetState from "../components/targetState.component.js";
import Soldier from "../components/soldier.component.js";
import Ant from "../components/ant.component.js";
import ParentState from "../components/parent.component.js";
import Age from "../components/age.component.js";

export default class SoldierSystem extends System {

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
            var velocity = entity.getMutableComponent(Velocity)
            var parentState = entity.getMutableComponent(ParentState)

            if (!parentState.ref && age.value < 10) {
                parentState.ref = this.queries.queens.results
                    .filter(it => it.getComponent(Colour).difference(colour) < 0.2 && it.getComponent(Transform).distanceTo(transform) < 120)
                    .sort((a, b) => {
                        return a.getComponent(Transform).distanceTo(transform) - b.getComponent(Transform).distanceTo(transform)
                    })[0]
            }

            if (!parentState.ref || !parentState.ref.alive) {
                entity.remove()
                return
            }

            const parent = parentState.ref

            var parentTransform = parent.getComponent(Transform)

            //  Travel
            if (intent.value === Intent.PATROL) {
                const distance = parentTransform.distanceTo(transform)
                if (distance > 90) {
                    var dx = parentTransform.x - transform.x;
                    var dy = parentTransform.y - transform.y;
                    angle.value = Math.atan2(dy, dx);

                }
                else {
                    angle.value = angle.add(random(-1, 1) / 10)

                }

                velocity.value = 0.7

            }

            const mySprite = entity.getComponent(SpriteState)
            const toKill = this.queries.victims.results
                .filter(it => it.getComponent(Colour).difference(colour) > 0.3)
                .find(it => {
                    const otherSprite = it.getComponent(SpriteState)
                    return mySprite.collides(otherSprite.ref)
                })
            if (toKill) {
                toKill.remove()

            }

            //  Bounds
            if (transform.x < 0 || transform.x > CONFIG.WIDTH || transform.y < 0 || transform.y > CONFIG.HEIGHT) {
                angle.value = angle.add(Angle.HALF)
            }

        });
    }
}

SoldierSystem.queries = {
    subjects: { components: [Soldier, Velocity, Angle, Transform, Colour, SpriteState, TargetState, ParentState] },
    victims: { components: [Ant, Transform, SpriteState] },
    queens: { components: [Queen] },
};