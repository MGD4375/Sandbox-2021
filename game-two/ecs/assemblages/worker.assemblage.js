import { Component, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";
import random from "../../random.js";
import Age from "../components/age.component.js";
import Angle from "../components/angle.component.js";
import Ant from "../components/ant.component.js";
import Cargo from "../components/cargo.component.js";
import Colour from "../components/colour.component.js";
import Energy from "../components/energy.component.js";
import Intent from "../components/intent.component.js";
import Queen from "../components/queen.component.js";
import Sprite from "../components/sprite.component.js";
import TargetState from "../components/targetState.component.js";
import Transform from "../components/transform.component.js";
import Velocity from "../components/velocity.component.js";
import Worker from "../components/worker.component.js";

export default class WorkerTemplate {
    static create(world, x, y, hue) {
        world.createEntity()
            .addComponent(Worker)
            .addComponent(Transform, Transform.create(x, y))
            .addComponent(Colour, Colour.create(hue))
            .addComponent(Ant)
            .addComponent(Velocity)
            .addComponent(Intent, Intent.create(Intent.EXPLORE))
            .addComponent(Energy)
            .addComponent(Cargo)
            .addComponent(TargetState)
            .addComponent(Age)
            .addComponent(Angle, Angle.create(random(0, 100)))
            .addComponent(Sprite, Sprite.create('resources/sprites/ant-walk.json', 'ant-walk', 0.5))

    }
}