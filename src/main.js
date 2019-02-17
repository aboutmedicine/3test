import Vue from 'vue'
import PortalVue from 'portal-vue'
import vSelect from 'vue-select'
import VueMq from 'vue-mq'


import App from './App.vue'
import router from './router'
import store from '@/store/index'

//TODO default layout
import ModelViewer from '@/layouts/ModelViewer'
import ArticleListing from '@/layouts/ArticleListing'
import Modal from '@/components/Modal'

Vue.component('layout-models', ModelViewer);
Vue.component('layout-notes', ArticleListing);

Vue.component('app-modal', Modal);

Vue.component('v-select', vSelect);

//A Portal Component for Vuejs, to render DOM outside of a component, anywhere in the document.
Vue.use(PortalVue);


Vue.use(VueMq, {
    breakpoints: {
        xs: 480,
        sm: 768,
        md: 970,
        lg: Infinity,
    }
})


Vue.config.productionTip = false

//global variables, shortcuts
Vue.prototype.$theme = store.state.theme;


//Custom directives
// Vue.directive('clickout', {
//     bind(el, { value: fn }, { context: vm }) {
//         console.log(vm);
//         const handler = (event) => {
//             const target = event.target
//             if (target !== el && !el.contains(target)) {
//                 fn()
//                 console.log('clicked outside')
//             }
//         }
//         document.addEventListener('click', handler)
//         el.__handler = handler
//     },
//     unbind(el) {
//         document.removeEventListener('click', el.__handler)
//     }
// });

//init
new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app');

