import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function lazyLoad(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            meta: { layout: 'models' },
            component: lazyLoad('Scene'),
        },
        {
            path: '/notes',
            meta: { layout: 'notes' },
            component: lazyLoad('Notes'),
        },
        {
            path: '/:id',
            meta: { layout: 'models' },
            component: lazyLoad('Scene'),
        },

    ],

});

export default router;
