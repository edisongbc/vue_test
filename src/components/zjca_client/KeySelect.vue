<template>
  <el-row type="flex" justify="space-around" :gutter="100">
    <el-col :span="16" >
      <div class="grid-content demo-block">
<!--        选择设备-->
        <h3>密码设备</h3>
        <el-select style="width: 400px" v-model="selVal" placeholder="Please Choose the UKey" @change="selChange" >
          <el-option v-for="(key, index) in keyList" :key="index" :value="key.id" :label="key.name" />
        </el-select>
        <br/>
        <br/>
<!--        设备信息-->
        <div v-if="selVal!==null">
          <el-row type="flex" justify="space-around" :gutter="100">
            <el-col :span="8" class="grid-content bg-purple" >
              <div style="line-height: 36px; text-align: left;">
                <span>KeySn：</span>
                <span>{{selKeySn}}</span>
              </div>
            </el-col>
            <el-col :span="8" class="grid-content bg-purple" >
              <div style="line-height: 36px; text-align: left;">
                <span>Label：</span>
                <span>{{selKeyLabel}}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <br/>
        <br/>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  // 引入PubSub
  import PubSub from 'pubsub-js'

  export default {
    name: 'KeySelect',
    props: {
      keyList: Array,
      selIndex: Number
    },
    mounted () {
      /**
       * 初始化赋值
       */
      const key = this.keyList[this.selVal]
      this.selKeySn = key.device.getSN();
      this.selKeyLabel = key.device.getLabel();
      /**
       * 订阅消息updateSelVal：更改selVal
       */
      PubSub.subscribe('updateSelVal', (msg, selIndex) => {
        this.selVal = selIndex;
      })
    },
    data() {
      return {
        selVal: this.selIndex,
        selKeySn: '',
        selKeyLabel: ''
      }
    },
    methods: {
      /**
       * 变更select
       */
      selChange() {
        // 显示介质信息
        if (this.selVal !== null) {
          console.log('selChange() --> keyList：' + this.keyList)
          const key = this.keyList[this.selVal]
          this.selKeySn = key.device.getSN();
          this.selKeyLabel = key.device.getLabel();
        }
        // 触发事件监听updateSelIndex：更改selIndex
        // this.$emit('updateSelIndex', this.selVal)
        // 发布消息updateSelIndex：更改selIndex
        PubSub.publish('updateSelIndex', this.selVal)
      }
    }
  }
</script>

<style scoped>

</style>
