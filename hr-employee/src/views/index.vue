<template>
  <div class="content-view">
    <v-header></v-header>
    <div class="content-menu">
      <router-link v-for="(item, index) in routerMenus"
        :to="{name: item.name}" :key="index">
        <el-button ><p>
          <span>{{item.label}}</span>
        </p>
          <p>
          <span>{{item.label2}}</span>
        </p></el-button>
      </router-link>
    </div>
    <div class="user-content-route">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import VHeader from '@/components/header'

  export default {
    data () {
      return {
        routerMenus: [
          {name: 'employeeList', label: '员工', label2: '信息'},
        ]
      }
    },
    components: { VHeader }
  }
</script>

<style lang="stylus" scoped>
  .content-menu
    position: fixed
    top: 100px
    width: 50px
    height: 10px
    padding: 0 25px
    .el-button
      margin-bottom: 25px
      width:47px
      height:49px
      padding:0
      border-radius:5px
     
    .el-button:hover
    	color:#fff
    	background-color: #0ca97d;
  .user-content-route
    padding-left: 120px
    padding-right: 50px

  .router-link-active .el-button
    color: #e4ffed
    border-color: #0CA97D
    background-color: #0CA97D

</style>
