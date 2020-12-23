import { Component, Types, System } from '../node_modules/ecsy/build/ecsy.module.js';
import globals from '../globals.js';
import random from '../random.js';
import Position from './position.js'
import PixiSprite from './pixiSprite.js';

export default class Destroy extends System {

    execute() {
        this.queries.subjects.results.forEach(entity => {
            const position = entity.getMutableComponent(Position);
            const spriteRef = entity.getMutableComponent(PixiSprite);
            if (position.x > globals.WORLD_WIDTH) {
                spriteRef.ref.parent.removeChild(spriteRef.ref)
                entity.remove()
            }
        });
    }
}

Destroy.queries = {
    subjects: { components: [Position, PixiSprite] }
}