<template>
  <div class="page-resume-position">
    <p class="resume-block-title">职业信息专栏（仅限营销司机应聘人员填写）</p>
    <el-form size="small" label-width="120px" label-position="left"
      :model="positionInfo"
      :rules="rules"
      ref="positionInfo"
      >
      <div class="item-block">
        <el-form-item label="驾照类型" label-width="80px" prop="licensetype">
          <el-select v-model="positionInfo.licensetype" placeholder="请选择驾照类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领证地点" label-width="80px" prop="licenselocation">
         <el-input placeholder="请输入领证地点" v-model="positionInfo.licenselocation">
         </el-input>
        </el-form-item>
      </div>

      <div class="item-block">
        <el-form-item label="有效日期" label-width="80px" prop="licensevaliddate">
          <el-date-picker
            v-model="positionInfo.licensevaliddate"
            type="date"
            placeholder="请选择到期时间"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实际驾龄" label-width="80px" prop="drivingex">
         <el-input placeholder="请输入实际驾龄" v-model.number="positionInfo.drivingex">
         </el-input>
        </el-form-item>
      </div>

      <el-form-item label="驾驶过的车辆类型" label-width="160px" prop="cartype">
        <el-checkbox-group v-model="positionInfo.cartype">
            <el-checkbox label="1.5吨以上货车"></el-checkbox>
            <el-checkbox label="其他"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="有无货运上岗证" label-width="160px" prop="isworklicense" required>
        <el-radio-group v-model="positionInfo.isworklicense">
            <el-radio label="有"></el-radio>
            <el-radio label="无"></el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="货运上岗证有效日期至" label-width="180px" prop="worklicensevaliddate">
        <el-date-picker
        	:disabled="positionInfo.isworklicense=='无'"
          v-model="positionInfo.worklicensevaliddate"
          type="date"
          placeholder="请输入到期时间"
          >
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="item-block btn-container">
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-left" @click="prev">上一步</el-button>
        <el-button type="primary" @click="next('positionInfo')">
          下一步
          <i class="el-icon-arrow-right el-icon--right">
          </i>
        </el-button>
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
    	var checkNumber = (rule, value, callback) => {
        if (value) {
        	if (!/^[1-9]\d*$/.test(value)) {
	          callback(new Error('请输入正整数'))
	        } else {
	          callback()
	        }
        } 
      }
      return {
      	firstOpen:true,
        positionInfo: {
          licensetype: '',
          licenselocation: '',
          licensevaliddate: '',
          drivingex: '',
          cartype: [],
          isworklicense: '有',
          worklicensevaliddate: ''
        },
        options: [{
          value: 'A1',
          label: 'A1'
        }, {
          value: 'A2',
          label: 'A2'
        }, {
          value: 'A3',
          label: 'A3'
        }, {
          value: 'B1',
          label: 'B1'
        }, {
          value: 'B2',
          label: 'B2'
        }, {
          value: 'C1',
          label: 'C1'
        }, {
          value: 'C2',
          label: 'C2'
        }, {
          value: 'C3',
          label: 'C3'
        }, {
          value: 'C4',
          label: 'C4'
        }, {
          value: 'D',
          label: 'D'
        }, {
          value: 'E',
          label: 'E'
        }, {
          value: 'F',
          label: 'F'
        }, {
          value: 'M',
          label: 'M'
        }, {
          value: 'N',
          label: 'N'
        }, {
          value: 'P',
          label: 'P'
        }],
        rules: {
          licensetype: [
            {required: true, message: '请选择驾照类型', trigger: 'change'}
          ],
          licenselocation: [
            {required: true, message: '请输入领证地址', trigger: 'blur'}
          ],
          licensevaliddate: [
            {required: true, message: '请选择驾照到期时间', trigger: 'change'}
          ],
          drivingex: [
            {required: true, message: '请输入实际驾龄', trigger: 'blur',type:'number'},
            {pattern:/^[1-9]\d*$/,message:'请输入正整数', trigger: 'blur'}
          ],
          cartype: [
            {required: true, message: '请选择驾驶过的车辆类型', trigger: 'change', type: 'array'}
          ],
          worklicensevaliddate:[
            {required: true, message: '请选择货运上岗证到期时间', trigger: 'change'}
          ]
        }
      }
    },
    created () {
    	if(this.value){
		  		Object.assign(this.positionInfo,this.value);
		  		if(this.value.cartype)this.positionInfo.cartype=this.value.cartype.split(",");
		  		if(this.value.drivingex)this.positionInfo.drivingex=parseInt(this.positionInfo.drivingex);
		  		this.firstOpen=false;
    	}else{
    		if (sessionStorage.positionInfo) {
	        var positionInfo = JSON.parse(sessionStorage.positionInfo)
	        positionInfo.licensevaliddate = new Date(positionInfo.licensevaliddate)
	        positionInfo.worklicensevaliddate = new Date(positionInfo.worklicensevaliddate)
	        this.positionInfo = positionInfo;
	      }
    	}
    },
    watch:{
    	'positionInfo.isworklicense':function(val){
    		if(val=='有'){
    			this.rules.worklicensevaliddate=[
            {required: true, message: '请选择货运上岗证到期时间', trigger: 'change'}
          ]
    		}else{
    			this.rules.worklicensevaliddate=[{required:false}];
    			this.$refs.positionInfo.validateField('worklicensevaliddate');
    			this.positionInfo.worklicensevaliddate="";
    		}
    	},
    	"positionInfo":{
        handler(info){
	    		if(this.value&&!this.firstOpen){
	    			Object.assign(this.value,info);
	    			this.value.cartype=info.cartype.join(",");
	    			this.value.licensevaliddate=this.value.licensevaliddate?(new Date(this.value.licensevaliddate).getTime()):'';
	    			this.value.worklicensevaliddate=this.value.worklicensevaliddate?(new Date(this.value.worklicensevaliddate).getTime()):'';
	    		}
	    	},
        deep: true
	    }
    },
    methods: {
    	checkForm(){
    		var flag=true;
    		if(this.$refs.positionInfo){
    			this.$refs.positionInfo.validate((valid)=>{
    				flag=valid;
    			})
    		}
    		return flag;
    	},
      prev () {
        this.$router.push({name: 'base-info'})
      },
      next (formName) {
      	this.positionInfo;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            sessionStorage.setItem('positionInfo', JSON.stringify(this.positionInfo))
            this.$router.push({name: 'contact'})
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
  .page-resume-position
    padding-bottom: 50px
</style>
