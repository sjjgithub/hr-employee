<template>
	<ctrl-layout :is-first="firstOpen">
		<div slot="layout-header" class="content-header">
			<page-top page-title="员工管理" page-description="这里可以对员工进行操作">
				<create-employee :add="true" @update="getStaffList"></create-employee>
			</page-top>
		</div>
		<div slot="query">
			<!--头部帅选-->
			<el-form :model="param" inline label-position="left" label-width="70px" class="checkParam selForm" ref="paramForm">
				<el-row>
					<el-col :span="8">
						<el-form-item prop="deptIds" label="选择部门" >
							<hr-dept v-model="param.deptIds"></hr-dept>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="jobId" label="选择职位" >
							<hr-position size="mini" v-model="param.jobId" :related-dept="param.deptIds" :multiple="true"></hr-position>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="keyword" label="筛选员工" >
						  	<el-input v-model="param.keyword" size="mini" placeholder="请输入职员姓名或代码"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-row>
					<el-col :span="8">
						<el-form-item label="入司时间" >
						  		<el-form-item prop="entryDateFrom">
						  			<el-date-picker type="date" placeholder="开始日期"
										v-model="param.entryDateFrom" size="mini">
						  			</el-date-picker>
						  		</el-form-item>
						  		-
						  		<el-form-item prop="entryDateTo">
						  			<el-date-picker type="date" placeholder="结束日期"
										v-model="param.entryDateTo" size="mini">
						  			</el-date-picker>
						  		</el-form-item>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="转正时间" >
						  		<el-form-item prop="formalDateFrom">
						  			<el-date-picker type="date" placeholder="开始日期"
										v-model="param.formalDateFrom" size="mini">
						  			</el-date-picker>
						  		</el-form-item>
						  	-
						  		<el-form-item prop="formalDateTo">
						  			<el-date-picker type="date" placeholder="结束日期"
										v-model="param.formalDateTo" size="mini">
						  			</el-date-picker>
						  		</el-form-item>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="离职时间" >
						  		<el-form-item prop="quitDateFrom">
						  			<el-date-picker type="date" placeholder="开始日期"
										v-model="param.quitDateFrom" size="mini">
						  			</el-date-picker>
						  		</el-form-item>
						  		-
						  		<el-form-item prop="quitDateTo">
						  			<el-date-picker type="date" placeholder="结束日期"
										v-model="param.quitDateTo" size="mini">
						  			</el-date-picker>
						  		</el-form-item>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8" >
						<el-form-item prop="jobStates" label="在职状态" >
							<el-checkbox-group v-model="param.jobStates" :min="1"> 
								<el-checkbox :label="state.id" v-for="state in states" :key="state.id">{{state.state}}</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item prop="gatherMsgStates" label="采集状态" >
							<el-checkbox-group v-model="param.gatherMsgStates" :min="1"> 
								<el-checkbox :label="atherMsgData.type" v-for="(atherMsgData,index) in gatherMsgList" :key="index">{{atherMsgData.state}}</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item  class="text-center submit">
							<el-button type="primary" size="mini"  class="el-button "
									@click="getStaffList(1)" :loading="searchLoading"> 检索 
							</el-button>
							<el-button type="button" size="mini" class="el-button"
									@click="$refs.paramForm.resetFields()"> <span>重置</span> 
							</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<template slot="content-header">
			<!--列表操作按钮-->
			<el-button type="primary" class="iconfont icon-leave"
				size="mini" 
				@click.stop="showViewMemberToggle"> 离职</el-button>
			<el-button type="primary" class="iconfont icon-export"
				size="mini"
				@click.stop="exportEmployee"> 导出</el-button>
		</template>
		<!--员工信息列表-->
		<el-table :data="employeeList.list" stripe v-loading="isloading"
			@selection-change="selsChange">
			<el-table-column 
			label="全选" type="selection">
			</el-table-column>
			<el-table-column  label="姓名" align="center" prop="name" show-overflow-tooltip>
			</el-table-column>
			<el-table-column
				label="职员代码" align="center" prop="code" show-overflow-tooltip></el-table-column>
			<el-table-column label="部门名称" align="center" prop="deptName" show-overflow-tooltip></el-table-column>
			<el-table-column
				label="职位" align="center" prop="jobName" show-overflow-tooltip>
			</el-table-column> 
			<el-table-column
				label="岗位" align="center" prop="jobOrgName" show-overflow-tooltip>
			</el-table-column>
			<el-table-column
				label="在职状态" align="center" prop="jobStateName" show-overflow-tooltip></el-table-column>
			<el-table-column label="入司时间" align="center" prop="entryDate" show-overflow-tooltip></el-table-column>
			<el-table-column label="转正时间" align="center" prop="formalDate" show-overflow-tooltip></el-table-column>
			<el-table-column label="离职时间" align="center" prop="quitDate" show-overflow-tooltip></el-table-column>
			<el-table-column colspan="2" align="center" label="操作" width="150px" show-overflow-tooltip>
				<template slot-scope="scope">
					<create-employee :add="false" type="text" text="编辑" @update="getStaffList" :code="scope.row.code" :id="scope.row.id"></create-employee>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination" slot="page" v-if="employeeList.totalCount > 0">
			<el-pagination layout="total,sizes,prev,pager,next,jumper" :current-page="page"
				:page-size="pageSize" @current-change="handleSizeChange"
				:total="employeeList.totalCount"
				@size-change="sizeChange"
				:page-sizes="[10,20,30]">
			</el-pagination>
		</div>
		<!--员工离职-->
		<el-dialog :visible.sync="showViewMember" :close-on-click-modal="false" size="tiny" title="离职" :before-close="showViewMemberCut">
			<div class="viewMember">
				<el-form label-position="right" label-width="80px" onsubmit="return false">
					<el-form-item label="员工代码">
						<el-input placeholder="支持多选,请用英文逗号分隔" icon="search" v-model="memberIds" @keydown.enter.native="getByCodes" :on-icon-click.prevent="getByCodes"></el-input>
					</el-form-item>
				</el-form>
				<div class="viewMemberBd" style="margin-bottom: 20px;">
					<el-table ref="etMember" :data="viewMemberData" stripe 
						v-loading="viewMemberLoading" empty-text="查询的员工不存在或已离职" height="200"> <el-table-column
						prop="name" label="姓名"></el-table-column> <el-table-column
						prop="code" align="center" label="职员代码"></el-table-column> <el-table-column
						prop="deptName" align="center" label="部门"></el-table-column> <el-table-column
						prop="jobName" align="center" label="职位"></el-table-column> 
					</el-table>
				</div>
				<el-form label-position="right" label-width="80px">
					<el-form-item label="离职日期">
						<el-date-picker class="quit-date-date" type="date"
							placeholder="请选择离职日期" v-model="quitDate"
							:picker-options="pickOptions">
						</el-date-picker>
					</el-form-item>
				</el-form>
				<el-row type="flex" class="row-bg" justify="center"> <el-col
					:span="12" :offset="10"> <el-button type="primary"
					@click.stop="confirmQuit" :loading="listLoading">确定</el-button></el-col> <el-col :span="12">
				<el-button @click="showViewMemberCut">取消</el-button></el-col>
				</el-row>
			</div>
		</el-dialog>
	</ctrl-layout>
