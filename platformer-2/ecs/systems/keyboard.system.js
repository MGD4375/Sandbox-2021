import {
    Component,
    System,
    Types
} from "../../node_modules/ecsy/build/ecsy.module.js"

//  Taken from ECSY-two
//  https://github.com/joshmarinacci/ecsy-two/blob/master/src/keyboard.js

export class InputState extends Component {
    static create(states) {
        return {
            states
        }
    }
    constructor() {
        super()
        this.states = {}
        this.changed = true
        this.released = false
    }

    anyChanged() {
        return this.changed
    }

    anyReleased() {
        return this.released
    }
}

InputState.schema = {
    states: {
        type: Types.Ref,
        default: {}
    }
}

export class KeyboardState extends Component {
    constructor() {
        super();
        this.states = {}
        this.mapping = {
            ' ': 'jump',
            'arrowleft': 'left',
            'arrowright': 'right',
            'arrowup': 'up',
            'arrowdown': 'down',
            'a': 'left',
            'd': 'right',
            'w': 'up',
            's': 'down',
            ' ': 'up',
            '1': 'attack1',
            '2': 'attack2',
            '3': 'attack3',
        }
        this.on_keydown = (e) => {
            this.setKeyState(e.key, 'down')
        }
        this.on_keyup = (e) => {
            this.setKeyState(e.key, 'up')
        }
    }
    setKeyState(key, value) {
        key = key.toLowerCase()
        let state = this.getKeyState(key)
        state.prev = state.current
        state.current = value
    }
    getKeyState(key) {
        if (!this.states[key]) {
            this.states[key] = {
                prev: 'up',
                current: 'up',
            }
        }
        return this.states[key]
    }
    isPressed(name) {
        return this.getKeyState(name).current === 'down'
    }
}
export class KeyboardSystem extends System {
    execute(delta, time) {
        this.queries.controls.added.forEach(ent => {
            let cont = ent.getMutableComponent(KeyboardState)
            document.addEventListener('keydown', cont.on_keydown)
            document.addEventListener('keyup', cont.on_keyup)
        })

        this.queries.controls.results.forEach(ent => {
            let kb = ent.getComponent(KeyboardState)
            let inp = ent.getMutableComponent(InputState)
            Object.keys(kb.mapping).forEach(key => {
                let name = kb.mapping[key]
                let state = kb.getKeyState(key)
                if (state.current === 'down' && state.prev === 'up') {
                    inp.states[name] = (state.current === 'down')
                    inp.changed = true
                }
                if (state.current === 'up' && state.prev === 'down') {
                    inp.states[name] = (state.current === 'down')
                    inp.changed = true
                    inp.released = true
                }
                state.prev = state.current
            })

        })
    }
}
KeyboardSystem.queries = {
    controls: {
        components: [KeyboardState, InputState],
        listen: {
            added: true,
            removed: true
        },
    },
}