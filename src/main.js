import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from '@/store/index'

//TODO default layout
import LayoutModel from '@/layouts/Model'
import LayoutNotes from '@/layouts/Notes'

Vue.component('layout-model', LayoutModel);
Vue.component('layout-notes', LayoutNotes);

Vue.config.productionTip = false

//global variables, shortcuts
Vue.prototype.$theme = store.state.theme;

//init
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');

