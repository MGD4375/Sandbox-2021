import {
    BodyState,
    PhysicsBody,
    SensorBody,
    SensorState
} from "../engine/physics.system.js";
import {
    Render
} from "../engine/renderer.system.js";
import {
    Component,
    System,
    TagComponent,
    Types
} from "../node_modules/ecsy/build/ecsy.module.js";

export class CarryingFood extends TagComponent {}
export class Ant extends TagComponent {}
export class Hive extends TagComponent {}
export class Food extends TagComponent {}
export class HomePheramone extends TagComponent {}
export class FoodPheramone extends TagComponent {}
export class Age extends Component {}
Age.schema = {
    value: {
        type: Types.Number,
        default: 0
    }
}

export default class DemoSystem extends System {
    constructor(world, attrs) {
        super(world, attrs);
        this.world = world
        this.count = 0

    }
    execute() {
        this.count++

        const hive = this.queries.hives.results.find(it => it)

        if (this.count < (60)) {
            this.world.createEntity()
                .addComponent(Ant)
                .addComponent(Age)
                .addComponent(Render)
                .addComponent(
                    PhysicsBody,
                    PhysicsBody.create({
                        shape: PhysicsBody.SHAPES.BOX,
                        type: PhysicsBody.TYPES.DYNAMIC,
                        height: 6,
                        width: 10,
                        x: 400,
                        y: 300,
                        angle: Math.random() * 360
                    })
                )
                .addComponent(
                    SensorBody,
                    SensorBody.create({
                        shape: SensorBody.SHAPES.BOX,
                        type: SensorBody.TYPES.DYNAMIC,
                        height: 12,
                        width: 12,
                        collisionGroup: 2

                    })
                )
        }

        this.queries.agers.results.forEach(entity => {
            const age = entity.getMutableComponent(Age);
            age.value++
        })


        this.queries.pheramones.results.forEach(entity => {
            const age = entity.getComponent(Age);
            if (age.value > 720) {
                entity.remove()
            }

        })

        this.queries.subjects.results.forEach(entity => {
            const bodyState = entity.getComponent(BodyState);
            const sensorState = entity.getComponent(SensorState);
            const age = entity.getComponent(Age);
            const bodySpec = entity.getMutableComponent(PhysicsBody);

            bodySpec.angle += (-1 + (Math.random() * 2)) * 0.5
            bodySpec.velocity = 1


            if (!entity.getComponent(CarryingFood)) {

                const food = bodyState.collisions
                    .find(cEntity => !!cEntity.getComponent(Food))

                const target = sensorState.collisions
                    .find(it => it.getComponent(Food))

                if (!!food) {
                    food.remove()
                    entity.addComponent(CarryingFood)
                } else if (!!target) {
                    const targetBody = target.getComponent(PhysicsBody)

                    var angleRadians = Math.atan2(
                        targetBody.y - bodySpec.y,
                        targetBody.x - bodySpec.x
                    );

                    bodySpec.angle = angleRadians;

                }

                //  TODO: If carrying food
                //  And colliding with home home pheramone
                //  veer left, else stay parallel
            } else if (entity.getComponent(CarryingFood)) {
                const hiveBody = hive.getComponent(PhysicsBody)


                var angleRadians = Math.atan2(
                    hiveBody.y - bodySpec.y,
                    hiveBody.x - bodySpec.x
                );

                bodySpec.angle = angleRadians;

                const hiveCollision = bodyState.collisions
                    .find(cEntity => !!cEntity.getComponent(Hive))

                if (!!hiveCollision) {
                    entity.removeComponent(CarryingFood)
                }
            }

            //  The problem with pheramones is there's many times more of them than ants. So the performance takes a massive dip.
            if (age.value % 30 === 0) {
                this.world.createEntity()
                    .addComponent(HomePheramone)
                    .addComponent(Age)
                    .addComponent(
                        PhysicsBody,
                        PhysicsBody.create({
                            shape: PhysicsBody.SHAPES.BOX,
                            type: PhysicsBody.TYPES.STATIC,
                            height: 30,
                            width: 30,
                            x: bodySpec.x,
                            y: bodySpec.y,
                            collisionGroup: 2
                        })
                    )
            }
        })
    }
}

DemoSystem.queries = {
    hives: {
        components: [Hive],
    },
    subjects: {
        components: [Ant, Age, BodyState],
    },
    agers: {
        components: [Age]
    },
    pheramones: {
        components: [HomePheramone, Age]
    }
}