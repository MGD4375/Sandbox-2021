import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Transform from "../components/transform.component.js";
import CONFIG from "../../app.config.js";
import random from "../../random.js";
import Age from "../components/age.component.js";
import Colour from "../components/colour.component.js";
import Egg from "../components/egg.component.js";
import QueenTemplate from "../assemblages/queen.assemblage.js";
import WorkerTemplate from "../assemblages/worker.assemblage.js";
import SoldierTemplate from "../assemblages/soldier.assemblage.js";

export default class EggSystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        this.world = world
    }

    execute() {
        this.queries.subjects.results.forEach(entity => {
            var age = entity.getComponent(Age)
            var transform = entity.getMutableComponent(Transform)
            var colour = entity.getComponent(Colour)

            var num = random(0, 10)

            if (age.value > 1000) {
                if (num >= 9) QueenTemplate.create(this.world, transform.x, transform.y, colour.hue)
                else if (num >= 8) SoldierTemplate.create(this.world, transform.x, transform.y, colour.hue)
                else WorkerTemplate.create(this.world, transform.x, transform.y, colour.hue)
                entity.remove()
            }

            //  Bounds
            if (transform.x < 0) transform.x = 2
            if (transform.x > CONFIG.WIDTH) transform.x = CONFIG.WIDTH - 2
            if (transform.y < 0) transform.y = 2
            if (transform.y > CONFIG.HEIGHT) transform.x = CONFIG.HEIGHT - 2

        });


    }

}

EggSystem.queries = {
    subjects: { components: [Egg, Transform, Colour, Age] },
};