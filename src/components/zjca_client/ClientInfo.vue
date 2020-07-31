<template>
  <el-row type="flex" justify="space-around" :gutter="100">
    <el-col :span="16" >
      <div class="grid-content demo-block">
        <h3>客户端信息</h3>
        <span v-if="clientSuccess" style="color: green">{{clientMsg}}</span>
        <span v-else style="color: red">{{clientMsg}}</span>
        <br/>
        <br/>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'ClientInfo',
    props: {
      clientSuccess: Boolean,
      clientMsg: String
    },
    data() {
      return {
      }
    }
  }
</script>

<style scoped>

</style>
