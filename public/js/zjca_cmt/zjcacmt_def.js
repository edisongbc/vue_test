/* 
 * ZJCA CMT Define JAVA Script file for HTML
 * Version: v0.0.1
 * Date: 2018-04-25
 * 2017 - 2021 ZJCA. All rights reserved.
 * 
 *
*/

/*	产品类型定义  */
var ZJCA_PRODUCT_CMT		= 0x01
var ZJCA_PRODUCT_ZWCMT		= 0x02
var ZJCA_PRODUCT_FRCMT		= 0x03

/*	设备事件类型定义 */
var ZJCA_EVENT_INSERTED		= 0x01
var ZJCA_EVENT_REMOVED		= 0x02
var ZJCA_EVENT_UPDATED		= 0x03

/* 非对称密钥算法类型 */
var ZJCA_KEY_UNKNOWN		= 0x00000000
var ZJCA_KEY_RSA			= 0x00000001
var ZJCA_KEY_SM2			= 0x00000002

/*	对称算法类型　*/
var ZJCA_SYMM_UNKNOWN		= 0x00000000
var ZJCA_SYMM_DES			= 0x00000004		
var ZJCA_SYMM_3DES			= 0x00000008
var ZJCA_SYMM_SM1_ECB		= 0x00000010
var ZJCA_SYMM_SMS4_ECB		= 0x00000020
var ZJCA_SYMM_AES128		= 0x00000040
var ZJCA_SYMM_AES192		= 0x00000080
var ZJCA_SYMM_AES256		= 0x00000100

/*	对称加密补齐方式 */
var ZJCA_PADDING_ZERO		= 0x00000000
var ZJCA_PADDING_PKCS5		= 0x00000001

/* HASH算法类型	*/
var ZJCA_HASH_UNKNOWN		= 0x00000000
var ZJCA_HASH_MD5			= 0x00000200
var ZJCA_HASH_SHA1			= 0x00000400
var ZJCA_HASH_SHA256		= 0x00000800
var ZJCA_HASH_SHA384		= 0x00001000
var ZJCA_HASH_SHA512		= 0x00002000
var ZJCA_HASH_SM3			= 0x00004000

/* 密钥对用途类型 */
var ZJCA_KEY_UNKNOWN_USAGE	= 0x00
var ZJCA_KEY_SIGN			= 0x01
var ZJCA_KEY_EXCH			= 0x02

/* PIN码类型 */
var ZJCA_PIN_SO				= 0x00
var ZJCA_PIN_USER			= 0x01

/* 证书媒介类型 */
var ZJCA_CERT_STORE_KEY		= 0x01
var ZJCA_CERT_STORE_PFX		= 0x02
var ZJCA_CERT_STORE_ALL		= (ZJCA_CERT_STORE_KEY|ZJCA_CERT_STORE_PFX)

/* 证书类型 */
var ZJCA_CERT_UNKNOWN		= 0x00
var ZJCA_CERT_SIGN			= 0x01
var ZJCA_CERT_EXCH			= 0x02

/* 证书用户类型 */
var ZJCA_CERT_USER_UNKNOWN	= 0x00
var ZJCA_CERT_USER_PERSONAL	= 0x01
var ZJCA_CERT_USER_ORG		= 0X02

/* 验证证书的项 */
var ZJCA_CERT_VERIFY_TIME		= 0x01
var ZJCA_CERT_VERIFY_SIGNATURE	= 0x02
var ZJCA_CERT_VERIFY_CRL		= 0x04
var ZJCA_CERT_VERIFY_ALL		= (ZJCA_CERT_VERIFY_TIME|ZJCA_CERT_VERIFY_SIGNATURE|ZJCA_CERT_VERIFY_CRL)

