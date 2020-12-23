import { Component, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";
import random from "../../random.js";
import Age from "../components/age.component.js";
import Angle from "../components/angle.component.js";
import Colour from "../components/colour.component.js";
import Drawable from "../components/drawable.component.js";
import Energy from "../components/energy.component.js";
import Feeder from "../components/feeder.component.js";
import Food from "../components/food.component.js";
import Intent from "../components/intent.component.js";
import Queen from "../components/queen.component.js";
import Sprite from "../components/sprite.component.js";
import Transform from "../components/transform.component.js";
import Velocity from "../components/velocity.component.js";
import Worker from "../components/worker.component.js";

export default class FoodTemplate {
    static create(world, x, y) {
        world.createEntity()
            .addComponent(Energy)
            .addComponent(Food)
            .addComponent(Transform, Transform.create(x, y))
            .addComponent(Colour, Colour.create(Colour.GREEN))
            .addComponent(Drawable, Drawable.create(3))

    }
}