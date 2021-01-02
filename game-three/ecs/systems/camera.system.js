import {
    System
} from "../../node_modules/ecsy/build/ecsy.module.js";
import { UI, CameraFocusComponent } from "../components/camera.component.js";
import { ColliderState } from "../components/collider.component.js";
import { SpriteState } from "../components/sprite.component.js";
import Transform from "../components/transform.component.js";
import pixiApp from "../singletons/pixi.js";

export default class CameraSystem extends System {

    execute() {
        this.queries.subjects.results.forEach(entity => {
            var sprite = entity.getComponent(ColliderState).ref
            pixiApp.stage.position.set(pixiApp.screen.width / 2, pixiApp.screen.height / 2);
            pixiApp.stage.pivot.copyFrom(sprite.position);
        });


        const map = this.queries.subjects.results.map(entity => { return entity.getComponent(Transform) });
        const xs = map.map(it => { return it.x });
        const ys = map.map(it => { return it.y });
        const averageX = average(xs)
        const averageY = average(ys)

        this.queries.ui.results.forEach(entity => {
            var sprite = entity.getComponent(SpriteState).ref
            sprite.position.x = averageX
            sprite.position.y = averageY

        });
    }
}

CameraSystem.queries = {
    subjects: {
        components: [ColliderState, CameraFocusComponent, Transform]
    },
    ui: {
        components: [UI, SpriteState]
    }
};

function average(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
}