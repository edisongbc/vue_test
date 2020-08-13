<template>
  <div>
    <div>
      <h1>This is an ZJCA CLIENT DEMO</h1>

      <ClientInfo :clientSuccess="clientSuccess" :clientMsg="clientMsg"/>

      <!--      自定义事件监听updateSelIndex-->
      <!--      <KeySelect :keyList="keyList" :selIndex="selIndex" @updateSelIndex="updateSelIndex" />-->
      <KeySelect :keyList="keyList" :selIndex="selIndex"/>

      <el-row type="flex" justify="space-around" :gutter="100">
        <el-col :span="16">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="证书信息" name="first">
              <CertInfo v-if="selIndex!==null" :certList="certList"/>
            </el-tab-pane>
            <el-tab-pane label="证书签发" name="second">
              <Sign :genCertReq="genCertReq" :installCert="installCert"/>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>

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
  // 引入Sign组件
  import Sign from '../components/zjca_client/Sign'

  export default {
    name: 'Demo',
    // 声明组件
    components: {
      ClientInfo,
      KeySelect,
      CertInfo,
      Sign
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
        certList: [],
        // 初始化标签
        activeName: 'first'
      }
    },

    computed: {},

    created () {
      this.init()
    },

    mounted () {
      /**
       * 订阅消息updateSelIndex：更改selIndex
       */
      PubSub.subscribe('updateSelIndex', (msg, selVal) => {
        this.selIndex = selVal
        this.onCallbackKeyEvent()
      })
    },

    methods: {
      testParent () {
        console.log('testParent()--------------')
        return 'edisongbc'
      },
      /**
       * 点击标签页
       */
      handleClick (tab, event) {
        console.log('handleClick() --> activeName：' + this.activeName)
        console.log(tab, event)
      },
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
      updateSelVal () {
        PubSub.publish('updateSelVal', this.selIndex)
      },
      /**
       * 发布消息publishCertList：更改certList
       */
      publishCertList () {
        PubSub.publish('publishCertList', this.certList)
      },
      /**
       * 初始化ZJCA客户端
       */
      init () {
        console.log('init()')
        // 创建ZJCA客户端控件对象
        this.g_ZjcaCMT = new zjca_CMT(this.onCallbackKeyEvent, null)
        // 初始化客户端
        const resp = this.g_ZjcaCMT.init(1, 1)
        this.clientSuccess = resp.code === 0
        if (this.clientSuccess) {
          // 版本信息
          const clientVersion = this.g_ZjcaCMT.getVersion()
          if (clientVersion.code == 0) {
            this.clientMsg = '客户端版本：' + clientVersion.res
          } else {
            this.clientMsg = '客户端版本：未知'
          }
          // 刷新介质设备列表
          try {
            this.onCallbackKeyEvent()
          } catch (e) {
            alert('获取证书设备失败：' + e.message)
          }
        } else {
          this.clientMsg = '初始化ZJCA客户端失败【' + resp.code + '】'
          // alert('初始化ZJCA客户端失败【'+resp.code+'】')
        }
      },
      /**
       * 设备事件响应函数
       */
      onCallbackKeyEvent (type, index, name) {
        console.log('onCallbackKeyEvent()')
        // 删除原有介质
        this.keyList = []
        // 枚举介质列表
        const keyResp = this.g_ZjcaCMT.getKeyList(false)
        if (keyResp.code === 0) {
          // 更新介质列表数组
          const devices = keyResp.res
          if (devices !== null) {
            for (let i = 0; i < devices.length; i++) {
              let keySN = devices[i].getSN()
              let keyLabel = devices[i].getLabel()
              let text = keyLabel + '(' + keySN + ')'
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
          if (this.keyList.length > 0) {
            if (this.selIndex === null || this.selIndex > (this.keyList.length - 1)) {
              this.selIndex = 0
              this.updateSelVal()
            }
          } else {
            this.selIndex = null
            this.updateSelVal()
          }
        } else {
          alert('枚举介质列表失败')
        }
        // 枚举证书列表（选中介质的所有证书）
        const certArray = []
        if (this.selIndex !== null) {
          const certResp = this.g_ZjcaCMT.getCertList(this.selIndex, 0, 0)
          if (certResp.code === 0) {
            this.certList = certResp.res
            this.publishCertList()
          } else {
            alert('枚举证书列表失败')
          }
        }
      },
      /**
       * 生成证书请求
       */
      genCertReq (keyAlg, isKeyUpdate, bit) {
        console.log('genCertReq(' + keyAlg + ', ' + isKeyUpdate + ', ' + bit + ')')
        let result = {
          isSuccess: false,
          certReq: '',
          msg: ''
        }
        try {
          const resp = this.g_ZjcaCMT.genCertReq(this.selIndex, keyAlg, isKeyUpdate, bit, 'test')
          const cert_req = resp.res
          if (cert_req === null || cert_req.length === 0) {
            result.msg = '空的证书请求：' + resp.msg
          } else {
            result.isSuccess = true
            result.certReq = cert_req
          }
        } catch (e) {
          result.msg = '生成证书请求失败：' + e.msg
        }
        return result
      },
      /**
       * 灌装证书
       */
      installCert (keyAlg, signCert, encCert, encryptedKeypair, symmAlg, symmCipher, authorizeCode) {
        console.log('installCert()-----------------')
        var installMsg
        try {
          // 安装证书
          var resp = this.g_ZjcaCMT.importCertAndEncKeyPair(this.selIndex, keyAlg, signCert,
            encCert, encryptedKeypair, symmAlg, symmCipher, authorizeCode)
          if (resp.code == 0) {
            installMsg = 'success'
          } else {
            installMsg = '灌装证书失败：【' + resp.res + '】'
          }
        } catch (e) {
          installMsg = '灌装证书失败：' + e.msg
        }
        //  灌证操作后，不论成功还是失败都强制刷新一下介质列表
        const keyResp = this.g_ZjcaCMT.getKeyList(true)
        if (keyResp.code === 0) {
          return installMsg
        } else {
          installMsg = '强制刷新失败'
          return installMsg
        }
      },
    }

  }

</script>
