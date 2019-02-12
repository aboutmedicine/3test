export default {
    namespaced: true,
    state: {
        systems: [],
        sections: [],
        articles: [
            {
                type: 'pathology',
                title: 'Cardiac failure',
                description: 'The decline of the heart, precipitated and exacerbated by injury.',
                hx: 'SOBOE, angina, swelling',
                ex: 'Vitals, cardiac examination - JVP, lung crackles, peripheral oedema, thready pulse',
                ix: 'FBE + UEC + BNP',
                mx: 'Optimisation of fluid balance (diuretics vs. fluid restriction), cardiac Rx (ACEi + cardioselective β-blocker + CaCB)',
                system: 'Geriatric Medicine',
                section: 'Pathology'
            },
            {
                title: 'Article Title',
                description: 'article text',
                system: 'Anaesthesiology',
                section: 'Anatomy',
                tags: [
                    {
                        title: 'Ear',
                        slug: 'ear',
                        icon: 'far fa-music'
                    },
                    {
                        title: 'Brain',
                        slug: 'brain',
                        icon: 'far fa-brain'
                    },
                ],
                id: 123
            }, {
                title: 'Article Title 2',
                description: 'article text',
                system: 'Anaesthesiology',
                section: 'Anatomy',
                tags: [
                    {
                        title: 'G.I. Tract',
                        slug: 'gi_tract',
                        icon: 'far fa-stomach'
                    }
                ],
                id: 124
            }
        ],

    },
    mutations: {
        SET_CATEGORIES(state, data) {
            state.systems = data.systems;
            state.sections = data.sections;
        },
    },
    actions: {},
    getters: {
        articlesInSelection: (state) => selection => {
            return state.articles
                .filter(x => x.system == selection.system.name && x.section == selection.section.name);
        },
    }
}