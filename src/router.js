import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function lazyLoad(view) {
    return () => import(/* webpackChunkName: "view-[request]" */ `@/views/${view}.vue`)
}

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
            meta: { layout: 'model'},
			component: lazyLoad('Scene'),
		},
        {
            path: '/notes',
            name: 'notes',
            meta: { layout: 'notes'},
            component: lazyLoad('Notes'),

        },
		{
			path: '/:id',
			name: 'scene',
            meta: { layout: 'model'},
            component: lazyLoad('Scene'),
			beforeEnter: (to, from, next) => {
				function isValid (param) {
					//TODO check if model exists
					console.log(param);
					return true
				}

				if (!isValid(to.params.id)) {
					//TODO create 404 page or something
					next({ name: '404' });
				}

				next();
			}
		},

	]
})
