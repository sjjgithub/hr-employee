<template>
<span class="conytact-setting">
	<el-button :size="size" :type="add?'primary':'text'" @click="open">{{add?'新建合同':'编辑'}}</el-button>
	<el-dialog :center="true" :modal-append-to-body="false"  :visible.sync="show" :title="(add?'新建':'编辑')+'合同'" :close-on-click-modal="false" @open="resert('form')">
		<el-form ref='form' size="small" :rules="rules" :model="form" label-width="115px" label-position="right">
			<el-form-item prop="newtreatytype" label="新签合同方式"  required>
				<el-radio-group v-model="form.newtreatytype" size="small">
					<el-radio-button label="1">新增合同</el-radio-button>
					<el-radio-button label="2">续签合同</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-row>
				<el-col :span="12">
					<el-form-item prop="treatyid" label="合同编号"  required>
						<el-input v-model="form.treatyid" placeholder="请输入合同编号" disabled></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="treatytype" label="合同类型"  required>
						<el-select v-model="form.treatytype" size="small">
							<el-option label="固定期" value="1"></el-option>
							<el-option label="无固定期" value="2"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="treatydate" label="合同签订日">
						<el-date-picker
						    v-model="form.treatydate"
						    type="date"
						    size="small"
						    clearable
						    placeholder="请选择">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<template v-if="form.treatytype!=2">
				<el-col :span="12">
					<el-form-item prop="treatybegin" label="合同起始日" >
						<el-date-picker
						    v-model="form.treatybegin"
						    type="date"
						    size="small"
						    clearable
						    placeholder="请选择">
						</el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="treatylast" label="合同期限(年)"  >
						<el-input v-model="form.treatylast" size="small" placeholder="请输入合同期限"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item prop="treatyend" label="合同结束日"  >
						<el-date-picker
						    v-model="form.treatyend"
						    type="date"
						    size="small"
						    clearable
						    placeholder="请选择">
						</el-date-picker>
					</el-form-item>
				</el-col>
				</template>
			</el-row>	
			<el-form-item prop="remark" label="备注" >
				<el-input v-model="form.remark" type="textarea" size="small" placeholder="请输入备注内容"></el-input>
			</el-form-item>
			<el-form-item prop="files" label="合同附件" >
				<el-upload
				  list-type="picture"
				  accept="image/jpg,image/png"
				  ref="upload"
				  multiple
				  :on-preview="openFile"
				  :on-remove="removeFile"
				  :action="api.upFile"
				  :on-change="upFile"
				  :before-upload="upBefore"
				  :on-error="upError"
				  :file-list="form.files">
				  <el-button size="small" type="primary" icon="upload2">上传附件</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
				</el-upload>
			</el-form-item>
		</el-form>
		<div style="text-align: center;">
			<el-button type="primary" @click="save('form')" :loading="loading.save">保存</el-button>
			<el-button @click="show=false">取消</el-button>
		</div>
	</el-dialog>
</span>
</template>

