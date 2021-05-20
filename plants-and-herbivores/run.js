export function runAt(loop, fps) {
    const fpsInterval = 1000 / fps;
    var then = Date.now();

    frame()

    function frame() {
        window.requestAnimationFrame(frame)
        var now = Date.now()
        var elapsed = now - then;
        if (elapsed > fpsInterval) {
            then = now - (elapsed % fpsInterval);
            loop();
        }
    }
}

export function random(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export class Colour {

    static GREEN = 120;
    static RED = 0;
    static SATURATION = 50;
    static LIGHT = 50;

    constructor(hue) {
        this.hue = (hue + 360) % 360
    }

    static difference(aHue, bHue) {
        return Math.abs(1 - Math.abs((Math.min(aHue - bHue, 360 - (aHue - bHue)) / 180)))
    }

    //  0 - opposite colour
    //  1 - same colour
    difference(otherColour) {
        const aHue = this.hue
        const bHue = otherColour.hue
        return Colour.difference(aHue, bHue)
    }
}

//  This only works for this specific project, because both herbivores and plants
export class EntityArray {
    constructor(width, height) {
        this.height = height;
        this.width = width;
        this.data = new Int32Array((width * height) * //  Count
            (
                1 //  IsAlive
                +
                1 //  Hue
                +
                1 // r 
                +
                1 // g
                +
                1 // b
            ));
    }

    set(x, y, isAlive, hue) {
        if (y >= this.height || y <= 0 || x >= this.width || x <= 0) return

        const rgb = hsl2rgb((hue + 360) % 360, 30, 30)

        this.data[(5 * (x + (y * this.width))) + 0] = (isAlive ? 1 : 0)
        this.data[(5 * (x + (y * this.width))) + 1] = (hue + 360) % 360
        this.data[(5 * (x + (y * this.width))) + 2] = rgb.r
        this.data[(5 * (x + (y * this.width))) + 3] = rgb.g
        this.data[(5 * (x + (y * this.width))) + 4] = rgb.b

    }

    get(x, y) {
        if (y > this.height || y < 0 || x > this.width || x < 0) throw Error('Out of bounds')

        return {
            isAlive: this.data[(5 * (x + (y * this.width))) + 0] > 0,
            colour: new Colour(this.data[(5 * (x + (y * this.width))) + 1]),
            r: this.data[(5 * (x + (y * this.width))) + 2],
            g: this.data[(5 * (x + (y * this.width))) + 3],
            b: this.data[(5 * (x + (y * this.width))) + 4]
        }

    }
}


function hsl2rgb(h, s, l) {

    var r, g, b, m, c, x

    if (!isFinite(h)) h = 0
    if (!isFinite(s)) s = 0
    if (!isFinite(l)) l = 0

    h /= 60
    if (h < 0) h = 6 - (-h % 6)
    h %= 6

    s = Math.max(0, Math.min(1, s / 100))
    l = Math.max(0, Math.min(1, l / 100))

    c = (1 - Math.abs((2 * l) - 1)) * s
    x = c * (1 - Math.abs((h % 2) - 1))

    if (h < 1) {
        r = c
        g = x
        b = 0
    } else if (h < 2) {
        r = x
        g = c
        b = 0
    } else if (h < 3) {
        r = 0
        g = c
        b = x
    } else if (h < 4) {
        r = 0
        g = x
        b = c
    } else if (h < 5) {
        r = x
        g = 0
        b = c
    } else {
        r = c
        g = 0
        b = x
    }

    m = l - c / 2
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return {
        r: r,
        g: g,
        b: b
    }

}