import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import { Not } from "../../node_modules/ecsy/src/index.js";
import Transform from "../components/transform.component.js";
import { Collisions, CollisionsState } from "../components/collisions.component.js";
import CONFIG from "../../app.config.js";
import Quadtree from "../../quadtree.js";
import { Collider, ColliderState } from "../components/collider.component.js";

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
            const colliderState = it.getComponent(ColliderState)
            return {
                x: transform.x,
                y: transform.y,
                width: colliderState.ref.width,
                height: colliderState.ref.height,
                entity: it
            }
        })

        map.forEach(it => {
            this.quadTree.insert(it);
        })

        map.forEach((aTransformEntity) => {
            if (!aTransformEntity.entity.getComponent(Collisions)) { return }

            const aCollider = aTransformEntity.entity.getComponent(ColliderState)
            const aCollisions = aTransformEntity.entity.getMutableComponent(CollisionsState)
            aCollisions.value = []

            var candidates = this.quadTree.retrieve(aTransformEntity);

            candidates.forEach(bTransformEntity => {
                if (aTransformEntity === bTransformEntity) return

                const bCollider = bTransformEntity.entity.getComponent(ColliderState)
                if (aCollider.collides(bCollider.ref)) {
                    aCollisions.value.push(bTransformEntity.entity)
                }
            })

        });
    }
}

CollisionsSystem.queries = {
    creates: { components: [Collider, Not(CollisionsState), ColliderState, Transform] },
    updates: { components: [Collider, CollisionsState, ColliderState, Transform] },
    deletes: { components: [Not(Collider), CollisionsState] }
};