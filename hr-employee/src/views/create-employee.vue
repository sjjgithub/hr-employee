<template>
<div class="addEmployee">
	<el-button :type="type" size="small" :icon="add&&!fromResume?'el-icon-plus':''" @click="getDateById">{{text}}</el-button>
	<el-dialog :modal='false' :fullscreen="true" :visible.sync="open" :title="(add?'新建':'编辑')+'员工'"  :close-on-click-modal="false" @close="resert('aadForm')">
		<div class="post-rel clearfix allwrap" style="overflow: hidden;" v-loading.body="saveLoading" :element-loading-text="loadingText">
			<ul class="tabs">
				<li v-for="(tab,index) in tabList" :key="index" v-show="tab.show&&index!=1"
					:class="{active:activeInd==index}" @click="activeInd=index">{{tab.label}}</li>
			</ul>
			<div class="content">
				<el-form size="small" :model="form" v-show="open&&activeInd<2" inline :rules="rules" label-position="right" label-width="110px" ref="aadForm">
					<el-row v-show="activeInd==0">
						<el-col :span="8">
							<el-form-item prop="info.name" label="姓名"  
								:rules="rules['info.name']">
								<el-input size="small" v-model="form.info.name" placeholder="输入姓名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.firstName" label="英文姓氏"  
								:rules="{pattern:/^[a-zA-Z]+$/,message:'只能输入英文'}">
								<el-input size="small" v-model="form.info.firstName" placeholder="输入英文姓氏"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.lastName" label="英文名称"  
								:rules="[{pattern:/^[a-zA-Z]+$/,message:'只能输入英文'},{required:true,message:'请填写英文名字'}]">
								<el-input size="small" v-model="form.info.lastName" placeholder="输入英文名称"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.code" label="职员代码"  :rules="rules['info.code']">
								<el-input size="small" v-model="form.info.code" placeholder="输入职员代码" :readonly="!add"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.mobile" label="手机号" :rules="rules['info.mobile']" >
								<el-input size="small" v-model="form.info.mobile" placeholder="输入手机号"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.fromCompany" label="所属公司" >
								<el-input size="small" v-model="form.info.fromCompany" placeholder="输入所属公司"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.deptId" label="部门"  :rules="rules['info.deptId']">
								<hr-dept v-model="form.info.deptId" size="small" :multiple="false" :filter-org="true"></hr-dept>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.jobId" label="职位"  :rules="rules['info.jobId']">
								<hr-position size="small" v-model="form.info.jobId" :related-dept="form.info.deptId" :filter-org="true"></hr-position>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.jobOrgId" label="岗位"  :rules="rules['info.jobOrgId']">
								<el-select size="small" clearable v-model="form.info.jobOrgId" filterable placeholder="请选岗位">
									<el-option v-for="job in sels.jobOrgs"
										:key="job.id"
	      								:label="job.name"
	     								:value="job.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.workSystemId" label="工作制类型" :rules="rules['info.workSystemId']">
								<el-select size="small" clearable v-model="form.info.workSystemId" filterable placeholder="请选工作制">
									<el-option v-for="type in sels.workTypes"
										:key="type.id"
	      								:label="type.name"
	     								:value="type.id">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.idNum" label="身份证号"  :rules="rules['info.idNum']">
								<el-input @blur="idCardBlur" size="small" v-model="form.info.idNum" placeholder="输入身份证号"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.idDateFrom" label="身份证有效开始"  >
								<el-date-picker
								    v-model="form.info.idDateFrom"
								    type="date"
								    size="small"
								    clearable
								    placeholder="请选择">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.idDateTo" label="身份证有效结束"  >
								<el-date-picker
								    v-model="form.info.idDateTo"
								    type="date"
								    size="small"
								    clearable
								    placeholder="请选择">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.dateOfBirth" label="生日" :rules="rules['info.dateOfBirth']">
								<el-input size="small" v-model="form.info.dateOfBirth" placeholder="根据身份证号自动获取" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.sex" label="性别"  required>
								<el-radio-group v-model="form.info.sex">
								    <el-radio disabled :label="1">男</el-radio>
								    <el-radio disabled :label="2">女</el-radio>
							    </el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.jobState" label="在职状态" required>
								<el-radio-group v-model="form.info.jobState" :disabled="!add">
								    <el-radio :label="1">试用</el-radio>
								    <el-radio :label="2">在职</el-radio>
								    <el-radio :label="3" disabled>离职</el-radio>
							    </el-radio-group>
							</el-form-item>
						</el-col>
						
						<el-col :span="8">
							<el-form-item prop="info.entryDate" label="入职时间" :rules="rules['info.entryDate']">
								<el-date-picker
								    v-model="form.info.entryDate"
								    type="date"
								    size="small"
								    clearable
								    placeholder="请选择">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.probationPeriod" label="试用期" :rules="rules['info.probationPeriod']">
								<el-input size="small" :disabled="!add" v-model="form.info.probationPeriod" placeholder="请输入试用期单位/月"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.formalDate" label="转正时间" :rules="rules['info.formalDate']">
								<el-date-picker
								    v-model="form.info.formalDate"
								    type="date"
								    size="small"
								    clearable
								    :picker-options="formalDatePickerOptions"
								    placeholder="请选择">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.quitDate" label="离职时间" :rules="rules['info.quitDate']">
								<el-date-picker
									disabled
								    v-model="form.info.quitDate"
								    type="date"
								    size="small"
								    clearable
								    placeholder="请选择">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.email" label="邮箱"  :rules="rules['info.email']">
								<el-input size="small" v-model="form.info.email" placeholder="输入邮箱"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.bankCardNo" label="银行卡号" :rules="rules['info.bankCardNo']">
								<el-input size="small" v-model="form.info.bankCardNo" placeholder="银行卡号"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.workStartDate" label="社会工作开始"  >
								<el-date-picker
								    v-model="form.info.workStartDate"
								    type="date"
								    size="small"
								    clearable
								    placeholder="请选择">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.workMonths" label="社会工龄"  >
								<div class="el-input el-input--small">
									<el-input size="small" v-model="form.info.workMonths" placeholder="请输入" style="width: 150px;margin-right: 5px;"></el-input>月
								</div>
							</el-form-item>
						</el-col>
						<el-col :span="8" v-if="!add">
							<el-form-item  label="公司工龄"  >
								<div class="el-input el-input--small">
									<el-input size="small" disabled v-model="workAge" style="width: 150px;margin-right: 5px;"></el-input>月
								</div>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.requireAttendance" label="是否需要考勤"  >
								<el-radio-group v-model="form.info.requireAttendance">
								    <el-radio label="Y">是</el-radio>
								    <el-radio label="N">否</el-radio>
							    </el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="baseInfo.nation" label="民族">
								<el-input placeholder="请输入民族" v-model="form.baseInfo.nation"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="baseInfo.nativeStr" label="籍贯">
								<el-input placeholder="请输入籍贯" v-model="form.baseInfo.nativeStr"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="身高" prop="height" :rules="[{pattern:/^[1-9]\d*$/, message:'请输入正整数', trigger: 'blur'}]">
					         	<el-input placeholder="请输入身高(cm)" v-model.number="form.baseInfo.height"></el-input>
					        </el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="体重" prop="weight" :rules="[{pattern:/^[1-9]\d*$/, message:'请输入正整数', trigger: 'blur'}]">
					         	<el-input placeholder="请输入体重" v-model.number="form.baseInfo.weight"></el-input>
					        </el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="政治面貌" prop="politics">
					          <el-select v-model="form.baseInfo.politics">
					            <el-option v-for="(item, index) in politicsOptions"
					              :key="index" :label="item.label"
					              :value="item.label">
					            </el-option>
					          </el-select>
					        </el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="婚姻状况" prop="marriage">
					          <el-radio-group v-model="form.baseInfo.marriage">
					            <el-radio
					              v-for="(item,index) in checkMarriedList"
					              :label="item.value"
					              :key="index">
					              {{ item.label}}
					            </el-radio>
					          </el-radio-group>
					        </el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="是否有服兵役" label-width="120px" prop="escuage">
					          <el-radio-group v-model="form.baseInfo.escuage">
					            <el-radio
					              v-for="(item, index) in soldierList"
					              :label="item.label"
					              :key="index">
					              {{ item.label }}
					            </el-radio>
					          </el-radio-group>
					        </el-form-item>
						</el-col>
					</el-row>
					<template v-if="canCreateSalary">
					<el-row v-show="activeInd==1">
						<el-col :span="8">
							<el-form-item prop="info.jobTypeName" label="职位等级">
								<el-input size="small" :value="form.info.jobTypeName" placeholder="根据所选职位自动获取" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.jobGradeName" label="职位类型">
								<el-input size="small" :value="form.info.jobGradeName" placeholder="根据所选职位自动获取" readonly></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.salaryId" label="基本工资档位" :rules="rules['info.salaryId']">
								<el-select size="small" clearable v-model="form.info.salaryId" filterable placeholder="请选择" class="w130" style="width: 130px;margin-right: 5px;" >
									<el-option :value="0" label="基本工资0档"></el-option>
									<el-option v-for="n in 10"
										:key="n"
	      								:label="'基本工资'+n+'档'"
	     								:value="n">
									</el-option>
								</el-select>
								<span>金额 {{form.info.salary}}</span>	
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.perfId" label="绩效档位" >
								<el-select size="small" clearable v-model="form.info.perfId" filterable placeholder="请选择" class="w130" style="width: 130px;margin-right: 5px;">
									<el-option :value="0" label="绩效工资0档"></el-option>
									<el-option v-for="n in 5"
										:key="n"
	      								:label="'绩效工资'+n+'档'"
	     								:value="n">
									</el-option>
								</el-select>
								<span>金额 {{form.info.perf}}</span>
							</el-form-item>	
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.discount" label="试用打折率" :rules="rules['info.discount']">
								<el-input size="small" v-model="form.info.discount" placeholder="试用期折扣(0-1)"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.wageForSeniorityAdd" label="工龄工资调整值" :rules="rules['info.wageForSeniorityAdd']">	
								<el-input size="small" v-model="form.info.wageForSeniorityAdd" placeholder="可精确到2位小数"></el-input>					
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.otherAllowance" label="其他补贴" :rules="rules['info.wageForSeniorityAdd']">
								<el-input size="small" v-model="form.info.otherAllowance" placeholder="可精确到2位小数"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.trafficAllowance" label="车贴" >
								<el-select size="small" allow-create clearable v-model="form.info.trafficAllowance" filterable placeholder="请选择">
									<el-option v-for="(type,index) in sels.carMoneys"
										:key="index"
	      								:label="type.val"
	     								:value="type.val">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.foodAllowance" label="饭贴">
								<el-select size="small" allow-create clearable v-model="form.info.foodAllowance" filterable placeholder="请选择">
									<el-option v-for="(type,index) in sels.foodMoneys"
										:key="index"
	      								:label="type.val"
	     								:value="type.val">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.tradeUnions" label="是否是工会会员" >
								<el-radio-group v-model="form.info.tradeUnions">
								    <el-radio label="Y">是</el-radio>
								    <el-radio label="N">否</el-radio>
							    </el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.tradeUnionsFee" label="工会费" >
								<el-select size="small" allow-create :disabled="form.info.tradeUnions=='N'" clearable v-model="form.info.tradeUnionsFee" filterable placeholder="请选择">
									<el-option v-for="(type,index) in sels.vipMoneys"
										:key="index"
	      								:label="type.val"
	     								:value="type.val">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="info.jobType" label="用工属性" >
								<el-select size="small" clearable v-model="form.info.jobType" filterable placeholder="请选择">
									<el-option 
	      								label="正式"
	     								value="1">
									</el-option>
									<el-option 
	      								label="劳务"
	     								value="2">
									</el-option>
									<el-option 
	      								label="实习"
	     								value="3">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="salary.amount" label="社保基数" :rules="rules['salary.amount']">
								<el-input size="small" v-model="form.salary.amount" placeholder="可精确到2位小数"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="salary.socialSecurityNo" label="社保账户" >
								<el-input size="small" v-model="form.salary.socialSecurityNo" placeholder="请输入社保账户"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="salary.housingFundNo" label="公积金账户" >
								<el-input size="small" v-model="form.salary.housingFundNo" placeholder="请输入公积金"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							 <el-form-item label="户粮性质" prop="salary.householdCode" >
                                <el-select v-model="form.salary.householdCode" placeholder="请选择" size="small">
                                    <el-option v-for="item in sels.householdList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                            </el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="salary.paymentUnit" label="缴纳单位" >
								<el-select v-model="form.salary.paymentUnit" placeholder="请选择" size="small">
                                    <el-option v-for="item in sels.paymentUnitList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="salary.cityCode" label="参保城市" >
                                <el-select v-model="form.salary.cityCode" placeholder="请选择" size="small">
                                    <el-option v-for="item in sels.cityList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item prop="salary.accinfoName" label="社保套账" >
								<el-tooltip effect="dark" :content="'Bottom Center'+form.salary.accinfoName" v-if="form.salary.accinfoName&&form.salary.accinfoName.length>13">
									<el-input size="small" v-model="form.salary.accinfoName" placeholder="根据前边三项自动获取" readonly></el-input>
								</el-tooltip>
								<el-input v-else size="small" v-model="form.salary.accinfoName" placeholder="根据前边三项自动获取" readonly></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					</template>
				</el-form>
				<contract   v-if="activeInd==2" :employee-code="form.info.code"></contract>
				<car-info v-if="activeInd==3" v-model="resurmeInfo" ref="carInfo"></car-info>
				<contact-info v-if="activeInd==4" v-model="resurmeInfo" ref="contactInfo"></contact-info>
				<family-info v-if="activeInd==5" v-model="resurmeInfo" ref="familyInfo"></family-info>
				<education-info v-if="activeInd==6" v-model="resurmeInfo" ref="educationInfo"></education-info>
				<work-info v-if="activeInd==7" v-model="resurmeInfo" ref="workInfo"></work-info>
				<skill-info v-if="activeInd==8" v-model="resurmeInfo" ref="skillInfo"></skill-info>
				<complaint-info v-if="activeInd==9" v-model="resurmeInfo" ref="complaintInfo"></complaint-info>
			</div>
		</div>
		<div style="text-align: center;">
			<el-button type="primary" @click="save('aadForm')" :loading="saveLoading">保存</el-button>
			<el-button @click="resert('aadForm')">取消</el-button>
		</div>
	</el-dialog>