/* 证书验证结果 */
var ZJCA_CERT_TRUST_OK							= 0x00
var ZJCA_CERT_TRUST_IS_NOT_YET_VALID			= 0x01
var ZJCA_CERT_TRUST_HAS_EXPIRED					= 0x02
var ZJCA_CERT_TRUST_IS_REVOKED					= 0x04
var ZJCA_CERT_TRUST_IS_NOT_VALID_SIGNATURE		= 0x08
var ZJCA_CERT_TRUST_IS_NOT_VALID_ISSUER			= 0x10
var ZJCA_CERT_TRUST_HAS_NOT_VALID_ROOT			= 0x20
var ZJCA_CERT_TRUST_REVOKED_UNKNOWN				= 0x40
var ZJCA_CERT_TRUST_UNKNOWN						= 0xFF

/* 授权码类型 */
var ZJCA_AUTH_FORMAT		= 0x01
var ZJCA_AUTH_UNLOCK		= 0x02
var ZJCA_AUTH_PWD4P12		= 0x04
var ZJCA_AUTH_CHGSOPIN		= 0x08

/* 字符集类型 */
var ZJCA_ENCODING_NONE		= 0x00	//可见字符串，同ZJCA_ENCODING_UTF8
var ZJCA_ENCODING_GBK		= 0x01	//可见字符串，ASCII编码
var ZJCA_ENCODING_UNICODE	= 0x02	//可见字符串，UNICODE编码
var ZJCA_ENCODING_UTF8		= 0x03	//可见字符串，UTF-8编码
var ZJCA_ENCODING_BASE64	= 0x04	//Base64编码的字符串
var ZJCA_ENCODING_HEX		= 0x05	//16进制编码的字符串

/* 加密数据封装类型 */
var ZJCA_ENVELOPED_UNKNOWN	= 0x00
var ZJCA_ENVELOPED_NORMAL	= 0x01
var ZJCA_ENVELOPED_P7		= 0x02
var ZJCA_ENVELOPED_RAW		= 0x03
var ZJCA_ENVELOPED_ASN1		= 0x04		//Only for SM2

/* 非对称密文编码方式 */
var ZJCA_SM2CIPHER_UNKNOWN	= 0x00
var ZJCA_SM2CIPHER_RAW		= 0x01	//原始的SM2密文格式(0x04|x|y|hash|cipher)
var ZJCA_SM2CIPHER_DER		= 0x02	//DER编码的SM2密文格式
var ZJCA_SM2CIPHER_SKF		= 0x03	//国密SKF规范中的密文结构体格式

/* 签名数据类型定义 */
var ZJCA_SIGN_UNKNOWN		= 0x00
var ZJCA_SIGN_P1			= 0x01
var ZJCA_SIGN_P7			= 0x02
var ZJCA_SIGN_RAW			= 0x03
var ZJCA_SIGN_ASN1			= 0x04		//Only for SM2

/* 签名操作标记定义 */
var ZJCA_SIGNATTACH_CERT	= 0x01
var ZJCA_SIGNATTACH_MSG		= 0x02
var ZJCA_SIGNATTACH_TIME	= 0x04

/* 文件流类型标记 */
var ZJCA_STREAM_READ		= 0x01
var ZJCA_STREAM_WRITE		= 0x02

/* 用户选项设置类型 */
var ZJCA_OPTION_AUTORUN		= 0x01		//开机自动运行
var ZJCA_OPTION_CHECKUPDATE	= 0x02		//自动更新
var ZJCA_OPTION_SHOWPAGE	= 0x03		//插KEY时显示应用导航页面

