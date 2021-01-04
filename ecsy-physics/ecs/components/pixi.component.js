import { Component, System, Types } from "../../node_modules/ecsy/build/ecsy.module.js";


export default class Pixi extends Component {
    static create(width, height) {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        const pixiApp = new PIXI.Application({
            width: width,               // default: 800
            height: height,             // default: 600
            antialias: true,          // default: false
            transparent: false,       // default: false
            resolution: 1             // default: 1
        });

        document.body.appendChild(pixiApp.view);
        pixiApp.renderer.backgroundColor = 0x7F7F7F;
        return { ref: pixiApp }
    }
}

Pixi.schema = {
    ref: { type: Types.Ref },
};