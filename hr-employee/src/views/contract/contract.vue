<template>
<div class="contract">
	<!--顶部搜索组件-->
	<page-top style="margin-bottom: 1rem;padding-top:0" page-title="合同信息" page-description="在这里您可以合同进行管理"></page-top>
	<div style="margin-bottom:20px">
		<el-button size="small" :loading="loading.delete" @click="del()">删除</el-button>
		<div class="fr">
			<el-input @keyup.enter.native="search"  v-model="kw"  size="small" placeholder="输入检索内容">
				<i
			    class="el-icon-search el-input__icon"
			    slot="suffix"
			    @click="search">
				</i>
			</el-input>
			<contract-setting  @update="getList" :add="true" size="small" :employee-code="employeeCode"></contract-setting>
		</div>
	</div>
	<el-table :data="conytact.list" stripe :loading="loading.search" 
		@selection-change="function(list){selects=list}">
		<el-table-column label="全选" type="selection">
		</el-table-column>
		<el-table-column  label="合同编号" align="center" prop="treatyid" show-overflow-tooltip>
		</el-table-column>
		<el-table-column  label="合同类型" align="center" prop="treatytype" show-overflow-tooltip>
			<template slot-scope="scope">
				{{scope.row.treatytype==1?'新签和同':'续签合同'}}
			</template>
		</el-table-column>
		<el-table-column  label="合同签订日" align="center" prop="treatydate" show-overflow-tooltip>
			<template slot-scope="scope">
				{{scope.row.treatydate?moment(scope.row.treatydate).format('YYYY-MM-DD'):'-'}}
			</template>
		</el-table-column>
		<el-table-column  label="合同起始日" align="center" prop="treatybegin" show-overflow-tooltip>
			<template slot-scope="scope">
				{{scope.row.treatybegin?moment(scope.row.treatybegin).format('YYYY-MM-DD'):'-'}}
			</template>
		</el-table-column>
		<el-table-column  label="合同年限" align="center" prop="treatylast" show-overflow-tooltip>
			<template slot-scope="scope">
				{{scope.row.treatylast||'-'}}
			</template>
		</el-table-column>
		<el-table-column  label="合同终止日" align="center" prop="treatylast" show-overflow-tooltip>
			<template slot-scope="scope">
				{{scope.row.treatyend?moment(scope.row.treatyend).format('YYYY-MM-DD'):'-'}}
			</template>
		</el-table-column>
		<el-table-column  label="操作" align="center" prop="treatyend" show-overflow-tooltip>
			<template slot-scope="scope">
				<contract-setting  :add="false" size="small" @update="getList" :employeeCode="employeeCode" :id="scope.row.id"></contract-setting>
				<el-button size="mini" type="text" @click="del(scope.row.id)">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
</div>	
</template>

<script>
import {ctrlhr} from '@/config/env'
import pageTop from '@/components/page-top'
import moment from 'moment'
import contractSetting  from '~/contract/contractSetting'
export default{
	components: {
			pageTop,contractSetting
		},
	props:{
		employeeCode:{}
	},
	data:function(){
		return {
			moment:moment,
			kw:'',//模糊查询
			pagination:{
				page:1,
				pageSize:10,
				sizes:[10,20,30]
			},
			loading:{
				delete:false,
				search:false
			},
			conytact:{
				list:[],
				totalCount:1
			},
			selects:[],
			api: {
				list:ctrlhr+"/api/contract/list",//获取合同列表
				del:ctrlhr+"/api/contract/delete",//删除
			},
		}
	},
	computed:{
		
	},
	mounted:function (){
		this.getList();
    },
    methods: {
    	search:function(){
    		this.pagination.page=1;
    		this.getList();
    	},
    	getList:function(){
    		if(!this.employeeCode){
    			return
    		}
    		var param={
    			//keyword:this.kw,
    			pageSize:9999,
    			employeeCode:this.employeeCode
    		}
    		var vm=this;
    		vm.loading.search=true;
    		this.$http.get(vm.api.list,{params:param})
    		.then((response)=>{
    			let data=response.data;
    			vm.loading.search=false;
                if (data.code == '200') {
                   vm.conytact = data.data;
                } 
    		}).catch(()=>{
    			vm.loading.search=false;
    			
    		})
    	},
    	del:function(ids){
    		var vm=this;
    		if(!ids){
    			ids=this.selects.reduce(function(sum,item){
    				return sum+','+item.id
    			},'').substring(1);
    		}
    		vm.loading.delete=true;
    		this.$http.get(vm.api.del,{params:{ids:ids}})
    		.then((response)=>{
    			let data=response.data;
    			vm.loading.delete=false;
                if (data.code == '200') {
                	vm.$message.success('合同删除成功');
                	vm.getList();
                }else{
                	vm.$message.error({
                		message:data.msg||'未知错误，稍后重试',
                		duration:20000,
						showClose:true,
                	});
                }
    		}).catch(()=>{vm.loading.delete=false;})
    	}
    }
}
</script>

<style>
	.fr{float: right;}
    .contract{width:100%;padding:0 20px}
	.contract *{box-sizing: border-box;}
	.contract .el-input,.contract .el-date-editor{width:175px}
	.contract .w130 .el-input{width:130px}
	.contract .el-dialog__header{text-align:center;}
	.contract{display: inline-block;}
	.post-rel{position: relative;}
	.contract .allwrap{height: 520px;}
	.contract .tabs{
		padding: 0;
		margin-right:20px;
		list-style: none;
	}
	.contract .tabs li{line-height: 18px;overflow:hidden;white-space:normal; text-align:center;width:50px;height:50px;display: flex;align-items: center;border-radius: 5px;overflow: hidden;border: 1px solid #ccc;padding: 5px;margin-bottom:10px;cursor: pointer;}
	.contract .tabs li.active{background-color: #00A58D;color: #fff;border-color: #00A58D;}
	.content{position: absolute;top: 0px;right: 0;left: 65px;text-align: left;}
	.el-dialog__headerbtn{background-color: transparent;
	    border: none;
	}
</style>