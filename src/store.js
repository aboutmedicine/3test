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
		annotations: {}
	},
	mutations: {
		toggleTheme(state) {
			state.theme.dark = !state.theme.dark
		},
		setController(state, payload) {
			state.controller = payload;
		}
	},
	actions: {}
})
