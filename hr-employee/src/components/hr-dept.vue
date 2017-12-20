<template>
<span class="dept">
		<span class="selVal">
			<el-tooltip :content="depts" placement="top" v-if="depts.length>13">
				<el-input :size="size"   :value="depts.length<13?depts:depts.substr(0,12)+'…'" :placeholder="placeholder" @focus="startSelect" class="deptInput" :disabled="disabled">
					<i
					    class="el-icon-menu el-input__icon"
					    slot="suffix"
					    @click="deleteAll">
					</i>
				</el-input>
			</el-tooltip>
			<el-input :size="size"  :value="depts.length<13?depts:depts.substr(0,12)+'…'" :placeholder="placeholder" @focus="startSelect" class="deptInput" v-else :disabled="disabled">
				<i
			    class="el-icon-menu el-input__icon"
			    slot="suffix"
			    @click="deleteAll">
				</i>
			</el-input>
		</span>
		<el-dialog ref="deptDialog"
		  class="deptDialog"
		  :class="{'multiple':multiple}"
		  title="部门选择"
		  v-show="deptShow"
		  :modal-append-to-body="false"
		  :visible.sync="deptShow"
		  :before-close="calcIt">
        	<el-row :gutter="20">
        		<el-col :span="multiple?12:24" class="clearfix">
	        		<el-card class="box-card left" :body-style="{ padding: 0}">
					  <div slot="header" class="clearfix">
					    <span style="line-height: 36px;">所有部门</span>
					    <el-input class="filter right"
				            placeholder="输入关键字进行检索"
				            v-model="filterText">
				        </el-input>
					  </div>
					   <el-tree style="text-align:left;font-size:14px;" ref="companyTree"
		                :data="list"
		                size="small"
		                :props="defaultProps"
		                node-key="id"
		                show-checkbox
		                check-strictly
		                :default-expanded-keys="opens"
		                @check-change="toogleIt"
		                :filter-node-method="filterNode"
		                :render-content="renderTree3">
		       		 	</el-tree>
					</el-card>
        		</el-col>
        		<el-col :span="12" v-if="multiple">
        			<el-card class="box-card right">
						<div slot="header" class="clearfix">
						    <span style="line-height: 36px;">已选部门</span>
						    <span class="right dis-inline">
						    	<el-input v-model="selectFilter" class="selectFilter" placeholder="请输入关键字检索"></el-input>
						    	<el-button type="primary"  @click="reserSelect">清空</el-button>
						    </span>
						</div>
						<el-row>
							<el-col :span="6" class="tex-center" :key="deptIt.id" v-for="deptIt in selects">
								<el-tag
						            v-if="deptIt.name.indexOf(selectFilter) > -1"
						            :key="deptIt.id"
						            :closable="true"
						            :close-transition="true"
						            @close="deleteIt(deptIt)"
						            :title="deptIt.name"
						            class="tex-center"
						            >{{deptIt.name}}
					            </el-tag>
							</el-col>
						</el-row>
					</el-card>
        		</el-col>
        	</el-row>	
        <div class="submit">
        	<el-button @click="sureIt" type="primary">确认</el-button>
        	<el-button @click="calcIt">取消</el-button>
        </div>
    </el-dialog>
</span>
</template>

