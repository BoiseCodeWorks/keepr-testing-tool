import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ApiTester from "@bcwdev/vue-api-tester"

ApiTester.install(Vue, { router })

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
