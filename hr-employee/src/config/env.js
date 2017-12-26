/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */
//http://10.0.0.61:8080
let baseUrl = ''; 
let routerMode = 'history';
let imgBaseUrl = 'http://images.cangdu.org/';
let sso='';
let hruat=''
let ctrlhr=''
const errorMessage={
	other:"网络问题稍后重试",
	E001:"参数校验失败",
	E100:'合同信息已存在',
	E101:'添加入职申请失败',
	E201:'添加合同失败',
	E301:'添加薪酬失败'
};
const notMustLoginPage=["base-info","contact","education","family","position","technology","work","shengao"]
if (process.env.NODE_ENV == 'development') {
	// baseUrl = 'http://114.80.176.10:10086/hr_ganway'
//	baseUrl = 'http://121.40.102.225:8888/hrRecruit-api'; 
//	sso='http://121.40.102.225:8888/hrSSO';
//	ctrlhr='http://121.40.102.225:8888/ctrlHR';
	baseUrl = 'http://127.0.0.1:8080/hrRecruit-api'; 
	sso='http://127.0.0.1:8080/hrSSO';
	ctrlhr='http://127.0.0.1:8080/ctrlHR';
}else if(process.env.NODE_ENV == 'production'){
//	baseUrl = 'http://127.0.0.1:8080/hrRecruit-api'; 
//	sso='http://127.0.0.1:8080/hrSSO';
//	ctrlhr='http://127.0.0.1:8080/ctrlHR';
//	baseUrl = 'http://121.40.102.225:8888/hrRecruit-api'; 
//	sso='http://121.40.102.225:8888/hrSSO';
//	ctrlhr='http://121.40.102.225:8888/ctrlHR';
//	baseUrl = 'http://hr.ta-q-bin.com.cn/hrRecruit-api'; 
//	sso='http://hr.ta-q-bin.com.cn/hrSSO';
//	ctrlhr='http://hr.ta-q-bin.com.cn/ctrlHR';
	baseUrl = 'http://121.40.102.225:9000/hrRecruit-api'; 
	sso='http://121.40.102.225:12880/hrSSO';
	ctrlhr='http://121.40.102.225:9000/ctrlHR';
	
	
}

export {
	baseUrl,
	routerMode,
	imgBaseUrl,
	errorMessage,
	sso,
	ctrlhr,
	notMustLoginPage
}