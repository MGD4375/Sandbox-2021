import { Component, TagComponent, Types } from "../../node_modules/ecsy/build/ecsy.module.js";

const SATURATION = 50;
const LIGHT = 50;

export default class Colour extends Component {
    static create(hue) { return { hue: (hue + 360) % 360 } }
    static GREEN = 120;
    static RED = 0;
    static difference(aHue, bHue) {
        return Math.min(Math.abs(aHue - bHue), Math.abs(360 - Math.abs(aHue - bHue))) / 180
    }
    toHex() { return hslToHex(this.hue, SATURATION, LIGHT) }
    toRGB() {
        const rgb = hslToRgb(this.hue / 360, SATURATION / 100, LIGHT / 100);
        return { r: rgb[0], g: rgb[1], b: rgb[2] }
    }
    //  0 - opposite colour
    //  1 - same colour
    difference(otherColourComponent) {
        const aHue = this.hue
        const bHue = otherColourComponent.hue

        const diff = Colour.difference(aHue, bHue)
        if (diff > 1 || diff < 0) {
            console.warn('Colour difference is outside expected bounds: ', diff)
        }
        return diff

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


/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {

        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}