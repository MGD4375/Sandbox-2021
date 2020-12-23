import { Component, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

const SATURATION = 50;
const LIGHT = 50;

export default class Colour extends Component {
    static create(hue) { return { hue: (hue + 360) % 360 } }
    static GREEN = 120;
    static RED = 0;
    static difference(aHue, bHue) { return Math.abs(Math.min(aHue - bHue, 360 - (aHue - bHue)) / 180) }
    toHex() { return hslToHex(this.hue, SATURATION, LIGHT) }

    //  0 - opposite colour
    //  1 - same colour
    difference(otherColourComponent) {
        const aHue = this.hue
        const bHue = otherColourComponent.hue

        return Colour.difference(aHue, bHue)

    }
}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `0x${f(0)}${f(8)}${f(4)}`;
}

Colour.schema = {
    hue: { type: Types.Number, default: 0 },
}