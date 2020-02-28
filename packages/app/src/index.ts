import 'core-js';
import 'regenerator-runtime/runtime';
import Vue from 'vue';
import store from './store';
import router from './routers';
import App from './components/App/App.vue';
import { LoadingComponent } from '@veles/common';
import VueRouter from 'vue-router';
import vuetify from './plugins/vuetify';

export { LoadingComponent };

Vue.use(VueRouter);

export const app = new Vue({
  // @ts-ignore
  vuetify,
  el: '#app',
  router,
  store,
  render: h => h(App)
});

// declare global {
//   interface Window {
//     version: string;
//   }
// }

// window.version = version;
