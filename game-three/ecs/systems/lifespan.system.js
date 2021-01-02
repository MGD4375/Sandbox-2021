import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import InputComponent from "../components/input.component.js";
import LifeSpan from "../components/lifespan.component.js";

export default class LifeSpanSystem extends System {

    constructor(world, attributes) {
        super(world, attributes)

    }

    execute(delta, time) {

        this.queries.subjects.results.forEach((entity) => {
            const lifeSpan = entity.getMutableComponent(LifeSpan)

            lifeSpan.current++
            if (lifeSpan.current > lifeSpan.max) {
                entity.remove()
            }

        })


    }
}

LifeSpanSystem.queries = {
    subjects: { components: [LifeSpan] }
}


