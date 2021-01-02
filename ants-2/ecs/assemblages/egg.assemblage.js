import Age from "../components/age.component.js";
import Angle from "../components/angle.component.js";
import Ant from "../components/ant.component.js";
import { Collisions } from "../components/collisions.component.js";
import Colour from "../components/colour.component.js";
import Drawable from "../components/drawable.component.js";
import Egg from "../components/egg.component.js";
import Transform from "../components/transform.component.js";
import Velocity from "../components/velocity.component.js";

export default class EggTemplate {
    static create(world, x, y, hue) {
        world.createEntity()
            .addComponent(Egg)
            .addComponent(Transform, Transform.create(x, y))
            .addComponent(Colour, Colour.create(hue))
            .addComponent(Angle)
            .addComponent(Collisions)
            .addComponent(Ant)
            .addComponent(Velocity)
            .addComponent(Age)
            .addComponent(Drawable, Drawable.create(3))
        // .addComponent(Sprite, Sprite.create('resources/sprites/ant-walk.json', 'ant-walk'))
    }
}