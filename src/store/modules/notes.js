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
                for(const type of data.sections) {

                    articles[category.name][type.name] = [];
                }
            }
            state.articles = articles;
        },
        SET_ARTICLES(state, payload) {
            console.log(payload);
            state.articles[payload.category][payload.type] = payload.articles
        }
    },
    actions: {
        FETCH_ARTICLES_IN_SELECTION({commit}, { category, type }) {
            //category and type
            HttpService.getArticlesIn({ category, type })
                .then( res => {

                    commit('SET_ARTICLES', {
                        category,
                        type,
                        articles: res
                    });

                });

        }
    },
    getters: {
        // Returns an array of articles matching the selection parameters or []
        articlesInSelection: (state) => selection => {
            const system = selection.system.name;
            const section = selection.section.name;

            if(system && section) {
                try {
                    return state.articles[system][section]
                }
                catch(err) {
                    console.log(err);
                }
            }
            else {
                return []
            }

        },
    }
}