import {
    Component,
    Not,
    System,
    SystemStateComponent,
    Types
} from "../node_modules/ecsy/build/ecsy.module.js";

//  Aliases. In a perfect ES6 world these would all be module imports
const Engine = Matter.Engine,
    World = Matter.World,
    Events = Matter.Events,
    Bodies = Matter.Bodies,
    Body = Matter.Body

export class PhysicsBody extends Component {
    static SHAPES = {
        BOX: "box",
        TRIANGLE: "triangle",
        CIRCLE: "circle"
    }

    static TYPES = {
        STATIC: "static",
        DYNAMIC: "dynamic"
    }

    static create(options) {
        //  Validation
        if (!options.x) console.warn('PhysicsBody needs an x position')
        if (!options.y) console.warn('PhysicsBody needs a y position')
        if (!options.height) console.warn('PhysicsBody needs a height')
        if (!options.width) console.warn('PhysicsBody needs a width')
        if (options.type !== PhysicsBody.TYPES.DYNAMIC && options.type !== PhysicsBody.TYPES.STATIC) console.warn('PhysicsBody needs a type: static or dynamic')

        return options;
    }
}
PhysicsBody.schema = {
    shape: {
        type: Types.String
    },
    type: {
        type: Types.String
    },
    x: {
        type: Types.Number
    },
    y: {
        type: Types.Number
    },
    width: {
        type: Types.Number
    },
    height: {
        type: Types.Number
    },
    angle: {
        type: Types.Number,
        default: 0
    },
    velocity: {
        type: Types.Number,
        default: 0
    },
    collisionGroup: {
        type: Types.Number,
        default: 1
    }
}


export class BodyState extends SystemStateComponent {
    static create(ref) {
        return {
            ref
        }
    }
}
BodyState.schema = {
    ref: {
        type: Types.Ref
    },
    collisions: {
        type: Types.Array,
        default: []
    }
}

export class SensorState extends BodyState {}
export class SensorBody extends PhysicsBody {
    static create(options) {
        //  Validation
        if (!options.height) console.warn('SensorBody needs a height')
        if (!options.width) console.warn('SensorBody needs a width')
        if (options.type !== PhysicsBody.TYPES.DYNAMIC && options.type !== PhysicsBody.TYPES.STATIC) console.warn('PhysicsBody needs a type: static or dynamic')

        return options;
    }
}

