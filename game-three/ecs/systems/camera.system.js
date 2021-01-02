import {
    System
} from "../../node_modules/ecsy/build/ecsy.module.js";
import CameraFocusComponent from "../components/cameraFocus.component.js";
import { ColliderState } from "../components/collider.component.js";
import pixiApp from "../singletons/pixi.js";

export default class CameraSystem extends System {

    execute() {
        this.queries.subjects.results.forEach(entity => {
            var sprite = entity.getComponent(ColliderState).ref
            pixiApp.stage.position.set(pixiApp.screen.width / 2, pixiApp.screen.height / 2);
            pixiApp.stage.pivot.copyFrom(sprite.position);
        });
    }
}

CameraSystem.queries = {
    subjects: {
        components: [ColliderState, CameraFocusComponent]
    }
};