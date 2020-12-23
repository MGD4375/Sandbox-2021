
import { Component, Types, System } from '../node_modules/ecsy/build/ecsy.module.js';
import Position from './position.js'
import PixiSprite from './pixiSprite.js'

export default class MoveSprite extends System {

    execute() {
        this.queries.subjects.results.forEach(entity => {
            const position = entity.getMutableComponent(Position);
            const sprite = entity.getMutableComponent(PixiSprite);

            sprite.ref.position.x = position.x
            sprite.ref.position.y = position.y

        });
    }
}

MoveSprite.queries = {
    subjects: { components: [Position, PixiSprite] }
}