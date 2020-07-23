<template>
  <div>
    <div>
      <h1>This is an ZJCA CLIENT DEMO</h1>
      <select name="DeviceList" id="deviceList" @change="selKey()">
        <option value="-1">请选择UKey设备</option>
      </select>
    </div>
    <br/>
    <div>
      <span>介质序列号：</span>
      <input type="text" name="selKey" id="selKey" readonly="readonly"/>
      <input type="hidden" id="hidOperKeySn" name="operKeySn"/>
    </div>
    <br/>
    <div>
      <el-button @click="genCertReq()">证书请求</el-button> |
      <el-button @click="genAuthCodeReq(authCodeType.get('cert'))">授权码请求</el-button>
    </div>
    <br/>
    <div>
      <span>证书算法：</span>
      <el-radio-group v-model.trim="certAlg">
        <el-radio :label=1>RSA</el-radio>
        <el-radio :label=2>SM2</el-radio>
      </el-radio-group>
    </div>
    <br/>
    <div>
      <span>是否更新密钥：</span>
      <el-radio-group v-model.trim="isKeyUpdate">
        <el-radio :label=true>是</el-radio>
        <el-radio :label=false>否</el-radio>
      </el-radio-group>
    </div>
    <br/>
    <div>
      <span>选择BIT：</span>
      <el-radio-group v-model.trim="bit">
        <el-radio :label=256>256</el-radio>
        <el-radio :label=1024>1024</el-radio>
        <el-radio :label=2048>2048</el-radio>
      </el-radio-group>
    </div>
    <br/>
    <div>
      <span>证书请求：</span>
      <input type="text" v-model="cert_req" readonly="readonly"/>
    </div>
    <br/>
    <div>
      <span>授权码请求：</span>
      <input type="text" v-model="auth_code_req" readonly="readonly"/>
    </div>
    <br/>
    <div>
      <el-button @click="installCert()">灌装证书</el-button>
    </div>
    <br/>
    <div>
      <span>签名证书：</span>
      <input type="text" v-model="signCert" />
    </div>
    <div>
      <span>加密证书：</span>
      <input type="text" v-model="encCert" />
    </div>
    <div>
      <span>加密密钥结构保护体：</span>
      <input type="text" v-model="encryptedKeypair" />
    </div>
    <div>
      <span>对称密钥密文：</span>
      <input type="text" v-model="symmCipher" />
    </div>
    <div>
      <span>对称加密算法：</span>
      <input type="text" v-model="symmAlg" />
    </div>
    <div>
      <span>授权码：</span>
      <input type="text" v-model="authorizeCode" />
    </div>
  </div>
</template>

