import { Not, System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Age from "../components/age.component.js";
import Feeder from "../components/feeder.component.js";

export default class DeathSystem extends System {
    execute() {
        this.queries.subjects.results.forEach(entity => {
            var age = entity.getComponent(Age)
            if (age.value > 3000) {
                entity.remove()
            }
        });


    }

}

DeathSystem.queries = {
    subjects: { components: [Age, Not(Feeder)] },
};