</template>

<script>
import createEmployee  from '~/create-employee'
import CtrlLayout from '@/components/layout'
import hrDept  from '@/components/hr-dept'
import hrPosition  from '@/components/hr-position'
import pageTop from '@/components/page-top'
import {employeeState} from '@/config/globalStaict.js'
import {ctrlhr} from '@/config/env'
export default{
	components: {
		createEmployee,pageTop,CtrlLayout,hrDept,hrPosition
	},
	data(){
		return {
			firstOpen:true,
			listLoading :false,
			employeeList: [],
			dialogVisible: false,
			page:1,
			pageSize:10,
			popShow:false,
			isloading:false,
			states:employeeState,
			message:{},
			hadFinger:true,
			hadFace:true,
			viewMemberData: [],
			viewMemberLoading: false,
			showViewMember: false,
			searchLoading:false,
			memberIds:'',
			quitDate:"",
			editMember:false,
			selDepts:"",
			gatherMsgList:[
				{
					state:"未采集",
					type:1
				},
				{
					state:"部分采集",
					type:2
				},
				{
					state:"已采集",
					type:3
				}
			],
			employeeFormRules:{
				name:[
					{required: true,message:'请输入员工姓名',trigger: 'blur'}
				],
				code: [
					{required: true,message:'请输入员工代码',trigger: 'blur'}
				]
			},
			selJobState:1,
			deptSel:false,
			salarys:[],
			perfs:[],
			deptsPlus:[],
			userMsg:{},
			sels:"",
			httpUrl: {
				listUrl: ctrlhr+"/api/employee/list",//列表
				dimission:ctrlhr+"/api/employee/dimission",//离职
				exportEmployee:ctrlhr+"/api/employee/export",//导出
				getByCodes:ctrlhr+"/api/employee/staff",//获取员工离职权限
			},
			param:{
				keyword:"",
				deptIds:[],
				jobId:[],
				jobStates:[1,2,3],
				gatherMsgStates:[1,2,3],
				entryDateFrom:"",
				entryDateTo:"",
				formalDateFrom:"",
				formalDateTo:"",
				quitDateFrom:"",
				quitDateTo:""
			},
			leftList: [
				{
					"id":1,
					"text": "员工信息",
					"link":"${ctx}/route/employee/employeeList;"
				}
			],
			searchTxt:"",
			departmentData:[],
			pickOptions:{
				disabledDate:function(time){
					var date=new Date();
					date.setDate(1)
					return time.getTime()< date.getTime() - 8.64e7;
				}
			}
		}
	},
	methods: {
		//获取员工列表
		getStaffList: function(page){
			var vm = this;
			if(vm.firstOpen)vm.firstOpen=false;
			var param={};
			if(page)vm.page=page;
			vm.searchLoading=true;
			param.entryDateFrom=vm.dateToTimestamp(vm.param.entryDateFrom);
			param.entryDateTo = vm.dateToTimestamp(vm.param.entryDateTo);
			param.formalDateFrom = vm.dateToTimestamp(vm.param.formalDateFrom);
			param.formalDateTo = vm.dateToTimestamp(vm.param.formalDateTo);
			param.quitDateFrom = vm.dateToTimestamp(vm.param.quitDateFrom);
			param.quitDateTo = vm.dateToTimestamp(vm.param.quitDateTo);		
			param.jobStates=vm.param.jobStates.join(',');
			param.gatherMsgStates= vm.param.gatherMsgStates.join(',');
			param.deptIds = vm.param.deptIds.join(",");
			param.jobIds=vm.param.jobId.join(",");
			param.pageSize=vm.pageSize;
			param.page=vm.page;
			param.keyword=vm.param.keyword;
			vm.isloading = true;
			vm.$http.get(vm.httpUrl.listUrl +"?"+Util.parseForm(param))
			.then(function(response) {
				let responseData=response.data;
				vm.searchLoading=false;
				vm.isloading = false;
				vm.employeeList = responseData.data;
				for(var i=0; i<vm.employeeList.list.length; i++){
					var employee = vm.employeeList.list[i];
					if(employee.entryDate != null){
						employee.entryDate = new Date(employee.entryDate).format('yyyy-MM-dd');
					}

					if(employee.formalDate != null){
						employee.formalDate = new Date(employee.formalDate).format('yyyy-MM-dd');
					}

					if(employee.quitDate != null){
						employee.quitDate = new Date(employee.quitDate).format('yyyy-MM-dd');
					}
					
					for(var j = 0;j<employeeState.length;j++){
						if(employee.jobState == employeeState[j].id){
							vm.$set(employee, "jobStateName", employeeState[j].state);
							vm.$set(employee, "jobStateId", employeeState[j].id);
						}
					}
				}
			})
		},
		dateToTimestamp:function(date){
			if(date){
				return date.getTime();
			}
			else{
				return null;
			}
		},
		showViewMemberCut:function(){
			this.memberIds =this.sels;;
			this.viewMemberData=[];
			this.quitDate="";
			this.showViewMember = false;
		},
		selsChange: function(sels) {
			var temp = [];
			sels.forEach(function(sel){
				temp.push(sel.code);
			});
			this.sels = temp.join(",");
			this.memberIds=temp.join(",");
		},
		//分页方法
		handleSizeChange:function(val){
			this.page = val;
			this.getStaffList();
		},
		sizeChange:function(val){
			this.pageSize=val;
			this.getStaffList();
		},
		// 员工弹出框toggle
		showViewMemberToggle:function() {
			var vm = this;
			vm.getByCodes();
		},
		// 确定离职时间
		getByCodes: function() {
			var vm = this;
			if(vm.memberIds==""){
				vm.showViewMember = true;
				return false
			}
			vm.$http.get(vm.httpUrl.getByCodes+"?codes="+vm.memberIds).then(function(response) {
				let responseData=response.data;
				vm.viewMemberData = responseData.data;
				if(vm.viewMemberData.length > 0&&vm.viewMemberData.length==vm.memberIds.split(",").length){
					vm.showViewMember = true;
				}else{
					vm.$message({
						message:'您选择的用户不存在或已离职!',
						duration:20000,
						showClose:true,
					})
				}
			})
			return false;
		},
		// 确定离职
		confirmQuit: function() {
			var vm = this;
			//var codes = vm.sels.map(item => item.code).toString();
			var quitDate = null;
			if(vm.quitDate){
				quitDate = Date.parse(new Date(vm.quitDate))
			}
			if(vm.viewMemberData.length == 0){
				vm.$message({
					message:'数据不能为空!',
					duration:20000,
					showClose:true,
				});
			}else if(quitDate == null){
				vm.$message({
					message:'请设置离职时间!',
					duration:20000,
					showClose:true,
				});
			}else{
				vm.$confirm('确认设置批量离职吗','提示',{
					type: 'info'
				}).then(function(){
					vm.listLoading = true;
					var para = {codes:vm.memberIds,quitDate:quitDate};
					vm.$http.post(vm.httpUrl.dimission,JSON.stringify(para))
					.then(function(response) {
						let responseData=response.data;
						if(responseData.code == '200') {
							vm.$message.success('批量设置成功！');
							vm.listLoading = false;
							vm.showViewMemberCut();
							vm.getStaffList();
						} else {
							vm.$message.error({
								message:responseData.msg,
								duration:20000,
								showClose:true,
							});
						}
					})
				});
			}
		},
		//导出
		exportEmployee:function(){
			var vm = this;
			var param={};
			param.entryDateFrom=vm.dateToTimestamp(vm.param.entryDateFrom);
			param.entryDateTo = vm.dateToTimestamp(vm.param.entryDateTo);
			param.formalDateFrom = vm.dateToTimestamp(vm.param.formalDateFrom);
			param.formalDateTo = vm.dateToTimestamp(vm.param.formalDateTo);
			param.quitDateFrom = vm.dateToTimestamp(vm.param.quitDateFrom);
			param.quitDateTo = vm.dateToTimestamp(vm.param.quitDateTo);		
			param.jobStates=vm.param.jobStates.join(',');
			param.gatherMsgStates= vm.param.gatherMsgStates.join(',');
			param.deptIds = vm.param.deptIds.join(",");
			param.jobIds=vm.param.jobId.join(",");
			param.keyword=vm.param.keyword;
			window.open(vm.httpUrl.exportEmployee+"?"+Util.parseForm(param));
		}
	},
}
</script>

<style>
	.checkParam .el-checkbox-group{display: inline-block;}
	.selForm .el-form-item{margin-bottom: 0;}
	.dateChoice .el-input{width: 180px;}
	.selForm .el-date-editor.el-input{width: 120px;}
	.el-dialog--tiny .el-date-editor.el-input{width: 150px;}
	.el-dialog__header{text-align: center;}
</style>