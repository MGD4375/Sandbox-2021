export default class Renderer {
    constructor(globals, renderFn) {
        this.x = globals.x;
        this.y = globals.y;
        this.canvas = document.getElementById("canvas");
        this.canvas.height = this.y;
        this.canvas.width = this.x;
        this.canvasContext = this.canvas.getContext('2d');

        this.tick = () => {
            renderFn(this.canvasContext);
        };

    }
}