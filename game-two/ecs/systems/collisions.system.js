import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import { Not } from "../../node_modules/ecsy/src/index.js";
import Transform from "../components/transform.component.js";
import SpriteState from "../components/sprite.state.js";
import { Collisions, CollisionsState } from "../components/collisions.component.js";
import CONFIG from "../../app.config.js";
import Quadtree from "../../quadtree.js";
import Food from "../components/food.component.js";
import Egg from "../components/egg.component.js";

export default class CollisionsSystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        this.quadTree = new Quadtree({
            x: 0,
            y: 0,
            width: CONFIG.WIDTH,
            height: CONFIG.HEIGHT
        });

    }

    execute() {
        this.queries.creates.results.forEach(entity => { entity.addComponent(CollisionsState) });
        this.queries.deletes.results.forEach(entity => { entity.removeComponent(CollisionsState) });

        this.quadTree.clear();

        const map = this.queries.updates.results.map(it => {
            const transform = it.getComponent(Transform)
            const spriteState = it.getComponent(SpriteState)
            return {
                x: transform.x,
                y: transform.y,
                width: spriteState.ref.width,
                height: spriteState.ref.height,
                entity: it
            }
        })

        map.forEach(it => {
            this.quadTree.insert(it);
        })

        map.forEach((aTransformEntity) => {
            if (aTransformEntity.entity.getComponent(Food)) return
            if (aTransformEntity.entity.getComponent(Egg)) return

            const aSpriteComponent = aTransformEntity.entity.getComponent(SpriteState)
            const aCollisionsState = aTransformEntity.entity.getMutableComponent(CollisionsState)
            aCollisionsState.value = []

            var candidates = this.quadTree.retrieve(aTransformEntity);

            candidates.forEach(bTransformEntity => {
                if (aTransformEntity === bTransformEntity) return

                const bSpriteComponent = bTransformEntity.entity.getComponent(SpriteState)
                if (aSpriteComponent.collides(bSpriteComponent.ref)) {
                    aCollisionsState.value.push(bTransformEntity.entity)
                }
            })
        });
    }
}

CollisionsSystem.queries = {
    creates: { components: [Collisions, Not(CollisionsState), Transform, SpriteState] },
    updates: { components: [Collisions, CollisionsState, Transform, SpriteState] },
    deletes: { components: [Not(Collisions), CollisionsState] }
};