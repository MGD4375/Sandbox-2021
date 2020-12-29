import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Colour from "../components/colour.component.js";
import Queen from "../components/queen.component.js";
import Transform from "../components/transform.component.js";
import Velocity from "../components/velocity.component.js";
import pixiApp from "../singletons/pixi.js";

export default class TerritorySystem extends System {

    constructor(world, attrs) {
        super(world, attrs)
        const me = this
        this.imageData = new ImageData(pixiApp.view.width, pixiApp.view.height)
        var cvs = document.getElementById("territories");
        cvs.height = pixiApp.view.height
        cvs.width = pixiApp.view.width
        this.queenCount = 0
        this.cvs = cvs

        this.regionTexture = null

        this.updating = false

        const offscreen = document.querySelector('canvas').transferControlToOffscreen();
        this.worker = new Worker("/ecs/systems/territory.worker.js");
        this.worker.onmessage = function (e) {
            me.updating = false

            if (me.regionTexture) {
                pixiApp.stage.removeChild(me.regionTexture)
                me.texture.update()
            } else {
                me.texture = PIXI.Texture.from(me.cvs)

            }

            me.regionTexture = new PIXI.Sprite(me.texture);
            me.regionTexture.alpha = .2
            pixiApp.stage.addChild(me.regionTexture)

        }
        this.worker.postMessage({ canvas: offscreen }, [offscreen]);


    }

    execute() {
        const queens = this.queries.queens.results // .filter(it => it.getComponent(Velocity).value === 0)

        if (queens.length === 0 || this.updating) {
            return
        }

        this.updating = true


        this.queenCount = queens.length

        const map = queens.map(it => {
            const transform = it.getComponent(Transform)
            const colour = it.getComponent(Colour)
            return {
                x: transform.x,
                y: transform.y,
                c: colour.toRGB()
            }
        })
        this.worker.postMessage(map);
    }
}

TerritorySystem.queries = {
    queens: { components: [Queen, Transform, Colour, Velocity] }
};
