//  This is taken from my older js only game of life.
export default class CanvasRenderer {
    constructor(width, height, scale) {
        this.height = height;
        this.width = width;
        this.canvas = document.getElementById("canvas");
        this.canvas.height = height;
        this.canvas.width = width;
        this.canvasContext = this.canvas.getContext('2d');
        this.scale = scale;
    }

    render(board) {
        var imageData = new ImageData(this.canvas.width, this.canvas.height)

        for (let colIndex = 0; colIndex < this.width; colIndex++) {
            for (let rowIndex = 0; rowIndex < this.height; rowIndex++) {

                const idx = board.getIndex(rowIndex, colIndex);
                if (board.bitIsSet(idx, board)) {
                    this.setPixel(imageData, colIndex, rowIndex, 255, 255, 255, 255)

                }
            }
        }

        this.canvasContext.putImageData(imageData, 0, 0);
    }

    setPixel(imageData, x, y, r, g, b, a) {
        var index = (x + y * imageData.width) * 4;
        imageData.data[index + 0] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = a;
    }
}