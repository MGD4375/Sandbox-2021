import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Health from "../components/health.component.js";

export default class DeathSystem extends System {
    execute() {
        this.queries.subjects.results.forEach(entity => {
            const health = entity.getComponent(Health)
            if (health.value < 0) {
                entity.remove()
            }
        });


    }

}

DeathSystem.queries = {
    subjects: { components: [Health] },
};