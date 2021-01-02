import appConfig from "../../app.config.js";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const pixiApp = new PIXI.Application({
    width: appConfig.WIDTH,       // default: 800
    height: appConfig.HEIGHT,     // default: 600
    antialias: true,          // default: false
    transparent: false,       // default: false
    resolution: 1             // default: 1
});

document.body.appendChild(pixiApp.view);
pixiApp.renderer.backgroundColor = 0x7F7F7F;

export default pixiApp