/* 操作函数定义 */
var FUNC_INIT						= "init"					//初始化客户端
var FUNC_FINALED					= "finaled"					//释放客户端
var FUNC_GET_VERSION				= "get_version"				//获取客户端版本信息
var FUNC_GET_USEROPTION				= "get_useroption"			//获取用户设置信息,参数:(选项类型)
var FUNC_SET_USEROPTION				= "set_useroption"			//保存客户设置信息,参数:(选项类型)(值)
var	FUNC_GET_DEVICE_LIST			= "enum_dev"				//获取所有设备信息列表
var FUNC_GET_CERTIFICATE_LIST		= "enum_cert"				//获取所有证书信息列表,参数:(设备序号)(证书类型)(证书用途)
var	FUNC_GET_CERTIFICATE_DATA		= "get_cert"				//获取制定序列号的证书内容,参数:(设备序号)(证书类型)(证书用途)
var	FUNC_GET_CERTIFICATE_BYSN		= "get_cert_bysn"			//获取制定序列号的证书内容,参数:(设备序号)(证书SN)
var FUNC_DECODER_CERTIFICATE		= "decode_cert"				//解码证书,参数:(base64证书内容)
var	FUNC_CERT_ATTRIBUTE				= "get_cert_attr"			//获取一个证书属性
var	FUNC_CERT_EXTENSION				= "get_cert_ext"			//返回一个证书的扩展属性
var	FUNC_RELEASE_CERTIFCATE			= "release_cert"			//释放证书对象
var	FUNC_SHOW_CERTIFICATE			= "show_cert"				//显示证书
var	FUNC_VERIFY_CERTIFICATE			= "verify_cert"				//验证证书
//
var	FUNC_SIGN_MESSAGE				= "sign_message"			//签名消息,参数:(设备序号)(算法类型)(签名类型)(附带标识)(消息原文)(描述信息)(编码类型)
var	FUNC_VERIFY_MESSAGE				= "verify_message"			//验证消息签名,参数:(设备序号)(消息原文)(描述信息)(编码类型)(Base64格式的签名)(Base64格式的证书)
var	FUNC_SIGN_FILE					= "sign_file"				//签名文件,参数:(设备序号)(算法类型)(签名类型)(附带标识)(原文文件名)(描述信息)
var	FUNC_VERIFY_FILE				= "verify_file"				//验证文件签名,参数:(设备序号)(原文文件名)(描述信息)(Base64格式的签名)(Base64格式的证书)
var	FUNC_SIGN_DIGEST				= "sign_digest"				//签名杂凑,参数:(设备序号)(算法类型)(签名类型)(附带标识)(Base64杂凑值)(杂凑算法)
var	FUNC_VERIFY_DIGEST				= "verify_digest"			//验证杂凑的签名,参数:(设备序号)(Base64杂凑值)(杂凑算法)(Base64格式的签名)(Base64格式的证书)
//
var	FUNC_SIGNATURE_ATTACHED			= "signature_attached"		//获取P7签名中的附加信息,参数:(Base64格式的签名)(原文编码类型)
var FUNC_SIGNATURE_TYPE				= "signature_type"			//获取前面的类型和算法消息,参数:(Base64格式的签名)
//
var FUNC_ENCODE_MESSAGE				= "encode_message"			//加密消息,参数:(设备序号)(Base64格式的证书)(消息原文)(原文字符集)(对称算法)(密文类型)(补齐类型)
var FUNC_ENCODE_FILE				= "encode_file"				//加密文件,参数:(设备序号)(Base64格式的证书)(原文文件名)(密文文件名)(对称算法)(密文类型)(补齐类型)
var FUNC_DECODE_MESSAGE				= "decode_message"			//解密消息,参数:(设备序号)(Base64格式的密文)(原文字符集)
var FUNC_DECODE_FILE				= "decode_file"				//解密文件,参数:(设备序号)(Base64格式的密文)(密文文件名)(目标文件名)
//
var FUNC_GET_FILENAME				= "get_filename"			//打开文件对话框,选择文件,参数:(文件对话框Caption)(文件对话框Filter)
var FUNC_GET_PATHNAME				= "get_pathname"			//打开路径对话框,选择路径,参数:(目录对话框Caption)
var FUNC_READ_FILE					= "read_file"				//读取文件内容,参数:(文件名)
var FUNC_WRITE_FILE					= "write_file"				//写文件内容,参数:(文件名)(文件内容)(是否以二进制保存)
var FUNC_DELETE_FILE				= "delete_file"				//删除一个文件,参数:(文件名)
var FUNC_CREATE_FOLDER				= "create_folder"			//创建一个目录,参数:(目录名)
var FUNC_OPEN_FOLDER				= "open_folder"				//直接打开一个目录,参数:(目录名)
var FUNC_DELETE_FOLDER				= "delete_folder"			//删除一个目录,参数:(目录名)
//
var FUNC_GEN_AUTHREQ 				= "gen_auth_req"			//生成授权请求码
var FUNC_INITILIAZE_DEVICE			= "initiliaze_device"		//初始化设备
var FUNC_UNLOCK_DEVICE				= "unlock_device"			//解锁设备
var FUNC_CHANGE_PIN					= "change_pin"				//修改PIN码
var FUNC_VERIFY_PIN					= "verify_pin"				//检验PIN码
//
var FUNC_GEN_CERTREQ 				= "gen_cert_csr"			//生成证书请求
var FUNC_IMPORT_DUALCERT_KEYPAIR_PFX= "import_dualcert_keypair"	//导入证书和加密密钥对(PFX格式),参数:(设备序号)(算法类型)(签名证书)(加密证书)(加密密钥对)(授权码)
var FUNC_IMPORT_DUALCERT_KEYPAIR_ENC= "import_dualcert_keypair_enc"//导入证书和加密密钥对(密文格式),参数:(设备序号)(算法类型)(签名证书)(加密证书)(加密密钥对密文)(对称算法ID)(对称密钥密文)(授权码)
var FUNC_IMPORT_UPGRADED_CERTKEYPAIR= "import_upgraded_certs_keypair"//证书算法升级,参数:(设备序号)(老算法)(新算法)(签名证书)(加密证书)(加密密钥对密文)(对称算法ID)(对称密钥密文)(授权码)
var FUNC_IMPORT_DUALCERT			= "import_dualcert"			//导入双证书,参数:(设备序号)(算法类型)(签名证书)(加密证书)(授权码)
var FUNC_IMPORT_CERT				= "import_cert"				//导入单证书,参数:(设备序号)(算法类型)(是否是签名证书)(证书内容)
var FUNC_VALIDATION					= "validation"				//验证制证结果,参数:(设备序号)(非对称算法类型)(用途类型)
//
var FUNC_TIMESTAMP_ATTRS			= "timestamp_attrs"			//获取时间戳属性,参数:(Base64时间戳)
var FUNC_TIMESTAMP_VERIFY			= "timestamp_verify"		//验证时间戳,参数:(时间戳句柄)
var FUNC_TIMESTAMP_VERIFYWITHDIGEST	= "timestamp_verify_digest" //验证时间戳,参数:(时间戳句柄)(杂凑值)(杂凑算法)
var FUNC_TIMESTAMP_VERIFYWITHFILE	= "timestamp_verify_file"	//验证时间戳,参数:(时间戳句柄)(文件名)(杂凑算法)(UserId)(公钥证书)
var FUNC_TIMESTAMP_VERIFYWITHMSG	= "timestamp_verify_msg"	//验证时间戳,参数:(时间戳句柄)(文件名)(杂凑算法)(charset)(UserId)(公钥证书)
//
var FUNC_TESTRANDROM				= "test_randrom"			//随机数测试,参数:(设备序号)(大小)(格式)(输出文件名)
//

