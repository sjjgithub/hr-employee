<template>
  <div class="page-resume-education">
    <p class="resume-block-title">教育经历（从最高学历填起）</p>
    <el-form label-width="80px" label-position="left" :rules="rules" :ref="'education'+index"  :model="item"  v-for="(item,index) in educationList" key="item.key">
      <div class="form-item-group">
        <div class="item-block">
          <el-form-item label="起始年月" prop="beginDate">
            <el-date-picker
              v-model="item.beginDate"
              type="date"
              placeholder="请输入起始年月">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="终止年月" prop="endDate">
            <el-date-picker
              v-model="item.endDate"
              type="date"
              placeholder="请输入终止年月">
            </el-date-picker>
          </el-form-item>
        </div>

        <div class="item-block">
          <el-form-item label="学校名称" prop="school">
            <el-input v-model="item.school" placeholder="请输入学校名称"></el-input>
          </el-form-item>
          <el-form-item label="专业">
            <el-input v-model="item.profession" placeholder="请输入专业名称"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="学历" prop="education">
          <el-select v-model="item.education">
            <el-option v-for="(item, index) in educationOptions"
              :key="index" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-button @click="educationList.splice(index,1)" class="del" v-if="index>0" icon="el-icon-remove-outline">删除</el-button>
      </div>
    </el-form>
    <div class="item-block item-add">
        <el-button @click="addList" icon="el-icon-plus">新增教育经历</el-button>
  	</div>
    <div class="item-block btn-container">
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-left" @click="prev">上一步</el-button>
        <el-button type="primary" @click="next">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
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
        educationList: [{
          beginDate: '',
          endDate: '',
          school: '',
          profession: '',
          education: ''
        }],
        educationOptions: [{
          label: '高中'
        }, {
          label: '中专'
        }, {
          label: '大专'
        }, {
          label: '本科'
        }, {
          label: '硕士'
        }, {
          label: '博士'
        }],
        rules:{
        	beginDate:[
        		{required:true,message:'请输入起始年月',trigger:'change'},
        	],
        	endDate:[
        		{required:true,message:'请输入终止年月',trigger:'change'},
        	],
        	school:[
        		{required:true,message:'请输入学校名称',trigger:'blur'}
        	],
        	education:[
        		{required: true, message: '请选择学历', trigger: 'change'}
        	]
        }
      }
    },
    created () {
    	if(this.value&&this.value.tbEducationList&&this.value.tbEducationList.length){
        this.educationList = this.value.tbEducationList;
        this.firstOpen=false;
    	}else if (sessionStorage.educationList) {
        var educationList = JSON.parse(sessionStorage.educationList)
        for (let i = 0; i < educationList.length; i++) {
          educationList[i].beginDate = new Date(educationList[i].beginDate)
          educationList[i].endDate = new Date(educationList[i].endDate)
        }
        this.educationList = educationList
      }
    },
    watch:{
		"educationList":{
        handler(info){
	    		if(this.value&&!this.firstOpen){
	    			for (let i = 0; i < info.length; i++) {
		          info[i].beginDate = info[i].beginDate?(new Date(info[i].beginDate).getTime()):''
		          info[i].endDate = info[i].endDate?(new Date(info[i].endDate).getTime()):''
		        }
	    				this.value.tbEducationList=info;
    			}
	    	},
        deep: true
	    },
		},
    methods: {
    	checkForm () {
      	var flag=true;
      	this.educationList.forEach((person,i)=>{
      		var form=this.$refs['education'+i][0];
      		form.validate((valid) => {
      			if(valid){
      				if(new Date(person.beginDate).getTime()>new Date(person.endDate).getTime()){
      					this.$message("第"+(i+1)+'段教育经历开始时间不能大于结束时间');
      					 flag=false;
      				}
      				if(i+1==this.educationList.length&&flag) {
		           flag=true;
		          }
      			}else{
		          	flag= false;
	          }
	        })
      	})
      	return flag;
      },
      addList () {
        if (this.educationList.length < 3) {
          this.educationList.push({
            beginDate: '',
            endDate: '',
            school: '',
            profession: '',
            education: ''
          })
        } else {
          this.$message('最多填写3段教育经历')
        }
      },
      prev () {
        this.$router.push({name: 'family'})
      },
      next () {
      	var flag=true;
      	this.educationList.forEach((person,i)=>{
      		var form=this.$refs['education'+i][0];
      		form.validate((valid) => {
      			if(valid){
      				if(new Date(person.beginDate).getTime()>new Date(person.endDate).getTime()){
      					this.$message("第"+(i+1)+'段教育经历开始时间不能大于结束时间');
      					 flag=false;
      				}
      				if(i+1==this.educationList.length&&flag) {
		           	sessionStorage.setItem('educationList', JSON.stringify(this.educationList))
	        			this.$router.push({name: 'work'})
		          }
      			}else{
		          	flag= false;
	          }
	        })
      	})
      }
    }
  }
</script>
<style type="text/css">
	.form-item-group{position: relative;margin-top: 30px;}
	.form-item-group .del{display: none;position: absolute;right: 10px;top: 50%;transform: translateY(-50%);}
	.form-item-group:hover .del{display: block;}
</style>
<style lang="stylus">
  .page-resume-education
    padding-bottom: 50px
</style>
