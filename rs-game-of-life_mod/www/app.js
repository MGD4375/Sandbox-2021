import init, {
    Universe
} from '../pkg/game_of_life.js';
import CanvasRenderer from './renderer.js';

const WIDTH = 360;
const HEIGHT = 360;
const renderer = new CanvasRenderer(WIDTH, HEIGHT, 1);

!async function run() {
    console.log('Begin')

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

    const renderLoop = () => {
        drawGrid();
        drawCells();

        for (let i = 0; i < 9; i++) {
            universe.tick();
        }

        requestAnimationFrame(renderLoop);
    };

    const drawGrid = () => {

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