<template>
  <div class="header-user">
    <div class="header-user-content">
      <div class="left">
        <p class="dis-flex"><img src="../assets/images/logo.png" class="logo" height="40px" style="margin-right: 5px;"></p>
        <p class="company">天孜创智</p>
        <!--<p><i class="el-icon-menu"></i></p>-->
      </div>
      <div class="nav">
      	  <template v-for="(menu,index) in menus">
      	  	<p>
      	  		<a v-if="menu.status==1" :href="menu.url" :class="{'disabled':menu.code=='ATT_MODULE'}">
	        			<el-button :class="{on:menu.code=='EMPLOYEE_MODULE'}">{{menu.name}}</el-button>
	        		</a>
      	  	</p>
	        </template>
      </div>
      <div class="right">
        <div class="manage-center">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-setting"></i>  管理中心<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="user-info">
          <el-dropdown @command="outlogin">
            <span class="el-dropdown-link">
              <img class="user-avatar" src="../assets/images/people.png">
              <span>{{user.realName}}</span><i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="退出">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
	import Cookie from 'js-cookie'
	import { Base64 } from 'js-base64'
	import { sso } from '@/config/env'
	import { Message } from 'element-ui'
  export default {
    data () {
      return {
      	menus:[],
				token:Cookie.get("HR_TOKEN")||'',
				api:{
					getMenu:sso+'/api/menu/queryGroup',
				},
      }
    },
    created(){
			this.getMenus();
    },
		computed:{
			test(){
				var formal=['http://hr.ta-q-bin.com.cn','114.80.227.222:8080'];
				return formal.indexOf(location.origin)<0
			},
			user(){
				var param={};
        var str=Cookie.get('HR_USER');
        if (str){
			    param=JSON.parse(Base64.decode(str));
        }
				return param;
			}
		},
    methods:{
    	getMenus(){
    		this.$http.get(this.api.getMenu,{baseURL:sso})
				.then((response)=>{
						if(response.data.code==200){
							this.menus=response.data.data;
						}else{
							Message.error(response.data.msg);
							
						}
				})
			},
			outlogin(){
				location.href=sso+'/api/user/loginOut?token='+this.token;
			}
    }
  }
</script>
<style type="text/css">
	.company{padding-right:10px;}
	.dis-flex{display: flex;}
	.left{padding-right: 10px;}
	a.disabled{pointer-events: none;}
</style>
<style lang="stylus">
  .header-user
    left: 0
    top: 0
    width: 100%
    background-color: rgb(9, 173, 138)
    z-index: 1000
    .header-user-content
      width:96%
      height: 50px
      line-height: 50px
      margin: 0 auto
      display: flex
      justify-content: center
      align-items: center
      .left, .nav, .right
        display: flex
        justify-content: center
        align-items: center
        text-align: center
      .right
        flex: 2
        justify-content: flex-end
        color:#fff
      .nav
        flex: 1;
        justify-content: flex-start;
        padding-left: 30px;
        p
         width:100px;
        .el-button
          border: 0
          background-color: rgb(9, 173, 138)
          font-size: 16px
          color: #ccc
        .el-button.on
        	color: #fff
      .left
        border-right: 1px solid #ccc
        font-size: 20px
        color: #fff
      .user-info
        margin-left: 30px
        padding-left:30px
        border-left:1px solid #ccc
        .user-avatar
          border-radius: 50%
          width: 40px
          height: 40px
    .el-dropdown
      font-size: 16px
      color: rgba(255, 255, 255, 0.6)
      span
      	color:#fff
</style>
