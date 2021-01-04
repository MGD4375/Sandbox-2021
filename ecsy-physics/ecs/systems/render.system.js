import { Component, System, SystemStateComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";
import { Not } from "../../node_modules/ecsy/src/index.js";

export class Collider extends Component {
    static create(width, height) { return { width, height } }
}
Collider.schema = {
    height: { type: Types.Number },
    width: { type: Types.Number }
}

export class ColliderState extends SystemStateComponent {
    static create(ref) { return { ref } }

    static collides(a, b) {
        const ab = a.getBounds()
        const bb = b.getBounds()
        return (ab.x + ab.width > bb.x &&
            ab.x < bb.x + bb.width &&
            ab.y + 1 + ab.height > bb.y &&
            ab.y + 1 < bb.y + bb.height)
    }

    collides(otherSprite) {
        return ColliderState.collides(this.ref, otherSprite)
    }
}

ColliderState.schema = {
    ref: { type: Types.Ref }
}

export class Transform extends Component {
    static create(x, y) { return { x, y } }

    add(velocity, angle) {
        return {
            x: this.x + (velocity * Math.cos(angle)),
            y: this.y + (velocity * Math.sin(angle))
        }
    }

    distanceTo(bTransform) { return Math.sqrt(Math.pow(this.x - bTransform.x, 2) + Math.pow(this.y - bTransform.y, 2)) }

}
Transform.schema = {
    x: { type: Types.Number },
    y: { type: Types.Number }
}

export class RenderSystem extends System {
    constructor(world, attrs) {
        super(world, attrs)
        this.pixiApp = world.pixiApp

    }

    execute() {
        this.queries.creates.results.forEach((entity) => {
            const collider = entity.getComponent(Collider)
            const transform = entity.getComponent(Transform)

            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFF00);
            graphics.alpha = 0.4
            graphics.drawRect(
                0 - (.5 * collider.width),
                0 - (.5 * collider.height),
                collider.width,
                collider.height
            );

            graphics.beginFill(0x000000);
            graphics.drawRect(
                0,
                0,
                3,
                3
            );

            graphics.name = entity.id + '-hitbox'
            graphics.x = transform.x
            graphics.y = transform.y

            this.pixiApp.stage.addChild(graphics)
            entity.addComponent(ColliderState, ColliderState.create(graphics))

        });

        this.queries.deletes.results.forEach((entity) => {
            const colliderState = entity.getComponent(ColliderState)
            this.pixiApp.stage.removeChild(colliderState.ref)
            entity.removeComponent(ColliderState)


        });

        this.queries.updates.results.forEach((entity) => {
            const colliderState = entity.getComponent(ColliderState)
            const transform = entity.getComponent(Transform)

            colliderState.ref.x = transform.x
            colliderState.ref.y = transform.y
        });
    }

}

RenderSystem.queries = {
    creates: { components: [Collider, Not(ColliderState), Transform] },
    deletes: { components: [Not(Collider), ColliderState] },
    updates: { components: [Collider, ColliderState, Transform] }
};