</div>	
</template>

<script>
import moment  from 'moment'

import {ctrlhr,sso,errorMessage} from '@/config/env'
import {JOB_TYPE}  from '@/config/globalStaict'

import hrDept  from '@/components/hr-dept'
import hrPosition  from '@/components/hr-position'

import contract  from '~/contract/contract'

import educationInfo  from '~/resume/education'
import contactInfo  from '~/resume/contact'
import familyInfo  from '~/resume/family'
import workInfo  from '~/resume/work'
import carInfo  from '~/resume/position'
import skillInfo  from '~/resume/technology'
import complaintInfo  from '~/resume/shengao'

export default{
	components: {
			hrDept,hrPosition,contract,carInfo,contactInfo,familyInfo,educationInfo,workInfo,skillInfo,complaintInfo
		},
	props:{
		fromResume:{//判断是否是从简历中创建的,是的话要更新简历信息
			type:Boolean,
			default:false,
		},
		type:{//button类型
			type:String,
			default:'primary'
		},
		info:{//从简历传入的简历id
			
		},
		text:{//button显示的子
			type:String,
			default:'新建'
		},
		add:{//是否为创建
			type:Boolean,
			default:true,
		},
		code:{},//编辑是传入员工code
		id:{},//编辑时传入的员工id
	},
	data:function(){
		var vm=this; 
		var checkMobile=function(rule,value,callback){
				if(value){
					if(value.length!=11){
						callback(new Error("输入11位手机号"))
					}
				}
				callback();
			}; 
		var checkDiscount=function(rule,value,callback){
				if(value){
					if(parseFloat(value)<0||parseFloat(value)>1){
						callback(new Error("折扣输入不正确"))
					}
				}
				callback();
			}; 
		var checkEntryDate=function(rule,value,callback){
				if(value&&vm.form.info.formalDate){
					if(moment(value).format('x')>moment(vm.form.info.formalDate).format('x')){
						callback(new Error("转正日期不能小于入职日期"))
					}
				}
				callback();
			}; 
		var checkFormalDate=function(rule,value,callback){
				if(value&&vm.form.info.entryDate){
					if(moment(value).format('x')<moment(vm.form.info.entryDate).format('x')){
						callback(new Error("转正日期不能小于入职日期"))
					}
				}
				callback();
			}; 
		return {
			tabList:[
				{
					label:'个人信息',
					show:true,
				},
				{
					label:'薪酬信息',
					show:false,
				},
				{
					label:'合同信息',
					show:true,
				},
				{
					label:'职业信息',
					show:false,
				},
				{
					label:'联系方式',
					show:true,
				},
				{
					label:'家庭成员',
					show:true,
				},
				{
					label:'教育经历',
					show:true,
				},
				{
					label:'工作经历',
					show:true,
				},
				{
					label:'技能特长',
					show:true,
				},
				{
					label:'申告事项',
					show:true,
				}
				
			],
			resumeId:null,
			hasContract:true,
			checkDiscount:checkDiscount,
			canCreateSalary:true,
			formalDatePickerOptions:{},//入职时间显示参数
			open:false,//设置弹窗显示
			saveLoading:false,//保存按钮的liading
			loadingText:"",//保存时加载时的字段
			activeInd:0,//目前显示的信息,
			resurmeInfo:{},//简历信息
			workAge:'',//公司工作工龄
			form:{
				info:{
					name:"",//姓名
					code:"",//员工号
					mobile:"",//手机号
					idNum:"",//身份证
					sex:1,//性别
					dateOfBirth:"",//生日
					address:"",//户籍地址
					nowAddress:"",//现住址
					discount:"1.0",//试用打折率
					deptId:"",//部门
					email:"",//邮箱
					jobId:"",//职位
					bankCardNo:"",//银行卡号
					jobOrgId:"",//岗位
					workSystemId:"",//工作制类型
					jobState:1,//在职状态
					entryDate:"",//入职时间
					probationPeriod:"",//试用期
					formalDate:"",//转正时间
					quitDate:"",//离职时间
					laborDispatch:"Y",//是否外派
					workMonths:"",//工龄
					maritalStatus:"",//婚姻状态
					fertilityStatus:"",//生育状态
					requireAttendance:"Y",//是否考勤
					salaryId:"",//工资档
					perfId:"",//绩效档
					wageForSeniorityAdd:"",//岗位工资调整
					otherAllowance:"",//其他补贴
					trafficAllowance:"",//车贴
					foodAllowance:"",//饭贴
					tradeUnions:"Y",//是否是工会会员
					tradeUnionsFee:5,//工会费
					jobType:"",//用工属性
					salary:"",//薪资档具体金额
					perf:"",//绩效具体金额
					firstName:'',//英文姓氏
					lastName:'', //英文姓名
					workStartDate:'',//社会工作开始时间
					fromCompany:'',//所属公司
					nation:'',//民族
					idDateFrom:'',//身份证有效期开始时间
					idDateTo:'',//身份证有效期结束时间 
				},
				salary:{
					amount:"",//社保基数
					socialSecurityNo:"",//社保账户
					housingFundNo:"",//公积金账户
					status:"",//投保状态
					householdCode:"",//户粮性质
					paymentUnit:"",//缴纳单位
					cityCode:"",//参保城市
					accinfoId:"",//套账Id
					accinfoName:"",//套账名字
					jobTypeId:'',//职位类型id
					jobGradeId:'',//职位等级id
					jobTypeName:'',//职位类型
					jobGradeName:''//职位等级
				},
				baseInfo:{
					nativeStr:'',//籍贯
					height:'',//身高
					weight:'',//体重
					politics:'',//politics
					marriage:1,//marriage
					escuage:'否',//是否有服兵役
				}
			},
			sels:{
				jobOrgs:[],//职位列表集合
				workTypes:[],//工作制集合
				salary:"",//薪资档金额
				perf:"",//绩效档金额
				carMoneys:[],//车贴集合
				foodMoneys:[],//饭贴集合
				vipMoneys:[],//工会缴纳集合
				householdList:[],//户粮性质集合
				paymentUnitList:[],//缴纳单位集合
				cityList:[],//社保城市集合
				jobType:JOB_TYPE,//用工属性集合
			},
			rules:{
				'info.name':[
					{required:true,message:"员工姓名不能为空",trigger:'blur'}
				],
				'info.code':[
					{required:true,message:"职员代码不能为空",trigger:'blur'}
				],
				'info.mobile':[
					{required:true,message:"员工手机号不能为空",trigger:'blur'},
					{validator:checkMobile,trigger:"blur"}
				],
				'info.deptId':[
					{required:true,message:"员工部门不能为空"}
				],
				'info.jobId':[
					{required:true,message:"员工职位不能为空"}
				],
				'info.jobOrgId':[
					{required:true,message:"员工岗位不能为空"}
				],
				'info.workSystemId':[
					{required:true,message:"编制不能为空"}
				],
				'info.workMonths':[
					{pattern:/^\d+(\.\d+)?$/,message:"格式不正确",trigger:"blur"}
				],
				'info.idNum':[
					{required:true,message:"身份证号不能为空"},
					{pattern:/(^\d{15}$)|(^\d{17}(\d|x)$)/i,message:"身份证号格式不正确",trigger:"blur"}
				],
				'info.dateOfBirth':[
					{required:true,message:"生日不能为空"}
				],
				'info.entryDate':[
					{required:true,message:"入职时间不能为空"},
					{validator:checkEntryDate,trigger:"change"}
				],
				'info.formalDate':[
					{required:true,message:"转正时间不能为空"},
					{validator:checkFormalDate,trigger:"change"}
				],
				'info.quitDate':[
					{required:false,message:"转正时间不能为空"},
				],
				'info.email':[
					{type:'email',message:"请输入正确的邮箱格式",trigger:"blur"}
				],
				'info.probationPeriod':[
					{required:true,message:"试用期不能为空",trigger:'blur'},
					{pattern: /^\d+$|^\d+(\.\d{1}$)/, message: '试用期填写格式不正确', trigger: 'blur'},
				],
				'info.bankCardNo':[
					{pattern: /^\d{16}|^\d{19}$/, message: '银行卡格式不正确', trigger: 'blur'},
				],
				'info.wageForSeniorityAdd': [
                    {pattern:/^\d+(\.\d{1,2})?$/, message: '格式不正确', trigger: 'blur'},
                ],
                'info.otherAllowance': [
                    {pattern:/^\d+(\.\d{1,2})?$/, message: '格式不正确', trigger: 'blur'},
                ],
				'salary.amount': [
                    {pattern:/^\d+(\.\d{1,2})?$/, message: '请输入正确金额', trigger: 'blur'},
                ],
			},
			api: {
				getJob:ctrlhr+"/api/jobOrg/getORGlistByDeptAndJob",//根据部门职位获取编制结合
				workSystemApi:ctrlhr+"/api/job/getWorkSystem",//获取工作制集合
				getLaborDispath:ctrlhr+"/api/employee/getDDByParentCode?parentCode=",//获取饭贴车贴情况数集
				getWorkSystem:ctrlhr+"/api/employee/getWorkSystemByORG",//根据编制获取默认工作制
				getSalaryPerf:ctrlhr+"/api/employee/getSalaryPerf",//根据编制获取默认档位金额
				saveEmployee:ctrlhr+"/api/employee/add",//新增用户信息
				getInfo:ctrlhr+"/api/employee/getInfo?id=",//根据code获取用户信息
				upDate:ctrlhr+"/api/employee/update",//编辑用户信息
				
				paymentUnitList:ctrlhr+"/api/employee/getSecurityPaymentUnitList",//获取缴纳单位
                cityList: ctrlhr+"/api/employee/getSecurityCityList",//获取社保城市集合
                houseHoldList:ctrlhr+"/api/employee/getSecurityHouseholdList",//获取户粮性质集合
                getAccinfoId:ctrlhr+"/api/employee/getSecurityAccinfo",//根据以上三项获取套账Id
                addSalary:ctrlhr+"/api/employee/insertInsure",//添加社保信息
                updateSalary:ctrlhr+"/api/employee/updateInsure",//更新社保信息
                getSalaryInfo:ctrlhr+"/api/employee/getInsure",//根据地会员社保信息
                getJobInfo:ctrlhr+"/api/job/getJobGradeAndType",//获取职位信息
                getPermission:sso+"/api/pmsn/selfPermissions",//获取权限
			},
			isFirstChangeJob:true,
			isFirstChangeJobOrgId:true,
			politicsOptions: [{
		          label: '团员'
		        }, {
		          label: '党员'
		        }, {
		          label: '群众'
		        }
	        ],
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
	        canUpdate:true,
		}
	},
	computed:{
		emoloyeeCode:function(){
			return this.code;
		},
		emoloyeeId:function(){
			return this.id;
		}
	},
	mounted:function (){
		this.getWorkSystems();
		this.getLaborDispath("carMoneys","SALARY_LABOR_DISPATCH_TRAFFIC");
		this.getLaborDispath("foodMoneys","SALARY_LABOR_DISPATCH_FOOD");
		this.getLaborDispath("vipMoneys","TRADE_UNIONS_FEE");
        var vm=this;
         //获取员工新建权限
        this.$http.get(vm.api.getPermission)
        .then((response)=>{
        	let data=response.data;
        	if (data.code == '200') {
               vm.canCreateSalary = data.data.indexOf('SALARY')>=0;
               vm.tabList[1].show=vm.canCreateSalary;
            } 
        })
        // 加载编辑弹出层中的户粮性质列表
        this.$http.get(vm.api.houseHoldList)
       .then((response)=>{
        	let data=response.data;
        	if (data.code == '200') {
                vm.sels.householdList = data.data;
            } 
        })

        // 加载编辑弹出层中的参保城市列表
		this.$http.get(vm.api.cityList)
        .then((data)=>{
        	if (data.code == '200') {
                vm.sels.cityList = data.data;
            }
        })
        // 加载编辑弹出层中的参保单位
        this.$http.get(vm.api.paymentUnitList)
        .then((data)=>{
        	 if (data.code == '200') {
                vm.sels.paymentUnitList = data.data;
            } 
        })
    //根据简历id获取简历信息
        if(this.info){
        	var vm=this;
      		this.$http.get("/candidate/query",{params:{id:this.info}})
    		.then((response)=>{
                if (response.data.returnCode=="S000") {
                	response.data.data = JSON.parse(response.data.data);
                	console.log(response)
                	if(response.data.data.length){
                  		Object.assign(vm.resurmeInfo,response.data.data[0]);
              			//填补员工信息
			        	var info={
			        		name:vm.resurmeInfo.name,
							mobile:vm.resurmeInfo.phone,
							idNum:vm.resurmeInfo.num,
							sex:vm.resurmeInfo.sex,
							dateOfBirth:vm.resurmeInfo.date_of_birth,
							email:vm.resurmeInfo.email,
							jobOrgId:vm.resurmeInfo.post,
			        	};
			        	this.resumeId=vm.resurmeInfo.id;
			        	info.dateOfBirth=moment(info.dateOfBirth).format("YYYY-MM-DD");
			        	Object.assign(this.form.info,info);
			        	this.$http.get('/api/recruitPlan/otherInfo',{params:{id:info.jobOrgId}})
			        	.then((response)=>{ 
			        		this.form.info.deptId=response.data.data.deptId;
			        		this.$nextTick(function(){
			        			this.form.info.jobId=response.data.data.jobId;
			        			this.$nextTick(()=>{
			        				this.form.info.jobOrgId=response.data.data.jobOrgId;
			        				this.$nextTick(()=>{
				        				this.form.info.workSystemId=response.data.data.workSystemId;
				        			})
			        			})
			        		})
			        	})
                	}else{
                		vm.resurmeInfo={};
                	}
                } 
    		})
        }
    },
    watch:{
    	'form.baseInfo':{
    		handler(val){
	    		Object.assign(this.resurmeInfo,val);
	    	},
	    	deep:true,
    	},
    	activeInd:function(val){
    		if(val==1){
    			this.rules['info.salaryId']=[{required:true,message:"工资档位不能为空"}];
    			this.rules['info.discount']=[{required:true,message:"试用期折扣不能为空",trigger:"change"},{validator:this.checkDiscount,trigger:"blur"}];
    		}else{
    			 this.rules['info.salaryId']=[];
    			 this.rules['info.discount']=[];
    		}
    	},
    	'form.info.tradeUnions'(val){
    		if(val=='Y'){
    			this.form.info.tradeUnionsFee='5'
    		}else if(val!='Y'){
    			this.form.info.tradeUnionsFee='0'
    		}
    	},
    	'form.info.jobType'(val){
			if(val=='1'){
    			this.form.info.trafficAllowance='10';
    			this.form.info.foodAllowance='20';
    		}else if(val=='2'){
    			this.form.info.trafficAllowance='5';
    			this.form.info.foodAllowance='15';
    		}else if(!val){
    			this.form.info.trafficAllowance='';
    			this.form.info.foodAllowance='';
    		}
    	},
	    'form.info.deptId':function(val){
	    	if(this.$refs.aadForm){
				this.$refs.aadForm.validateField("info.deptId");
			}
		},
		'form.info.jobId':function(val){
			if(val){
				this.getJobInfo();
			}else{
				this.form.info.jobTypeId="";
            	this.form.info.jobTypeName="";
            	this.form.info.jobGradeId="";
            	this.form.info.jobGradeName="";
			}
			if(this.form.info.salaryId&&val){
				this.getSalaryPerf("salary",this.form.info.salaryId);
			}
			if(this.form.info.perfId&&val){
				this.getSalaryPerf("perf",this.form.info.perfId);
			}
			this.getJobOrgs();
			this.form.info.jobOrgId="";
			this.$nextTick(function(){
				if(this.$refs.aadForm)this.$refs.aadForm.validateField("info.jobId");
			})
		},
		'form.info.jobOrgId':function(){
			if(this.add){
				this.getDefaultWorkSystem();
				this.form.info.workSystemId="";
			}
		},
		'form.info.salaryId':function(val,old){
			if(!val){
				if(val==0){
					this.form.info.salary=0;
				}else{
					this.form.info.salary="";
				}
			}else{
				if(this.form.info.jobId){
					this.getSalaryPerf("salary",val)
				}else if(this.open){
					this.$message.info("确定职位后才能显示档位金额")
				}
			}
		},
		'form.info.perfId':function(val){
			if(!val){
				if(val==0){
					this.form.info.perf=0;
				}else{
					this.form.info.perf="";
				}
			}else{
				if(this.form.info.jobId){
					this.getSalaryPerf("perf",val)
				}else if(this.open){
					this.$message.info("确定职位后才能显示档位金额")
				}
			}
		},
		'form.info.probationPeriod':function(val){
			if(this.form.info.entryDate&&this.add){
				this.form.info.formalDate=this.setMonth(this.form.info.entryDate,val);
				this.$nextTick(function(){
					if(this.$refs.aadForm)this.$refs.aadForm.validateField("info.formalDate");
				})
			}
		},
		'form.info.entryDate':function(val){
			if(this.form.info.probationPeriod&&this.add){
			   this.form.info.formalDate=this.setMonth(val,this.form.info.probationPeriod);
			   	this.$nextTick(function(){
					if(this.$refs.aadForm)this.$refs.aadForm.validateField("info.formalDate");
				})
			}
			if(!this.add){
				this.getprobationPeriod(val,this.form.info.formalDate)
			}
			if(val){
				this.formalDatePickerOptions.disabledDate=function(time){
					return time.getTime()< (moment(val).add(1,'d').format("x") - 8.64e7);
				}
			}else{
				this.formalDatePickerOptions={};
			}
		},
		'form.info.formalDate':function(val){
			if(!this.add){
				this.getprobationPeriod(this.form.info.entryDate,val)
			}
		},
		'form.info.jobState':function(val){
			if(val==3){
				this.rules['info.quitDate']=[{required:true,message:"离职时间不能为空"}];
				this.$nextTick(function(){
					if(this.$refs.aadForm)this.$refs.aadForm.validateField("info.quitDate");
				})
			}else{
				this.rules['info.quitDate']=[{required:false,message:"离职时间不能为空"}];
				this.$nextTick(function(){
					if(this.$refs.aadForm)this.$refs.aadForm.validateField("info.quitDate");
				})
				this.form.info.quitDate="";
			}
		},
		'form.salary.householdCode':function(){
			this.getAccinfoId();
		},
		'form.salary.paymentUnit':function(){
			this.getAccinfoId();
		},
		'form.salary.cityCode':function(){
			this.getAccinfoId();
		},
    },
    methods: {
    	changeObjNull:function(obj){
    		for(var key in obj){
				if(obj[key]==null)obj[key]="";
			}
			return obj
    	},
    	setMonth:function(now,month){
			if(month){
				month=parseInt(month);
        		var data= new Date(now);
        		var year=data.getFullYear();
				var monthNow=data.getMonth();
				var yearAdd=parseInt(Math.floor(month/24));
				var monthAdd=parseInt(month%24);
				data.setFullYear(year+yearAdd);
				data.setMonth(monthNow+monthAdd);
			}else{
				data="";
			}
			return data;
    	},
    	//根据员工id获取基本信息
		getDateById:function(){
    		if(this.add){
        		this.open=true;
        		return
    		};
    		var vm=this;
    		vm.saveLoading=true;
    		vm.$http.get(vm.api.getInfo+vm.id).then((response)=>{
    			let responseData=response.data;
				if(responseData.code==200){
				    var data=vm.changeObjNull(responseData.data);
				    var copyData=JSON.parse(JSON.stringify(data));
					data.entryDate=data.entryDate?moment(data.entryDate).format("YYYY-MM-DD"):"";
    				data.formalDate=data.formalDate?moment(data.formalDate).format("YYYY-MM-DD"):"";
    				data.dateOfBirth=data.dateOfBirth?moment(data.dateOfBirth).format("YYYY-MM-DD"):"";
					data.quitDate=data.quitDate?moment(data.quitDate).format("YYYY-MM-DD"):"";
					data.discount=data.discount?parseFloat(data.discount).toFixed(1):1.0;
					//新增日期  
					data.workStartDate=data.workStartDate?moment(data.workStartDate).format("YYYY-MM-DD"):"";
    				data.idDateFrom=data.idDateFrom?moment(data.idDateFrom).format("YYYY-MM-DD"):"";
    				data.idDateTo=data.idDateTo?moment(data.idDateTo).format("YYYY-MM-DD"):"";
					
					if(data.entryDate){
						this.workAge=(moment().year()-moment(data.entryDate).year())*12+(moment().month()-moment(data.entryDate).month());
					}
					
					vm.form.info={};
					vm.form.info=data;
					vm.$nextTick(function(){
						vm.idCardBlur();
						if(!vm.form.info.probationPeriod){
							vm.getprobationPeriod(vm.form.info.entryDate,vm.form.info.formalDate);
						}
						if(!vm.form.info.deptId)vm.form.info.deptId=copyData.deptId;
						vm.$nextTick(function(){
							if(!vm.form.info.jobId)vm.form.info.jobId=copyData.jobId;
							vm.$nextTick(function(){
								if(!vm.form.info.jobOrgId)vm.form.info.jobOrgId=copyData.jobOrgId;
								vm.$nextTick(function(){
									if(!vm.form.info.workSystemId)vm.form.info.workSystemId=copyData.workSystemId;
								})
							})	
						})
						vm.form.info.trafficAllowance=copyData.trafficAllowance;
    					vm.form.info.foodAllowance=copyData.foodAllowance;
					})
					vm.getSalaryByCode();
				}
				vm.saveLoading=false;
			})
    	},
    	//根据员工id获取社保信息
    	getSalaryByCode:function(){
    		var vm=this;
    		this.$http.get(vm.api.getSalaryInfo,{params:{employeeCode:vm.emoloyeeCode}})
    		.then((response)=>{
    			let data=response.data;
    			vm.saveLoading=false;
                if (data.code == '200') {
                	if(data&&data.data){ 
                		vm.form.salary = vm.changeObjNull(data.data)
            		}else{
            			vm.form.salary={
							amount:"",//社保基数
							socialSecurityNo:"",//社保账户
							housingFundNo:"",//公积金账户
							status:"",//投保状态
							householdCode:"",//户粮性质
							paymentUnit:"",//缴纳单位
							cityCode:"",//参保城市
							accinfoId:"",//套账Id
							accinfoName:"",//套账名字
							jobTypeId:'',//职位类型id
							jobGradeId:'',//职位等级id
							jobTypeName:'',//职位类型
							jobGradeName:''//职位等级
						}
                	}
                    vm.open=true;
                } 
                vm.getResumeByCode()
    		})
    	},
    	//根据员工code获取简历信息
    	getResumeByCode:function(){
    		var vm=this;
    		this.$http.get("/candidate/query",{params:{employeecode:vm.emoloyeeCode}})
    		.then((response)=>{
                if (response.data.returnCode=="S000") {
                	response.data.data = JSON.parse(response.data.data);
                	console.log(response)
                	if(response.data.data.length){
                  		Object.assign(vm.resurmeInfo,response.data.data[0]);
                  		Object.assign(this.form.baseInfo,this.resurmeInfo);
			        	this.form.baseInfo.marriage=this.resurmeInfo.marriage?parseInt(this.resurmeInfo.marriage):1;
			        	this.form.baseInfo.escuage=this.resurmeInfo.escuage||'否';
			        	vm.canUpdate=true;
                	}else{
                		vm.resurmeInfo={};
                		vm.canUpdate=false;
                	}
                    vm.open=true;
                } 
    		})
    	},
    	//重置
    	resert:function(formName){
        	if(this.$refs[formName]){
	        	this.$refs[formName].resetFields();
//	        	this.form.info.jobId="",
        		this.form.info.salary="";
				this.form.info.perf="";
				this.form.salary.accinfoId="",
				this.activeInd=0;
				this.isFirstChangeJob=true;
				this.isFirstChangeJobOrgId=true;
				this.loadingText="";
				this.open=false;
        	}
    	},
    	//添加保存
    	save:function(formName){
    		var vm=this;
    		if(this.$refs.carInfo){
				var flag=this.$refs.carInfo.checkForm();
				if(!flag){
					return false;
				}
			}
    		if(this.$refs.contactInfo){
				var flag=this.$refs.contactInfo.checkForm();
				if(!flag){
					return false;
				}
			}
    		if(this.$refs.familyInfo){
				var flag=this.$refs.familyInfo.checkForm();
				if(!flag){
					return false;
				}
			}
    		if(this.$refs.educationInfo){
				var flag=this.$refs.educationInfo.checkForm();
				if(!flag){
					return false;
				}
			}
    		if(this.$refs.complaintInfo){
				var flag=this.$refs.complaintInfo.checkForm();
				if(!flag){
					return false;
				}
			}
    		vm.$refs[formName].validate(function(valid){
    			if(valid){
    				var param=JSON.parse(JSON.stringify(vm.form.info));
    				param.entryDate=moment(param.entryDate).format("YYYY-MM-DD HH:mm:ss");
    				param.formalDate=moment(param.formalDate).format("YYYY-MM-DD HH:mm:ss");
    				param.dateOfBirth=moment(param.dateOfBirth).format("YYYY-MM-DD HH:mm:ss");
    				
					param.quitDate=param.quitDate?moment(param.quitDate).format("YYYY-MM-DD HH:mm:ss"):'';
					//新增几个日期字段
					param.workStartDate=param.workStartDate?moment(param.workStartDate).format("YYYY-MM-DD HH:mm:ss"):'';
    				param.idDateFrom=param.idDateFrom?moment(param.idDateFrom).format("YYYY-MM-DD HH:mm:ss"):'';
    				param.idDateTo=param.idDateTo?moment(param.idDateTo).format("YYYY-MM-DD HH:mm:ss"):'';
    				
					var saveApi=vm.add?vm.api.saveEmployee:vm.api.upDate;
					vm.loadingText="保存基本信息";
					vm.saveLoading=true;
					vm.$http.get(saveApi,{params:param})
					.then((response)=>{
						var responseData=response.data
						if(responseData.code=="200"){
								vm.saveSalary(responseData.data.id,responseData.data.code,vm.form.salary)
							}else{
								vm.saveLoading=false;
								vm.$message.error({
									message:responseData.msg||"创建员工信息发生错误",
									duration:20000,
									showClose:true,
								});
							}
					}).catch(function(){
						vm.saveLoading=false;
						vm.$message.error({
									message:"创建员工信息发生错误",
									duration:20000,
									showClose:true,
								});
					})
    			}else{
    				vm.$message.info(vm.activeInd==1?"请检查您的个人和薪酬信息":'请检查您的个人信息');
    			}
    		})
    	},
    	//添加保存社保信息
    	saveSalary:function(id,code,param){
    		var vm=this;
    		vm.loadingText="保存社保信息";
    		param.employeeId=id;
    		param.employeeCode=code;
    		var saveApi=vm.add?vm.api.addSalary:vm.api.updateSalary;
			vm.$http.get(saveApi,{params:param})
			.then((response)=>{
				let responseData=response.data
				if(responseData.code=="200"){
					vm.saveResume(code,vm.resurmeInfo);
				}else{
					vm.saveLoading=false;
					vm.$message.error({
						message:responseData.msg||"创建社保信息发生错误",
						duration:20000,
						showClose:true,
					});
				}
			}).catch(function(){
				vm.saveLoading=false;
				vm.$message.error({
					message:"创建社保信息发生错误",
					duration:20000,
					showClose:true,
				});
			})
    	},
    	//添加保存简历信息
    	saveResume:function(code,param){
    		var vm=this;
    		vm.loadingText="保存简历信息";
    		var saveApi="";
    		if(vm.add&&!vm.fromResume){
    			saveApi="/candidate/addCandidate"
    		}else {
    			if(vm.canUpdate){
    				saveApi="/candidate/updateCandidate";
    			}else{
    				saveApi="/candidate/addCandidate";
    			}
    		}
    		param.employeecode=code;
			vm.$http.post(saveApi,JSON.stringify(param))
			.then((response)=>{
				let responseData=response.data
				vm.open=false;
				vm.saveLoading=false;
				if(responseData.returnCode=="S000"){
					vm.$message.success(vm.add?"新建员工成功":"编辑员工成功");
					if(vm.add&&vm.fromResume){
						vm.$emit("update",vm.resumeId);
					}else{
						vm.$emit("update");
					}
				}else{
					vm.$message.error({
						message:responseData.msg||"创建简历息发生错误",
						duration:20000,
						showClose:true,
					});
				}
			}).catch(function(){
				vm.saveLoading=false;
				vm.$message.error({
					message:"创建简历息发生错误",
					duration:20000,
					showClose:true,
				});
			})
    	},
    	//根据部门和职位获取编制集合
    	getJobOrgs:function(){
        	if(!this.form.info.deptId||!this.form.info.jobId){
        		this.sels.jobOrgs=[];
        		return;
        	}
    		var vm=this;
    		var param={};
    		param.deptId=vm.form.info.deptId;
    		param.jobId=vm.form.info.jobId;
    		vm.$http.get(vm.api.getJob +"?"+Util.parseForm(param))
    		.then((response)=>{
    			let responseData=response.data;
				if(responseData.code==200){
					vm.sels.jobOrgs=responseData.data;
				}
			})
    	},
    	//获取工作制类型集合
		getWorkSystems:function(){
			var vm = this;
			vm.$http.get(vm.api.workSystemApi)
    		.then((response)=>{
				let responseData=response.data;
				if(responseData.code==200){
					vm.sels.workTypes=responseData.data;
				}
			})
		},
		//根据编制获取默认编制
		getDefaultWorkSystem:function(){
			if(!this.form.info.jobOrgId)return
			var vm = this;
			vm.$http.get(vm.api.getWorkSystem+"?jobOrgId="+vm.form.info.jobOrgId)
    		.then((response)=>{
				let responseData=response.data;
				if(responseData.code==200){
					vm.form.info.workSystemId=responseData.data?responseData.data.id:"";
				}
			})
		},
		//获取各种情况下的车贴以及饭贴
    	getLaborDispath:function(key,param){
    		var vm=this;
    		vm.$http.get(vm.api.getLaborDispath+param)
    		.then((response)=>{
				let responseData=response.data;
				if(responseData.code==200){
					vm.sels[key]=responseData.data;
				}
			})
    	},
    	//根据档位获取具体金额值
    	getSalaryPerf:function(key,val){
    		var vm=this;
    		vm.$http.get(vm.api.getSalaryPerf+"?jobId="+vm.form.info.jobId+"&"+key+"Id="+val)
    		.then((response)=>{
				let responseData=response.data;
				if(responseData.code==200&&responseData.data){
						vm.form.info[key]=responseData.data[key];
					}else{
						vm.form.info[key]='暂无';
					}
			})
    	},
    	//根据职位id获取职位信息
    	getJobInfo:function(){
    	  	var vm=this;
    	  	vm.$http.get(vm.api.getJobInfo,{params:{jobId:vm.form.info.jobId}})
    		.then((response)=>{
				let data=response.data;
				if (data.code == '200') {
                    if(data.data){
                    	vm.form.info.jobTypeId=data.data.jobTypeId;
                    	vm.form.info.jobTypeName=data.data.jobTypeName?data.data.jobTypeName:'暂无';
                    	vm.form.info.jobGradeId=data.data.jobGradeId;
                    	vm.form.info.jobGradeName=data.data.jobGradeName?data.data.jobGradeName:'暂无';
                    }
                } 
			})
    	},
    	//根据入职日期和转正日期反推试用期
       	getprobationPeriod:function(start,end){
       		var startDate=moment(start);
       		var endDate=moment(end);
       		if(startDate.date()==endDate.date()){
       			if(startDate.year()==endDate.year()){
       				this.form.info.probationPeriod=endDate.month()-startDate.month();
       			}else{
       				this.form.info.probationPeriod=endDate.month()-startDate.month()+12*(endDate.year()-startDate.year())
       			}
       		}else{
				if(startDate.isBefore(endDate)){
					var i=1;
					while(moment(start).add(i,"day").isSameOrBefore(endDate)){
						i++;
					}
				}else{
					var i=-1;
					while(moment(start).add(i,"day").isSameOrAfter(endDate)){
						i--;
					}
				}
				this.form.info.probationPeriod=Math.round((i/30)*10)/10;
       		}
       	},
    	//身份证输入完毕根据身份证获取生日性别
    	idCardBlur:function(){
    		if(!this.form.info.idNum){
    			return
    		}
    		var card=Util.trim(this.form.info.idNum);
    		var reg=/(^\d{15}$)|(^\d{17}(\d|x)$)/i;
    		if(reg.test(card)){
    			if(card.length==15){
    				this.form.info.sex=card.substring(14,15)%2==0?2:1;
    				this.form.info.dateOfBirth="19"+card.substring(6,8)+"-"+card.substring(8,10)+"-"+card.substring(10,12);
    			}else{
    				this.form.info.sex=card.substring(16,17)%2==0?2:1;
    				this.form.info.dateOfBirth=card.substring(6,10)+"-"+card.substring(10,12)+"-"+card.substring(12,14);
    			}
    		}
    		
    	},
    	getAccinfoId:function(){
    		var vm=this;
    		if(!vm.form.salary.householdCode||!vm.form.salary.cityCode||!vm.form.salary.paymentUnit){
    			return;
    		}
    		var param={};
    		param.householdCode=vm.form.salary.householdCode;
		 	param.cityCode=vm.form.salary.cityCode;
		  	param.paymentUnit=vm.form.salary.paymentUnit;
		  	vm.$http.get(vm.api.getAccinfoId,{params:param})
    		.then((response)=>{
				let data=response.data;
				if (data.code == '200') {
                    vm.form.salary.accinfoId= data.data?data.data.id:"";
                    vm.form.salary.accinfoName=data.data?data.data.name:""
                } 
			})
    	}
    }
}
</script>