export class PhysicsSystem extends System {
    constructor(world, attrs) {
        super(world, attrs);
        this.engine = Engine.create();
        this.simulation = this.engine.world; //  I wish not everybody would use the term world, what about universe? Cosmos? Arena? We have options people.
        this.engine.world.gravity.y = 0;
        this.collisions = []
        this.sensed = []

        // an example of using collisionActive event on an engine
        Events.on(this.engine, 'collisionActive', (event) => {
            var pairs = event.pairs;
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                const bodyA = pair.bodyA;
                const bodyB = pair.bodyB;

                if (bodyA.isSensor) {
                    this.sensed[bodyA.ecsId] = !!this.sensed[bodyA.ecsId] ? this.sensed[bodyA.ecsId] : []
                    this.sensed[bodyA.ecsId].push(bodyB.entity)
                } else {
                    this.collisions[bodyA.ecsId] = !!this.collisions[bodyA.ecsId] ? this.collisions[bodyA.ecsId] : []
                    this.collisions[bodyA.ecsId].push(bodyB.entity)
                }

                if (bodyB.isSensor) {
                    this.sensed[bodyB.ecsId] = !!this.sensed[bodyB.ecsId] ? this.sensed[bodyB.ecsId] : []
                    this.sensed[bodyB.ecsId].push(bodyA.entity)

                } else {
                    this.collisions[bodyB.ecsId] = !!this.collisions[bodyB.ecsId] ? this.collisions[bodyB.ecsId] : []
                    this.collisions[bodyB.ecsId].push(bodyA.entity)

                }


            }
        });
    }

    execute(delta, time) {
        const sys = this;

        Engine.update(sys.engine, time);

        sys.queries.create.results.forEach(entity => {
            const bodySpec = entity.getComponent(PhysicsBody);

            var body = Bodies.rectangle(
                bodySpec.x,
                bodySpec.y,
                bodySpec.width,
                bodySpec.height, {
                    isStatic: bodySpec.type === PhysicsBody.TYPES.STATIC
                }
            );

            body.collisionFilter = {
                'group': bodySpec.collisionGroup,
                'category': 2,
                'mask': 0,
            };

            body.ecsId = entity.id
            body.entity = entity

            World.add(sys.engine.world, [body]);

            entity.addComponent(BodyState, BodyState.create(body))

        });

        sys.queries.update.results.forEach(entity => {
            const bodyState = entity.getMutableComponent(BodyState);
            const bodySpec = entity.getMutableComponent(PhysicsBody);

            if (bodySpec.velocity > 0) {
                const xV = Math.cos(bodySpec.angle);
                const yV = Math.sin(bodySpec.angle);

                Body.setAngle(bodyState.ref, bodySpec.angle);
                Body.setVelocity(bodyState.ref, {
                    x: xV,
                    y: yV
                });

            }

            bodySpec.x = bodyState.ref.position.x
            bodySpec.y = bodyState.ref.position.y

            bodyState.collisions = sys.collisions[entity.id] === undefined ? [] : sys.collisions[entity.id];

        })

        sys.queries.delete.results.forEach(entity => {
            const body = entity.getComponent(BodyState).ref;
            World.remove(sys.engine.world, body);
            entity.removeComponent(BodyState)
        })

        sys.collisions = []

        //  Sensors
        sys.queries.sensorCreate.results.forEach(entity => {
            const sensorSpec = entity.getComponent(SensorBody);
            const physicsSpec = entity.getComponent(PhysicsBody);

            var body = Bodies.rectangle(
                physicsSpec.x,
                physicsSpec.y,
                sensorSpec.width,
                sensorSpec.height, {
                    isStatic: sensorSpec.type === SensorBody.TYPES.STATIC,
                    isSensor: true
                }
            );

            body.collisionFilter = {
                'group': sensorSpec.collisionGroup,
                'category': 2,
                'mask': 0,
            };

            body.ecsId = entity.id
            body.entity = entity

            World.add(sys.engine.world, [body]);

            entity.addComponent(SensorState, SensorState.create(body))

        });

        sys.queries.sensorUpdate.results.forEach(entity => {
            const sensorState = entity.getMutableComponent(SensorState);
            const sensorSpec = entity.getMutableComponent(SensorBody);
            const bodySpec = entity.getMutableComponent(PhysicsBody);

            sensorSpec.x = bodySpec.x
            sensorSpec.y = bodySpec.y
            sensorState.ref.position.x = bodySpec.x
            sensorState.ref.position.y = bodySpec.y

            sensorState.collisions = sys.sensed[entity.id] === undefined ? [] : sys.sensed[entity.id];

        })

        sys.queries.sensorDelete.results.forEach(entity => {
            const body = entity.getComponent(SensorState).ref;
            World.remove(sys.engine.world, body);
            entity.removeComponent(SensorState)
        })

        sys.collisions = []
        sys.sensed = []



    }
}

PhysicsSystem.queries = {
    create: {
        components: [PhysicsBody, Not(BodyState)]
    },
    update: {
        components: [PhysicsBody, BodyState]
    },
    delete: {
        components: [Not(PhysicsBody), BodyState]
    },
    sensorCreate: {
        components: [PhysicsBody, SensorBody, Not(SensorState)]
    },
    sensorUpdate: {
        components: [PhysicsBody, SensorBody, SensorState]
    },
    sensorDelete: {
        components: [Not(SensorBody), SensorState]
    },
}