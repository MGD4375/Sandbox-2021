import {
    Not,
    System,
    SystemStateComponent,
    TagComponent,
    Types
} from "../node_modules/ecsy/build/ecsy.module.js";
import {
    PhysicsBody,
} from "./physics.system.js";

export class BoxSpriteState extends SystemStateComponent {
    static create(ref) {
        return {
            ref
        }
    }
}
BoxSpriteState.schema = {
    ref: {
        type: Types.Ref
    }
}

export class Render extends TagComponent {}

export class RenderSystem extends System {
    constructor(world, attrs) {
        super(world, attrs)
        this.pixi = world.pixi;

    }

    execute() {
        const sys = this;

        this.queries.creates.results.forEach((entity) => {

            const body = entity.getComponent(PhysicsBody)

            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xFFFF00);
            graphics.alpha = 0.4
            graphics.drawRect(
                0,
                0,
                body.width,
                body.height
            );

            graphics.beginFill(0x000000);
            graphics.drawRect(
                0,
                0,
                body.width,
                body.height
            );

            graphics.x = body.x
            graphics.y = body.y

            graphics.pivot.x = graphics.width / 2
            graphics.pivot.y = graphics.height / 2

            sys.pixi.stage.addChild(graphics)
            entity.addComponent(BoxSpriteState, BoxSpriteState.create(graphics))

        });

        this.queries.deletes.results.forEach((entity) => {
            const boxSpriteState = entity.getComponent(BoxSpriteState)
            sys.pixi.stage.removeChild(boxSpriteState.ref)
            entity.removeComponent(BoxSpriteState)


        });

        this.queries.updates.results.forEach((entity) => {
            const boxSpriteState = entity.getComponent(BoxSpriteState)
            const body = entity.getComponent(PhysicsBody)

            boxSpriteState.ref.rotation = body.angle;
            boxSpriteState.ref.x = body.x
            boxSpriteState.ref.y = body.y
        });
    }

}

RenderSystem.queries = {
    creates: {
        components: [Render, PhysicsBody, Not(BoxSpriteState)]
    },
    deletes: {
        components: [Not(PhysicsBody), BoxSpriteState]
    },
    updates: {
        components: [Render, PhysicsBody, BoxSpriteState]
    }
};