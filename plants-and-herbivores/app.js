import Renderer from './render.js'
import {
    runAt,
    random,
    EntityArray
} from './run.js'

import tests from './tests.js'

const RELATIVE_POINTS = [{
        x: -1,
        y: 0
    },
    {
        x: 1,
        y: 0
    },
    {
        x: 0,
        y: -1
    },
    {
        x: 0,
        y: 1
    }
]
const randomPoint = function () {
    return RELATIVE_POINTS[Math.floor(Math.random() * RELATIVE_POINTS.length)];
}

tests();

! function () {
    const globals = {
        x: 200,
        y: 200,
        turn: 0
    }

    const processes = [
        turnTick,
        grassTick,
        herbivoreTick,
        new Renderer(globals, renderFn).tick
    ]

    const entities = {
        grass: new EntityArray(globals.x, globals.y),
        herbivores: new EntityArray(globals.x, globals.y)
    }

    // entities.grass.set(Math.floor(globals.x * 0.9), Math.floor(globals.y * 0.9), true, 300)
    entities.grass.set(Math.floor(globals.x * 0.4), Math.floor(globals.y * 0.4), true, 112)

    runAt(coreLoop, 60)

    function coreLoop() {
        processes.forEach(function (process) {
            process(globals, entities)
        });
    }

    function renderFn(context) {

        var imageData = new ImageData(globals.x, globals.y)

        for (let y = 1; y < globals.y; y++) {
            for (let x = 1; x < globals.x; x++) {
                const space = entities.grass.get(x, y)
                if (space.isAlive === false) continue
                setPixel(imageData, x, y, space.r, space.g, space.b)

            }
        }

        for (let y = 1; y < globals.y; y++) {
            for (let x = 1; x < globals.x; x++) {
                const space = entities.herbivores.get(x, y)
                if (space.isAlive === false) continue
                setPixel(imageData, x, y, space.r + 30, space.g + 30, space.b + 30)
            }
        }

        context.putImageData(imageData, 0, 0);

        function setPixel(imageData, x, y, r, g, b) {
            var index = (x + y * imageData.width) * 4;
            imageData.data[index + 0] = r;
            imageData.data[index + 1] = g;
            imageData.data[index + 2] = b;
            imageData.data[index + 3] = 255;
        }

    }
}()

function turnTick(globals, entities) {
    globals.turn += 1
}

function grassTick(globals, entities) {
    if (globals.turn % 2 !== 1) return

    for (let tickerY = 1; tickerY < globals.y; tickerY++) {
        for (let tickerX = 1; tickerX < globals.x; tickerX++) {

            const x = random(0, globals.x)
            const y = random(0, globals.y)

            const grass = entities.grass.get(x, y)
            if (!grass.isAlive) continue

            const target = randomPoint()
            const targetX = bounded(x + target.x, 0, globals.x)
            const targetY = bounded(y + target.y, 0, globals.y)


            if (entities.grass.get(targetX, targetY).isAlive) continue

            entities.grass.set(targetX, targetY, true, mutate2(grass.colour.hue))
        }
    }
}


function herbivoreTick(globals, entities) {

    if (globals.turn < 250 && globals.turn > 200) {
        entities.herbivores.set(Math.floor(globals.x * 0.4), Math.floor(globals.y * 0.4), 1, 60)
    }


    for (let tickerY = 1; tickerY < globals.y; tickerY++) {
        for (let tickerX = 1; tickerX < globals.x; tickerX++) {

            const x = random(0, globals.x)
            const y = random(0, globals.y)
            const vore = entities.herbivores.get(x, y)

            if (!vore.isAlive) continue

            const grass = entities.grass.get(x, y)
            if (!grass.isAlive) {
                if (Math.random() > 0.99) {
                    entities.herbivores.set(x, y, 0, 0)
                } else {
                    const target = randomPoint()
                    const targetX = bounded(x + target.x, 0, globals.x)
                    const targetY = bounded(y + target.y, 0, globals.y)
                    const targetSpace = entities.herbivores.get(targetX, targetY)

                    if (!targetSpace.isAlive) {
                        entities.herbivores.set(x, y, 0, 0)
                        entities.herbivores.set(targetX, targetY, true, vore.colour.hue)

                    }
                }
                continue
            }

            const closeness = vore.colour.difference(grass.colour);
            entities.grass.set(x, y, false, 0)
            if (Math.random() + .25 < closeness) {

                RELATIVE_POINTS.forEach(target => {
                    const targetX = bounded(x + target.x, 0, globals.x)
                    const targetY = bounded(y + target.y, 0, globals.y)
                    addVore(entities, targetX, targetY, vore)
                })


            } else {
                entities.herbivores.set(x, y, 0, 0)
            }
        }
    }
}

function addVore(entities, targetX, targetY, vore) {
    if (entities.herbivores.get(targetX, targetY).isAlive) return
    entities.herbivores.set(targetX, targetY, 1, mutate(vore.colour.hue))
}

function mutate(value) {
    return random(value - 1, value + 1)
}

function mutate2(value) {
    return random(value - 2, value + 2)
}

function bounded(value, min, max) {
    return value < min ? min : value > max ? max : value
}