import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import { Not } from "../../node_modules/ecsy/src/index.js";
import Transform from "../components/transform.component.js";
import Sprite from "../components/sprite.component.js";
import SpriteState from "../components/sprite.state.js";
import pixiApp from "../singletons/pixi.js";
import Velocity from "../components/velocity.component.js";
import CONFIG from "../../app.config.js";
import Queen from "../components/queen.component.js";
import Angle from "../components/angle.component.js";
import Intent from "../components/intent.component.js";
import random from "../../random.js";
import Age from "../components/age.component.js";
import EggTemplate from "../assemblages/egg.assemblage.js";
import Colour from "../components/colour.component.js";
import Energy from "../components/energy.component.js";

export default class QueenSystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        this.world = world
    }

    execute() {
        this.queries.subjects.results.forEach(entity => {
            var angle = entity.getMutableComponent(Angle)
            var intent = entity.getMutableComponent(Intent)
            var age = entity.getComponent(Age)
            var transform = entity.getComponent(Transform)
            var colour = entity.getComponent(Colour)
            var velocity = entity.getMutableComponent(Velocity)
            var energy = entity.getMutableComponent(Energy)

            if (intent.value === Intent.EXPLORE) {
                angle.value = angle.add(random(-1, 1) / 10)
                velocity.value = .5
            }

            else if (intent.value === Intent.SETTLE && (random(0, 100) === 100) && energy.value > 10) {
                velocity.value = 0

                const target = transform.add(20, random(0, 100))

                energy.value -= 10

                EggTemplate.create(this.world,
                    target.x,
                    target.y,
                    colour.hue + random(-60, 60),
                    entity.id
                )


            }

            if (age.value < 300) {
                intent.value = Intent.EXPLORE

            } else {
                intent.value = Intent.SETTLE
            }


            //  Bounds
            if (transform.x < 0 || transform.x > CONFIG.WIDTH || transform.y < 0 || transform.y > CONFIG.HEIGHT) {
                angle.value = angle.add(Angle.HALF)

            }

        });


    }

}

QueenSystem.queries = {
    subjects: { components: [Queen, Velocity, Angle, Transform, Colour, Energy] },
};