<script>

  import $ from 'jquery'

  export default {
    name: 'Demo',
    data () {
      return {
        /* ZJCA接口对象 */
        g_ZjcaCMT: null,
        /* 当前枚举到的设备列表 */
        g_UsingDeviceArray: null,
        /* 当前使用的设备索引 */
        g_UsingDeviceIndex: -1,
        /* 当前使用的设备 */
        deviceSel: null,
        /* 证书请求 */
        cert_req: "",
        /* 授权码请求 */
        auth_code_req: "",
        /* 证书算法 */
        certAlg: 2,
        /* 授权码类型 */
        authCodeType: new Map([["init", 0x01], ["unlock", 0x02], ["cert", 0x04]]),
        /* BIT */
        bit: 256,
        /* 是否更新密钥 */
        isKeyUpdate: false,
        /* 签名证书 */
        signCert: "",
        /* 加密证书 */
        encCert: "",
        /* 加密密钥结构保护体 */
        encryptedKeypair: "",
        /* 对称密钥密文 */
        symmCipher: "",
        /* 对称密钥算法 */
        symmAlg: "",
        /* 授权码 */
        authorizeCode: ""
      }
    },
    created () {

    },
    mounted () {
      this.init();
    },
    methods: {
      /* 初始化方法 */
      init () {
        // 初始化客户端
        this.g_ZjcaCMT = new zjca_CMT(this.onKeyEventCallbackFunc, null)
        var resp = this.g_ZjcaCMT.init(1, 1)
        if (resp.code != 0) {
          alert("初始化ZJCA客户端失败【"+resp.code+"】");
        } else {
          try{
            resp = this.g_ZjcaCMT.getKeyList(false);
            if(resp.code!=0){
              alert("枚举设备失败");
            }else{
              //设备列表
              this.findDevices(resp.res);
            }
          } catch(e){
            alert("获取证书设备失败：" + e.msg);
          }
        }
      },
      /* 设备事件处理函数 */
      onKeyEventCallbackFunc (type, index, name) {
        var resp = this.g_ZjcaCMT.getKeyList(false)
        if (resp.code == 0) {  //获取新的设备列表
          this.findDevices(resp.res)
        }
      },
      /* 枚举设备（ZJCA控件） */
      findDevices (keyArray) {
        // 删除老的选项
        var selKeyCtrl = document.getElementById('deviceList')
        var itemCount = selKeyCtrl.options.length
        for (var n = 0; n < itemCount; n++) {
          selKeyCtrl.options.remove(0)
        }
        // 保存当前选择的设备
        var selDeviceSN
        if (this.g_UsingDeviceArray && this.g_UsingDeviceArray.length > 0) {
          if (this.g_UsingDeviceIndex >= 0 && this.g_UsingDeviceIndex < this.g_UsingDeviceArray.length) {
            selDeviceSN = this.g_UsingDeviceArray[this.g_UsingDeviceIndex].getSN()
          }
        }
        //管理员证书
        var operKeySn = $('#hidOperKeySn').val()
        // 更新列表
        this.g_UsingDeviceArray = keyArray
        if (this.g_UsingDeviceArray && this.g_UsingDeviceArray.length > 0) {
          selKeyCtrl.options.add(new Option('请选择UKey设备', -1))
          for (var n = 0; n < this.g_UsingDeviceArray.length; n++) {
            var keySN = this.g_UsingDeviceArray[n].getSN()
            //管理员证书不添加到列表
            if (keySN != operKeySn) {
              var keyLabel = this.g_UsingDeviceArray[n].getLabel()
              var text = keyLabel + '(' + keySN + ')'
              selKeyCtrl.options.add(new Option(text, n))
            }
          }
        } else {
          selKeyCtrl.options.add(new Option('未发现任何ZJCA UKey设备', -1))
          this.selKey()
          return false
        }
        // 设置选中的设备
        var i = 0
        if (this.g_UsingDeviceIndex >= 0) {
          for (i = 0; i < this.g_UsingDeviceArray.length; i++) {
            if (selDeviceSN == this.g_UsingDeviceArray[i].getSN()) {
              selKeyCtrl.options[i].selected = true
              this.g_UsingDeviceIndex = i
            }
          }
        }
        if (i == this.g_UsingDeviceArray.length) {
          selKeyCtrl.options[0].selected = true
          this.selKey()
        }
        //默认选择第一个介质
        if (selKeyCtrl.options.length > 1) {
          selKeyCtrl.options[1].selected = true
          this.selKey()
        }
      },
      /* 选择介质时自动读取介质序列号 */
      selKey () {
        this.deviceSel = null;
        $('#selKey').val('');
        this.g_UsingDeviceIndex = Number(document.getElementById('deviceList').value);
        if (this.g_UsingDeviceIndex < 0 || (this.g_UsingDeviceIndex >= this.g_UsingDeviceArray.length)) {
          return false
        }
        $('#selKey').val(this.g_UsingDeviceArray[this.g_UsingDeviceIndex].getSN())
      },
      /* 判断选择介质，初始化介质 */
      initKeyDevice() {
        try {
          if (this.deviceSel != null) {
            return true;
          }
          // 判断选择介质
          this.g_UsingDeviceIndex = Number(document.getElementById("deviceList").value);
          if (this.g_UsingDeviceArray==null || this.g_UsingDeviceIndex < 0
            || (this.g_UsingDeviceIndex >= this.g_UsingDeviceArray.length)) {
            alert("请选择介质");
            return false;
          }
          this.deviceSel = this.g_UsingDeviceArray[this.g_UsingDeviceIndex];
          if (this.deviceSel == null) {
            alert("请选择介质");
            return false;
          }
          return true;
        } catch (e) {
          alert("初始化介质驱动错误：" + e.msg);
          return false;
        }
      },
      /* 生成证书请求 */
      genCertReq() {
        try {
          // 判断选择介质
          this.initKeyDevice();
          // 生成请求
          this.cert_req = "";
          var resp = this.g_ZjcaCMT.genCertReq(this.deviceSel.getIndex(), this.certAlg, this.isKeyUpdate, this.bit, "test");
          this.cert_req = resp.res;
          if (this.cert_req==null || this.cert_req.length==0) {
            alert("空的证书请求：" + resp.msg);
          }
        } catch (e) {
          alert("生成证书请求失败：" + e.msg);
        }
      },
      /* 生成授权码请求 */
      genAuthCodeReq(authType) {
        try {
          // 判断选择介质
          this.initKeyDevice();
          // 生成授权请求
          this.auth_code_req = "";
          var resp = this.g_ZjcaCMT.genAuthReq(this.deviceSel.getIndex(), authType);
          this.auth_code_req = resp.res;
          if (this.auth_code_req==null || this.auth_code_req.length==0) {
            alert("空的授权码请求：" + resp.msg);
          }
        } catch (e) {
          alert("生成授权码请求失败：" + e.msg);
        }
      },
      /* 灌装证书 */
      installCert() {
        try {
          // 判断选择介质
          this.initKeyDevice();
          // 安装证书
          var resp;
          if (this.isKeyUpdate) {
            // 更新密钥
            resp = this.g_ZjcaCMT.importCertAndEncKeyPair(this.deviceSel.getIndex(), this.certAlg, this.signCert,
              this.encCert, this.encryptedKeypair, this.symmAlg, this.symmCipher, this.authorizeCode);
          } else {
            // 不更新密钥
            resp = this.g_ZjcaCMT.importDualCert(this.deviceSel.getIndex(), this.certAlg, this.signCert, this.encCert);
          }
          var installMsg;
          if (resp.code == 0) {
            installMsg = "灌装证书成功";
          } else {
            installMsg = "灌装证书失败：【"+resp.res+"】";
          }
        } catch (e) {
          installMsg = "灌装证书失败：" + e.msg;
        }
        //  灌证操作后，不论成功还是失败都强制刷新一下介质列表
        this.g_ZjcaCMT.getKeyList(true);
        // 打印结果
        alert(installMsg);
      },
      /* 测试方法 */
      test () {
        alert(isIE())
      }
    }
  }

</script>