<script>
import {ctrlhr} from '@/config/env'
console.log(ctrlhr)
export default{
	props:{ value:{},
			placeholder:{
				type:String,
				default:'请选择'
			},
			size:{
            	type:String,
            	default:'mini'
            },
         	multiple:{
            	type:Boolean,
                default:true
            },
            filterOrg:{
            	type:Boolean,
                default:false
            },
            disabled:{
            	type:Boolean,
                default:false
            }
	},
	data(){
		return {
			cheeckAll:true,
            filterText:"",
            selectFilter:"",
            deptShow:false,
            selects:[],
            list: [],
            defaultProps: {
                children: 'childDept',
                label: 'name',
                //disabled:'disabled',
            },
            api:ctrlhr+"/api/getDeptTree",
        }
	},
	created:function(){
		var component = this.$mount();
		document.querySelector('body').appendChild(component.$refs.deptDialog.$el)
	},
	computed:{
	    depts:function () {
	    	var items=[];
	    	var str="";
	    	if(this.selects.length){
	    		this.selects.forEach(function(dept){
	    			items.push(dept.name)
	    		})
	    	}
	        return items.join(",")
	    },
	    opens:function(){
	    	var openKeys=[];
	    	var vm=this;
	    	if(vm.list.length){
	    		vm.list.forEach(function(item){
	    			openKeys.push(item.id);
	    		})
	    		return openKeys;
	    	}
	    },
	},
	mounted:function (){
     	this.getDepts();
    },
    watch: {
        filterText:function(val) {
            this.$refs.companyTree.filter(val);
        },
        value:function(){
        	this.initSelects();
        },
    },
	methods: {
    	//获取部门列表
		getDepts:function(){
			var vm=this;
			vm.$http.get(vm.api).then(function(response){
				vm.list=response.data.code==200?response.data.data:[];
				vm.initSelects(true);
			})
		},
    	startSelect:function(){
    		var vm=this;
    		vm.deptShow=true;
    		vm.$nextTick(function(){
    			vm.initSelects();
    		})
    	},
    	initSelects:function(type){
    		var vm=this;
    		var data=[];
    		if(vm.list.length){
    			function eachList(lists,selects){
					lists.forEach(function(item){
            			if(selects.indexOf(item.id)>=0){
            				if(!type&&vm.$refs.companyTree){
            					vm.$refs.companyTree.setChecked(item,true)
            				}
            				data.push(item);
            			}else{
            				if(!type&&vm.$refs.companyTree){
            					vm.$refs.companyTree.setChecked(item,false)
            				}
            			}
	            		if(item[vm.defaultProps.children]&&item[vm.defaultProps.children].length){
	            			eachList(item[vm.defaultProps.children],selects);
	            		}
	            	})
    			}
    			var arr=[];
    			if(vm.multiple){
    			 	arr=vm.value;
    			}else if(vm.value){
    				arr.push(parseInt(vm.value));
    			}
    			if(arr.length){
    				eachList(vm.list,arr)
    			}else{
    				if(vm.$refs.companyTree){vm.$refs.companyTree.setCheckedKeys([])}
    			};
    		}
        	vm.selects=data;
        },
        renderTree3:function(h, _ref) {
		    var _this = this;
		    var node = _ref.node,
		        data = _ref.data,
		        store = _ref.store;
			if(_this.multiple){
			    return h(
			        "span",
			        { "class": "tree-table-row" },
			        [h(
			            "span",
			            null,
			            [data.name, data.check]
			        ), h(
			            "span",
			            { "class": "tree-table-cell", style: "text-align:center;margin-right:20px" },
			            [h(
			                "el-button",
			                {
			                    attrs: { size: "mini", type: "text" },
			                    on: {
			                        "click": function click() {
			                            return _this.addChildren(data);
			                        }
			                    }
			                },
			                ["\u6DFB\u52A0\u5B50\u90E8\u95E8"]
			            )]
			        )]
			    );
		 	}else{
		 		return h(
			        "span",
			        { "class": "tree-table-row" },
			        [h(
			            "span",
			            null,
			            [data.name, data.check]
			        ), 
			        h(
			            "span",
			            { "class": "tree-table-cell", style: "text-align:center;margin-right:20px" },
			            []
			        )]
			    );
		 	}
		},
        filterNode:function(selects, data) {
            if (!selects) return true;
            return data.name.indexOf(selects) !== -1;
        },
        deleteIt:function(tag){
        	this.$refs.companyTree.setChecked(tag,false);
        },
        toogleIt:function(data,check){
            if(!check){
            	var index=this.selects.indexOf(data);
            	if(index>=0){
            		this.selects.splice(index,1);
            	}
        	}else{
        		if(this.multiple){
        			 this.selects.push(data);
        		}else{
    				 this.$refs.companyTree.setCheckedKeys([data.id]);
        			 this.selects=[data];
        		}
        	}
        },
        addChildren:function(data){
        	var vm=this;
            if(data[vm.defaultProps.children] && data[vm.defaultProps.children].length){
                data[vm.defaultProps.children].forEach(function(childrenCompanies){
                    if(vm.selects.indexOf(childrenCompanies)<0){
                    	vm.$refs.companyTree.setChecked(childrenCompanies,true);
                 	}
                    if(childrenCompanies[vm.defaultProps.children]&&childrenCompanies[vm.defaultProps.children].length){
	                	vm.addChildren(childrenCompanies);
	                }
                })
            }
        },
        getSelectedIds:function(){
            let result = [];
            this.selects.forEach(function(c){
                result.push(c.id)
            })
            return result;
        },
        deleteAll:function(){
			this.$emit("input",[]);
		},
        reserSelect:function(){
        	this.$refs.companyTree.setCheckedKeys([]);
        },
        sureIt:function(){
        	var val;
            if(this.multiple){
           	 	val=this.getSelectedIds();
            }else{
            	val=this.getSelectedIds().join(",");
            }
            this.$emit("input",val);
            this.filterText="";
            this.selectFilter="";
            this.deptShow=false;
        },
        calcIt:function(){
        	this.filterText="";
            this.selectFilter="";
    		this.initSelects();
        	this.deptShow=false;
        }
	}	
}
</script>
<style type="text/css" scoped="scoped">
	.selVal .el-icon-menu.el-input__icon:hover:before{content: "\e607";}
</style>
<style>
	.dept .deptInput{width: 180px;}
	.deptDialog .el-dialog{text-align: center;width:550px}
	.deptDialog.multiple .el-dialog{width:996px}
	.deptDialog .filter{width: 180px;}
	.deptDialog .selectFilter{width: 180px;margin-right: 10px;}
	.deptDialog .el-tag{width: 100px;display: inline-block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;
  					padding-right: 20px;position: relative;margin-bottom: 5px;}
	.deptDialog .el-dialog .submit{margin-top: 30px;}
	.deptDialog .el-tree{border: none;}
	.deptDialog .el-card{width:100%;text-align: left;box-sizing: border-box;overflow-y: scroll;height: 400px;}
	.deptDialog .el-card__header{position: absolute;width:calc(100% - 40px);z-index: 1000;background-color: #FFFFFF;}
	.deptDialog .el-card__body{margin-top: 73px;}
	.deptDialog .el-col{position: relative;}
	.deptDialog .left{float: left;border-right:1px solid rgb(209, 229, 229);}
	.deptDialog .right{float: right;}
	.deptDialog .tree-table-cell .el-switch{margin-left: 10px;}
	.deptDialog .tex-center{text-align:center}
	.deptDialog .el-tag .el-icon-close{position:absolute;right:5px;top:50%;transform: translateY(-50%);}
	.deptDialog .tree-table-row{display: block;width: 100%;}
	.deptDialog .tree-table-row .tree-table-cell{float: right;}
</style>