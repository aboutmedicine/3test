import Vue from 'vue'
import Router from 'vue-router'

import Scene from '@/views/Scene'
import Notes from '@/views/Notes'

Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
            meta: { layout: 'model'},
			component: Scene,
		},
        {
            path: '/notes',
            name: 'notes',
	        meta: { layout: 'notes'},
            component: Notes
        },
		{
			path: '/:id',
			name: 'scene',
            meta: { layout: 'model'},
			component: Scene,
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
