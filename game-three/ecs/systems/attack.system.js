import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import { CollisionsState } from "../components/collisions.component.js";
import Attack from "../components/attack.component.js";
import Enemy from "../components/enemy.component.js";
import Velocity from "../components/velocity.component.js";
import Angle from "../components/angle.component.js";
import Knockback from "../components/knockback.component.js";

export default class AttackSystem extends System {

    execute() {
        this.queries.knockedBack.results.forEach(entity => {
            const velocity = entity.getMutableComponent(Velocity)
            velocity.value = 0
            entity.removeComponent(Knockback)
        })

        this.queries.attacks.results.forEach(entity => {
            const collisions = entity.getComponent(CollisionsState)
            const attack = entity.getComponent(Attack)
            const angle = entity.getComponent(Angle)

            const enemies = collisions.value.filter(it => it.getComponent(Enemy))

            enemies.forEach((enemy) => {
                const enemyVelocity = enemy.getMutableComponent(Velocity)
                const enemyAngle = enemy.getMutableComponent(Angle)
                if (enemyVelocity) {
                    enemyAngle.value = angle.value
                    enemyVelocity.value = attack.knockback
                    enemy.addComponent(Knockback)
                }
                console.log('damage enemy by: ', attack.damage)
            });

            if (enemies.length > 0) {
                entity.remove()
            }
        });


    }
}

AttackSystem.queries = {
    attacks: { components: [Attack, Angle, CollisionsState] },
    knockedBack: { components: [Knockback] }
};