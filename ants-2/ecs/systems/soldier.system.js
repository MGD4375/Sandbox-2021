import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Transform from "../components/transform.component.js";
import SpriteState from "../components/sprite.state.js";
import Velocity from "../components/velocity.component.js";
import CONFIG from "../../app.config.js";
import Angle from "../components/angle.component.js";
import random from "../../random.js";
import Colour from "../components/colour.component.js";
import Soldier from "../components/soldier.component.js";
import { CollisionsActor, CollisionsState } from "../components/collisions.component.js";
import { SensedState } from "../components/sense.component.js";
import Ant from "../components/ant.component.js";
import Egg from "../components/egg.component.js";
import Queen from "../components/queen.component.js";
import Age from "../components/age.component.js";
import pixiApp from "../singletons/pixi.js";
import Cargo from "../components/cargo.component.js";
import FoodTemplate from "../assemblages/food.assemblage.js";

export default class SoldierSystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        this.world = world

        this.strategies = [
            new HuntStrategy(world),
            new PatrolStrategy(world),
            new RoamStrategy(world)
        ]

    }

    execute() {
        this.queries.subjects.results.forEach(entity => {
            const angle = entity.getMutableComponent(Angle)
            const transform = entity.getComponent(Transform)
            const age = entity.getComponent(Age)

            if (age.value < 10) {
                const colour = entity.getMutableComponent(Colour)
                const target = entity.getComponent(SensedState).value
                    .find(it => it.alive && it.getComponent(Queen))

                if (target) {
                    colour.hue = target.getComponent(Colour).hue
                    const sprite = entity.getComponent(SpriteState)
                    pixiApp.stage.removeChild(sprite.ref)
                    entity.removeComponent(SpriteState)
                }
                else { console.warn('No queen nearby for a soldier to imprint on! :(') }

            }

            var result = SoldierStrategy.FAILED;
            var i = 0
            while (result === SoldierStrategy.FAILED) {
                result = this.strategies[i].handle(entity)
                i++
            }

            //  Bounds
            if (transform.x < 0 || transform.x > CONFIG.WIDTH || transform.y < 0 || transform.y > CONFIG.HEIGHT) {
                angle.value = angle.add(Angle.HALF)
            }
        });
    }
}

SoldierSystem.queries = {
    subjects: { components: [Soldier, Velocity, Angle, Transform, Colour, SpriteState, CollisionsState, SensedState] },
};

class SoldierStrategy {
    static FAILED = 'failed'
    static SUCCESS = 'success'
}

class HuntStrategy extends SoldierStrategy {
    constructor(world) {
        super()
        this.world = world
    }

    handle(entity) {
        const colour = entity.getComponent(Colour)
        const target = entity.getComponent(SensedState).value
            .find(it => it.alive && (it.getComponent(Ant) || it.getComponent(Egg)) && it.getComponent(Colour).difference(colour) > 0.4)

        if (!target) { return SoldierStrategy.FAILED }

        const transform = entity.getComponent(Transform)
        const tTransform = target.getComponent(Transform)
        const angle = entity.getMutableComponent(Angle)
        const velocity = entity.getMutableComponent(Velocity)

        var dx = tTransform.x - transform.x;
        var dy = tTransform.y - transform.y;
        angle.value = Math.atan2(dy, dx);
        velocity.value = 1

        entity.getComponent(CollisionsState).value
            .filter(it => it.alive && (it.getComponent(Ant) || it.getComponent(Egg)) && it.getComponent(Colour).difference(colour) > 0.4)
            .forEach(it => {
                if (it.getComponent(Soldier)) { entity.remove() }
                FoodTemplate.create(this.world, transform.x, transform.y)
                it.remove()
            })

        if (!entity.getComponent(CollisionsActor)) {
            entity.addComponent(CollisionsActor)
        }

        return SoldierStrategy.SUCCESS
    }
}

class PatrolStrategy extends SoldierStrategy {

    constructor(world) {
        super()
        this.world = world
    }

    handle(entity) {
        const colour = entity.getMutableComponent(Colour)
        const target = entity.getComponent(SensedState).value
            .find(it => it.alive && it.getComponent(Queen) && it.getComponent(Colour).difference(colour) < 0.2)

        if (!target) { return SoldierStrategy.FAILED }

        const transform = entity.getComponent(Transform)
        const tTransform = target.getComponent(Transform)
        const angle = entity.getMutableComponent(Angle)
        const velocity = entity.getMutableComponent(Velocity)

        const distance = tTransform.distanceTo(transform)
        if (distance > 60) {
            var dx = tTransform.x - transform.x;
            var dy = tTransform.y - transform.y;
            angle.value = Math.atan2(dy, dx);
        } else {
            angle.value = angle.add(random(-1, 1) / 10)
        }
        velocity.value = .7

        entity.getComponent(CollisionsState).value
            .filter(it => it.alive && (it.getComponent(Ant) || it.getComponent(Egg)) && it.getComponent(Colour).difference(colour) > 0.4)
            .forEach(it => {
                if (it.getComponent(Soldier)) { entity.remove() }
                it.remove()
            })

        if (!entity.getComponent(CollisionsActor)) {
            entity.removeComponent(CollisionsActor)
        }

        return SoldierStrategy.SUCCESS
    }
}

class RoamStrategy extends SoldierStrategy {
    handle(entity) {
        const velocity = entity.getMutableComponent(Velocity)
        const angle = entity.getMutableComponent(Angle)

        angle.value = angle.add(random(-1, 1) / 10)
        velocity.value = 0.7

        if (entity.getComponent(CollisionsActor)) {
            entity.removeComponent(CollisionsActor)
        }

        return SoldierStrategy.SUCCESS
    }
}
