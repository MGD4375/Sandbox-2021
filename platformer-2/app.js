import {
    AIComponent,
    Enemy,
    Facing,
    Health,
    MovementSpeed
} from "./ecs/components/components.js";
import {
    CameraFocus
} from "./ecs/systems/camera.system.js";
import {
    InputState,
    KeyboardState
} from "./ecs/systems/keyboard.system.js";
import {
    PhysicsBody
} from "./ecs/systems/physics.system.js";
import Platformer from "./game.js";
var game;

!async function () {
    game = await Platformer.create()

    game.createEntity()
        .addComponent(CameraFocus)
        .addComponent(Health, Health.create(3, 3))
        .addComponent(Facing)
        .addComponent(InputState)
        .addComponent(KeyboardState)
        .addComponent(MovementSpeed, MovementSpeed.create(2))
        .addComponent(PhysicsBody, PhysicsBody.create(120, 0, 32, 48))

    await GameLoader.LoadLevel('level_01.json')

    game.pixi.ticker.add(delta => gameLoop(delta));

    function gameLoop(delta) {

        game.execute(delta);
    }
}();

class GameLoader {
    static async LoadLevel(name) {
        const response = await fetch('./levels/' + name);
        const data = await response.json();
        for (let rowIndex = 0; rowIndex < data.tiles.length; rowIndex++) {
            const row = data.tiles[rowIndex];
            for (let colIndex = 0; colIndex < row.length; colIndex++) {
                const cell = row[colIndex];


                if (cell.toLowerCase() === 'f') {
                    if (!isMiddle(data.tiles, rowIndex, colIndex) && isTop(data.tiles, rowIndex, colIndex)) {

                        var count = 0
                        var plus = 0
                        var stop = false
                        while (!stop) {
                            plus++
                            if (data.tiles[rowIndex + plus][colIndex].toLowerCase() === 'f') {
                                count++
                            } else {
                                stop = true
                            }
                        }


                        const staticBody = PhysicsBody.create(colIndex * 32, rowIndex * 32, 32, 32 * count);
                        staticBody.static = true;
                        game.createEntity().addComponent(PhysicsBody, staticBody);
                    }

                } else if (cell === 'P') {} else if (cell === ' ') {} else if (cell === 'E') {

                    game.createEntity()
                        .addComponent(AIComponent)
                        .addComponent(Enemy)
                        .addComponent(Facing)
                        .addComponent(Health, Health.create(2, 2))
                        .addComponent(MovementSpeed, MovementSpeed.create(.45))
                        .addComponent(InputState)
                        .addComponent(PhysicsBody, PhysicsBody.create(colIndex * 32, rowIndex * 32, 32, 48))


                } else if (cell === 'V') {} else {}
            }
        }
    }
}

function isTop(tiles, rowIndex, colIndex) {
    return tiles[rowIndex - 1][colIndex].toLowerCase() !== "f"
}

function isTopRight(tiles, rowIndex, colIndex) {
    return tiles[rowIndex - 1][colIndex].toLowerCase() !== "f" && tiles[rowIndex][colIndex + 1].toLowerCase() !== "f"
}

function isRight(tiles, rowIndex, colIndex) {
    return tiles[rowIndex][colIndex + 1].toLowerCase() !== "f"
}

function isBottomRight(tiles, rowIndex, colIndex) {
    return tiles[rowIndex + 1][colIndex].toLowerCase() !== "f" && tiles[rowIndex][colIndex + 1].toLowerCase() !== "f"
}

function isBottom(tiles, rowIndex, colIndex) {
    return tiles[rowIndex + 1][colIndex].toLowerCase() !== "f"
}

function isBottomLeft(tiles, rowIndex, colIndex) {
    return tiles[rowIndex + 1][colIndex].toLowerCase() !== "f" && tiles[rowIndex][colIndex - 1].toLowerCase() !== "f"
}

function isLeft(tiles, rowIndex, colIndex) {
    return tiles[rowIndex][colIndex - 1].toLowerCase() !== "f"
}

function isTopLeft(tiles, rowIndex, colIndex) {
    return tiles[rowIndex - 1][colIndex].toLowerCase() !== "f" && tiles[rowIndex][colIndex - 1].toLowerCase() !== "f"
}

function isMiddle(tiles, rowIndex, colIndex) {
    return tiles[rowIndex - 1][colIndex].toLowerCase() === "f" &&
        tiles[rowIndex + 1][colIndex].toLowerCase() === "f" &&
        tiles[rowIndex][colIndex - 1].toLowerCase() === "f" &&
        tiles[rowIndex][colIndex + 1].toLowerCase() === "f"
}