import { HttpService } from '@/http'

export default {
    namespaced: true,
    state: {
        systems: [],
        sections: [],
        tags: [],
        articles: {},
        selectedArticle: null
    },
    mutations: {
        SET_CATEGORIES(state, data) {
            state.systems = data.systems;
            state.sections = data.sections;
            state.tags = data.tags;

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
            // console.log(payload);
            state.articles[payload._category][payload._type] = payload.articles
        },
        ADD_ARTICLE(state, payload) {
            console.log(payload);
            state.articles[payload._category][payload._type].push(payload);
        },
        REMOVE_ARTICLE(state, payload) {
            const filtered = state.articles[payload._category][payload._type]
                .filter(x => x._id !== payload._id);
            state.articles[payload._category][payload._type] = filtered;
        },
        UPDATE_ARTICLE(state, payload) {
            const collectionInType = state.articles[payload._category][payload._type];

            state.articles[payload._category][payload._type] = [
                ...collectionInType.filter(x => x._id !== payload._id),
                payload
            ]
        },
        SELECT_ARTICLE(state, payload) {
            state.selectedArticle = payload;
        }
    },
    actions: {
        FETCH_ARTICLES_IN_SELECTION({ commit }, { _category, _type }) {
            //category and type
            HttpService.getArticlesIn({ _category, _type })
                .then(res => {

                    commit('SET_ARTICLES', {
                        _category,
                        _type,
                        articles: res
                    });

                });

        },
        CREATE_ARTICLE({ commit }, articleData) {
            return HttpService.articleCreate(articleData)
                .then(res => {
                    const newData = { _id: res._id, ...articleData };
                    commit('ADD_ARTICLE', newData);
                    commit('SELECT_ARTICLE', newData);
                    //return to component
                    return res;
                })
        },
        EDIT_ARTICLE({ commit }, articleData) {
            return HttpService.articleEdit(articleData)
                .then(res => {
                    commit('UPDATE_ARTICLE', articleData);
                    commit('SELECT_ARTICLE', articleData);
                    //return to component
                    return res;
                })
        },
        DELETE_ARTICLE({ commit }, articleData) {
            return HttpService.articleDelete(articleData)
                .then(res => {
                    commit('REMOVE_ARTICLE', articleData);
                    commit('SELECT_ARTICLE', null);
                    //return to component
                    return res;
                })
        },
    },
    getters: {
        // Returns an array of articles matching the selection parameters or []
        articlesInSelection: (state) => selection => {
            const system = selection.system;
            const section = selection.section;

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