<template>
  <div class="page-resume-baseinfo">
    <el-form size="small" label-width="80px" label-position="left" :model="baseInfo" ref="baseInfo" :rules="rules">
      <div class="item-block">
        <el-form-item label="申请岗位" prop="post">
          <el-select 
          	filterable
          	remote="delySearch"
          	v-model="baseInfo.post"
          	 placeholder="请选择申请岗位">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="可到职日" prop="workDate">
          <el-date-picker
            v-model="baseInfo.workDate"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="item-block">
        <el-form-item label="期望薪资" prop="exp_salary">
          <el-input placeholder="请输入期望薪资（元）" v-model.number="baseInfo.exp_salary"></el-input>
        </el-form-item>
      </div>

      <el-form-item label="招聘渠道" prop="channel">
        <el-checkbox-group v-model="baseInfo.channel">
          <el-checkbox label="网络招聘"></el-checkbox>
          <el-checkbox label="人才市场"></el-checkbox>
          <el-checkbox label="中介公司"></el-checkbox>
          <el-checkbox label="内部引荐"></el-checkbox>
          <el-checkbox label="其他"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <p class="resume-block-title">基本信息</p>
      <div class="item-block">
        <el-form-item label="姓名" prop="name">
          <el-input placeholder="请输入姓名" v-model="baseInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model.number="baseInfo.sex">
            <el-option v-for="(item, index) in sexOptions"
              :key="index" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="item-block">
        <el-form-item label="证件类型" prop="documentType">
          <el-select v-model="baseInfo.documentType" placeholder="请选择申证件类型">
            <el-option
              v-for="item in options3"
              :key="item.type"
              :label="item.info"
              :value="item.type">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号" prop="num">
         	<el-input placeholder="请输入证件号" v-model="baseInfo.num" @blur="getIdInfo(baseInfo.num)"></el-input>
        </el-form-item>
      </div>
      <div class="item-block">
        <el-form-item label="出生年月" prop="date_of_birth">
          <el-date-picker
            v-model="baseInfo.date_of_birth"
            type="date"
            placeholder="请输入出生年月"
            :picker-options="pickerOptions1">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="籍贯" prop="nativeStr">
         <el-input placeholder="请输入籍贯" v-model="baseInfo.nativeStr"></el-input>
        </el-form-item>
      </div>

      <div class="item-block">
        <el-form-item label="身高" prop="height">
         <el-input placeholder="请输入身高(cm)" v-model.number="baseInfo.height"></el-input>
        </el-form-item>
        <el-form-item label="体重" prop="weight">
         <el-input placeholder="请输入体重" v-model.number="baseInfo.weight"></el-input>
        </el-form-item>
      </div>

      <div class="item-block">
        
        <el-form-item label="政治面貌" prop="politics">
          <el-select v-model="baseInfo.politics">
            <el-option v-for="(item, index) in politicsOptions"
              :key="index" :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
      </div>

      <div class="item-block">
        <el-form-item label="婚姻状况" prop="marriage" required>
          <el-radio-group v-model="baseInfo.marriage">
            <el-radio
              v-for="(item,index) in checkMarriedList"
              :label="item.value"
              :key="index">
              {{ item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否有服兵役" label-width="120px" prop="escuage">
          <el-radio-group v-model="baseInfo.escuage">
            <el-radio
              v-for="(item, index) in soldierList"
              :label="item.label"
              :key="index">
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div class="item-block btn-container">
        <el-button type="primary"  @click="next('baseInfo')">下一步</el-button>
      </div>
    </el-form>
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
      	check:true,
      	timer:null,//延迟事件id
        baseInfo: {
          post: '',
          workDate: '',
          exp_salary:'',
          channel: [],
          name: '',
          sex: '',
          date_of_birth: '',
          num: '',
          height: '',
          weight: '',
          nativeStr: '',
          politics: '',
          marriage: 1,
          escuage: '否'
        },
        options: [],
        options3: [],
        pickerOptions0: {
          disabledDate (time) {
            return time?(time.getTime() < Date.now()):false
          }
        },
        pickerOptions1: {
          disabledDate (time) {
            return time?(time.getTime() > Date.now()):false
          }
        },
        sexOptions: [{
          label: '男',
          value: 1
        }, {
          label: '女',
          value: 0
        }],
        politicsOptions: [{
          label: '团员'
        }, {
          label: '党员'
        }, {
          label: '群众'
        }],
        checkMarriedList: [
          {
            label: '未婚',
            value: 1
          },
          {
            label: '已婚未育',
            value: 2
          },
          {
            label: '已婚已育',
            value: 3
          }
        ],
        soldierList: [
          {label: '是'},
          {label: '否'}
        ],
        rules: {
          post: [
            {required: true, message: '请选择申请岗位', trigger: 'change'}
          ],
          workDate: [
            {required: true, message: '请选择入职时间', trigger: 'change', type: 'date'}
          ],
          exp_salary: [
            {required: true, message: '请输入期望薪资', trigger: 'blur',type:'number'},
            {pattern:/^[1-9]\d*$/, message:'请输入正整数', trigger: 'blur'}
          ],
          channel: [
            {required: true, message: '请选择至少一条应聘渠道', trigger: 'change', type: 'array'}
          ],
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          sex:[
            {required: true, message: '请选择性别', trigger: 'change',type:'number'}
          ],
          documentType: [
            {required: true, message: '请选择证件类型', trigger: 'change'}
          ],
          date_of_birth: [
            {required: true, message: '请选择出生日期', trigger: 'change', type: 'date'}
          ],
          num: [
          	{required: true, message: '请填写身份证号'},
            {pattern: !/(^\d{17}[\d|x]$)|^\d{15}$/i,message:'身份证格式不正确', trigger: 'blur'}
          ],
          height: [
             {pattern:/^[1-9]\d*$/, message:'请输入正整数', trigger: 'blur'}
          ],
          weight: [
             {pattern:/^[1-9]\d*$/, message:'请输入正整数', trigger: 'blur'}
          ],
          nativeStr: [
            {required: true, message: '请输入籍贯', trigger: 'blur'}
          ],
        }
      }
    },
    created () {
    	this.getPosts();
	    this.getSelects('documentType', 'options3');
	    this.$nextTick(()=>{
	    	if(this.value){
	    		if(this.value.post)this.value.post=parseInt(this.value.post);
	    		if(this.value.exp_salary)this.value.exp_salary=parseInt(this.value.exp_salary);
	    		if(this.value.marriage)this.value.marriage=parseInt(this.value.marriage);
	    		if(this.value.sex)this.value.sex=parseInt(this.value.sex);
		  		Object.assign(this.baseInfo,this.value);
		  		if(this.value.channel)this.baseInfo.channel=this.value.channel.split(",");
		  		this.firstOpen=false;
	    	}else{
	    		 if (sessionStorage.baseInfo) {
		        var baseInfo = JSON.parse(sessionStorage.baseInfo)
		        baseInfo.date_of_birth = new Date(baseInfo.date_of_birth)
		        baseInfo.workDate = new Date(baseInfo.workDate)
		        this.baseInfo = baseInfo;
		      }
	    	}
	    })
	    
    },
    watch:{
    	"baseInfo":{
        handler(info){
	    		if(this.value&&!this.firstOpen){
	    			Object.assign(this.value,info);
	    			this.value.channel=info.channel.join(",");
	    			this.value.date_of_birth=this.value.date_of_birth?(new Date(this.value.date_of_birth).getTime()):'';
	    			this.value.workDate=this.value.workDate?(new Date(this.value.workDate).getTime()):'';
	    		}
	    	},
        deep: true
	    }
    },
    methods: {
    	getIdInfo(card){
    		if(!card){
    			this.baseInfo.sex="";
					this.baseInfo.date_of_birth="";
    			return
    		}
    		var reg=/(^\d{15}$)|(^\d{17}(\d|x)$)/i;
    		if(reg.test(card)){
    			if(card.length==15){
    				this.baseInfo.sex=card.substring(14,15)%2==0?0:1;
    				this.baseInfo.date_of_birth="19"+card.substring(6,8)+"-"+card.substring(8,10)+"-"+card.substring(10,12);
    			}else{
    				this.baseInfo.sex=card.substring(16,17)%2==0?0:1;
    				this.baseInfo.date_of_birth=new Date(card.substring(6,10)+"-"+card.substring(10,12)+"-"+card.substring(12,14));
    			}
    			this.$nextTick(()=>{
						this.$refs.baseInfo.validateField("sex");
    				this.$refs.baseInfo.validateField("date_of_birth");
    			})
    		}
    	},
    	getSelects(param, optionName){
    		this.$http.get('/candidate/getTypeInfo',{params:{type_id:param}})
    		.then((response)=>{
            this[optionName]=response.data.data?JSON.parse(response.data.data):[];
    		}).catch((error)=>{

    		})
    	},
    	getPosts(val){
    		if(val){
    			this.$http.get('/api/recruitPlan/simpleList',{params:{keyword:val}})
	    		.then((response)=>{
	            this.options=response.data.data||[];
	    		})
    		}else{
    			this.options==[];
    		}
    	},
    	delySearch(val){
    		var vm = this;
    		if(vm.timer){
    			clearTimeout(vm.timer)
    		}        	 	
    	 	vm.timer = setTimeout(function(){
    	 		vm.getPosts(val);
    	 	},500);
    	},
      next (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            sessionStorage.setItem('baseInfo', JSON.stringify(this.baseInfo));
            if(this.baseInfo.post==1){
          		this.$router.push({name: 'position'})
          	}else{
          		this.$router.push({name: 'contact'})
          	}
          	this.$emit('update',this.baseInfo.post)
          }
        })
      },
      checkAll(){
      	 this.$refs[formName].validate((valid) => {
          if (valid) {
          	this.check=true;
          }else{
          	this.check=false;
          }
        })
      },
    },
  }
</script>

<style lang="stylus">
.page-resume-baseinfo
  padding-bottom: 50px
</style>
