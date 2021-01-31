import {
    System
} from "../../node_modules/ecsy/build/ecsy.module.js"
import {
    Age,
    Attack,
    Facing,
    Faction,
    Health,
    Parent
} from "../components/components.js"
import {
    PhysicsBody
} from "./physics.system.js"

export class AttackSystem extends System {
    constructor(world, attrs) {
        super(world, attrs)
        this.world = world

    }

    execute() {

        this.queries.subjects.results.forEach((entity) => {
            const body = entity.getMutableComponent(PhysicsBody)
            const parent = entity.getComponent(Parent).ref
            const age = entity.getMutableComponent(Age)
            const attack = entity.getComponent(Attack)
            const facing = entity.getComponent(Facing)
            const faction = entity.getComponent(Faction)
            const parentBody = parent.getComponent(PhysicsBody)
            const parentFacing = parent.getComponent(Facing)

            if (!parent || !parentFacing) {
                entity.remove()
                return
            }

            body.x = parentFacing.value === Facing.LEFT ?
                parentBody.x - parentBody.width - 20 :
                parentBody.x + parentBody.width + 3;

            body.y = parentBody.y

            age.current++
            if (age.current === age.max) {
                entity.remove()
            }

            body.collisions.forEach(collision => {
                if (collision.body === parentBody) return
                const collisionFaction = collision.body.entity.getComponent(Faction)
                if (!collisionFaction) return
                if (collisionFaction.value === faction.value) return
                const health = collision.body.entity.getMutableComponent(Health)
                if (!health) return

                const enemyBody = collision.body.entity.getMutableComponent(PhysicsBody)
                health.current -= attack.damage

                enemyBody.xAcceleration = facing.value ? 20 : -20
                enemyBody.yAcceleration = -3

                if (health.current < 1) {
                    collision.body.entity.remove()
                }

                entity.remove()

            })


        })
    }
}
AttackSystem.queries = {
    subjects: {
        components: [Attack, Parent, Age, PhysicsBody]
    }
}