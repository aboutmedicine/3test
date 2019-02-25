import Vue from 'vue'
import Vuex from 'vuex'

import notes from '@/store/modules/notes'
import models from '@/store/modules/models'

import { HttpService } from "@/http"

Vue.use(Vuex)

import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
    reducer: (state) => ({
        annotations: state.models.annotations
    }), //only save annotations
    // we can also listen only for a specific mutations
    // filter: (mutation) => mutation.type == 'ADD_NOTE'
});

const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    plugins: [vuexLocal.plugin],
    modules: {
        notes,
        models
    },
    state: {
        user: null,
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
        SET_USER(state, payload) {
            state.user = payload;
        }
    },
    actions: {
        LOG_OUT({ commit }) {
            HttpService.logOut()
                .then(res => {
                    console.log(res);
                    commit('SET_USER', null);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        LOG_IN({ commit }, { email, password }) {

            return new Promise((resolve, reject) => {
                HttpService.auth('login', { email, password })
                    .then(res => {
                        console.log(res);
                        commit('SET_USER', res);
                        resolve();
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
            })

        },
        SIGN_UP({commit}, { email, password}) {
            return new Promise((resolve, reject) => {
                HttpService.auth('signup', { email, password })
                    .then(res => {
                        console.log(res);
                        commit('SET_USER', res);
                        resolve();
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
            })
        },
        AUTH_STATUS({ commit }) {
            HttpService.getUser()
                .then(res => {
                    console.log(res);
                    commit('SET_USER', res);
                })
                .catch(err => {
                    console.log(err);
                    commit('SET_USER', null);
                });
        }
    },
    getters: {}
});

export default store;