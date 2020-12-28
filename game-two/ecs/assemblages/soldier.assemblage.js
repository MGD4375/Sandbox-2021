import random from "../../random.js";
import Age from "../components/age.component.js";
import Angle from "../components/angle.component.js";
import Ant from "../components/ant.component.js";
import { Collisions } from "../components/collisions.component.js";
import Colour from "../components/colour.component.js";
import Energy from "../components/energy.component.js";
import Intent from "../components/intent.component.js";
import ParentState from "../components/parent.component.js";
import Soldier from "../components/soldier.component.js";
import Sprite from "../components/sprite.component.js";
import TargetState from "../components/targetState.component.js";
import Transform from "../components/transform.component.js";
import Velocity from "../components/velocity.component.js";

export default class SoldierTemplate {
    static create(world, x, y, hue) {
        world.createEntity()
            .addComponent(Soldier)
            .addComponent(Ant)
            .addComponent(Transform, Transform.create(x, y))
            .addComponent(Colour, Colour.create(hue))
            .addComponent(Velocity)
            .addComponent(ParentState)
            .addComponent(Collisions)
            .addComponent(Intent, Intent.create(Intent.PATROL))
            .addComponent(Energy)
            .addComponent(TargetState)
            .addComponent(Age)
            .addComponent(Angle, Angle.create(random(0, 100)))
            .addComponent(Sprite, Sprite.create('resources/sprites/ant-walk.json', 'ant-walk', 0.8))

    }
}