//
/* 函数响应定义 */
var RESP_INIT						= "init_resp"
var RESP_GET_VERSION				= "get_version_resp"		//参数:(版本信息)
var RESP_GET_USEROPTION				= "get_useroption_resp"		//参数:(设置的值)
var RESP_SET_USEROPTION				= "set_useroption_resp"		//参数:(无)
var	RESP_GET_DEVICE_LIST			= "enum_dev_resp"
var RESP_GET_CERTIFICATE_LIST		= "enum_cert_resp"
var	RESP_GET_CERTIFICATE_DATA		= "get_cert_resp"
var	RESP_GET_CERTIFICATE_BYSN		= "get_cert_bysn_resp"		//参数:(Base64格式的证书内容)
var	RESP_CERT_ATTRIBUTE				= "get_cert_attr_resp"
//
var	RESP_SIGN_MESSAGE				= "sign_message_resp"		//参数:(Base64格式的签名结果)
var	RESP_VERIFY_MESSAGE				= "verify_message_resp"		//参数:(是否通过验证
//
var RESP_GEN_AUTHREQ				= "gen_auth_req_resp"		//参数:(授权请求码)
var RESP_INITILIAZE_DEVICE			= "initiliaze_device_resp"	//参数:(是否成功)
var RESP_UNLOCK_DEVICE				= "unlock_device_resp"		//参数:(是否成功)
//
var RESP_GEN_CERTREQ 				= "gen_cert_csr_resp"		//参数:(csr|regCode)
var RESP_IMPORT_CERT_KEYPAIR_PFX	= "import_dualcert_keypair_resp"	//参数:(是否成功)
var RESP_IMPORT_CERT_KEYPAIR_ENC	= "import_dualcert_keypair_enc_resp"//参数:(是否成功)
var RESP_IMPORT_DUAL_CERT			= "import_dualcert_resp"	//参数:(是否成功)
var RESP_IMPORT_SIGN_CERT			= "import_cert_resp"		//参数:(是否成功)
//
/* 设备事件消息定义 */
var RESP_DEVICE_EVENT				= "device_event_resp"		//参数:(事件类型)(设备序号)(DevName)

