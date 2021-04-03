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
    Bodies = Matter.Bodies;

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
        const size = (options.height + options.width) / 100;

        //  Validation
        if (!options.x) console.warn('PhysicsBody needs an x position')
        if (!options.y) console.warn('PhysicsBody needs a y position')
        if (!options.height) console.warn('PhysicsBody needs a height')
        if (!options.width) console.warn('PhysicsBody needs a width')
        if (options.type !== PhysicsBody.TYPES.DYNAMIC && options.type !== PhysicsBody.TYPES.STATIC) console.warn('PhysicsBody needs a type: static or dynamic')

        //  Sensible defaults
        options.angularVelocity = !!options.angularVelocity ? options.angularVelocity : 0;

        return options;
    }
}
PhysicsBody.schema = {
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
    angularVelocity: {
        type: Types.Number
    },
    angle: {
        type: Types.Number,
        default: 0
    },
    shape: {
        type: Types.String
    },
    type: {
        type: Types.String
    },
    linearImpulse: {
        type: Types.Number,
        default: 0
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


export class PhysicsSystem extends System {
    constructor(world, attrs) {
        super(world, attrs);
        this.engine = Engine.create();
        this.simulation = this.engine.world; //  I wish not everybody would use the term world, what about universe? Cosmos? Arena? We have options people.
        this.engine.world.gravity.y = 0;
        this.collisions = []
        // an example of using collisionActive event on an engine
        Events.on(this.engine, 'collisionStart', (event) => {
            var pairs = event.pairs;

            // change object colours to show those in an active collision (e.g. resting contact)
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i];
                const bodyA = pair.bodyA;
                const bodyB = pair.bodyB;
                this.collisions[bodyA.ecsId] = !!this.collisions[bodyA.ecsId] ? this.collisions[bodyA.ecsId] : []
                this.collisions[bodyA.ecsId].push(pair.bodyB)
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
                bodySpec.height
            );

            body.ecsId = entity.id

            World.add(sys.engine.world, [body]);

            entity.addComponent(BodyState, BodyState.create(body))

        });

        sys.queries.update.results.forEach(entity => {
            const bodyState = entity.getMutableComponent(BodyState);
            const bodySpec = entity.getMutableComponent(PhysicsBody);

            bodySpec.x = bodyState.ref.position.x
            bodySpec.y = bodyState.ref.position.y

            bodyState.collisions = !!sys.collisions[entity.id] ? sys.collisions[entity.id] : [];
            if (bodyState.collisions.length > 1) {
                console.log(bodyState.collisions)

            }

        })

        sys.queries.delete.results.forEach(entity => {
            const body = entity.getComponent(BodyState).ref;
            World.remove(sys.engine.world, [body]);
            entity.removeComponent(BodyState)
        })

        sys.collisions = []
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
    }
}