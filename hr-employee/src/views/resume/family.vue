<template>
  <div class="page-resume-family">
    <p class="resume-block-title">家庭成员（已婚者须填写配偶、子女情况；未婚者填写父母或兄弟姐妹）</p>
    <el-form size="small" label-width="80px" label-position="left" class="demo-dynamic" :rules="rules" :ref="'person'+index"  :model="item"  v-for="(item,index) in tbFamilyList" key="item.key">
      <div class="form-item-group">
        <div class="item-block">
          <el-form-item label="姓名" prop="name"  >
            <el-input v-model="item.name" placeholder="请输入成员姓名">
            </el-input>
          </el-form-item>
          <el-form-item label="关系" prop="relation">
            <el-input v-model="item.relation" placeholder="请输入关系"></el-input>
          </el-form-item>
        </div>

         <div class="item-block">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="item.age" placeholder="请输入成员年龄"></el-input>
          </el-form-item>
          <el-form-item label="居住地" prop="residence">
            <el-input v-model="item.residence" placeholder="请输入成员居住地" ></el-input>
          </el-form-item>
        </div>
        <div class="item-block">
          <el-form-item label="工作单位">
            <el-input v-model="item.company" placeholder="请输入成员工作单位" ></el-input>
          </el-form-item>
          <el-form-item label="职务">
            <el-input v-model="item.post" placeholder="请输入成员职务" ></el-input>
          </el-form-item>
        </div>
        <el-button @click="tbFamilyList.splice(index,1)" class="del" v-if="index>0" icon="el-icon-remove-outline">删除</el-button>
      </div>
    </el-form>
    <div class="item-block item-add">
    	<el-button @click="addMembers" icon="el-icon-plus">新增家庭成员</el-button>
  	</div>
    <div class="item-block btn-container">
      <el-button-group>
        <el-button type="primary" icon="el-icon-arrow-left" @click="prev">上一步</el-button>
        <el-button type="primary" @click="next('tbFamilyList')">下一步<i class="el-icon-arrow-right el-icon--right"></i></el-button>
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
    	var checkNumber=function(rule, value, callback){
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
        tbFamilyList: [{
          name: '',
          relation: '',
          age: '',
          residence: '',
          company: '',
          post: ''
        }],
        rules:{
        	name:[
        		{required:true,message:'请输入成员姓名',trigger:'blur'}
        	],
        	relation:[
        		{required:true,message:'请输入与成员关系',trigger:'blur'}
        	],
        	age:[
        		{required:true,message:'请输入成员年龄',trigger:'blur'},
        		{validator:checkNumber, trigger: 'blur'}
        	],
        	residence:[
        		{required:true,message:'请输入成员居住地址',trigger:'blur'}
        	],
        }
      }
    },
    created () {
    	if(this.value&&this.value.tbFamilyList&&this.value.tbFamilyList.length){
    		this.tbFamilyList=this.value.tbFamilyList;
    		this.firstOpen=false;
    	}else  if (sessionStorage.tbFamilyList) {
        this.tbFamilyList = JSON.parse(sessionStorage.tbFamilyList)
      }
    },
    watch:{
		"tbFamilyList":{
        handler(info){
	    		if(this.value&&!this.firstOpen){
	    				this.value.tbFamilyList=info;
    			}
	    	},
        deep: true
	    },
		},
    methods: {
    	checkForm () {
      	var flag=true;
      	this.tbFamilyList.forEach((person,i)=>{
      		var form=this.$refs['person'+i][0];
      		form.validate((valid) => {
      			if(valid){
      				 if(i+1==this.tbFamilyList.length&&flag) {
      				 	flag=true;
		          }
      			}else{
	          	flag=false;
	          }
	        })
      	})
      	return flag;
      },
      addMembers () {
        if (this.tbFamilyList.length < 3) {
          this.tbFamilyList.push({
            name:'',
            relation:'',
            age:'',
            residence: '',
            company: '',
            post: ''
          })
        } else {
          this.$message('最多填写3个家庭成员')
        }
      },
      prev () {
        this.$router.push({name: 'contact'})
      },
      next () {
      	var flag=true;
      	this.tbFamilyList.forEach((person,i)=>{
      		var form=this.$refs['person'+i][0];
      		form.validate((valid) => {
      			if(valid){
      				 if(i+1==this.tbFamilyList.length&&flag) {
      				 	
		            sessionStorage.setItem('tbFamilyList', JSON.stringify(this.tbFamilyList))
		    				this.$router.push({name: 'education'})
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
<style type="text/css">
	.form-item-group{position: relative;margin-top: 30px;}
	.form-item-group .del{display: none;position: absolute;right: 10px;top: 50%;transform: translateY(-50%);}
	.form-item-group:hover .del{display: block;}
</style>
<style lang="stylus">
  .page-resume-family
    padding-bottom: 50px
</style>