/* 签名操作时的附加信息定义 */
var RSA_SIGATURE_DESC 				= "";
var SM2_SIGATURE_DESC 				= "1234567812345678";

/* FUNC_CERT_ATTRIBUTE操作附加参数定义 */
var FUNC_CERT_ATTRIBUTE_PARAM_SN		= "cert_sn"			//证书序列号
var FUNC_CERT_ATTRIBUTE_PARAM_TYPE		= "cert_type"		//证书用户类型，个人证书还是企业证书
var FUNC_CERT_ATTRIBUTE_PARAM_USAGE		= "cert_usage"		//证书用途，签名证书还是加密证书
var FUNC_CERT_ATTRIBUTE_PARAM_SUBJECT	= "cert_subject"	//证书主题项，可以指定获取具体哪个节点的值
var FUNC_CERT_ATTRIBUTE_PARAM_ISSUER	= "cert_issuer"		//证书颁发者项，可以指定获取具体哪个节点的值
var FUNC_CERT_ATTRIBUTE_PARAM_REGISTED	= "cert_registed"	//证书是否注册
var FUNC_CERT_ATTRIBUTE_PARAM_VALIDDATE	= "cert_validdate"	//证书的起始日期
var FUNC_CERT_ATTRIBUTE_PARAM_KEYID		= "cert_keyid"		//密钥标识
var FUNC_CERT_ATTRIBUTE_PARAM_IDCARD	= "cert_idcard"		//个人身份证号
var FUNC_CERT_ATTRIBUTE_PARAM_IC_CODE	= "cert_iccode"		//工商注册号
var FUNC_CERT_ATTRIBUTE_PARAM_ORG_CODE	= "cert_orgcode"	//组织机构代码
var FUNC_CERT_ATTRIBUTE_PARAM_SS_CODE	= "cert_sscode"		//社保号
var FUNC_CERT_ATTRIBUTE_PARAM_USCCODE	= "cert_usccode"	//企业信用代码


function OkRespObject(res) {
	return RespObject(0, "执行成功！", res);
}
function FailedRespObject(code, msg) {
	return RespObject(code, msg, null);	
}
function RespObject(code, msg, param) {
	var result = {
		code:code,
		msg:msg,
		res:param
	};	
	return result;
}
