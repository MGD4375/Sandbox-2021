import { Collisions } from "../components/collisions.component.js";
import Colour from "../components/colour.component.js";
import Drawable from "../components/drawable.component.js";
import Energy from "../components/energy.component.js";
import Food from "../components/food.component.js";
import Transform from "../components/transform.component.js";

export default class FoodTemplate {
    static create(world, x, y) {
        world.createEntity()
            .addComponent(Energy)
            .addComponent(Food)
            .addComponent(Collisions)
            .addComponent(Transform, Transform.create(x, y))
            .addComponent(Colour, Colour.create(Colour.GREEN))
            .addComponent(Drawable, Drawable.create(1.5))

    }
}