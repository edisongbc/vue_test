<template>
  <div>
    <el-steps v-if="loading" :space="400" :active="stepsActive" align-center finish-status="success">
      <el-step title="表单验证"></el-step>
      <el-step title="生成请求"></el-step>
      <el-step title="签发证书"></el-step>
      <el-step title="灌装证书"></el-step>
    </el-steps>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px"
             v-loading="loading"
             element-loading-text="操作正在进行中，请勿插拔介质"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name"/>
      </el-form-item>
      <el-form-item label="身份证" prop="idCode">
        <el-input v-model="form.idCode" maxlength="18" show-word-limit/>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" maxlength="11" show-word-limit/>
      </el-form-item>
      <el-form-item label="证书类型" prop="certType">
        <el-cascader
          style="width: 100%"
          v-model="form.certType"
          :options="options"
          clearable/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">签发</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Sign',
    props: {
      genCertReq: Function,
      installCert: Function
    },
    created () {

    },
    mounted () {

    },
    data () {
      return {
        // 是否打开加载层
        loading: false,
        // 步骤条active
        stepsActive: 0,
        // 表单
        form: {
          name: '',
          idCode: '',
          mobile: '',
          certType: [],
        },
        // 表单规则
        rules: {
          name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur'
            }
          ],
          idCode: [
            {
              required: true,
              message: '请输入身份证',
              trigger: 'blur'
            },
            {
              min: 18,
              max: 18,
              message: '二代身份证长度不正确',
              trigger: 'blur'
            }
          ],
          mobile: [
            {
              required: true,
              message: '请输入手机号',
              trigger: 'blur'
            },
            {
              min: 11,
              max: 11,
              message: '手机号长度不正确',
              trigger: 'blur'
            }
          ],
          certType: [
            {
              required: true,
              message: '请选择证书类型',
              trigger: 'change'
            }
          ],
        },
        // 证书类型
        options: [
          {
            value: 1,
            label: '机构证书',
            children: [
              {
                value: 1,
                label: 'RSA',
                children: [
                  {
                    value: 1024,
                    label: '1024'
                  },
                  {
                    value: 2048,
                    label: '2048'
                  }
                ]
              },
              {
                value: 2,
                label: 'SM2',
                children: [
                  {
                    value: 256,
                    label: '256'
                  }
                ]
              }
            ]
          },
          {
            value: 2,
            label: '个人证书',
            children: [
              {
                value: 1,
                label: 'RSA',
                children: [
                  {
                    value: 1024,
                    label: '1024'
                  },
                  {
                    value: 2048,
                    label: '2048'
                  }
                ]
              },
              {
                value: 2,
                label: 'SM2',
                children: [
                  {
                    value: 256,
                    label: '256'
                  }
                ]
              }
            ]
          }
        ],
        // 证书类型信息
        certTypeInfo: [],
        // 证书类型
        certType: 0,
        // 密钥算法
        keyAlg: 0,
        // 算法位数
        bit: 0,
        // 证书策略
        policyCode: '',
        // 收费策略
        feeCode: '',
        // 客户单请求
        clientReq: '',
        // 业务数据
        bizRequest: null,
        // 服务请求
        serverRequest: null,
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
    methods: {
      /**
       * 表单验证
       */
      formValid(formName) {
        return new Promise((resolve, reject) => {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              resolve('表单验证成功')
            } else {
              reject('表单验证失败')
            }
          })
        })
      },
      /**
       * 初始化请求数据
       */
      initReqData() {
        return new Promise((resolve, reject) => {
          this.certTypeInfo = this.form.certType
          this.certType = this.certTypeInfo[0]
          this.keyAlg = this.certTypeInfo[1]
          this.bit = this.certTypeInfo[2]
          if (this.certType === 1) {
            // 机构证书
            reject('暂不支持机构证书')
          } else {
            this.feeCode = '20200616_private_user_new_1m'
            // 个人证书
            if (this.keyAlg == 1) {
              // RSA
              this.policyCode = '20200616-private-user-rsa-double'
            } else {
              // SM2
              this.policyCode = '20200616-private-user-sm2-double'
            }
            resolve()
          }
        })
      },
      /**
       * 生成客户端请求 csr+authCode请求码
       */
      genClientReq() {
        return new Promise((resolve, reject) => {
          this.stepsActive = 0
          setTimeout(() => {
            const certReqResult = this.genCertReq(this.keyAlg, true, this.bit)
            if (certReqResult.isSuccess) {
              this.clientReq = certReqResult.certReq
              resolve()
            } else {
              reject(certReqResult.msg)
            }
          }, 100)
        })
      },
      /**
       * 封装服务请求
       */
      packRequest() {
        return new Promise((resolve, reject) => {
          this.bizRequest = {
            bizTypeCode: 10,
            policyCode: this.policyCode,
            feeCode: this.feeCode,
            certReq: this.clientReq,
            name: this.form.name,
            idCode: this.form.idCode,
            mobile: this.form.mobile
          }
          this.serverRequest = {
            appCode: '20200616_privatization',
            isEnc: false,
            bizRequest: this.bizRequest
          }
          resolve()
        })
      },
      /**
       * 签发
       */
      sign() {
        return new Promise((resolve, reject) => {
          this.stepsActive = 1
          setTimeout(() => {
            const url = 'http://10.210.32.51/issue/server'
            axios.post(url, this.serverRequest).then(response => {
              if (response.data.code === 1) {
                this.signCert = response.data.data.signCert
                this.encCert = response.data.data.encCert
                this.encryptedKeypair = response.data.data.encryptedKeypair
                this.symmCipher = response.data.data.symmCipher
                this.symmAlg = response.data.data.symmAlg
                this.authorizeCode = response.data.data.authorizeCode
                resolve()
              } else {
                reject(response.data.message)
              }
            }).catch(error => {
              reject(error)
            })
          }, 100)
        })
      },
      /**
       * 安装证书
       */
      install() {
        new Promise((resolve, reject) => {
          this.stepsActive = 2
          setTimeout(() => {
            const installMsg = this.installCert(this.keyAlg, this.signCert, this.encCert,
              this.encryptedKeypair, this.symmAlg, this.symmCipher, this.authorizeCode)
            if(installMsg === 'success') {
              resolve()
            } else {
              reject(installMsg)
            }
          }, 100)
        })
      },
      /**
       * 提交签发证书
       */
      async onSubmit (formName) {
        this.loading = true
        try {
          // 1、表单验证
          await this.formValid(formName)
          // 2、初始化请求数据
          await this.initReqData()
          // 3、生成客户端请求
          await this.genClientReq()
          // 4、封装服务请求
          this.loadingText = '正在封装服务请求'
          await this.packRequest()
          // 5、签发证书，调用发证服务
          await this.sign()
          // 6、安装证书
          await this.install()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.loading = false
        } catch (e) {
          this.$message.error(e)
          this.loading = false
          return
        }
      },
      /**
       * 重置提示信息
       * @param formName
       */
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>

</style>
