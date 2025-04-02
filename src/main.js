// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './permission' // permission control
Vue.config.productionTip = false

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
import VueQuillEditor from 'vue-quill-editor'

// 引入 Quill 核心样式
import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'  // 主题样式（可选）
// import 'quill/dist/quill.bubble.css' // 气泡主题（可选）
import './utils/UEmethod'
import eruda from 'eruda';
eruda.init();
Vue.use(VueQuillEditor)
/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
