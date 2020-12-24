import CONFIG from "../../app.config.js";
import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Transform from "../components/transform.component.js";

export default class ShadowSystem extends System {

    constructor(world, attr) {
        super(world, attr)
    }

    execute() {
        this.queries.subjects.results.forEach(entity => {
            const transform = entity.getMutableComponent(Transform)
            transform.x += 1
            transform.x = transform.x % CONFIG.WIDTH
        })
    }
}

ShadowSystem.queries = {
    subjects: { components: [Transform] },
};