import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Angle from "../components/angle.component.js";
import Attack from "../components/attack.component.js";
import { Collider } from "../components/collider.component.js";
import { Collisions } from "../components/collisions.component.js";
import InputComponent from "../components/input.component.js";
import LifeSpan from "../components/lifespan.component.js";
import Transform from "../components/transform.component.js";
import Velocity from "../components/velocity.component.js";

export default class PlayerAttackSystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        this.world
        this.lastEvent = 0
        this.tick = 0
        this.globalCooldown = 20
        this.cooldowns = {}
        this.cooldowns[1] = 24
        this.cooldowns[2] = 30
        this.cooldowns[3] = 120
        this.lastUseds = {}
        this.lastUseds[1] = 0
        this.lastUseds[2] = 0
        this.lastUseds[3] = 0
    }

    execute(delta, time) {
        const sys = this
        this.tick++
        if (this.tick - this.lastEvent < this.globalCooldown) { return }

        this.queries.subjects.results.forEach((entity) => {
            var input = entity.getComponent(InputComponent)
            var transform = entity.getComponent(Transform)
            var angle = entity.getMutableComponent(Angle)
            var velocity = entity.getMutableComponent(Velocity)

            const keys = input.keys.filter(it => {
                return (it === '1' && sys.tick - sys.lastUseds[1] > sys.cooldowns[1])
                    || (it === '2' && sys.tick - sys.lastUseds[2] > sys.cooldowns[2])
                    || (it === '3' && sys.tick - sys.lastUseds[3] > sys.cooldowns[3])
                    || (it === '4' && sys.tick - sys.lastUseds[4] > sys.cooldowns[4])
            })

            if (!(keys.length > 0)) { return }
            this.lastEvent = this.tick
            if (keys.includes('1')) {
                this.lastUseds[1] = this.tick
                this.world.createEntity()
                    .addComponent(Attack, Attack.create(10, 60))
                    .addComponent(Collisions)
                    .addComponent(Angle, Angle.create(angle.value))
                    .addComponent(Velocity, Velocity.create(5 + velocity.value))
                    .addComponent(Transform, Transform.create(transform.x, transform.y))
                    .addComponent(Collider, Collider.create(72, 72))
                    .addComponent(LifeSpan, LifeSpan.create(12))
            }

            else if (keys.includes('2')) {
                this.lastUseds[2] = this.tick
                velocity.value = 0
                this.world.createEntity()
                    .addComponent(Attack, Attack.create(5, 30))
                    .addComponent(Collisions)
                    .addComponent(Angle, Angle.create(angle.value))
                    .addComponent(Velocity, Velocity.create(6 + velocity.value))
                    .addComponent(Transform, Transform.create(transform.x, transform.y))
                    .addComponent(Collider, Collider.create(30, 30))
                    .addComponent(LifeSpan, LifeSpan.create(120))
            }

            else if (keys.includes('3')) {
                this.lastUseds[3] = this.tick
                velocity.value = 360
            }
        })
    }
}

PlayerAttackSystem.queries = {
    subjects: { components: [InputComponent, Angle, Transform] }
}

