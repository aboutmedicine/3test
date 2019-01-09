import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

//global variables, shortcuts
Vue.prototype.$theme = store.state.theme

//init
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app')

