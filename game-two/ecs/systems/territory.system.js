import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Colour from "../components/colour.component.js";
import Queen from "../components/queen.component.js";
import Transform from "../components/transform.component.js";
import Velocity from "../components/velocity.component.js";
import pixiApp from "../singletons/pixi.js";

export default class TerritorySystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        var cvs = document.getElementById("territories");
        cvs.height = pixiApp.view.height
        cvs.width = pixiApp.view.width
        this.queenCount = 0

        this.cvs = cvs
        this.ctx = cvs.getContext("2d");


    }

    execute() {
        const me = this


        if (this.queries.queens.results.filter(it => it.getComponent(Velocity).value === 0).length === this.queenCount) {
            return
        }

        this.queenCount = this.queries.queens.results.filter(it => it.getComponent(Velocity).value === 0).length

        var w = this.cvs.width, h = this.cvs.height;
        var x = 0; var y = 0; var d = 0; var dm = 0; var j = 0; var w1 = w - 2, h1 = h - 2;
        var mt = 1
        var X = []
        var Y = []
        var C = []
        var n = this.queries.queens.results.length;

        me.ctx.fillStyle = "white"; me.ctx.fillRect(0, 0, w, h);
        this.queries.queens.results.forEach(queen => {
            const transform = queen.getComponent(Transform)
            const colour = queen.getComponent(Colour)
            X.push(transform.x)
            Y.push(transform.y)
            C.push('hsl(' + colour.hue + ',50%,50%)')
        });

        for (y = 0; y < h1; y++) {
            for (x = 0; x < w1; x++) {
                dm = Metric(h1, w1, mt); j = -1;
                for (var i = 0; i < n; i++) {
                    d = Metric(X[i] - x, Y[i] - y, mt)
                    if (d < dm) { dm = d; j = i; }
                }//fend i
                me.ctx.fillStyle = C[j];
                me.ctx.fillRect(x, y, 1, 1);
            }//fend x
        }//fend y
        me.ctx.fillStyle = "black";
        for (var i = 0; i < n; i++) {
            me.ctx.fillRect(X[i], Y[i], 3, 3);
        }

    }
}

TerritorySystem.queries = {
    queens: { components: [Queen, Transform, Colour, Velocity] }
};


// HF#3 Metrics: Euclidean, Manhattan and Minkovski 3/20/17
function Metric(x, y, mt) {
    if (mt == 1) { return Math.sqrt(x * x + y * y) }  //  THIS ONE
    if (mt == 2) { return Math.abs(x) + Math.abs(y) }
    if (mt == 3) { return (Math.pow(Math.pow(Math.abs(x), 3) + Math.pow(Math.abs(y), 3), 0.33333)) }
}

// HF#1 Like in PARI/GP: return random number 0..max-1
function randgp(max) { return Math.floor(Math.random() * max) }