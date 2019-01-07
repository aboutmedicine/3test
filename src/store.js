import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		theme: {
			dark: false
		},
		//scene controller will be defined later
		controller: null,
		annotations: {},
		activeAnnotation: null
	},
	mutations: {
		toggleTheme(state) {
			state.theme.dark = !state.theme.dark
		},
		setController(state, payload) {
			state.controller = payload;
		},
		ADD_NOTE(state, payload) {
			state.annotations = { ...state.annotations, [payload.id]: payload }
		},
		ACTIVE_NOTE(state, id) {
			state.activeAnnotation = id;
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

			store.commit('ACTIVE_NOTE', null);
		}
	}
})
