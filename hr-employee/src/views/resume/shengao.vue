<template>
  <div class="page-resume-shengao">
    <p class="resume-block-title">申告事项</p>
    <el-form size="small" :model="state" ref="state" label-position="top">
      <!--<el-form-item label="您是否在两年内有发生过交通违章？若有，请详细列出"
        prop="ispeccancy"
        :rules="[
          {required: true, message: '请输入内容'}
        ]"
      >
        <el-input :autosize="textareaSize" type="textarea" placeholder="请输入"
        v-model="state.ispeccancy"></el-input>
      </el-form-item>-->

      <el-form-item label="您是否因违法行为而被拘捕、民事或刑事诉讼过？若有，请详细列出"
        prop="beillegal"
        :rules="[
          {required: true, message: '请输入内容'}
        ]"
      >
        <el-input :autosize="textareaSize" type="textarea" placeholder="请输入"
        v-model="state.beillegal"></el-input>
      </el-form-item>

      <el-form-item label="您是否被公司解除劳动合同或和公司协商解除劳动合同过？若有，请详细列出"
        prop="retire">
        <el-input :autosize="textareaSize" type="textarea" placeholder="请输入"
        v-model="state.retire"></el-input>
      </el-form-item>

      <el-form-item label="您是否有亲属朋友在雅玛多关联公司工作？若有，请列出姓名，部门名称及职位"
        prop="remarks">
        <el-input :autosize="textareaSize" type="textarea" placeholder="请输入"
        v-model="state.remarks"></el-input>
      </el-form-item>

      <el-form-item label="您是否同意公司对您进行工作地点的调动?"
        prop="tranlocation"
        :inline-message="true"
        :rules="[
          {required: true, message: '请选择是否同意', trigger: 'change'}
        ]"
      >
        <el-radio-group v-model="state.tranlocation">
          <el-radio label="同意"></el-radio>
          <el-radio label="不同意"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        prop="reason1">
        <el-input :autosize="textareaSize" type="textarea" placeholder="可补充说明"
        v-model="state.reason1"></el-input>
      </el-form-item>

      <el-form-item label="您是否同意接受公司为您安排的其它岗位？"
        prop="tranpost"
        :inline-message="true"
        :rules="[
          {required: true, message: '请选择是否同意', trigger: 'change'}
        ]">
        <el-radio-group v-model="state.tranpost">
          <el-radio label="同意"></el-radio>
          <el-radio label="不同意"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="reason2">
        <el-input :autosize="textareaSize" type="textarea" placeholder="可补充说明"
        v-model="state.reason2"></el-input>
      </el-form-item>

      <el-form-item label="您是否同意接受不超过一年的外派工作?"
        prop="tranlocation1year"
        :inline-message="true"
        :rules="[
          {required: true, message: '请选择是否同意', trigger: 'change'}
        ]"
      >
        <el-radio-group v-model="state.tranlocation1year">
          <el-radio label="同意"></el-radio>
          <el-radio label="不同意"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        prop="reason3">
        <el-input :autosize="textareaSize" type="textarea" placeholder="可补充说明"
        v-model="state.reason3"></el-input>
      </el-form-item>
    </el-form>
    <div class="item-block btn-container">
        <el-button type="primary" icon="el-icon-arrow-left" @click="prev">上一步</el-button>
        	<template slot="button">
        		<el-button type="primary" @click="submit('state',$event)">创建简历</el-button>
        	</template>
        	<div slot="footer">
        		<el-button @click="save" :loading="loading" type="primary">保存</el-button>
        	</div>
        </detail>
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
      	loading:false,
        state: {
          ispeccancy: '',
          beillegal: '',
          retire: '',
          remarks: '',
          tranlocation: '同意',
          reason1: '',
          tranpost: '同意',
          reason2: '',
          tranlocation1year: '同意',
          reason3: ''
        },
        textareaSize: { minRows: 2, maxRows: 5 },
        detail:{},
      }
    },
    created () {
    	if(this.value){
    		debugger;
    		Object.assign(this.state,this.value);
    		this.firstOpen=false;
    	}else if (sessionStorage.stateInfo) {
        this.state = JSON.parse(sessionStorage.stateInfo)
      }
    },
     watch:{
		"state":{
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
    		this.$refs.state.validate((valid) => {
         flag=valid;
        })
    		return flag;
    	},
      formateTime (time) {
        time = new Date(time)
        return time.getTime();
      },
      prev () {
        this.$router.push({name: 'technology'})
      },
      submit (formName,e) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          	 sessionStorage.setItem('stateInfo', JSON.stringify(this.state));
            if (sessionStorage.baseInfo && sessionStorage.contactInfo && sessionStorage.educationList && sessionStorage.tbFamilyList  && sessionStorage.skill && sessionStorage.workList) {
              var baseInfo = JSON.parse(sessionStorage.baseInfo)
              var contcatInfo = JSON.parse(sessionStorage.contactInfo)
              var educationList = JSON.parse(sessionStorage.educationList)
              var tbFamilyList = JSON.parse(sessionStorage.tbFamilyList)
              var positionInfo = sessionStorage.positionInfo?JSON.parse(sessionStorage.positionInfo):'';
              var skill = JSON.parse(sessionStorage.skill)
              var workList = JSON.parse(sessionStorage.workList)
              if(baseInfo.post==1&&!sessionStorage.positionInfo){
              	this.$message('请完善您的职业信息后再提交');
              	return 
              }else if(sessionStorage.positionInfo){
              	positionInfo.licensevaliddate = positionInfo.licensevaliddate?this.formateTime(positionInfo.licensevaliddate):''
              	positionInfo.worklicensevaliddate = positionInfo.worklicensevaliddate?this.formateTime(positionInfo.worklicensevaliddate):''
              }
//            var newFamilyMembers = []
              var newWorkList = []
              var newEducationList = []
              baseInfo.date_of_birth = this.formateTime(baseInfo.date_of_birth);
             
              for (let i = 0; i < educationList.length; i++) {
                let obj = {}
                obj.beginDate = this.formateTime(educationList[i].beginDate)
                obj.endDate = this.formateTime(educationList[i].endDate)
                obj.school = educationList[i].school
                obj.profession = educationList[i].profession
                obj.education = educationList[i].education
                newEducationList.push(obj)
              }
              for (let i = 0; i < workList.length; i++) {
                let obj = {}
                obj.beginDate = workList[i].beginDate?this.formateTime(workList[i].beginDate):'';
                obj.endDate = workList[i].endDate?this.formateTime(workList[i].endDate):'';
                obj.company = workList[i].company;
                obj.post = workList[i].post;
                obj.salary = workList[i].salary;
                obj.reason = workList[i].reason;
                obj.reterence = workList[i].reterence;
                obj.phone = workList[i].phone;
                newWorkList.push(obj)
              }
//            for (let i = 0; i < familyMembers.length; i++) {
//              let obj = {}
//              obj.name = familyMembers[i].name
//              obj.relation = familyMembers[i].relation
//              obj.age = familyMembers[i].age
//              obj.residence = familyMembers[i].address
//              obj.company = familyMembers[i].workPlace
//              obj.post = familyMembers[i].position
//              newFamilyMembers.push(obj)
//            }
              this.detail = {
              	status:1,
              	post:baseInfo.post,
              	applicationArea:baseInfo.applicationArea,
              	exp_salary:baseInfo.exp_salary,
              	workDate:baseInfo.workDate,
              	channel:baseInfo.channel.join(","),
                name: baseInfo.name,
                sex: baseInfo.sex,
                documentType: baseInfo.documentType,
                num: baseInfo.num,
                date_of_birth: baseInfo.date_of_birth,
                height: Number(baseInfo.height),
                weight: Number(baseInfo.weight),
                nativeStr: baseInfo.nativeStr,
                politics: baseInfo.politics,
                marriage: baseInfo.marriage,
                escuage: baseInfo.escuage,
                licensetype: positionInfo.licensetype,
                licenselocation: positionInfo.licenselocation,
                licensevaliddate: positionInfo.licensevaliddate,
                drivingex: positionInfo.drivingex,
                cartype: positionInfo.cartype?positionInfo.cartype.join(','):'',
                isworklicense: positionInfo.isworklicense,
                worklicensevaliddate: positionInfo.worklicensevaliddate,
                tbFamilyList: tbFamilyList,
                tbEducationList: newEducationList,
                tbCompanyList: newWorkList,
                familyphone: contcatInfo.familyphone,
                phone: contcatInfo.phone,
                email: contcatInfo.email,
                birthplace: contcatInfo.birthplace,
                birthcode: contcatInfo.birthcode,
                residence: contcatInfo.residence,
                residencecode: contcatInfo.residencecode,
                iceperson: contcatInfo.iceperson,
                relation: contcatInfo.relation,
                icepersonphone: contcatInfo.icepersonphone,
                iscomputer: skill.iscomputer,
                proskill: skill.proskill,
                otherskill: skill.otherskill,
                interest: skill.interest,
                ispeccancy: this.state.ispeccancy,
                beillegal: this.state.beillegal,
                retire: this.state.retire,
                tranlocation: this.state.tranlocation,
                reason1: this.state.reason1,
                tranpost: this.state.tranpost,
                reason2: this.state.reason2,
                tranlocation1year: this.state.tranlocation1year,
                reason3: this.state.reason3,
                deleted:1
              }
            } else {
            	var str="请完善您的"
            	if(!sessionStorage.baseInfo ){
            		str+="基本信息"
            	}else if(!sessionStorage.contactInfo){
            		str+=",联系方式"
            	}else if(!sessionStorage.tbFamilyList){
            		str+=",家庭成员"
            	}else if(!sessionStorage.educationList){
            		str+=",教育经历"
            	}
            	str+='信息后再提交';
              this.$message(str);
              e.stopPropagation();
            }
          }else{
          	 e.stopPropagation();
          }
        })
      },
      save(){
      	this.loading=true;
	      this.$http.post('/candidate/addCandidate', JSON.stringify(this.detail))
	      .then((response)=>{
	      	this.loading=false;
	      	if(response.data.returnCode=='S000'){
	      		sessionStorage.removeItem("baseInfo");
	      		sessionStorage.removeItem("contactInfo");
	      		sessionStorage.removeItem("educationList");
	      		sessionStorage.removeItem("tbFamilyList");
	      		sessionStorage.removeItem("positionInfo");
	      		sessionStorage.removeItem("skill");
	      		sessionStorage.removeItem("workList");
	      		sessionStorage.removeItem("stateInfo");
	      		this.$refs.detail.showLayer=false;
	      		this.$alert('<div class="text-center"><p style="font-size:18px;margin-bottom:20px;color:#333"><i class="el-icon-success" style="color:#0aad8a;font-size:28px;vertical-align: middle;"></i> 恭喜您，简历提交成功</p>简历提交成功后，请联系我们的HR继续进行下一步面试。</div>',"", {
		        	dangerouslyUseHTMLString: true,
		          showClose:false,
		          center:true
		        }).then(()=>{
			      		this.$router.replace({name: 'base-info'})
		        })
	      	}
	      }).catch((error)=>{
	      	this.loading=false;
	      })
      }
    }
  }
</script>
<style type="text/css">
	.el-button+.detail-resume{margin-left: 10px;}
</style>
<style lang="stylus">
  .page-resume-shengao
    padding-bottom: 50px
    .el-form-item:nth-last-of-type(2)
      margin-bottom: 0
    .el-form-item:nth-last-of-type(4)
      margin-bottom: 0
    .el-form-item:nth-last-of-type(6)
      margin-bottom: 0
</style>
