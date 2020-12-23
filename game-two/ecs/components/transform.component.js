import { Component, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Transform extends Component {
    static create(x, y) { return { x, y } }

    add(velocity, angle) {
        return {
            x: this.x + (velocity * Math.cos(angle)),
            y: this.y + (velocity * Math.sin(angle))
        }
    }

    distanceTo(bTransform) { return Math.sqrt(Math.pow(this.x - bTransform.x, 2) + Math.pow(this.y - bTransform.y, 2)) }

}
Transform.schema = {
    x: { type: Types.Number },
    y: { type: Types.Number }
}