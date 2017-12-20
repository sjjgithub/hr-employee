<template>
  <div class="page-resume-work">
    <p class="resume-block-title">工作经历（最近的3家）</p>
    <el-form label-width="85px" label-position="left" :model="item" :ref="'work'+index" :rules="rules"  v-for="(item, index) in workList" :key="index">
      <div class="form-item-group">
        <div class="item-block">
          <el-form-item label="起始时间" prop="beginDate">
            <el-date-picker
              v-model="item.beginDate"
              type="date"
              placeholder="请输入起始时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="终止时间" prop="endDate">
            <el-date-picker
              v-model="item.endDate"
              type="date"
              placeholder="请输入终止时间">
            </el-date-picker>
          </el-form-item>
        </div>

        <div class="item-block">
          <el-form-item label="工作单位" prop="company">
            <el-input v-model="item.company" placeholder="请输入工作单位" ></el-input>
          </el-form-item>
          <el-form-item  label="职位" prop="post">
            <el-input v-model="item.post" placeholder="请输入职位" ></el-input>
          </el-form-item>
        </div>

        <div class="item-block" prop="salary">
          <el-form-item label="薪资">
            <el-input v-model="item.salary" placeholder="请输入薪资(元)" ></el-input>
          </el-form-item>
          <el-form-item label="离职原因" prop="reason">
            <el-input v-model="item.reason" placeholder="请输入离职原因" ></el-input>
          </el-form-item>
        </div>

        <div class="item-block">
          <el-form-item label="证明人" prop="reterence">
            <el-input v-model="item.reterence" placeholder="请输入证明人" ></el-input>
          </el-form-item>
          <el-form-item label="证明人手机" prop="phone">
            <el-input v-model="item.phone" placeholder="请输入证明人手机" ></el-input>
          </el-form-item>
        </div>
        <el-button @click="workList.splice(index,1)" class="del" v-if="index>0" icon="el-icon-remove-outline">删除</el-button>
      </div>
    </el-form>
    <div class="item-block item-add">
        <el-button @click="addList" icon="el-icon-plus">新增工作经历</el-button>
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
        workList: [{
          beginDate: '',
          endDate: '',
          company: '',
          post: '',
          salary: '',
          reason: '',
          reterence: '',
          phone: ''
        }],
        rules:{
        	phone:[
        		{pattern:/^1[3|4|5|8][0-9]\d{8}$/i,message:'手机号码格式错误',trigger:'blur'}
        	],
        }
      }
    },
    created () {
    	if(this.value&&this.value.tbCompanyList&&this.value.tbCompanyList.length){
        this.workList = this.value.tbCompanyList;
        this.firstOpen=false;
    	}
      if (sessionStorage.workList) {
        var workList = JSON.parse(sessionStorage.workList);
        for (let i = 0; i < workList.length; i++) {
          workList[i].beginDate = workList[i].beginDate?(new Date(workList[i].beginDate)):'';
          workList[i].endDate = workList[i].endDate?(new Date(workList[i].endDate)):'';
        }
        this.workList = workList;
      }
    },
    watch:{
		"workList":{
        handler(info){
	    		if(this.value&&!this.firstOpen){
	    			for (let i = 0; i < info.llength; i++) {
		          info[i].beginDate = info[i].beginDate?(new Date(info[i].beginDate).getTime()):''
		          info[i].endDate = info[i].endDate?(new Date(info[i].endDate).getTime()):''
		        }
	    				this.value.tbCompanyList=info;
    			}
	    	},
        deep: true
	    },
		},
    methods: {
    	checkForm () {
      	var flag=true;
      	this.workList.forEach((work,i)=>{
      		var form=this.$refs['work'+i][0];
      		form.validate((valid) => {
      			if(valid){
      				if(new Date(work.beginDate).getTime()>new Date(work.endDate).getTime()){
      					this.$message("第"+(i+1)+'段教育经历开始时间不能大于结束时间');
      					flag=false;
      				}
      				if(i+1==this.workList.length&&flag) {
		            flag=true;
		          }
      			}else{
		          	flag=false;
	          }
	        })
      	})
      	return flag;
      },
      addList () {
        if (this.workList.length < 3) {
          this.workList.push({
            beginDate: '',
            endDate: '',
            company: '',
            post: '',
            salary: '',
            reason: '',
            reterence: '',
            phone: ''
          })
        } else {
          this.$message('最多填写3段工作简历')
        }
      },
      prev () {
        this.$router.push({name: 'education'})
      },
      next () {
      	var flag=true;
      	this.workList.forEach((work,i)=>{
      		var form=this.$refs['work'+i][0];
      		form.validate((valid) => {
      			if(valid){
      				if(new Date(work.beginDate).getTime()>new Date(work.endDate).getTime()){
      					this.$message("第"+(i+1)+'段教育经历开始时间不能大于结束时间');
      					flag=false;
      				}
      				if(i+1==this.workList.length&&flag) {
		            sessionStorage.setItem('workList',JSON.stringify(this.workList))
        				this.$router.push({name: 'technology'})
		          }
      			}else{
		          	flag=false;
	          }
	        })
      	})
      }
    }
  }
</script>

<style lang="stylus">
  .page-resume-work
    padding-bottom: 50px
</style>
