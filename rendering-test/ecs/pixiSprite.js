import { Component, Types, System } from '../node_modules/ecsy/build/ecsy.module.js';

export default class PixiSprite extends Component {
    static create(ref) { return { ref } }
}

PixiSprite.schema = {
    ref: { type: Types.Ref },

}