<script>
import {ctrlhr} from '@/config/env'	
import moment from 'moment'
export default{
	props:{
		add:{
			type:Boolean,
			default:true,
		},
		size:{
			type:String,
			default:'small',
		},
		id:{},
		employeeCode:{},
	},
	data:function(){
		return {
			show:false,
			loading:{
				save:false
			},
			form:{
				treatyid:'',//合同编号
				newtreatytype:'1',//合同新建类型
				treatytype:'',//合同类型
				treatydate:'',//合同签订日
				treatybegin:'',//合同开始日
				treatylast:'',//合同年限
				treatyend:'',//合同结束日
				remark:'',//合同备注
				files:[],//附件
			},
			rules:{
				treatyid:[{required:true,message:'请输入合同编号'}
				],
				treatytype:[
					{required:true,message:'请选择合同类型'}
				],
				treatydate:[
					{required:true,message:'请选择合同签订日',type:'date',trigger:'change'}
				],
				treatylast:[
					{required:true,message:'请选择合同期限'},
					{pattern:/^[1-9]\d*$/,message:'年限只能输入正整数'}
				],
				treatybegin:[
					{required:true,message:'请选择合同起始日'}
				],
				treatyend:[
					{required:true,message:'请选择合同结束日'}
				]
			},
			api: {
				save:ctrlhr+"/api/contract/save",//根据id获取合同信息
				update:ctrlhr+"/api/contract/update",//编辑
				detail:ctrlhr+"/api/contract/getInfo",//获取详情
				upFile:ctrlhr+"/api/contract/upload",//上传
			},
		}
	},
	watch:{
		'form.treatytype':function(val){
			if(val==1){
				this.rules.treatybegin=[{required:true,message:'请选择合同起始日'}];
				this.rules.treatylast=[{required:true,message:'请选择合同期限'},
									  {pattern:/^[1-9]\d*$/,message:'年限只能输入正整数'}];
				this.rules.treatyend=[{required:true,message:'请选择合同结束日'}];
			}else{
				delete this.rules.treatybegin;
				delete this.rules.treatyend;
				delete this.rules.treatylast;
				this.form.treatyend='';
				this.form.treatybegin='';
				this.form.treatylast='';
			}
		},
		'form.treatybegin':function(val){
			if(this.form.treatylast){
				if(val){
					if(moment(this.form.treatybegin).add(-1,"day").format('MM-DD')!=moment(this.form.treatyend).format('MM-DD')){
						this.form.treatyend=moment(val).add(this.form.treatylast,'y').add(-1,"day");
					}
				}else{
					this.form.treatyend='';
				}
			}
		},
		'form.treatylast':function(val){
			if(val){
				if(moment(this.form.treatybegin).add(-1,"day").format('MM-DD')!=moment(this.form.treatyend).format('MM-DD')){
					if(this.form.treatybegin){
						this.form.treatyend=moment(this.form.treatybegin).add(val,'y').add(-1,'day');
					}
					if(this.form.treatyend){
						this.form.treatybegin=moment(this.form.treatyend).add(val*-1,'y').add(1,'day');
					}
				}
			}else{
				if(this.form.treatybegin&&this.form.treatyend){
					this.form.treatyend='';
				}
			}
		},
		'form.treatyend':function(val){
			if(this.form.treatylast){
				if(val){
					if(moment(this.form.treatybegin).add(-1,"day").format('MM-DD')!=moment(this.form.treatyend).format('MM-DD')){
						this.form.treatybegin=moment(val).add(this.form.treatylast*-1,'y').add(1,'day');
					}
				}else{
					this.form.treatybegin="";
				}
			}
		},
	},
	created(){
		this.form.treatyid=this.employeeCode;
	},
	mounted:function (){
		
    },
    methods: {
    	open:function(){
    		if(this.employeeCode){
    			if(!this.add){
    				this.getInfo();
    			}
    			this.show=true;
    		}else{
    			this.$message.error({
    				message:'请先确定员工编号才能新增合同',
    				duration:20000,
					showClose:true,
    			})
    		}
    	},
    	getInfo:function(){
    		var vm=this;
    		this.$http.get(vm.api.detail,{params:{id:this.id}})
    		.then((response)=>{
				let data=response.data;
    			if (data.code == '200') {
                  	vm.form=data.data;
                  	vm.form.treatydate=vm.form.treatydate?new Date(vm.form.treatydate):'';
					vm.form.treatybegin=vm.form.treatybegin?new Date(vm.form.treatybegin):'';
					vm.form.treatyend=vm.form.treatyend?new Date(vm.form.treatyend):'';
					if(vm.form.path){
						let urls=vm.form.path.split(',');
    					let files=urls.map(function(url){
    						var ind=url.lastIndexOf("/");
    						var name=url.substring(ind+1)
    						return {name:name,url:url}
    					})
    					vm.form.files=files;
					}else{
						vm.form.files=[]
					}
                } 
    		})
    	},
    	save:function(formName){
    		var vm=this;
    		this.$refs[formName].validate(function(valid){
    			if(valid){
    				var param={
    						treatyid:vm.form.treatyid,
							newtreatytype:vm.form.newtreatytype,
							treatytype:vm.form.treatytype,
							remark:vm.form.remark,
							employeecode:vm.employeeCode,
							treatydate:moment(vm.form.treatydate).format('x')
					};
    				if(vm.form.treatytype==1){
        					param.treatybegin=moment(vm.form.treatybegin).format('x');
        					param.treatyend=moment(vm.form.treatyend).format('x');
        					param.treatylast=vm.form.treatylast;
    				}
    				if(vm.form.files.length){
    					param.filePaths=vm.form.files.reduce(function(sum,file){
	        				return sum+','+((file.response&&file.status=='success')?file.response.data[0].filePath:file.url);
	        			},'').substring(1);
    				}
    				if(vm.add){
    					var url=vm.api.save;
    				}else{
    					param.id=vm.id;
    					var url=vm.api.update;
    				}
    				vm.loading.save=true;
    				vm.$http.get(url,{params:param})
    				.then((response)=>{
    					let data=response.data;
    					vm.loading.save=false;
		                if (data.code == '200') {
		                	vm.$message.success((vm.add?'新建':'编辑')+'合同成功');
		                	vm.$emit("update");
		                	vm.show=false;
		                }else{
		                	vm.$message.error({
		                		message:data.msg,
		                		duration:20000,
								showClose:true,
		                	});
		                }
    				}).catch(()=>{vm.loading.save=false})
    			}
    		})
    	},
    	resert:function(formName){
        	if(this.$refs[formName]){
	        	this.$refs[formName].resetFields();
        	}
    	},
    	upFile:function(file,fileList){
    		this.form.files=fileList;
    	},
    	upBefore:function(file){
    		var vm=this;
    		var upFileNames=[];
    		var noIt=true;
    		this.form.files.forEach(function(it){
    			if(it.status=='success'&&file.name==it.name){
    				vm.$message.error("文件不能重复上传");
    				noIt=false;
    				return
    			}
    		})
    		if(!noIt)return noIt
    		if(["image/jpg","image/png"].indexOf(file.type)<0){
    			this.$message.error("只能上传jpg/png文件");
				return false;
    		}
    		if(file.size>5120000){
				this.$message.error(file.name+"文件大于5M已取消其上传");
				return false;
			}
    	},
    	upError:function(err,file,fileList){
    		this.$message.error(file.name+"上传失败");
    	},
    	removeFile:function(file,fileList){
    		this.form.files=fileList;
    	},
    	openFile:function(file){
    		var url=""; 
        	if(file.response){
        		url=file.response.data[0].filePath;
        	}else{
        		url=file.url;
        	}
    		window.open(url);
    	},
    }
}
</script>

<style>
.conytact-setting .el-dialog{min-width:755px}
.conytact-setting .el-input{width: 210px;}
</style>