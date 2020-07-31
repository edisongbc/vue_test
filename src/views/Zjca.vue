<template>
  <div>
    <div>
      <h1>This is an ZJCA CLIENT DEMO</h1>
      <ClientInfo :clientSuccess="clientSuccess" :clientMsg="clientMsg" />
<!--      自定义事件监听updateSelIndex-->
<!--      <KeySelect :keyList="keyList" :selIndex="selIndex" @updateSelIndex="updateSelIndex" />-->
      <KeySelect :keyList="keyList" :selIndex="selIndex" />
      <CertInfo v-if="selIndex!==null" :certList="certList" />
    </div>
  </div>
</template>

<script>
  // 引入PubSub
  import PubSub from 'pubsub-js'
  // 引入ClientInfo组件
  import ClientInfo from '../components/zjca_client/ClientInfo'
  // 引入KeySelect组件
  import KeySelect from '../components/zjca_client/KeySelect'
  // 引入CertInfo组件
  import CertInfo from '../components/zjca_client/CertInfo'
  // 引入jquery
  import $ from 'jquery'

  export default {
    name: 'Demo',
    // 声明组件
    components: {
      ClientInfo,
      KeySelect,
      CertInfo
    },

    data () {
      return {
        // 介质列表数组
        keyList: [],
        // ZJCA接口对象
        g_ZjcaCMT: null,
        // 选中的下拉设备索引
        selIndex: null,
        // 客户端加载是否成功
        clientSuccess: false,
        // 客户端消息信息
        clientMsg: '',
        // 证书列表
        certList: []
      }
    },

    computed: {

    },

    created () {
      this.init()
    },

    mounted () {
      /**
       * 订阅消息updateSelIndex：更改selIndex
       */
      PubSub.subscribe('updateSelIndex', (msg, selVal) => {
        this.selIndex = selVal;
        this.onCallbackKeyEvent()
      })
    },

    methods: {
      /**
       * 事件监听updateSelIndex：更改selIndex
       */
      // updateSelIndex(val) {
      //   this.selIndex = val
      //   console.log('updateSelIndex() --> selIndex：' + this.selIndex)
      // },
      /**
       * 发布消息updateSelVal：更改selVal
       */
      updateSelVal() {
        PubSub.publish('updateSelVal', this.selIndex)
      },
      /**
       * 发布消息publishCertList：更改certList
       */
      publishCertList() {
        PubSub.publish('publishCertList', this.certList)
      },
      /**
       * 初始化ZJCA客户端
       */
      init() {
        console.log('init()')
        // 创建ZJCA客户端控件对象
        this.g_ZjcaCMT = new zjca_CMT(this.onCallbackKeyEvent, null)
        // 初始化客户端
        const resp = this.g_ZjcaCMT.init(1, 1)
        this.clientSuccess = resp.code===0
        if (this.clientSuccess) {
          // 版本信息
          const clientVersion = this.g_ZjcaCMT.getVersion();
          if (clientVersion.code == 0) {
            this.clientMsg = '客户端版本：' + clientVersion.res
          }else {
            this.clientMsg = '客户端版本：未知'
          }
          // 刷新介质设备列表
          try{
            this.onCallbackKeyEvent()
          } catch(e){
            alert('获取证书设备失败：' + e.message);
          }
        } else {
          this.clientMsg = '初始化ZJCA客户端失败【'+resp.code+'】'
          // alert('初始化ZJCA客户端失败【'+resp.code+'】')
        }
      },
      /**
       * 设备事件响应函数
       */
      onCallbackKeyEvent(type, index, name) {
        console.log('onCallbackKeyEvent()')
        // 删除原有介质
        this.keyList = []
        // 枚举介质列表
        const keyResp = this.g_ZjcaCMT.getKeyList(false)
        if (keyResp.code === 0) {
          // 更新介质列表数组
          const devices = keyResp.res
          if(devices!==null) {
            for (let i = 0; i < devices.length; i++) {
              let keySN = devices[i].getSN()
              let keyLabel = devices[i].getLabel()
              let text = keyLabel + "(" + keySN + ")"
              let uKey = {
                id: i,
                name: text,
                device: devices[i],
                selected: false
              }
              this.keyList.push(uKey)
            }
          }
          // 判断更新selIndex和selVal
          if (this.keyList.length>0) {
            if (this.selIndex===null || this.selIndex>(this.keyList.length-1)) {
              this.selIndex = 0
              this.updateSelVal()
            }
          } else {
            this.selIndex = null
            this.updateSelVal()
          }
        } else {
          alert("枚举介质列表失败")
        }
        // 枚举证书列表（选中介质的所有证书）
        const certArray = []
        if (this.selIndex !== null) {
          const certResp = this.g_ZjcaCMT.getCertList(this.selIndex, 0, 0)
          if (certResp.code === 0) {
            this.certList = certResp.res
            this.publishCertList()
          } else {
            alert("枚举证书列表失败")
          }
        }
      },
    }

  }

</script>
