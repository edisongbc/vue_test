/*
 * ZJCA CMT Script Interface for HTML
 * Version: v0.0.1
 * Date: 2018-04-25
 * 2015 - 2016 ZJCA. All rights reserved.
 *
 *
*/


/* FUNC_CERT_ATTRIBUTE操作附加参数定义 */
var FUNC_CERT_ATTRIBUTE_PARAM_SN		= "cert_sn"			//证书序列号
var FUNC_CERT_ATTRIBUTE_PARAM_TYPE		= "cert_type"		//证书用户类型，个人证书还是企业证书
var FUNC_CERT_ATTRIBUTE_PARAM_KEYALG	= "cert_keyalg"		//证书密钥算法
var FUNC_CERT_ATTRIBUTE_PARAM_DIGESTALG	= "cert_digestalg"	//证书杂凑算法
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

/* 证书常用扩展项属性Object ID定义 */
var ZJCA_CERT_EXT_AUTHORITY_KEY_IDENTIFIER	= "2.5.29.1"
var ZJCA_CERT_EXT_KEY_ATTRIBUTES			= "2.5.29.2"
var ZJCA_CERT_EXT_CERT_POLICIES_95			= "2.5.29.3"
var ZJCA_CERT_EXT_KEY_USAGE_RESTRICTION		= "2.5.29.4"
var ZJCA_CERT_EXT_SUBJECT_ALT_NAME			= "2.5.29.7"
var ZJCA_CERT_EXT_ISSUER_ALT_NAME			= "2.5.29.8"
var ZJCA_CERT_EXT_BASIC_CONSTRAINTS			= "2.5.29.10"
var ZJCA_CERT_EXT_SUBJECT_KEY_IDENTIFIER	= "2.5.29.14"				// 使用者密钥标识符
var ZJCA_CERT_EXT_KEY_USAGE					= "2.5.29.15"				// 密钥用法
var ZJCA_CERT_EXT_PRIVATEKEY_USAGE_PERIOD	= "2.5.29.16"
var ZJCA_CERT_EXT_BASIC_CONSTRAINTS2		= "2.5.29.19"				// 基本约束
var ZJCA_CERT_EXT_CRL_DIST_POINTS			= "2.5.29.31"				// CRL 分发点
var ZJCA_CERT_EXT_AUTHORITY_KEY_IDENTIFIER2	= "2.5.29.35"				// 颁发机构密钥标识符
var ZJCA_CERT_EXT_ENHANCED_KEY_USAGE		= "2.5.29.37"				// 增强型密钥用法
var ZJCA_CERT_EXT_AUTHORITY_INFO_ACCESS		= "1.3.6.1.5.5.7.1.1"		// 颁发机构信息访问
var ZJCA_CERT_EXT_SUBJECT_INFO_ACCESS		= "1.3.6.1.5.5.7.1.11"
var ZJCA_CERT_EXT_NETSCAPE_CERT_TYPE		= "2.16.840.1.113730.1.1"	// Netscape Cert Type
//
var ZJCA_CERT_EXT_PERSONALCARD_ID			= "1.2.156.10260.4.1.1"		//个人身份证号
var ZJCA_CERT_EXT_SOCAILSECURITY_CODE		= "1.2.156.10260.4.1.2"		//社保号
var ZJCA_CERT_EXT_INDUSTRYCOMMERCE_CODE		= "1.2.156.10260.4.1.3"		//工商注册号
var ZJCA_CERT_EXT_ORGANIZATION_CODE			= "1.2.156.10260.4.1.4"		//组织机构代码
var ZJCA_CERT_EXT_TAX_CODE					= "1.2.156.10260.4.1.5"		//税号
var ZJCA_CERT_EXT_SYSTEM_USERNAME			= "1.2.156.112573.14"		//系统用户名

function edisongbc() {
  alert("edisongbc");
}

/* 返回浏览器是否是IE */
function isIE(){
	if (!!window.ActiveXObject || "ActiveXObject" in window) {
		return true;
	}else{
		return false;
	}
}

/* 返回浏览器是否是Chrome */
function isChrome(){
	return (navigator.userAgent.indexOf("Chrome") > -1) ? true : false;
}

/* 返回浏览器是否是Firefox */
function isFF(){
	return (navigator.userAgent.indexOf("Firefox") != -1) ? true : false;
}

