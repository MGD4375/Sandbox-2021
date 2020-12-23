import { Component, Types, System } from '../node_modules/ecsy/build/ecsy.module.js';
import random from '../random.js';
import Position from './position.js'

export default class Movement extends System {

    execute() {
        this.queries.subject.results.forEach(entity => {
            const position = entity.getMutableComponent(Position);
            position.x += 1
            position.y += random(-2, 1)
        });
    }
}

Movement.queries = {
    subject: { components: [Position] }
}