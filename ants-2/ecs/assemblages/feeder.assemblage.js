import Age from "../components/age.component.js";
import Feeder from "../components/feeder.component.js";

export default class FeederTemplate {
    static create(world) {
        world.createEntity()
            .addComponent(Feeder)
            .addComponent(Age)
    }
}