import init, {
    Universe
} from '../pkg/game_of_life.js';
import CanvasRenderer from './renderer.js';

const WIDTH = 1440 / 2;
const HEIGHT = 900 / 2;
const renderer = new CanvasRenderer(WIDTH, HEIGHT, 1);

!async function run() {
    const wasm = await init();
    const memory = wasm.memory;

    const bitIsSet = (n, arr) => {
        const byte = Math.floor(n / 8);
        const mask = 1 << (n % 8);
        return (arr[byte] & mask) === mask;
    };

    const universe = Universe.new(WIDTH, HEIGHT);
    const width = universe.width();
    const height = universe.height();

    const draws = [];
    const ticks = [];

    const renderLoop = () => {
        var t0 = performance.now();
        drawCells();
        var t1 = performance.now();
        draws.push(t1 - t0)

        t0 = performance.now();
        universe.tick();
        t1 = performance.now();
        ticks.push(t1 - t0)

        var avDraw = average(draws)
        var aTick = average(ticks)

        console.log(
            'tick: ' + (aTick / (avDraw + aTick)).toFixed(2),
            'draw: ' + (avDraw / (avDraw + aTick)).toFixed(2)
        );


        requestAnimationFrame(renderLoop);
    };

    const getIndex = (row, column) => {
        return row * width + column;
    };

    const drawCells = () => {
        const cellsPtr = universe.cells();
        const cells = new Uint8Array(memory.buffer, cellsPtr, width * height / 8);


        cells.getIndex = getIndex;
        cells.bitIsSet = bitIsSet;
        renderer.render(cells);
    };

    renderLoop()

}();

function average(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
}