<template>
  <div id="app">
    <div class="app-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #ebebeb;
  height: 100%;
}
#app .app-content{
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: #fff
}
</style>
