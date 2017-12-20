<template>
  <div class="page-resume-contact">
    <p class="resume-block-title">联系方式</p>
    <el-form label-width="100px" label-position="left" :model="contactInfo" ref="contactInfo"
     :rules="rules">
      <div class="item-block">
        <el-form-item label="家庭电话" prop="familyphone">
          <el-input placeholder="请输入家庭电话" v-model="contactInfo.familyphone"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input placeholder="请输入手机号码" v-model="contactInfo.phone"></el-input>
        </el-form-item>
      </div>

      <div class="item-block">
        <el-form-item label="电子邮箱" prop="email">
          <el-input placeholder="请输入电子邮箱" v-model="contactInfo.email"></el-input>
        </el-form-item>
      </div>

      <div class="item-block">
        <el-form-item label="户籍地址" prop="birthplace">
          <el-input placeholder="请输入户籍地址" v-model="contactInfo.birthplace"></el-input>
        </el-form-item>
        <el-form-item label="户籍邮编" prop="birthcode">
          <el-input placeholder="请输入邮编" v-model="contactInfo.birthcode"></el-input>
        </el-form-item>
      </div>

      <div class="item-block">
        <el-form-item label="目前住址" prop="residence">
          <el-input placeholder="请输入目前住址" v-model="contactInfo.residence"></el-input>
        </el-form-item>
        <el-form-item label="住址邮编" prop="residencecode">
          <el-input placeholder="请输入住址邮编" v-model="contactInfo.residencecode"></el-input>
        </el-form-item>
      </div>

      <div class="item-block col-3">
        <el-form-item label="紧急联系人" prop="iceperson">
          <el-input placeholder="请输入紧急联系姓名" v-model="contactInfo.iceperson">
          </el-input>
        </el-form-item>
        <el-form-item label="关系" prop="relation">
          <el-input placeholder="请输入关系" v-model="contactInfo.relation">
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="icepersonphone">
          <el-input placeholder="请输入紧急联系手机号" v-model="contactInfo.icepersonphone">
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="item-block btn-container">
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-left" @click="$router.back()">上一步</el-button>
        <el-button type="primary" @click="next('contactInfo')">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
  export default {
  	props:{
  		value:{
  			type:Object,
  		}
  	},
    data () {
      return {
      	firstOpen:true,
        contactInfo: {
          familyphone: '',
          phone: '',
          email: '',
          birthplace: '',
          birthcode: '',
          residence: '',
          residencecode: '',
          iceperson: '',
          relation: '',
          icepersonphone: ''
        },
        rules: {
          familyphone: [
            {pattern: /^0\d{2,3}-?\d{7,8}$/i,message:'输入的电话号码格式不正确',trigger: 'blur'}
          ],
          phone: [
          	{required: true, message: '请输入手机号码', trigger: 'blur'},
            {pattern:/^1[3|4|5|8][0-9]\d{8}$/i,message:'手机号码格式不正确', trigger: 'blur'}
          ],
          email: [
            {type:'email', message:'邮箱格式不正确',trigger: 'blur'}
          ],
          icepersonphone: [
          	{required: true, message: '请输入紧急联系人手机号', trigger: 'blur'},
            {pattern:/(^1[3|4|5|8][0-9]\d{8}$)|(^0\d{2,3}-?\d{7,8}$)/i,message:'手机号码格式不正确', trigger: 'blur'}
          ],
          birthplace: [
            {required: true, message: '请输入户籍地址', trigger: 'blur'}
          ],
          iceperson: [
            {required: true, message: '请输入紧急联系姓名', trigger: 'blur'}
          ],
          residence: [
            {required: true, message: '请输入目前住址', trigger: 'blur'}
          ],
          relation: [
            {required: true, message: '请输入关系', trigger: 'blur'}
          ],
          birthcode:[
          	{pattern:/^[1-9][0-9]{5}$/,message:'邮编格式不正确',trigger:'blur'}
          ],
          residencecode:[
          	{pattern:/^[1-9][0-9]{5}$/,message:'邮编格式不正确',trigger:'blur'}
          ],
        }
      }
    },
    created () {
    	if(this.value){
    		Object.assign(this.contactInfo,this.value);
    		this.firstOpen=false;
    	}else if (sessionStorage.contactInfo) {
        this.contactInfo = JSON.parse(sessionStorage.contactInfo)
      }
    },
    watch:{
		"contactInfo":{
        handler(info){
	    		if(this.value&&!this.firstOpen){
	    			Object.assign(this.value,info);
	    		}
	    	},
        deep: true
	    },
		},
    methods: {
    	checkForm(){
    		var flag=true;
    		if(this.$refs.contactInfo){
    			this.$refs.contactInfo.validate((valid)=>{
    				flag=valid;
    			})
    		}
    		return flag;
    	},
      prev () {
        this.$router.push({name: 'position'})
      },
      next (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            sessionStorage.setItem('contactInfo', JSON.stringify(this.contactInfo))
            this.$router.push({name: 'family'})
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
  .page-resume-contact
    padding-bottom: 50px
</style>
