<template>
<div class="layout contentWrap">
	<slot name="layout-header"></slot>
	<div class="layout-content">
		<el-card  v-if="cardShow">
			<slot name="query"></slot>
		</el-card>
		<template v-if="!isFirst">
			<div class="content-header">
		        <slot name="content-header"></slot>
		    </div>
		    <slot></slot>
		    <div class="page">
		    	<slot name="page"></slot>
		    </div>
		 </template>
		 <div v-else class="text-center firstOpen">请进行检索获取数据</div>
    </div>
</div>
</template>

<script>
	export default {
		name:'ctrl-layout',
		props:{
			cardShow:{
				type:Boolean,
				default:true,
			},
			isFirst:{
				type:Boolean,
				default:false,
			}
		},
	}
</script>

<style  scoped>
	.layout{min-width:1150px}	
	.content-header{text-align:right;padding:20px 0 10px 0}
	.page{margin:50px 0;text-align:center}
	.firstOpen{text-align: center;
    color: #00A58B;
    font-size: 16px;
    margin-top: 30px;}
</style>