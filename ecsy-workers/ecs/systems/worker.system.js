import CONFIG from "../../app.config.js";
import { System } from "../../node_modules/ecsy/build/ecsy.module.js";
import Transform from "../components/transform.component.js";

export default class WorkerSystem extends System {

    constructor(world, attr) {
        super(world, attr)
        const sys = this;

        sys.eventQueue = []
        sys.workers = []

        for (let i = 0; i <= 5; i++) {
            const worker = new Worker('/ecs/systems/worker.worker.js');
            sys.workers.push(worker)
            worker.addEventListener('message', function (event) {
                sys.oneStore = new Int32Array(event.data)
                sys.oneStore.forEach(id => { sys.eventQueue.push(id) });
            });

        }

        sys.oneStore = null

        console.log('WorkerSystem prepared')


    }

    async execute() {

        try {
            if (!this.oneStore) {
                this.oneStore = new Int32Array(this.queries.subjects.results.length);
                for (let i = 0; i < this.oneStore.length; i++) {
                    this.oneStore[i] = this.queries.subjects.results[i].id;
                }
            }
            this.workers[0].postMessage(this.oneStore.buffer, [this.oneStore.buffer]);

        } catch (ex) { }




        while (this.eventQueue.length !== 0) {
            const id = this.eventQueue.shift();
            const entity = this.queries.subjects.results.find(it => it.id === id)
            const transform = entity.getMutableComponent(Transform)
            transform.x += 1
            transform.x = transform.x % CONFIG.WIDTH

        }

    }
}

WorkerSystem.queries = {
    subjects: { components: [Transform] },
};