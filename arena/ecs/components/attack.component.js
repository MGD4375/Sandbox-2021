import { Component, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Attack extends Component {
    static create(damage, knockback) { return { damage, knockback } }

}
Attack.schema = {
    damage: { type: Types.Number, default: 0 },
    knockback: { type: Types.Number, default: 0 },
}