function zjca_CMT(eventCallback, reversed) {
	var _zjcaObject = null;
	var _onKeyEvent = eventCallback;

	/*
	 *	功能：初始化函数，请在页面加载时调用
	 *	参数：product:客户端产品编号，1-ZJCA通用版客户端；2-政务版客户端；3-法人正客户端
	 *	 	  version:客户端版本(目前只支持"1")
	 *	返回：无
	 */
	this.init = function (product, version) {
		try {
			if (isIE()) {
				_zjcaObject = new zjca_COM(_onKeyEvent);
			}
			else if (isFF()) {
				//_zjcaObject = new zjca_NPAPI(_onKeyEvent);
				_zjcaObject = new zjca_Websocket(_onKeyEvent);
			}
			else {
				_zjcaObject = new zjca_Websocket(_onKeyEvent);
			}
			return _zjcaObject.init(product, version);;
		}catch (e) {
			if (isIE()) {
				return FailedRespObject(0x80000002, "ZJCA客户端未安装!");
			}else {
				return FailedRespObject(0x80000001, "该版本不支持非IE浏览器!");
			}
		}
	}
	/*
	 *	功能：结束函数，请在页面关闭前调用
	 *	参数：无
	 *	返回：无
	 */
	this.finaled = function () {
		if (_zjcaObject) {
			_zjcaObject.finaled();
		}
	}
	/*
	 *	功能：获取客户端版本信息
	 *	参数：无
	 *	返回：客户端软件版本信息
	 */
	this.getVersion = function () {
		return _zjcaObject.getVersion();
	}
	/*
	 *	功能：获取用户选项设置
	 *	参数：opt:选项类型,ZJCA_OPTION_AUTORUN/ZJCA_OPTION_CHECKUPDATE/ZJCA_OPTION_SHOWPAGE
	 *	返回：当前设置的值
	 */
	this.getUserSetting = function (opt) {
		return _zjcaObject.getUserSetting(opt);
	}
	/*
	 *	功能：保存用户选项设置
	 *	参数：opt:选项类型,ZJCA_OPTION_AUTORUN/ZJCA_OPTION_CHECKUPDATE/ZJCA_OPTION_SHOWPAGE
	 *        val:选项值,1或则0
	 *	返回：当前设置的值
	 */
	this.putUserSetting = function (opt, val) {
		return _zjcaObject.putUserSetting(opt, val);
	}
	/*
	 *	功能：枚举Key信息
	 *	参数：无
	 *	返回：介质信息列表
	 */
	this.getKeyList = function (forceUpdate) {
		return _zjcaObject.getKeyList(Number(forceUpdate));
	}
	/*
	 *	功能：枚举Key中的证书信息列表
	 *	参数：keyIndex:Key的序号,-1表示不限定设备
	 *		  alg:证书的算法类型,0:枚举所有证书;1:只枚举RSA证书;2:只枚举SM2证书
	 *		  usage:证书的用途,0:枚举所有证书;1:只枚举签名证书;2:只枚举加密证书
	 *	返回：证书信息列表
	 */
	this.getCertList = function (keyIndex, alg, usage, flags) {
		return _zjcaObject.getCertList(Number(keyIndex), Number(alg), Number(usage), Number(flags));
	}
	/*
	 *	功能：获取某一证书的内容
	 *	参数：certSN:证书序号
	 *	返回：证书的内容
	 */
	this.getCertContentBySN = function (certSN) {
		return _zjcaObject.getCertContentBySN(certSN);
	}
	/*
	 *	功能：获取某一证书的内容
	 *	参数：keyIndex:Key的序号
	 *		  alg:证书的算法类型,1:RSA证书;2:SM2证书
	 *		  usage:证书的用途,1:签名证书;2:加密证书
	 *	返回：证书的内容
	 */
	this.getCertContent = function (keyIndex, alg, usage) {
		return _zjcaObject.getCertContent(Number(keyIndex), Number(alg), Number(usage));
	}
	/*
	 *	功能：解码证书内容，返回该证书的句柄，使用完成之后需要调用releaseCert()释放！
	 *	参数：certBase64:证书内容(Base64格式)
	 *	返回：证书句柄
	 */
	this.decodeCert = function (certBase64) {
		return _zjcaObject.decodeCert(certBase64);
	}
	/*
	 *	功能：获取证书的某个属性值
	 *	参数：certHandle:证书句柄，是调用decodeCert()得到的！
	 *		  attrName:属性名
	 *		  attrParam:附加参数
	 *	返回：证书属性值
	 */
	this.getCertAttribute = function (certHandle, attrName, attrParam) {
		var resp = _zjcaObject.getCertAttribute(certHandle, attrName, attrParam);
		if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_VALIDDATE) {
			if (resp.code == 0) {
				var validDate = resp.res.split("|");
				var fromDate = validDate[0];
				var endDate = validDate[1];
				return OkRespObject({fromDate:fromDate,endDate:endDate});
			}
		}else {
			return resp;
		}
	}
	/*
	 *	功能：获取证书的某个扩展项
	 *	参数：certHandle:证书句柄，是调用decodeCert()得到的！
	 *		  extOid:扩展项的Object ID
	 *	返回：证书扩展属性值
	 */
	this.getCertExtension = function (certHandle, extOid) {
		return _zjcaObject.getCertExtension(certHandle, extOid);
	}
	/*
	 *	功能：释放证书句柄
	 *	参数：certHandle:证书句柄，是调用decodeCert()得到的！
	 *	返回：无
	 */
	this.releaseCert = function (certHandle) {
		return _zjcaObject.releaseCert(certHandle);
	}
	/*
	 *	功能：显示证书
	 *	参数：certBase64:证书内容
	 *		  hwnd:父窗口句柄，可以为空
	 *	返回：无
	 */
	this.showCert = function (certBase64, hwnd) {
		return _zjcaObject.showCert(certBase64, Number(hwnd));
	}
	/*
	 *	功能：验证证书
	 *	参数：certBase64:证书内容
	 *		  flags:验证哪些项，1:只验证有效期；2:只验证签名；4:只验证CRL；可以为这三者的任意组合
	 *	返回：验证结果
	 */
	this.verifyCert = function (certBase64, flags) {
		return _zjcaObject.verifyCert(certBase64, Number(flags));
	}
	/*
	 *	功能：通过选择证书来签名消息
	 *	参数：cert:使用哪个证书签名
	 *		  type:签名类型，1-P1;2-P7
	 *		  flags:签名包含哪些项，0x01:包含证书；0x02:包含原文；0x04:包含时间；可以为这三者的任意组合
	 *		  msg:待签名的消息
	 *		  userId:杂凑时的UserID，如果是RSA签名，建议使用“”；如果是SM2签名，建议使用“1234567812345678”
	 *	返回：签名结果
	 */
	this.signMessageUseCert = function (cert, type, flags, msg, userId) {
		var keyIndex = cert.getKeyIndex();
		var alg = cert.getAlg();
		var charset = 0x03; //UTF8
		if (keyIndex == -1) {
			return _zjcaObject.signMessageByCert(cert, Number(type), Number(flags), msg, userId, Number(charset));
		}else {
			return _zjcaObject.signMessage(Number(keyIndex), Number(alg), Number(type), Number(flags), msg, userId, Number(charset));
		}
	}
	/*
	 *	功能：通过选择介质来签名消息
	 *	参数：keyIndex:使用哪个设备签名
	 *		  alg:签名算法，0-默认;1-RSA;2-SM2，
	 *		  type:签名类型，1-P1;2-P7
	 *		  flags:签名包含哪些项，0x01:包含证书；0x02:包含原文；0x04:包含时间；可以为这三者的任意组合
	 *		  msg:待签名的消息
	 *		  userId:杂凑时的UserID，如果是RSA签名，建议使用“”；如果是SM2签名，建议使用“1234567812345678”
	 *	返回：签名结果
	 */
	this.signMessageUseKey = function (keyIndex, alg, type, flags, msg, userId) {
		var charset = 0x03; //UTF8
		//var userId = (1 == alg) ? RSA_SIGATURE_DESC : SM2_SIGATURE_DESC;
		return _zjcaObject.signMessage(Number(keyIndex), Number(alg), Number(type), Number(flags), msg, userId, Number(charset));
	}
	/*
	 *	功能：验证消息的签名
	 *	参数：keyIndex:使用哪个设备验签，如果使用软件验签，需设置为-1。
	 *		  msg:原文消息，如果签名本身包含原文，则可以设置为空。
	 *        base64Sign:Base64格式的签名
	 *		  base64Cert:Base64格式的证书，如果签名本身包含证书，则可以设置为""。
	 *		  userId:杂凑时的UserID，如果是RSA签名，建议使用""；如果是SM2签名，建议使用“1234567812345678”。若为undefined，则会根据签名证书的算法取默认值。
	 *	返回：成功返回true;否则返回false。
	 */
	this.verifyMessage = function (keyIndex, msg, base64Sign, base64Cert, userId) {
		var charset = 0x03; //UTF8
		return _zjcaObject.verifyMessage(Number(keyIndex), msg, userId, charset, base64Sign, base64Cert);
	}
	/*
	 *	功能：通过选择证书来签名数据
	 *	参数：cert:使用哪个证书签名
	 *		  type:签名类型，1-P1;2-P7
	 *		  flags:签名包含哪些项，0x01:包含证书；0x02:包含原文；0x04:包含时间；可以为这三者的任意组合
	 *		  data_txt:待签名的数据字符串(base64或16进制)
	 *		  encode:data_txt的编码，Base64或Hex字符串。
	 *		  userId:杂凑时的UserID，如果是RSA签名，建议使用“”；如果是SM2签名，建议使用“1234567812345678”
	 *	返回：签名结果
	 */
	this.signDataUseCert = function (cert, type, flags, data_txt, encode, userId) {
		var keyIndex = cert.getKeyIndex();
		var alg = cert.getAlg();

		if (keyIndex == -1) {
			return _zjcaObject.signMessageByCert(cert, Number(type), Number(flags), data_txt, userId, Number(encode));
		}else {
			return _zjcaObject.signMessage(Number(keyIndex), Number(alg), Number(type), Number(flags), data_txt, userId, Number(encode));
		}
	}
	/*
	 *	功能：通过选择介质来签名数据
	 *	参数：keyIndex:使用哪个设备签名
	 *		  alg:签名算法，0-默认;1-RSA;2-SM2，
	 *		  type:签名类型，1-P1;2-P7
	 *		  flags:签名包含哪些项，0x01:包含证书；0x02:包含原文；0x04:包含时间；可以为这三者的任意组合
	 *		  data_txt:待签名的数据字符串(base64或16进制)
	 *		  encode:data_txt的编码，Base64或Hex字符串。
	 *		  userId:杂凑时的UserID，如果是RSA签名，建议使用“”；如果是SM2签名，建议使用“1234567812345678”
	 *	返回：签名结果
	 */
	this.signDataUseKey = function (keyIndex, alg, type, flags, data_txt, encode, userId) {
		return _zjcaObject.signMessage(Number(keyIndex), Number(alg), Number(type), Number(flags), data_txt, userId, Number(encode));
	}
	/*
	 *	功能：验证数据的签名
	 *	参数：keyIndex:使用哪个设备验签，如果使用软件验签，需设置为-1。
	 *		  data_txt:原文数据字符串，如果签名本身包含原文，则可以设置为空。
	 *		  encode:data_txt的编码，Base64或Hex字符串。
	 *        base64Sign:Base64格式的签名
	 *		  base64Cert:Base64格式的证书，如果签名本身包含证书，则可以设置为""。
	 *		  userId:杂凑时的UserID，如果是RSA签名，建议使用""；如果是SM2签名，建议使用“1234567812345678”。若为undefined，则会根据签名证书的算法取默认值。
	 *	返回：成功返回true;否则返回false。
	 */
	this.verifyData = function (keyIndex, data_txt, encode, base64Sign, base64Cert, userId) {
		return _zjcaObject.verifyMessage(Number(keyIndex), data_txt, userId, Number(encode), base64Sign, base64Cert);
	}
	/*
	 *	功能：通过选择证书来签名文件
	 *	参数：cert:使用哪个证书签名
	 *		  type:签名类型，1-P1;2-P7
	 *		  flags:签名包含哪些项，0x01:包含证书；0x02:包含原文(不支持)；0x04:包含时间；可以为这三者的任意组合
	 *		  file:待签名的文件名
	 *		  userId:杂凑时的UserID，如果是RSA签名，建议使用“”；如果是SM2签名，建议使用“1234567812345678”。若为undefined，则会根据签名证书的算法取默认值。
	 *		  callback:结果回调函数，如果不设置则为同步模式。
	 *	返回：签名结果
	 */
	this.signFileUseCert = function (cert, type, flags, file, userId, callback) {
		var keyIndex = cert.getKeyIndex();
		var alg = cert.getAlg();
		return _zjcaObject.signFile(Number(keyIndex), Number(alg), Number(type), Number(flags), file, userId, callback);
	}
	/*
	 *	功能：通过选择介质来签名文件
	 *	参数：keyIndex:使用哪个设备签名
	 *		  alg:签名算法，0-默认;1-RSA;2-SM2
	 *		  type:签名类型，1-P1;2-P7
	 *		  flags:签名包含哪些项，0x01:包含证书；0x02:包含原文(不支持)；0x04:包含时间；可以为这三者的任意组合
	 *		  file:待签名的文件名
	 *		  userId:杂凑时的UserID，如果是RSA签名，建议使用“”；如果是SM2签名，建议使用“1234567812345678”。若为undefined，则会根据签名证书的算法取默认值。
	 *		  callback:结果回调函数，如果不设置则为同步模式。
	 *	返回：签名结果
	 */
	this.signFileUseKey = function (keyIndex, alg, type, flags, file, userId, callback) {
		return _zjcaObject.signFile(Number(keyIndex), Number(alg), Number(type), Number(flags), file, userId, callback);
	}
	/*
	 *	功能：验证文件的签名
	 *	参数：keyIndex:使用哪个设备验签，如果使用软件验签，需设置为-1。
	 *		  file:原文文件名。
	 *        base64Sign:Base64格式的签名
	 *		  base64Cert:Base64格式的证书，如果签名本身包含证书，则可以设置为""。
	 *		  userId:杂凑时的UserID，如果是RSA签名，建议使用""；如果是SM2签名，建议使用“1234567812345678”。若为undefined，则会根据签名证书的算法取默认值。
	 *		  callback:结果回调函数，如果不设置则为同步模式。
	 *	返回：成功返回true;否则返回false。
	 */
	this.verifyFile = function (keyIndex, file, base64Sign, base64Cert, userId, callback) {
		return _zjcaObject.verifyFile(Number(keyIndex), file, userId, base64Sign, base64Cert, callback);
	}
	/*
	 *	功能：通过选择证书来签名杂凑
	 *	参数：cert:使用哪个证书签名
	 *		  type:签名类型，1-P1;2-P7
	 *		  flags:签名包含哪些项，0x01:包含证书；0x02:包含原文(不支持)；0x04:包含时间；可以为这三者的任意组合
	 *		  digest:待签名的值，Base64编码。
	 *		  digestAlg:杂凑算法，MD5-0x200;SHA1-0x400;SHA256-0x800;SHA384-0x1000;SHA512:0x2000;SM3:0x4000
	 *	返回：签名结果
	 */
	this.signDigestUseCert = function (cert, type, flags, digest, digestAlg) {
		var keyIndex = cert.getKeyIndex();
		var alg = cert.getAlg();
		return _zjcaObject.signDigest(Number(keyIndex), Number(alg), Number(type), Number(flags), digest, Number(digestAlg));
	}
	/*
	 *	功能：通过选择介质来签名杂凑值
	 *	参数：cert:使用哪个证书签名
	 *		  type:签名类型，1-P1;2-P7
	 *		  flags:签名包含哪些项，0x01:包含证书；0x02:包含原文(不支持)；0x04:包含时间；可以为这三者的任意组合
	 *		  digest:待签名的值，Base64编码。
	 *		  digestAlg:杂凑算法，MD5-0x200;SHA1-0x400;SHA256-0x800;SHA384-0x1000;SHA512:0x2000;SM3:0x4000
	 *	返回：签名结果
	 */
	this.signDigestUseKey = function (keyIndex, alg, type, flags, digest, digestAlg) {
		return _zjcaObject.signDigest(Number(keyIndex), Number(alg), Number(type), Number(flags), digest, Number(digestAlg));
	}
	/*
	 *	功能：验证杂凑的签名
	 *	参数：keyIndex:使用哪个设备验签，如果使用软件验签，需设置为-1。
	 *		  digest:待签名的值，Base64编码。
	 *		  digestAlg:杂凑算法，MD5-0x200;SHA1-0x400;SHA256-0x800;SHA384-0x1000;SHA512:0x2000;SM3:0x4000
	 *        base64Sign:Base64格式的签名
	 *		  base64Cert:Base64格式的证书，如果签名本身包含证书，则可以设置为""。
	 *	返回：成功返回true;否则返回false。
	 */
	this.verifyDigest = function (keyIndex, digest, digestAlg, base64Sign, base64Cert) {
		return _zjcaObject.verifyDigest(Number(keyIndex), digest, Number(digestAlg), base64Sign, base64Cert);
	}
	/*
	 *	功能：获取P7签名中的附加信息
	 *	参数：base64Sign:Base64格式的P7签名
	 *	返回：签名中的附加属性：原文、时间、证书等信息
	 */
	this.getSignatureAttached = function (base64Sign) {
		var charset = 0x03;
		return _zjcaObject.getSignatureAttached(base64Sign, Number(charset));
	}
	/*
	 *	功能：加密消息
	 *	参数：keyIndex:使用哪个设备加密
	 *		  base64Cert:加密证书
	 *		  msg:待加密的原文消息
	 *        charset:原文字符集
	 *		  symmAlg:对称算法
	 *		  cipherType:密文封装类型，P1还是P7
	 *		  paddingType:对称加密补齐类型
	 *		  des_file:密文文件名，不指定则以Base64字符串形式返回密文。
	 *		  callback:结果回调函数，如何不指定则为同步模式。
	 *	返回：如果callback为空，则返回结果(如果des_file为空，则返回密文，Base64格式)
	 */
	this.encryptMessage = function (keyIndex, base64Cert, msg, symmAlg, cipherType, paddingType, des_file, callback) {
		var charset = 0x03; //UTF8
		return _zjcaObject.encryptMessage(Number(keyIndex), base64Cert, msg, charset, Number(symmAlg), Number(cipherType), Number(paddingType), des_file, callback);
	}
	/*
	 *	功能：使用选择的介质解密消息
	 *	参数：keyIndex:使用哪个设备加密
	 *		  asymmAlg:非对称算法
	 *		  symmAlg:对称算法
	 *		  paddingType:对称加密补齐类型
	 *		  base64Cipher:Base64密文
	 *		  des_file:解密后的文件名，不指定则以原文字符串形式返回解密结果。
	 *		  callback:结果回调函数，如何不指定则为同步模式。
	 *	返回：如果callback为空，则返回结果(如果des_file为空，则返回密文，Base64格式)
	 */
	this.decryptMessageUseKey = function (keyIndex, asymmAlg, symmAlg, paddingType, base64Cipher, des_file, callback) {
		var charset = 0x03; //UTF8
		return _zjcaObject.decryptMessage(Number(keyIndex), Number(asymmAlg), Number(symmAlg), Number(paddingType), base64Cipher, charset, des_file, callback);
	}
	/*
	 *	功能：使用选择的证书解密消息
	 *	参数：cert:使用哪个证书签名
	 *		  symmAlg:对称算法
	 *		  paddingType:对称加密补齐类型
	 *		  base64Cipher:Base64密文
	 *		  des_file:解密后的文件名，不指定则以原文字符串形式返回解密结果。
	 *		  callback:结果回调函数，如何不指定则为同步模式。
	 *	返回：如果callback为空，则返回结果(如果des_file为空，则返回原文字符串)
	 */
	this.decryptMessageUseCert = function (cert, symmAlg, paddingType, base64Cipher, des_file, callback) {
		var keyIndex = cert.getKeyIndex();
		var asymmAlg = cert.getAlg();
		var charset = 0x03; //UTF8
		return _zjcaObject.decryptMessage(Number(keyIndex), Number(asymmAlg), Number(symmAlg), Number(paddingType), base64Cipher, charset, des_file, callback);
	}
	/*
	 *	功能：加密文件
	 *	参数：keyIndex:使用哪个设备加密
	 *		  base64Cert:加密证书
	 *		  srcFile:待加密的文件名
	 *        desFile:密文文件名，如果空则直接返回密文字符串
	 *		  symmAlg:对称算法
	 *		  cipherType:密文封装类型，P1还是P7
	 *		  paddingType:对称加密补齐类型
	 *		  callback:结果回调函数，如何不指定则为同步模式。
	 *	返回：如果callback为空，则返回结果(如果des_file为空，则返回密文Base64字符串)
	 */
	this.encryptFile = function (keyIndex, base64Cert, srcFile, desFile, symmAlg, cipherType, paddingType, callback) {
		return _zjcaObject.encryptFile(Number(keyIndex), base64Cert, srcFile, desFile, Number(symmAlg), Number(cipherType), Number(paddingType), callback);
	}
	/*
	 *	功能：使用选择的介质解密文件
	 *	参数：keyIndex:使用哪个设备加密
	 *		  asymmAlg:非对称算法
	 *		  symmAlg:对称算法
	 *		  paddingType:对称加密补齐类型
	 *		  cipherFile:密文文件名
	 *        desFile:解密后的文件名,如不指定则直接返回密文Base64字符串(最大只支持100M)
	 *		  callback:结果回调函数，如何不指定则为同步模式。
	 *	返回：如果callback为空，则返回结果(如果des_file为空，则返回密文Base64字符串)
	 */
	this.decryptFileUseKey = function (keyIndex, asymmAlg, symmAlg, paddingType, cipherFile, desFile, callback) {
		return _zjcaObject.decryptFile(Number(keyIndex), Number(asymmAlg), Number(symmAlg), Number(paddingType), cipherFile, desFile, callback);
	}
	/*
	 *	功能：使用选择的证书解密文件
	 *	参数：cert:使用哪个证书签名
	 *		  symmAlg:对称算法
	 *		  paddingType:对称加密补齐类型
	 *		  cipherFile:密文文件名
	 *        desFile:解密后的文件名
	 *		  callback:结果回调函数，如何不指定则为同步模式。
	 *	返回：如果callback为空，则返回结果(如果des_file为空，则返回密文Base64字符串)
	 */
	this.decryptFileUseCert = function (cert, symmAlg, paddingType, cipherFile, desFile, callback) {
		var keyIndex = cert.getKeyIndex();
		var asymmAlg = cert.getAlg();
		return _zjcaObject.decryptFile(Number(keyIndex), Number(asymmAlg), Number(symmAlg), Number(paddingType), cipherFile, desFile, callback);
	}
	/*
	 *	功能：显示文件选择对话框，返回选择的文件名
	 *	参数：caption:文件对话框Caption
	 *		  filter:文件对话框的Filter
	 *	返回：选择的文件名
	 */
	this.getFileName = function (is_open, caption, filter) {
		return _zjcaObject.getFileName(is_open, caption, filter);
	}
	/*
	 *	功能：显示路径选择对话框，返回选择的路径名
	 *	参数：caption:路径选择对话框Caption
	 *		  defPath:缺省路径
	 *	返回：选择的路径名
	 */
	this.getPathName = function (caption, defPath) {
		return _zjcaObject.getPathName(caption);
	}
	/*
	 *	功能：读取文件内容，base64格式返回
	 *	参数：fileName:文件名
	 *	返回：文件内容，base64格式
	 */
	this.readFile = function (fileName) {
		return _zjcaObject.readFile(fileName);
	}
	/*
	 *	功能：写文件内容
	 *	参数：fileName:文件名
	 *		  content:文件内容
	 *		  inBinary:是否是二进制文件，如果是，则content为base64编码。
	 *	返回：成功或错误代码
	 */
	this.writeFile = function (fileName, content, inBinary) {
		return _zjcaObject.writeFile(fileName, content, Number(inBinary));
	}
	/*
	 *	功能：删除文件
	 *	参数：fileName:文件名
	 *	返回：成功或错误代码
	 */
	this.deleteFile = function (fileName) {
		return _zjcaObject.deleteFile(fileName);
	}
	/*
	 *	功能：创建目录(文件夹)
	 *	参数：folderName:目录名
	 *	返回：成功或错误代码
	 */
	this.createFolder = function (folderName) {
		return _zjcaObject.createFolder(folderName);
	}
	/*
	 *	功能：打开目录(文件夹)
	 *	参数：folderName:目录名
	 *	返回：成功或错误代码
	 */
	this.openFolder = function (folderName) {
		return _zjcaObject.openFolder(folderName);
	}
	/*
	 *	功能：删除目录(文件夹)
	 *	参数：folderName:文件名
	 *	返回：成功或错误代码
	 */
	this.deleteFolder = function (folderName) {
		return _zjcaObject.deleteFolder(folderName);
	}
	/*
	 *	功能：生成授权请求
	 *	参数：keyIndex:Key的序号
	 *		  authType:授权类型，0x01:初始化；0x02:解锁；0x04:制证
	 *	返回：请求码
	 */
	this.genAuthReq = function (keyIndex, authType) {
		return _zjcaObject.genAuthReq(Number(keyIndex), Number(authType));
	}
	/*
	 *	功能：初始化设备
	 *	参数：keyIndex:Key的序号
	 *		  authCode:授权码
	 *		  userPIN:用户初始PIN，为空则会弹出PIN设置对话框。
	 *		  label:设备标签，为空则保持不变。
	 *	返回：成功或错误代码
	 */
	this.initKey = function (keyIndex, authCode, userPIN, label) {
		return _zjcaObject.initKey(Number(keyIndex), authCode, userPIN, label);
	}
	/*
	 *	功能：校验用户PIN
	 *	参数：keyIndex:Key的序号
	 *		  userPIN:用户PIN码，为空则弹出PIN码设置框
	 *	返回：成功或错误代码
	 */
	this.verifyPin = function (keyIndex, userPIN) {
		return _zjcaObject.verifyPin(Number(keyIndex), userPIN);
	}
	/*
	 *	功能：解锁设备
	 *	参数：keyIndex:Key的序号
	 *		  authCode:授权码
	 *		  newPIN:新PIN码，为空则弹出PIN码设置框
	 *	返回：成功或错误代码
	 */
	this.unlockPin = function (keyIndex, authCode, newPIN) {
		return _zjcaObject.unlockPin(Number(keyIndex), authCode, newPIN);
	}
	/*
	 *	功能：修改用户PIN码
	 *	参数：keyIndex:Key的序号
	 *		  oldPIN:旧PIN码，为空则弹出PIN码设置框
	 *		  newPIN:新PIN码，为空则弹出PIN码设置框
	 *	返回：成功或错误代码
	 */
	this.changePin = function (keyIndex, oldPIN, newPIN) {
		return _zjcaObject.changePin(Number(keyIndex), oldPIN, newPIN);
	}
	/*
	 *	功能：生成证书请求
	 *	参数：keyIndex:Key的序号
	 *		  certAlg:证书算法，1-RSA；2-SM2
	 *		  newKeypair:true-新生成签名密钥对；false-使用老的签名密钥对
	 *		  cn:主体名，暂时随便传
	 *		  pin:校验用户PIN码，若不传则会弹出PIN码输入框。
	 *	返回：CSR
	 */
	this.genCertReq = function (keyIndex, certAlg, newKeypair, bits, cn, pin) {
		return _zjcaObject.genCertReq(Number(keyIndex), Number(certAlg), Number(newKeypair), Number(bits), cn, pin);
	}
	/*
	 *	功能：导入证书和加密密钥对(PFX格式)，该函数仅适用于RSA证书、且加密密钥对为PFX格式的情况。
	 *	参数：keyIndex:Key的序号
	 *		  signCert:签名证书
	 *		  exchCert:加密证书
	 *		  pfx:PFX证书
	 *		  authCode:授权码
	 *	返回：成功或错误代码
	 */
	this.importCertAndPfx = function (keyIndex, signCert, exchCert, pfx, authCode) {
		return _zjcaObject.importCertAndPfx(Number(keyIndex), signCert, exchCert, pfx, authCode);
	}
	/*
	 *	功能：导入证书和加密密钥对(密文格式)
	 *	参数：keyIndex:Key的序号
	 *		  alg:证书算法，1-RSA；2-SM2
	 *		  signCert:签名证书
	 *		  exchCert:加密证书
	 *		  keyPair:加密密钥对密文
	 *		  symmAlgOid:对称密钥算法oid
	 *		  symmCipher:对称密钥密文
	 *		  authCode:授权码
	 *	返回：成功或错误代码
	 */
	this.importCertAndEncKeyPair = function (keyIndex, alg, signCert, exchCert, keyPair, symmAlgOid, symmCipher, authCode){
		var symmAlgID = 0x10;

		// 转换算法ID(仅RSA需要)
		if (1 == alg) {
			if (symmAlgOid == "1.3.14.3.2.7") {
				symmAlgID = 0x04;//ZJCA_SYMM_DES;
			} else if (symmAlgOid == "1.2.840.113549.3.7")	{
				symmAlgID = 0x08;//ZJCA_SYMM_3DES;
			} else if (symmAlgOid == "1.2.156.10197.1.102") {
				symmAlgID = 0x10;//ZJCA_SYMM_SM1_ECB;
			} else if (symmAlgOid == "1.2.156.10197.1.104") {
				symmAlgID = 0x20;//ZJCA_SYMM_SM4_ECB;
			} else {
				return FailedRespObject(-1, "对称密钥算法OID不可识别！");
			}
		}
		return _zjcaObject.importCertAndEncKeyPair(Number(keyIndex), Number(alg), signCert, exchCert, keyPair, Number(symmAlgID), symmCipher, authCode);
	}
	/*
	 *	功能：证书算法升级(导入证书和加密密钥对)
	 *	参数：keyIndex:Key的序号
	 *		  old_alg:老证书算法，只能是1-RSA
	 *		  new_alg:新证书算法，只能是2-SM2
	 *		  signCert:签名证书
	 *		  exchCert:加密证书
	 *		  keyPair:加密密钥对密文
	 *		  symmAlgOid:对称密钥算法oid
	 *		  symmCipher:对称密钥密文
	 *		  authCode:授权码
	 *	返回：成功或错误代码
	 */
	this.importUpgradedCertAndKeyPair = function (keyIndex, old_alg, new_alg, signCert, exchCert, keyPair, symmAlgOid, symmCipher, authCode){
		var symmAlgID = 0x10;

		// 转换算法ID(仅RSA需要)
		if (1 == new_alg) {
			if (symmAlgOid == "1.3.14.3.2.7") {
				symmAlgID = 0x04;//ZJCA_SYMM_DES;
			} else if (symmAlgOid == "1.2.840.113549.3.7")	{
				symmAlgID = 0x08;//ZJCA_SYMM_3DES;
			} else if (symmAlgOid == "1.2.156.10197.1.102") {
				symmAlgID = 0x10;//ZJCA_SYMM_SM1_ECB;
			} else if (symmAlgOid == "1.2.156.10197.1.104") {
				symmAlgID = 0x20;//ZJCA_SYMM_SM4_ECB;
			} else {
				return FailedRespObject(-1, "对称密钥算法OID不可识别！");
			}
		}
		return _zjcaObject.importUpgradedCertAndKeyPair(Number(keyIndex), Number(old_alg), Number(new_alg), signCert, exchCert, keyPair, Number(symmAlgID), symmCipher, authCode);
	}
	/*
	 *	功能：导入双证书，适用于密钥对不更新的情况，比如“延期”。
	 *	参数：keyIndex:Key的序号
	 *		  alg:证书算法，1-RSA；2-SM2
	 *		  signCert:签名证书
	 *		  exchCert:加密证书
	 *	返回：成功或错误代码
	 */
	this.importDualCert = function (keyIndex, alg, signCert, exchCert){
		return _zjcaObject.importDualCert(Number(keyIndex), Number(alg), signCert, exchCert);
	}
	/*
	 *	功能：导入单签名证书，适用于申请单证书的业务。
	 *	参数：keyIndex:Key的序号
	 *		  alg:证书算法，1-RSA；2-SM2
	 *		  signCert:签名证书
	 *	返回：成功或错误代码
	 */
	this.importCert = function (keyIndex, alg, signCert){
		return _zjcaObject.importCert(Number(keyIndex), Number(alg), signCert);
	}
	/*
	 *	功能：验证介质内密钥和证书是否正确
	 *	参数：keyIndex:Key的序号
	 *		  alg:证书算法，1-RSA；2-SM2
	 *		  usage:证书用途，1-验证签名密钥对和证书；2-验证加密密钥对和证书。
	 *	返回：成功或错误代码
	 */
	this.keyValidation = function (keyIndex, alg, usage){
		return _zjcaObject.keyValidation(Number(keyIndex), Number(alg), Number(usage));
	}
	/*
	 *	功能：解析时间戳，返回时间戳中的属性。
	 *	参数：ts:时间戳,Base64格式
	 *		  params:需要返回的内容,比如:"sign|time|cert|digest|digest_alg",可指定其中的某几个.
	 *	返回：成功或错误代码
	 */
	this.parseTimestamp = function (ts, params) {
		return _zjcaObject.parseTimestamp(ts, params);
	}
	/*
	 *	功能：验证时间戳(验证签名和证书链)
	 *	参数：ts:事件戳,Base64格式
	 *	      srvCert:服务器证书,Base64格式，若ts中含有证书则可以为空。
	 *	返回：成功或错误代码
	 */
	this.verifyTimestamp = function (ts, srvCert) {
		return _zjcaObject.verifyTimestamp(ts, srvCert);
	}
	/*
	 *	功能：验证时间戳(验证杂凑值、签名和证书链)
	 *	参数：ts:事件戳,Base64格式
	 *		  digest:杂凑值,Base64格式
	 *	      srvCert:服务器证书,Base64格式，若ts中含有证书则可以为空。
	 *	返回：成功或错误代码
	 */
	this.verifyTimestampWithDigest = function (ts, digest, srvCert) {
		return _zjcaObject.verifyTimestampWithDigest(ts, digest, srvCert);
	}
	/*
	 *	功能：验证时间戳(验证原文消息、签名和证书链)
	 *	参数：ts:事件戳,Base64格式
	 *		  message:消息原文
	 *		  digest_alg:杂凑算法
	 *	      srvCert:服务器证书,Base64格式，若ts中含有证书则可以为空。
	 *		  usrId:做杂凑时的UserId,可选
	 *		  usrCert:做杂凑时的证书,可选
	 *	返回：成功或错误代码
	 */
	this.verifyTimestampWithMessage = function (ts, message, digest_alg, srvCert, userId, usrCert) {
		var charset = 0x03; //UTF8
		return _zjcaObject.verifyTimestampWithMessage(ts, message, charset, digest_alg, srvCert, userId, usrCert);
	}
	/*
	 *	功能：验证时间戳(验证原文文件、签名和证书链)
	 *	参数：ts:事件戳,Base64格式
	 *		  file:原文文件名
	 *		  digest_alg:杂凑算法
	 *	      srvCert:服务器证书,Base64格式，若ts中含有证书则可以为空。
	 *		  userId:做杂凑时的UserId,可选
	 *		  usrCert:做杂凑时的证书,可选
	 *	返回：成功或错误代码
	 */
	this.verifyTimestampWithFile = function (ts, file, digest_alg, srvCert, userId, usrCert) {
		return _zjcaObject.verifyTimestampWithFile(ts, file, digest_alg, srvCert, userId, usrCert);
	}
	/*
	 *	功能：验证随机数
	 *	参数：keyIndex:Key的序号
	 *		  size:随机数大小，字节数
	 *		  format:随机数格式，0-二进制文件输出;1-文本文件(二进制字符串);2-文本文件(十六进制字符串);3-文本文件(base64字符串)
	 *		  file:输出文件名。
	 *	返回：成功或错误代码
	 */
	this.testRandrom = function (keyIndex, size, format, file){
		return _zjcaObject.testRandrom(Number(keyIndex), Number(size), Number(format), file);
	}
}
