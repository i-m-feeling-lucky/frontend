import Vue from 'vue';
import vgl from 'vue-golden-layout';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'jquery';

Vue.config.productionTip = false;

Vue.use(vgl);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
