import axios from 'axios'
import { baseUrl, errorMessage,sso } from '@/config/env'
import { Message } from 'element-ui'
import Cookie from 'js-cookie'
import { Base64 } from 'js-base64'
//配置全局axios 
axios.defaults.baseURL = baseUrl;
axios.defaults.timeout = 200000;//超时
axios.defaults.headers = {
	'Content-Type': 'application/json;charset=utf-8'
};//请求头
//请求拦截
axios.interceptors.request.use(function(config) {
	if(Cookie.get("HR_TOKEN")){
		config.headers.withCredentials = true;
		config.headers['HR_TOKEN']=Cookie.get("HR_TOKEN");
	}
	return config;
}, function(error) {
	return Promise.reject(error);
});
//响应拦截
axios.interceptors.response.use(function(response) {
	if(response.data.loginState==1&&location.href.indexOf("/resume/shengao")<0){
		let ind=location.href.indexOf("?");
		location.href=sso+'/login?redirectUrl='+Base64.encode(ind>0?location.href.substring(0,ind):location.href);
	}
	if(response.data.returnCode!='S000'&&response.data.code!='200'){
		Message.error({
				message: errorMessage[response.data.returnCode]||errorMessage.other,
				showClose: true,
				duration: 5000,
			});
	}
	return response;
}, function(error) {
	Message.error({
		message: errorMessage.other,
		showClose: true,
	});
	return Promise.reject(error);
});
export default axios