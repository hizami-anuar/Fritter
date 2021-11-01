import Vue from 'vue';

// import VueRouter from 'vue-router';

import App from './App.vue';

import router from './router'
// import Main from './views/Main.vue';

export const eventBus = new Vue();

Vue.config.productionTip = false;
// Vue.use(VueRouter);


new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
