import {
    Colour
} from './run.js';

export default function () {
    ! function colour_shouldBeMeasurableDistance() {
        const c1 = new Colour(0)
        const c2 = new Colour(1)
        const c3 = new Colour(90)
        const c4 = new Colour(180)
        const c5 = new Colour(270)
        const c7 = new Colour(360)
        const c8 = new Colour(720)
        const c9 = new Colour(1)
        const c10 = new Colour(288)

        //  Same Colour
        if (c2.difference(c9) !== 1) console.error('Test Failed', c2.difference(c9))
        if (c3.difference(c3) !== 1) console.error('Test Failed', c3.difference(c3))
        if (c1.difference(c8) !== 1) console.error('Test Failed', c3.difference(c3))

        //  Opposite Colour
        if (c1.difference(c4) !== 0) console.error('Test Failed', c1.difference(c4))
        if (c7.difference(c4) !== 0) console.error('Test Failed', c7.difference(c4))

        //  90 Degree Colour
        if (c3.difference(c4) !== 0.5) console.error('Test Failed', c3.difference(c4))
        if (c4.difference(c3) !== 0.5) console.error('Test Failed', c4.difference(c3))

        //  20 Degree Colour
        if (c7.difference(c10) !== 0.6) console.error('Test Failed', c7.difference(c10))
        if (c10.difference(c7) !== 0.6) console.error('Test Failed', c10.difference(c7))

        //  Small difference
        if (c1.difference(c2) < 0.5) console.error('Test Failed', c1.difference(c2))
        if (c2.difference(c1) < 0.5) console.error('Test Failed', c1.difference(c2))

        //  Big difference
        if (c2.difference(c5) > 0.5) console.error('Test Failed', c2.difference(c5))

    }()
}