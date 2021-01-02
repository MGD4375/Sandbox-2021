import { Component, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

export default class Faction extends Component {
    static PLAYERS = 'players'
    static ENEMIES = 'enemies'
    static create(value) { return { value } }

}
Faction.schema = {
    value: { type: Types.String }
}