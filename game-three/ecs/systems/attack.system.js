import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import { CollisionsState } from "../components/collisions.component.js";
import Attack from "../components/attack.component.js";
import Enemy from "../components/enemy.component.js";
import Velocity from "../components/velocity.component.js";
import Angle from "../components/angle.component.js";
import Knockback from "../components/knockback.component.js";
import Faction from "../components/faction.component.js";
import Health from "../components/health.component.js";

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
            const faction = entity.getComponent(Faction)

            const enemies = collisions.value.filter(it => {
                const canHealth = it.getComponent(Health)
                const canFaction = it.getComponent(Faction)
                return canHealth && canFaction && canFaction.value !== faction.value
            })

            enemies.forEach((enemy) => {
                const enemyVelocity = enemy.getMutableComponent(Velocity)
                const enemyAngle = enemy.getMutableComponent(Angle)
                const enemyHealth = enemy.getMutableComponent(Health)
                if (enemyVelocity) {
                    enemyAngle.value = angle.value
                    enemyVelocity.value = attack.knockback

                    if (!enemy.getComponent(Knockback)) {
                        enemy.addComponent(Knockback)
                    }
                }

                enemyHealth.value -= attack.damage
            });

            if (enemies.length > 0) {
                entity.remove()
            }
        });


    }
}

AttackSystem.queries = {
    attacks: { components: [Attack, Angle, CollisionsState, Faction] },
    knockedBack: { components: [Knockback] }
};