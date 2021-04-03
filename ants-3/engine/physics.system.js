import {
    Component,
    Not,
    System,
    SystemStateComponent,
    Types
} from "../node_modules/ecsy/build/ecsy.module.js";

const PixelsPerMeter = 50;
const MetersPerPixel = 1 / PixelsPerMeter;

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
        this.simulation = planck.World();
        // this.simulation = planck.World(planck.Vec2(0, 1));
        this.collisions = [];


        this.simulation.on('pre-solve', (contact, oldManifold) => {
            var manifold = contact.getManifold();

            if (manifold.pointCount == 0) {
                return;
            }

            var fixtureA = contact.getFixtureA();
            var fixtureB = contact.getFixtureB();

            var worldManifold = contact.getWorldManifold();

            for (var i = 0; i < manifold.pointCount; ++i) {
                var cp = {};
                cp.fixtureA = fixtureA;
                cp.fixtureB = fixtureB;
                cp.position = worldManifold.points[i];
                cp.normal = worldManifold.normal;
                cp.normalImpulse = manifold.points[i].normalImpulse;
                cp.tangentImpulse = manifold.points[i].tangentImpulse;
                cp.separation = worldManifold.separations[i];
                const ecsId = cp.fixtureA.getBody().getUserData().ecsId
                this.collisions[ecsId] = !!this.collisions[ecsId] ? this.collisions[ecsId] : []
                this.collisions[ecsId].push(cp);
            }
        });


    }

    execute(delta, time) {
        const sys = this;

        sys.simulation.step(delta / 60);

        sys.queries.create.results.forEach(entity => {
            const bodySpec = entity.getComponent(PhysicsBody);

            const body = sys.simulation.createBody({
                type: bodySpec.type,
                bullet: false,
                angularVelocity: bodySpec.angularVelocity,
                position: {
                    x: bodySpec.x * MetersPerPixel,
                    y: bodySpec.y * MetersPerPixel
                },
                userData: { // We assign some userData for this body for future handling
                    ecsId: entity.id
                }
            });


            body.createFixture(
                planck.Box(
                    (bodySpec.width / 2) * MetersPerPixel,
                    (bodySpec.height / 2) * MetersPerPixel)
            );

            entity.addComponent(BodyState, BodyState.create(body))
        });

        sys.queries.update.results.forEach(entity => {
            const bodyState = entity.getMutableComponent(BodyState);
            const physicsBody = entity.getMutableComponent(PhysicsBody);
            physicsBody.x = bodyState.ref.getPosition().x * PixelsPerMeter
            physicsBody.y = bodyState.ref.getPosition().y * PixelsPerMeter
            physicsBody.angle = bodyState.ref.getAngle();

            bodyState.collisions = !!sys.collisions[entity.id] ? sys.collisions[entity.id] : []

            var f = bodyState.ref.getWorldVector(planck.Vec2(0, .01));
            var p = bodyState.ref.getWorldPoint(planck.Vec2(0, .01));
            bodyState.ref.applyLinearImpulse(f, p, false)
            bodyState.ref.applyAngularImpulse(0.1)
        })

        sys.queries.delete.results.forEach(entity => {
            const box = entity.getComponent(BodyState).ref;
            sys.simulation.destroyBody(box);
            entity.removeComponent(BodyState)
        })

        sys.collisions = [];
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