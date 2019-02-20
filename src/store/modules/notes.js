import { HttpService } from '@/http'

export default {
    namespaced: true,
    state: {
        systems: [],
        sections: [],
        articles: {},
    },
    mutations: {
        SET_CATEGORIES(state, data) {
            state.systems = data.systems;
            state.sections = data.sections;

            const articles = {};
            for (const category of data.systems) {
                articles[category.name] = {};
                for (const type of data.sections) {

                    articles[category.name][type.name] = [];
                }
            }
            state.articles = articles;
        },
        SET_ARTICLES(state, payload) {
            console.log(payload);
            state.articles[payload.category][payload.type] = payload.articles
        },
        ADD_ARTICLE(state, payload) {
            console.log(payload);
            state.articles[payload._category][payload.type].push(payload);
        },
        REMOVE_ARTICLE(state, payload) {
            const filtered = state.articles[payload._category][payload.type]
                .filter(x => x._id !== payload._id);
            state.articles[payload._category][payload.type] = filtered;
        },
        UPDATE_ARTICLE(state, payload) {
            const collectionInType = state.articles[payload._category][payload.type];

            state.articles[payload._category][payload.type] = [
                ...collectionInType.filter(x => x._id !== payload._id),
                payload
            ]
        }
    },
    actions: {
        FETCH_ARTICLES_IN_SELECTION({ commit }, { category, type }) {
            //category and type
            HttpService.getArticlesIn({ category, type })
                .then(res => {

                    commit('SET_ARTICLES', {
                        category,
                        type,
                        articles: res
                    });

                });

        },
        CREATE_ARTICLE({ commit }, articleData) {
            return HttpService.articleCreate(articleData)
                .then(res => {
                    commit('ADD_ARTICLE', { _id: res._id, ...articleData });
                    //return to component
                    return res;
                })
        },
        EDIT_ARTICLE({ commit }, articleData) {
            return HttpService.articleEdit(articleData)
                .then(res => {
                    commit('UPDATE_ARTICLE', articleData);
                    //return to component
                    return res;
                })
        },
        DELETE_ARTICLE({ commit }, articleData) {
            return HttpService.articleDelete(articleData)
                .then(res => {
                    commit('REMOVE_ARTICLE', articleData);
                    //return to component
                    return res;
                })
        },
    },
    getters: {
        // Returns an array of articles matching the selection parameters or []
        articlesInSelection: (state) => selection => {
            const system = selection.system.name;
            const section = selection.section.name;

            if (system && section) {
                try {
                    return state.articles[system][section]
                }
                catch (err) {
                    console.log(err);
                }
            }
            else {
                return []
            }

        },
    }
}