<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <el-divider direction="vertical"></el-divider>
      <router-link to="/about">About</router-link>
<!--      <el-divider direction="vertical"></el-divider>-->
<!--      <router-link to="/demo">Demo</router-link>-->
      <el-divider direction="vertical"></el-divider>
      <router-link to="/zjca">ZJCA</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }

  .demo-block {
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: .2s;
    margin-bottom: 24px;
  }
  .demo-block:hover{
    box-shadow:0 0 8px 0 rgba(232,237,250,.6),
    0 2px 4px 0 rgba(232,237,250,.5)
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>
