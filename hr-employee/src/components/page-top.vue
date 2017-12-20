<template>
<div class="pageTop clearfix">
	<div class="pageTopCont">
		<div class="title">{{pageTitle}}</div>
		<div class="intro">{{pageDescription}}</div>
	</div>
	<div class="pageTopSlot clearfix">
		<slot></slot>
	</div>
</div>
</template>

<script>
export default{
	props:['pageTitle','pageDescription']
}
</script>

<style>
	.pageTop{
		border-bottom: #ddd solid 1px;
		padding: 20px 0 10px 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.pageTopCont{
		flex: 1;
		text-align: left;
	}
	.pageTopCont>.title{
		font-weight: bold;
		font-size: 16px;
		margin-bottom: 10px;
	}
	.pageTopCont>.intro{
		font-size: 12px;
		color: #999;
	}
</style>