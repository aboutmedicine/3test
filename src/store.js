import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		theme: {
			dark: false
		},
		mode: {
			draw: false
		},
		//models to be fetched from server
		models: [],
		//scene controller will be defined later
		controller: null,
		drawings: [],
		annotations: {},
		activeAnnotation: null,
		activeMesh: {},
		mobile: (navigator.userAgent.match(/Android/i) ||
			navigator.userAgent.match(/webOS/i) ||
			navigator.userAgent.match(/iPhone/i) ||
			navigator.userAgent.match(/iPad/i) ||
			navigator.userAgent.match(/iPod/i) ||
			navigator.userAgent.match(/BlackBerry/i) ||
			navigator.userAgent.match(/Windows Phone/i))
	},
	mutations: {
		TOGGLE_THEME(state) {
			state.theme.dark = !state.theme.dark
		},
		TOGGLE_DRAW_MODE(state, forced) {
			state.mode.draw =  forced ? forced : !state.mode.draw;
		},
		ADD_MODEL(state, payload) {
			state.models.push(payload);
		},
		ADD_NOTE(state, payload) {
			state.annotations = { ...state.annotations, [payload.id]: payload }
		},
		ADD_DRAWING(state, object) {
			state.drawings.push(object);
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
		},
		REMOVE_DRAWINGS(state, length) {
			if (!state.drawings.length) return;

			for (let i = 0; i < length; i++) {
				state.controller.removeObject(state.drawings.pop());
			}
		},
	},
	actions: {
		ADD_NOTE({commit}, payload) {
			const id =  new Date().getTime();

			commit('ADD_NOTE', Object.assign({
				id
			}, payload));

			commit('SET_ACTIVE_NOTE', null);

		},
		CLEAR_SCENE({commit, state}) {
			commit('REMOVE_DRAWINGS', state.drawings.length);
			state.controller.restoreVisibility();
		},
		HIDE_MESH({state}) {
			state.controller.hideMesh(state.activeMesh.object);
		}
	}
})
