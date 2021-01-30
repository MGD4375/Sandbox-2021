import {
    System
} from "../../node_modules/ecsy/build/ecsy.module.js"
import {
    Age,
    AIComponent,
    Attack,
    Facing,
    MovementSpeed,
    Parent
} from "../components/components.js"
import {
    InputState
} from "./keyboard.system.js"
import {
    PhysicsBody
} from "./physics.system.js"

export class ControlSystem extends System {
    constructor(world, attrs) {
        super(world, attrs)
        this.world = world

    }

    execute() {
        const game = this.world

        this.queries.subjects.results.forEach(entity => {
            const body = entity.getMutableComponent(PhysicsBody)
            const input = entity.getMutableComponent(InputState)
            const facing = entity.getMutableComponent(Facing)
            const ms = entity.getComponent(MovementSpeed)

            body.xAcceleration = input.states.right ? ms.value :
                input.states.left ? -ms.value : 0

            if (body.xAcceleration > 0) {
                facing.value = Facing.RIGHT

            } else if (body.xAcceleration < 0) {
                facing.value = Facing.LEFT

            }

            if (body.collisions.map(it => it.axis).includes('bottom')) {
                body.yAcceleration = input.states.down ? 4.5 :
                    input.states.up ? -4.5 : 0

                input.states.up = false
            }

            if (input.states.attack1) {
                input.states.attack1 = false

                if (facing.value === Facing.LEFT) {
                    const attackBody = PhysicsBody.create(body.x - body.width - 16, body.y, 48, 48)
                    attackBody.corporeal = false
                    attackBody.static = true

                    game.createEntity()
                        .addComponent(Attack, Attack.create(1))
                        .addComponent(Parent, Parent.create(entity))
                        .addComponent(Facing, Facing.create(Facing.LEFT))
                        .addComponent(Age, Age.create(0, 10))
                        .addComponent(PhysicsBody, attackBody)

                } else {
                    const attackBody = PhysicsBody.create(body.x + body.width, body.y, 48, 48)
                    attackBody.corporeal = false
                    attackBody.static = true

                    game.createEntity()
                        .addComponent(Attack, Attack.create(1))
                        .addComponent(Facing, Facing.create(Facing.RIGHT))
                        .addComponent(Parent, Parent.create(entity))
                        .addComponent(Age, Age.create(0, 10))
                        .addComponent(PhysicsBody, attackBody)

                }




            }
            if (input.states.attack2) {
                input.states.attack2 = false

            }
            if (input.states.attack3) {
                input.states.attack3 = false

            }



        })
    }
}
ControlSystem.queries = {
    subjects: {
        components: [InputState, PhysicsBody, MovementSpeed, Facing]
    }

}