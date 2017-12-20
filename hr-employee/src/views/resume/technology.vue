<template>
  <div class="page-resume-technology">
    <p class="resume-block-title">技能及个人特长</p>
    <el-form size="small" :model="skill" ref="skill" label-position="top">
      <el-form-item label="您会使用何种电脑软件?（例如：EXCEL,WORD,PPT等）" 
      prop="iscomputer"
      >
        <el-input type="textarea" placeholder="如有其他请填写" v-model="skill.iscomputer">
        </el-input>
      </el-form-item>

      <el-form-item label="曾经参加过何种专业技能培训 ?" prop="proskill"
       
        >
        <el-input :autosize="textareaSize" type="textarea" placeholder="请输入" 
        v-model="skill.proskill"></el-input>
      </el-form-item>

      <el-form-item label="外语水平 / 其他技能" prop="otherskill"
        
        >
        <el-input :autosize="textareaSize" type="textarea" placeholder="请输入"
        v-model="skill.otherskill"></el-input>
      </el-form-item>

      <el-form-item label="个人兴趣爱好、特长" prop="interest"
       
        >
        <el-input :autosize="textareaSize" type="textarea" placeholder="请输入兴趣爱好"
        v-model="skill.interest"></el-input>
      </el-form-item>
    </el-form>
    <div class="item-block btn-container">
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-left" @click="prev">上一步</el-button>
        <el-button type="primary" @click="next('skill')">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
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
        skill: {
          iscomputer: '',
          proskill: '',
          otherskill: '',
          interest: ''
        },
        textareaSize: { minRows: 2, maxRows: 5 }
      }
    },
    created () {
    	if(this.value){
    		Object.assign(this.skill,this.value);
    		this.firstOpen=false;
    	}else if (sessionStorage.skill) {
        this.skill = JSON.parse(sessionStorage.skill)
      }
    },
    watch:{
		"skill":{
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
    		this.$refs.skill.validate((valid) => {
         flag=valid;
        })
    		return flag;
    	},
      prev () {
        this.$router.push({name: 'work'})
      },
      next (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            sessionStorage.setItem('skill', JSON.stringify(this.skill))
            this.$router.push({name: 'shengao'})
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
  .page-resume-technology
    padding-bottom: 50px
</style>
