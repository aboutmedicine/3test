import Vue from 'vue'
import Vuex from 'vuex'

import notes from '@/store/modules/notes'
import models from '@/store/modules/models'

Vue.use(Vuex)

import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    reducer: (state) => ({
        annotations: state.models.annotations
    }), //only save annotations
    // we can also listen only for a specific mutations
    // filter: (mutation) => mutation.type == 'ADD_NOTE'
})

export default new Vuex.Store({
    plugins: [vuexLocal.plugin],
    modules: {
        notes,
        models
    },
    state: {
        theme: {
            dark: false
        },
        mobile: (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)) || false
    },
    mutations: {
        TOGGLE_THEME(state) {
            state.theme.dark = !state.theme.dark
        },
    },
    actions: {},
    getters: {}
})