<style>
	.addEmployee .tabs{height: 100%;overflow-y: auto;width: 75px;}
	.addEmployee *{box-sizing: border-box;}
	.addEmployee .el-input,.addEmployee .el-date-editor{width:175px}
	.addEmployee .w130 .el-input{width:130px}
	.addEmployee .el-dialog__header{text-align:center;}
	.addEmployee{display: inline-block;}
	.post-rel{position: relative;}
	.addEmployee .allwrap{height:calc(100% - 100px)}
	.addEmployee .tabs{
		padding: 0;
		margin-right:20px;
		list-style: none;
	}
	.addEmployee .tabs li{line-height: 18px;overflow:hidden;white-space:normal; text-align:center;width:50px;height:50px;display: flex;align-items: center;border-radius: 5px;overflow: hidden;border: 1px solid #ccc;padding: 5px;margin-bottom:10px;cursor: pointer;}
	.addEmployee .tabs li.active{background-color: #00A58D;color: #fff;border-color: #00A58D;}
	.addEmployee .content{position: absolute;top: 0px;right: 0;left: 90px;text-align: left;max-height: 100%;overflow-y: auto;}
	.addEmployee .el-dialog__headerbtn{background-color: transparent;
	    border: none;
	}
	.addEmployee  .el-dialog__body{height: 100%;}
	.addEmployee .btn-container{display: none;}
	.item-block {
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: flex;
	}
	.item-block>.el-form-item{flex: 1;}
	.addEmployee .el-dialog.is-fullscreen{overflow: hidden;}
	.resume-block-title {
	    font-size: 16px;
	    font-weight: 500;
	    padding-bottom: 15px;
	    margin-bottom: 20px;
	    border-bottom: 1px solid #ddd;
	}
	.item-block.item-add{padding-top: 20px;border-top: 1px solid #ddd;}
	.addEmployee .el-col{height: 51px;max-height: 51px;}
</style>