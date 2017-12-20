<template>
<el-select 
	:disabled="disabled"
	v-if="multiple"
	filterable  
	remote
	:placeholder="placeholder"
	v-model="positionIds"
	:size="size"
	:clearable="clearable"
	multiple
	:remote-method="delaySearch"
	:loading="loading">
	<el-option
      v-for="item in positionList"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
</el-select>
<el-select 
	filterable 
	remote
	:remote-method="delaySearch"
	:disabled="disabled"
	v-else
	:placeholder="placeholder"
	v-model="positionIds"
	:size="size"
	:clearable="clearable">
	<el-option
      v-for="item in positionList"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
</el-select>
</template>

<script>
import {ctrlhr} from '@/config/env'
export default{
	props:{
        value:{
        },
        multiple:{
        	type:Boolean,
            default:false
        },
        filterOrg:{//是否筛选有编制的
        	type:Boolean,
            default:false,
        },
        relatedDept:{
        },
        placeholder:{
        	type:String,
            default:"请选择"
        },
        size:{
        	type:String,
        	default:'mini'
        },
        clearable:{
        	type:Boolean,
        	default:true
        },
         disabled:{
        	type:Boolean,
            default:false
        },
        showAll:{//不筛选没有人员的显示所有职位
        	type:Boolean,
            default:false,
        },
        notShow:{//单组使用没有限制条件展示全部
       	 	type:Boolean,
            default:false,
        }
    },
    data() {
        return {
        	loading:false,
        	positionIds:this.multiple?[]:"",
            positionList:[],
            all:[],
            init:[],
            timer:null,
        }
  	},
 	computed: {
    	deptIds(){
    		return this.relatedDept||[];
    	},
    	api(){
    		var url="";
    		if(this.showAll){
    			url="/api/job/dropDownList?";
    		}else if(this.filterOrg){
    			url="/api/job/simpleList?";
    		}else{
    			url="/api/jobList?";
    		}
    		return {list:ctrlhr+url};
    	}
   	},
 	mounted(){
 		this.positionIds=this.value;
 		this.getAll();
  	},
    watch:{
       deptIds(val){
       		this.search();
       		this.positionIds=this.multiple?[]:"";
       },
       positionIds(val){
       	this.$emit("input",val)
       },
       value(val){
       		this.positionIds=val;
       },
    },
    methods:{
    	delaySearch(val){
    		var vm = this;
    		if(vm.timer){
    			clearTimeout(vm.timer)
    		}        	 	
    	 	vm.timer = setTimeout(function(){
    	 		vm.search(val);
    	 	},500);
    	},
    	search(val){
    		this.positionList=[];
    		var dept=true;
    		if(isNaN(this.deptIds)){
    			if(!this.deptIds.length){
    				dept=false;
    			}
    		}
    		if(!this.notShow){
    			if(!dept&&!val){
	    			return
				}
    		}else{
    			if(!dept&&!val){
    				this.positionList=this.all;
	    			return
				}
    		}
			var vm=this;
			var param={};
			vm.loading=true;
			if(val&&!vm.filterOrg)param.keyword=val;
			param.deptIds=vm.deptIds;
			vm.$http.get(vm.api.list+Util.parseForm(param)).then(function(response){
				var list=[];
				if(response.data.code=="200"){
					var list=vm.showAll||vm.filterOrg?response.data.data:response.data.data.list;
					if(vm.init.length&&vm.multiple){
						vm.init.forEach(function(initItem,index){
							if(list.length){
								list.forEach(function(item){
									if(initItem.id==item.id){
										vm.init.splice(index,1);
									}
								})
							}
						})
					}
				}
				vm.positionList=vm.init.concat(list);
				vm.loading=false;
			})
      	},
      	getAll(){
      		var vm=this;
      		this.$http.get(vm.api.list).then(function(response){
      			if(response.data.code=="200"){
      				vm.all=vm.showAll?response.data.data:response.data.data.list;
      			}
      			vm.getInit();
			})
      	},
      	getInit(){
	      	if(this.multiple){
	      		var vm=this;
	      		var init=[];
	      		for(var i=0;i<this.positionIds.length;i++){
	      			if(this.all.length){
	      				this.all.forEach(function(item){
	      					if(item.id==vm.positionIds[i]){
	      						init.push(item);
	      					}
	      				})
	      			}
	      		}
	      		this.init=init;
	      	}
      		this.search();
      	},
    }
}
</script>

<style>
</style>