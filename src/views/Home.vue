<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <!--    3、使用组件-->
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
  // 1、引入组件
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    // 2、申明组件
    HelloWorld
  }
}
</script>
