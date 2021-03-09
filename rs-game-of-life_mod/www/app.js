import init, {
    add,
    greet
} from '../pkg/game_of_life.js';

async function run() {
    await init();
    const result = add(1, 2);
    console.log(`1 + 2 = ${result}`);
    if (result !== 3) {
        throw new Error("wasm addition doesn't work!");
    }

    greet("Morgan");

}

run();