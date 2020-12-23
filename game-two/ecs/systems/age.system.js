import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Age from "../components/age.component.js";

export default class AgeSystem extends System {
    execute() {
        this.queries.subjects.results.forEach(entity => {
            var age = entity.getMutableComponent(Age)
            age.value += 1
            if (age.value === 99999) {
                age.value = 0
            }
        });


    }
}

AgeSystem.queries = {
    subjects: { components: [Age] },
};