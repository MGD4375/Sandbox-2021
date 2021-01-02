import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import random from "../../random.js";
import Angle from "../components/angle.component.js";
import Attack from "../components/attack.component.js";
import { Collider } from "../components/collider.component.js";
import { Collisions } from "../components/collisions.component.js";
import Enemy from "../components/enemy.component.js";
import Faction from "../components/faction.component.js";
import GlobalCooldown from "../components/globalCooldown.component.js";
import InputComponent from "../components/input.component.js";
import LifeSpan from "../components/lifespan.component.js";
import Transform from "../components/transform.component.js";
import Velocity from "../components/velocity.component.js";

export default class EnemySystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        this.world
        this.lastEvent = 0
        this.tick = 0

    }

    execute(delta, time) {
        const sys = this
        this.tick++

        this.queries.subjects.results.forEach((entity) => {
            var globalCooldown = entity.getMutableComponent(GlobalCooldown)

            if (sys.tick - globalCooldown.lastEvent < globalCooldown.value) { return }
            globalCooldown.lastEvent = sys.tick

            var transform = entity.getComponent(Transform)
            var faction = entity.getComponent(Faction)
            var angle = entity.getMutableComponent(Angle)
            var velocity = entity.getMutableComponent(Velocity)


            if (this.tick % 60 === 0) {
                angle.value = random(0, 300)

            }
            velocity.value = 2
            var input = []
            input.push('2')

            const keys = input.filter(it => {
                return (it === '1')
                    || (it === '2')
                    || (it === '3')
                    || (it === '4')
            })

            if (!(keys.length > 0)) { return }
            this.lastEvent = this.tick
            if (keys.includes('1')) {
                this.world.createEntity()
                    .addComponent(Attack, Attack.create(10, 60))
                    .addComponent(Faction, Faction.create(faction.value))
                    .addComponent(Collisions)
                    .addComponent(Angle, Angle.create(angle.value))
                    .addComponent(Velocity, Velocity.create(5 + velocity.value))
                    .addComponent(Transform, Transform.create(transform.x, transform.y))
                    .addComponent(Collider, Collider.create(72, 72))
                    .addComponent(LifeSpan, LifeSpan.create(12))
            }

            else if (keys.includes('2')) {
                this.world.createEntity()
                    .addComponent(Attack, Attack.create(5, 30))
                    .addComponent(Faction, Faction.create(faction.value))
                    .addComponent(Collisions)
                    .addComponent(Angle, Angle.create(angle.value))
                    .addComponent(Velocity, Velocity.create(6 + velocity.value))
                    .addComponent(Transform, Transform.create(transform.x, transform.y))
                    .addComponent(Collider, Collider.create(15, 15))
                    .addComponent(LifeSpan, LifeSpan.create(120))
            }

            else if (keys.includes('3')) {
                velocity.value = 360
            }
        })
    }
}

EnemySystem.queries = {
    subjects: { components: [Enemy, Angle, Transform, Faction] }
}

