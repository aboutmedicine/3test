import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		theme: {
			dark: false
		},
		//models to be fetched from server
		models: [],
		//scene controller will be defined later
		controller: null,
		annotations: {},
		activeAnnotation: null,
		activeMesh: {}
	},
	mutations: {
		TOGGLE_THEME(state) {
			state.theme.dark = !state.theme.dark
		},
		ADD_MODEL(state, payload) {
			state.models.push(payload);
		},
		ADD_NOTE(state, payload) {
			state.annotations = { ...state.annotations, [payload.id]: payload }
		},
		SET_MODELS(state, payload) {
			state.models = payload;
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
		CLEAR_NOTES(state) {
			state.annotations = {};
		},
		REMOVE_NOTE(state, id) {
			Vue.delete(state.annotations, id);
			state.activeAnnotation = null;
		}
	},
	actions: {
		ADD_NOTE(store, payload) {
			const id =  new Date().getTime();

			store.commit('ADD_NOTE', Object.assign({
				id
			}, payload));

			store.commit('SET_ACTIVE_NOTE', null);

		}
	}
})
