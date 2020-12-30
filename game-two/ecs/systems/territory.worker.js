const CONFIG = {
    WIDTH: 480 * 2,
    HEIGHT: 270 * 2,
}
var offScreenCanvas = null;
var context = null
const imageData = new ImageData(CONFIG.WIDTH, CONFIG.HEIGHT)


onmessage = function (e) {
    if (e.data.canvas) {    //  OffScreenCanvas Transferred
        offScreenCanvas = e.data.canvas
        context = offScreenCanvas.getContext("2d");
        return
    }

    const queenData = e.data

    var w = offScreenCanvas.width, h = offScreenCanvas.height;
    var x = 0; var y = 0; var d = 0; var dm = 0; var j = 0; var w1 = w - 2, h1 = h - 2;
    var mt = 1
    var X = []
    var Y = []
    var C = []
    var n = queenData.length / 5;

    context.fillStyle = "white";
    context.fillRect(0, 0, w, h);

    for (let index = 0; index < queenData.length; index += 5) {
        X.push(queenData[(index) + 0])      //  x
        Y.push(queenData[(index) + 1])      //  y
        C.push(
            {
                r: queenData[(index) + 2],  //  r
                g: queenData[(index) + 3],  //  g
                b: queenData[(index) + 4]   //  b
            }
        )
    }

    for (y = 0; y < h1; y++) {
        for (x = 0; x < w1; x++) {
            dm = Metric(h1, w1, mt); j = -1;
            for (var i = 0; i < n; i++) {
                d = Metric(X[i] - x, Y[i] - y, mt)
                if (d < dm) { dm = d; j = i; }
            }
            setPixel(imageData, x, y, C[j].r, C[j].g, C[j].b, 255)
        }
    }

    context.putImageData(imageData, 0, 0)

    postMessage('return');
}

// HF#3 Metrics: Euclidean, Manhattan and Minkovski 3/20/17
function Metric(x, y, mt) {
    if (mt == 1) { return Math.sqrt(x * x + y * y) }  //  THIS ONE
    if (mt == 2) { return Math.abs(x) + Math.abs(y) }
    if (mt == 3) { return (Math.pow(Math.pow(Math.abs(x), 3) + Math.pow(Math.abs(y), 3), 0.33333)) }
}


function setPixel(imageData, x, y, r, g, b, a) {
    var index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}
