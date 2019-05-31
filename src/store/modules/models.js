import Vue from "vue";

export default {
    namespaced: true,
    state: {
        mode: {
            draw: false,
            annotation: false
        },
        //models to be fetched from server
        models: [],
        //scene controller will be defined later
        controller: null,
        drawings: [],
        annotations: {},
        currentModel: null,
        activeAnnotation: null,
        activeMesh: {},
    },
    mutations: {
        TOGGLE_DRAW_MODE(state, forced) {
            state.mode.draw = forced ? forced : !state.mode.draw;
        },
        SET_ANNOTATION_MODE(state, value) {
            state.mode.annotation = value;
        },
        ADD_MODEL(state, payload) {
            state.models.push(payload);
        },
        ADD_NOTE(state, payload) {
            let annotations = JSON.parse(JSON.stringify(state.annotations));

            annotations[state.currentModel] = {
                ...annotations[state.currentModel],
                [payload.id]: payload
            };

            state.annotations = annotations;
        },
        ADD_DRAWING(state, object) {
            state.drawings.push(object);
        },
        SET_MODELS(state, payload) {
            state.models = payload;
        },
        SET_CURRENT_MODEL(state, id) {
            state.currentModel = id;
        },
        SET_CONTROLLER(state, payload) {
            state.controller = payload;
        },
        SET_ACTIVE_NOTE(state, id) {
            state.activeAnnotation = id;
        },
        SET_ACTIVE_MESH(state, payload) {
            state.activeMesh = payload;
        },
        REMOVE_NOTE(state, id) {
            Vue.delete(state.annotations[state.currentModel], id);
            state.activeAnnotation = null;
        },
        REMOVE_DRAWINGS(state, length) {
            if (!state.drawings.length) return;

            for (let i = 0; i < length; i++) {
                state.controller.removeObject(state.drawings.pop());
            }
        },
        EDIT_NOTE(state, payload) {
            const note = state.annotations[state.currentModel][state.activeAnnotation];

            note.text[payload.key] = payload.value;
        }
    },
    actions: {
        ADD_NOTE({
            commit
        }, payload) {
            commit('SET_ANNOTATION_MODE', false);
            commit('ADD_NOTE', payload);
            commit('SET_ACTIVE_NOTE', payload.id);
        },
        CLEAR_SCENE({
            commit,
            state
        }) {
            commit('REMOVE_DRAWINGS', state.drawings.length);
            commit('SET_ACTIVE_MESH', {});
            commit('SET_ACTIVE_NOTE', null);
            state.controller.restoreVisibility();
        },
        HIDE_MESH({
            state
        }) {
            state.controller.hideMesh(state.activeMesh.object);
        }
    },
    getters: {
        annotations: (state) => {
            return state.annotations[state.currentModel];
        },
        sortedModels: (state) => {
            return [...state.models].sort((a, b) => a.title.localeCompare(b.title));
        },
        activeModel: (state) => {
            const model = state.models.filter(x => x._id === state.currentModel)[0];
            if (model) {
                return model.title;
            } else {
                return 'No model selected'
            }
        }

    }
}
