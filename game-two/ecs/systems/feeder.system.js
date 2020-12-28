import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import CONFIG from "../../app.config.js";
import random from "../../random.js";
import Age from "../components/age.component.js";
import Feeder from "../components/feeder.component.js";
import FoodTemplate from "../assemblages/food.assemblage.js";

export default class FeederSystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        this.world = world
    }

    execute() {
        this.queries.subjects.results.forEach(entity => {
            const age = entity.getComponent(Age)

            if (age.value % 5 === 0) {
                FoodTemplate.create(this.world,
                    random(10, CONFIG.WIDTH - 10),
                    random(10, CONFIG.HEIGHT - 10)
                )
            }

        });


    }

}

FeederSystem.queries = {
    subjects: { components: [Feeder, Age] },
};