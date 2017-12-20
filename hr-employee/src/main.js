// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'reset.css'
import '@/assets/base.css'
import '@/assets/element-theme/index.css'
import '@/assets/myMint.css'


import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import axios from '@/config/axios.js'
import VueAxios from 'vue-axios'
import { Base64 } from 'js-base64'
import Cookie from 'js-cookie'

import '@/assets/util.js'
import '@/assets/common.js'


import {sso,notMustLoginPage} from '@/config/env'
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(ElementUI)
router.beforeEach((to, from, next) => {
	if(notMustLoginPage.indexOf(to.name)<0){
		if(to.query&&to.query.token){
			let str=Base64.decode(to.query.token);
			let ind=str.indexOf("_");
			let token=str.substring(ind+1);
			let user=str.substring(0,ind);
			Cookie.set("HR_USER",user);
			Cookie.set("HR_TOKEN",token);
		}
		let token=Cookie.get("HR_TOKEN");
		if(!token){
			let ind=location.href.indexOf("?");
			location.href=sso+'/login?redirectUrl='+Base64.encode(ind>0?location.href.substring(0,ind):location.href);
		}
	}
	next()
})//拦截判断是否登录
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
