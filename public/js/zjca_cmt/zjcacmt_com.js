/* 
 * ZJCA COM object Script Interface for HTML
 * Version: v0.0.1
 * Date: 2018-04-25
 * 2015 - 2018 ZJCA. All rights reserved.
 * 
 *
*/

if (!Array.prototype.indexOf){  
	Array.prototype.indexOf = function(elt /*, from*/){  
		var len = this.length >>> 0;  
		var from = Number(arguments[1]) || 0;  
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);  
		if (from < 0)  
		  from += len;  
		for (; from < len; from++)  
		{  
		  if (from in this &&  
			  this[from] === elt)  
			return from;  
		}  
		return -1;  
	};  
}

function zjca_COM(eventCallback) {
	var	_versionObjName = "";
	var	_enumObjName = "";
	var	_deviceObjName = "";
	var	_certObjName = "";
	var	_signObjName = "";
	var	_cipherObjName = "";
	var	_streamFactoryObjName = "";
	var	_timeStampObjName = "";
	//
	var _deviceEnum = null;
	var _certEnum = null;
	var _onKeyEvent = eventCallback;
	var _decodedCertArray = new Array;
	
	/*
	 *	初始化COM组件的名称
	 */
	function initCOMObjName(product, version) {
		if (1 == product) {			//ZJCA 通用版客户端
			_versionObjName = "ZJCAKeyManager.ZJCAVersion." + version;
			_enumObjName = "ZJCAKeyManager.ZJCADeviceEnum." + version;
			_deviceObjName = "ZJCAKeyManager.ZJCADevice." + version;
			_certEnumName = "ZJCAKeyManager.ZJCACertificateEnum." + version;
			_certObjName = "ZJCAKeyManager.ZJCACertificate." + version;
			_signObjName = "ZJCAKeyManager.ZJCASignedData." + version;
			_cipherObjName = "ZJCAKeyManager.ZJCAEnvelopedData." + version;
			_streamFactoryObjName = "ZJCAKeyManager.ZJCAStreamFactory." + version;
			_timeStampObjName = "ZJCAKeyManager.ZJCATimestamp." + version;
		}else if (2 == product) {	//ZJCA 政务版客户端
			_versionObjName = "ZJCAKeyManagerSF.ZJCAVersion." + version;
			_enumObjName = "ZJCAKeyManagerSF.ZJCADeviceEnum." + version;
			_deviceObjName = "ZJCAKeyManagerSF.ZJCADevice." + version;
			_certEnumName = "ZJCAKeyManagerSF.ZJCACertificateEnum." + version;
			_certObjName = "ZJCAKeyManagerSF.ZJCACertificate." + version;
			_signObjName = "ZJCAKeyManagerSF.ZJCASignedData." + version;
			_cipherObjName = "ZJCAKeyManagerSF.ZJCAEnvelopedData." + version;
			_streamFactoryObjName = "ZJCAKeyManagerSF.ZJCAStreamFactory." + version;
			_timeStampObjName = "ZJCAKeyManagerSF.ZJCATimestamp." + version;
		}else if (3 == product) {	//法人证客户端
			_versionObjName = "ZJCAFrCertAssistant.ZJCAVersion." + version;
			_enumObjName = "ZJCAFrCertAssistant.ZJCADeviceEnum." + version;
			_deviceObjName = "ZJCAFrCertAssistant.ZJCADevice." + version;
			_certEnumName = "ZJCAFrCertAssistant.ZJCACertificateEnum." + version;
			_certObjName = "ZJCAFrCertAssistant.ZJCACertificate." + version;
			_signObjName = "ZJCAFrCertAssistant.ZJCASignedData." + version;
			_cipherObjName = "ZJCAFrCertAssistant.ZJCAEnvelopedData." + version;
			_streamFactoryObjName = "ZJCAFrCertAssistant.ZJCAStreamFactory." + version;
			_timeStampObjName = "ZJCAFrCertAssistant.ZJCATimestamp." + version;
		}else {
			return false;
		}		
		return true;
	}
	
	/*
	 *	设备事件响应函数
	 */
	function OnKeyChanged(name, index, type) {
		if (_onKeyEvent != null) {
			_onKeyEvent(type, index, name);
		}
	}
	/*
	 *	初始化函数，请在页面加载时调用
	 */
	this.init = function (product, version) {
		var res = 0;
		if (!initCOMObjName(product, version)) {
			return FailedRespObject(0x80000001, "产品名或版本参数错误！");	
		}else {		
			try {
				this.finaled();				
				_deviceEnum = new ActiveXObject(_enumObjName);	
				_deviceEnum.AddHandler(OnKeyChanged);
				return OkRespObject(null);
			}catch (e) {
				return FailedRespObject(0x80000002, "ZJCA客户端未安装或未启动！");	
			}		
		}
	}
	/*
	 *	结束函数，请在页面关闭前调用
	 */
	this.finaled = function () {
		try {
			if (_deviceEnum) {
				_deviceEnum.RemoveHandler(OnKeyChanged);
				_deviceEnum = null;
			}
		}catch (e) {
			//不处理	
		}
		return OkRespObject(null);
	}		
	/*
	 *	获取版本信息
	 */	
	this.getVersion = function () {	
		var version = "0.0.0.0";
		
		try {
			var versionObj = new ActiveXObject(_versionObjName);
			version = versionObj.GetVersion();
			return OkRespObject(version);
		}catch (e) {
			return FailedRespObject(e.number, e.description);	
		}
	}	
	/*
	 *	功能：获取用户选项设置
	 */
	this.getUserSetting = function (opt) {
		var val = 0;
		
		try {
			var versionObj = new ActiveXObject(_versionObjName);
			val = versionObj.GetUserOption(opt);
			return OkRespObject(val);
		}catch (e) {
			return FailedRespObject(e.number, e.description);	
		}
	}	
	/*
	 *	功能：保存用户选项设置
	 */
	this.putUserSetting = function (opt, val) {
		try {
			var versionObj = new ActiveXObject(_versionObjName);
			versionObj.SetUserOption(opt, val);
			return OkRespObject(null);
		}catch (e) {
			return FailedRespObject(e.number, e.description);	
		}
	}	
	/*
	 *	获取所有设备信息列表(不强制刷新)
	 */
	this.getKeyList = function (forceUpdate) {
		var keyCnt = 0;
		var keyArray = new Array;
		
		try {			
			// 此时，为了防止客户端已经退出，故需要重新初始化
			if (forceUpdate) {				
				this.finaled();				
				_deviceEnum = new ActiveXObject(_enumObjName);	
				_deviceEnum.AddHandler(OnKeyChanged);
			}
			
			// 获取所有设备
			_deviceEnum.EnumDevices(0, forceUpdate ? 1 : 0);
			keyCnt = _deviceEnum.Count;
			for (var i = 0; i < keyCnt; i++) {
				var keyObj = new ActiveXObject(_deviceObjName);
				_deviceEnum.get_Item(i, keyObj);				
				
				var key = new zjca_Key(i, keyObj.SN, keyObj.Label, keyObj.Manufacturer);
				keyArray.push(key);
			}
			return OkRespObject(keyArray);
		}catch (e) {	
			return FailedRespObject(e.number, e.description);	
		}
	}	
	/*
	 *	获取所有证书信息列表
	 */
	this.getCertList = function (keyIndex, alg, usage, flags) {
		var certArray = new Array;
		
		if (flags == undefined || isNaN(flags)) {
			flags = ZJCA_CERT_STORE_KEY;
		}
		
		// 先尝试使用新的接口ZJCACertificateEnum枚举证书
		try {
			_certEnum = new ActiveXObject(_certEnumName);
			var certObj = new ActiveXObject(_certObjName);
		
			// 枚举证书
			_certEnum.EnumCert(flags, keyIndex, alg, usage);
			
			// 获取证书信息
			var certCnt = _certEnum.Count;
			for (var certIndex = 0; certIndex < certCnt; certIndex++) {
				_certEnum.get_Item(certIndex, certObj);
				var certInfo = new zjca_Cert(certIndex,			//证书序号
											 certObj.SN,       	//SN
											 certObj.KeyType,  	//Alg
											 certObj.KeyUsage, 	//Usage
											 certObj.Subject,  	//DN
											 certObj.Issuer,   	//Issuer
											 certObj.ValidFrom,	//起始时间
											 certObj.ValidUntil,//失效时间
											 certObj.DevIndex	//所在KEY的序号
											 );
				certArray.push(certInfo);
			}
			return OkRespObject(certArray);			
		}catch (e) {	// 为了兼容老版本的客户端，如果ZJCACertificateEnum枚举证书失败则转为使用ZJCADevice枚举
			try {
				// 获取所有设备
				certArray.length = 0;
				_deviceEnum.EnumDevices(0, 0);
				
				// 根据参数获取证书
				var certIndex = 0;
				var keyCnt = _deviceEnum.Count;
				var keyObj = new ActiveXObject(_deviceObjName);
				var certObj = new ActiveXObject(_certObjName);
				for (var i = 0; i < keyCnt; i++) {
					if ((-1 != keyIndex) && (i != keyIndex)) {
						continue;
					}
					_deviceEnum.get_Item(i, keyObj);
					
					var certCnt = keyObj.CertificateCount;
					for (var index = 0; index < certCnt; index++) {
						keyObj.get_Certificate(index, certObj);
						if ((0 != alg) && (certObj.KeyType != alg)) {
							continue;
						}
						if ((0 != usage) && (certObj.KeyUsage != usage)) {
							continue;
						}
						
						var certInfo = new zjca_Cert(certIndex++,		//总序号
													 certObj.SN,       	//SN
													 certObj.KeyType,  	//Alg
													 certObj.KeyUsage, 	//Usage
													 certObj.Subject,  	//DN
													 certObj.Issuer,   	//Issuer
													 certObj.ValidFrom,	//起始时间
													 certObj.ValidUntil,//失效时间
													 i         			//所在KEY的序号
													 );
						certArray.push(certInfo);
					}			
				}
				return OkRespObject(certArray);
			}catch (e) {	
				return FailedRespObject(e.number, e.description);	
			}
		}
	}	
	/*
	 *	通过证书序列号获取证书内容
	 */
	this.getCertContentBySN = function (sn) {
		var content = "";
		var certObj = new ActiveXObject(_certObjName);
		
		try{			
			// 遍历证书
			if (_certEnum != null) {
				var certCnt = _certEnum.Count;
				for (var index = 0; index < certCnt; index++) {
					_certEnum.get_Item(index, certObj);
					if (sn == certObj.SN) {
						content = certObj.ToString();
						break;
					}
				}
			}else { //通过遍历所有设备的方法来查找证书
				var keyObj = new ActiveXObject(_deviceObjName);
				var keyCnt = _deviceEnum.Count;
				for (var i = 0; i < keyCnt; i++) {
					_deviceEnum.get_Item(i, keyObj);					
					var certCnt = keyObj.CertificateCount;
					for (var index = 0; index < certCnt; index++) {
						keyObj.get_Certificate(index, certObj);
						if (sn == certObj.SN) {
							content = certObj.ToString();
							break;
						}
					}
				}				
			}
			return OkRespObject(content);
		}catch (e) {	
			return FailedRespObject(e.number, e.description);	
		}
	}	
	/*
	 *	通过算法和用途获取证书内容
	 */
	this.getCertContent = function (keyIndex, alg, usage) {
		var content = "";
		var keyObj = new ActiveXObject(_deviceObjName);
		var certObj = new ActiveXObject(_certObjName);
		
		try{
			// 介质序号有误
			if (keyIndex < 0 || keyIndex >= _deviceEnum.Count) {
				return FailedRespObject(0x80000003, "选择的介质序号错误");						
			}
			
			// 获取对应的设备对象
			_deviceEnum.get_Item(keyIndex, keyObj);
			
			// 遍历证书
			var certCnt = keyObj.CertificateCount;
			for (var index = 0; index < certCnt; index++) {
				keyObj.get_Certificate(index, certObj);
				if ((0 == alg || alg == certObj.KeyType) && (usage == certObj.KeyUsage)) {
					content = certObj.ToString();
					break;
				}
			}	
			return OkRespObject(content);
		}catch (e) {	
			return FailedRespObject(e.number, e.description);	
		}
	}	
	/*
	 *	解码证书内容，返回该证书的句柄，使用完成之后需要调用releaseCert()释放！
	 */
	this.decodeCert = function (certBase64) {
		var cert = 0;
		try {
			cert = new ActiveXObject(_certObjName);
			cert.FromString(certBase64);
			_decodedCertArray.push(cert);
			return OkRespObject(cert);
		} 
		catch (e) {
			return FailedRespObject(e.number, e.description);	
		}	
	}		
	/*
	 *	获取证书的某个属性值
	 */
	this.getCertAttribute = function (certHandle, attrName, attrParam) {
		try {
			var attrValue;
			if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_SN) {
				attrValue = certHandle.SN;
			}
			else if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_TYPE) {
				attrValue = Number(certHandle.CertType);
			}
			else if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_USAGE) {
				attrValue = Number(certHandle.KeyUsage);
			}
			else if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_SUBJECT) {
				attrValue = certHandle.get_UserNode(attrParam);
			}
			else if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_ISSUER) {
				attrValue = certHandle.get_IssuerNode(attrParam);				
			}
			else if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_REGISTED) {
				attrValue = Number(certHandle.IsRegisted);
			}
			else if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_VALIDDATE) {
				attrValue = certHandle.ValidFrom;
				attrValue += "|";
				attrValue += certHandle.ValidUntil;
			}
			else if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_KEYID) {
				attrValue = certHandle.KeyIdentifier;
			}
			else if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_IDCARD) {
				attrValue = certHandle.IDCardNo;
			}
			else if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_IC_CODE) {
				attrValue = certHandle.BrNo;
			}
			else if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_ORG_CODE) {
				attrValue = certHandle.OrgCode;
			}
			else if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_SS_CODE) {
				attrValue = certHandle.SSNo;
			}
			else if (attrName == FUNC_CERT_ATTRIBUTE_PARAM_USCCODE) {
				attrValue = certHandle.USCCode;				
			}
			else {				
				return FailedRespObject(0x80000003, "参数错误!");
			}
			return OkRespObject(attrValue);		
		}
		catch (e) {
			return FailedRespObject(e.number, e.description);			
		}
	}
	/*
	 *	获取证书扩展属性
	 */
	this.getCertExtension = function (certHandle, extOid) {
		try {
			var extValue;
			extValue = certHandle.get_ExtensionByOid(extOid);
			return OkRespObject(extValue);	
		} catch (e) {
			return FailedRespObject(e.number, e.description);	
		}
	}	
	/*
	 *	释放证书句柄
	 */
	this.releaseCert = function (certHandle) {
		var index = _decodedCertArray.indexOf(certHandle);
		if (index > -1) {
			_decodedCertArray.splice(index, 1);
		}
		certHandle = null;
		return OkRespObject(null);	
	}		
	/*
	 *	显示证书
	 */	
	this.showCert = function (certBase64, hwnd) {
		try {
			var certObj = new ActiveXObject(_certObjName);
			certObj.FromString(certBase64);
			certObj.OpenViewDialog(0);
			return OkRespObject(null);	
		}
		catch (e) {
			return FailedRespObject(e.number, e.description);			
		}
	}	
	/*
	 *	验证证书
	 */	
	this.verifyCert = function (certBase64, flags) {
		try {
			var result = 0;
			var certObj = new ActiveXObject(_certObjName);
			certObj.FromString(certBase64);
			result = certObj.IsVaild(flags);
			return OkRespObject(Number(result));		
		}
		catch (e) {
			return FailedRespObject(e.number, e.description);			
		}
	}	
	/*
	 *	使用PFX证书签名消息
	 */
	this.signMessageByCert = function (cert, type, flags, msg, userId, charset) {		
		var signObj = new ActiveXObject(_signObjName);
		var certObj = new ActiveXObject(_certObjName);
		
		try {
			// 获取选择的证书对象
			_certEnum.get_Item(cert.getIndex(), certObj);
			
			// 未指定userId，则根据算法选择默认的userId
			if (userId == null || userId == undefined) {
				userId = (ZJCA_KEY_SM2 == cert.getAlg()) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
			}
			
			// 签名(杂凑算法设为SHA1，因为有很多CSP不支持SHA256)
			signObj.Sign(certObj, msg, charset, userId, ZJCA_HASH_SHA1, type, flags);
			
			// 返回签名结果
			return OkRespObject(signObj.ToString());						
		}catch (e) {
			return FailedRespObject(e.number, e.description);			
		}
	}
	/*
	 *	使用介质签名消息
	 */
	this.signMessage = function (keyIndex, alg, type, flags, msg, userId, charset) {		
		var signObj = new ActiveXObject(_signObjName);
		var keyObj = new ActiveXObject(_deviceObjName);
		var certObj = new ActiveXObject(_certObjName);
		
		// 找到对应的Key，进行签名
		if (keyIndex < _deviceEnum.Count) {
			_deviceEnum.get_Item(keyIndex, keyObj);
			
			// 没有指定签名算法，使用默认的签名证书算法
			if (ZJCA_KEY_UNKNOWN == alg) {
				var certCnt = keyObj.CertificateCount;
				for (var index = 0; index < certCnt; index++) {
					keyObj.get_Certificate(index, certObj);
					if (ZJCA_CERT_SIGN == certObj.KeyUsage) {
						alg = certObj.KeyType;
						break;
					}
				}			
			}
			// 无签名证书
			if (ZJCA_KEY_UNKNOWN == alg) {
				return FailedRespObject(0x80000004, "签名证书不存在");
			}
			
			// 未指定userId，则根据算法选择默认的userId
			if (userId == null || userId == undefined) {
				userId = (ZJCA_KEY_SM2 == alg) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
			}
			// 签名
			try {
				keyObj.Sign(alg, msg, charset, userId, type, flags, signObj);
				return OkRespObject(signObj.ToString());
			}catch (e) {
				return FailedRespObject(e.number, e.description);	
			}	
		}else {
			return FailedRespObject(0x80000003, "选择的介质序号错误");
		}
	}
	/*
	 *	使用证书验证消息签名
	 */
	this.verifyMessage = function (keyIndex, msg, userId, charset, base64Sign, base64Cert) {
		var pass = false;
		
		try {
			var certObj = new ActiveXObject(_certObjName);
			var signObj = new ActiveXObject(_signObjName);
			var keyObj = new ActiveXObject(_deviceObjName);
		
			// 构造签名对象
			signObj.FromString(base64Sign);
			
			// 构造证书对象
			if (base64Cert != "") {
				certObj.FromString(base64Cert);					
			}
			else {
				signObj.get_Certificate(certObj);
			}
			
			// 未指定userId，则根据算法选择默认的userId
			if (userId == null || userId == undefined) {
				userId = (ZJCA_KEY_SM2 == certObj.KeyType) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
			}
			
			//使用软件验签
			if (-1 == keyIndex) {
				pass = signObj.Verify(msg, charset, certObj, userId);				
			}
			//使用硬件KEY验签
			else {
				_deviceEnum.get_Item(keyIndex, keyObj);
				pass = keyObj.Verify(msg, charset, base64Sign, userId, certObj);
			}
			return OkRespObject(pass);
		}catch(e) {
			return FailedRespObject(e.number, e.description);
		}
	}
	/*
	 *	签名文件
	 */	
	this.signFile = function (keyIndex, alg, type, flags, file, userId, callback) {	
		var streamFactory;
		var fileStream;
		try {			
			var keyObj = new ActiveXObject(_deviceObjName);
			var certObj = new ActiveXObject(_certObjName);
			var signObj = new ActiveXObject(_signObjName);
			
			// 找到对应的Key，进行签名
			if (keyIndex >= 0 && keyIndex < _deviceEnum.Count) {
				_deviceEnum.get_Item(keyIndex, keyObj);
				
				// 没有指定签名算法，使用默认的签名证书算法
				if (ZJCA_KEY_UNKNOWN == alg) {
					var certCnt = keyObj.CertificateCount;
					for (var index = 0; index < certCnt; index++) {
						keyObj.get_Certificate(index, certObj);
						if (ZJCA_CERT_SIGN == certObj.KeyUsage) {
							alg = certObj.KeyType;
							break;
						}
					}			
				}
				// 无签名证书
				if (ZJCA_KEY_UNKNOWN == alg) {
					return FailedRespObject(0x80000004, "签名证书不存在");
				}
			}
			// 介质序号错误
			else{
				return FailedRespObject(0x80000003, "选择的介质序号错误");				
			}
					
			// 未指定userId，则根据算法选择默认的userId
			if (userId == null || userId == undefined) {
				userId = (ZJCA_KEY_SM2 == alg) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
			}
			
			// 构造文件流对象
			streamFactory = new ActiveXObject(_streamFactoryObjName);
			fileStream = streamFactory.GetFileStream(file, 1);	
			if (fileStream == null) {
				return FailedRespObject(0x80000003, "打开文件失败！");
			}	
			_deviceEnum.get_Item(keyIndex, keyObj);
			keyObj.Sign(alg, fileStream, 0x00, userId, type, flags, signObj);
			var signText = signObj.ToString();
			
			// 返回结果
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(0, signText)}, 500);
				return OkRespObject(null);
			}
			else {
				return OkRespObject(signText);
			}
		}
		catch(e) {
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(e.number, "")}, 500);
			}
			return FailedRespObject(e.number, e.description);
		}
		finally{
			// 释放文件流
			if (streamFactory){
				streamFactory.CloseStream(fileStream);
			}
		}	
	}
	/*
	 *	验证文件的签名
	 */	
	this.verifyFile = function (keyIndex, file, userId, base64Sign, base64Cert, callback) {		
		var streamFactory;
		var fileStream;
		try {
			var pass = false;
			var signObj = new ActiveXObject(_signObjName);
			var certObj = new ActiveXObject(_certObjName);
			streamFactory = new ActiveXObject(_streamFactoryObjName);
			fileStream = streamFactory.GetFileStream(file, 1);
			if (fileStream == null) {
				return FailedRespObject(0x80000003, "打开文件失败！");
			}
			
			// 构造签名对象
			signObj.FromString(base64Sign);
				
			// 构造证书对象
			if (base64Cert != "") {
				certObj.FromString(base64Cert);					
			}
			else {
				signObj.get_Certificate(certObj);
			}
						
			// 未指定userId，则根据算法选择默认的userId
			if (userId == null || userId == undefined) {
				userId = (ZJCA_KEY_SM2 == certObj.KeyType) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
			}
			
			//使用软件验签
			if (-1 == keyIndex) {
				pass = signObj.Verify(fileStream, 0x00, certObj, userId);				
			}
			//使用硬件KEY验签
			else {
				var keyObj = new ActiveXObject(_deviceObjName);
				_deviceEnum.get_Item(keyIndex, keyObj);	
				pass = keyObj.Verify(fileStream, 0x00, base64Sign, userId, certObj);				
			}
			
			// 返回结果
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(0, pass)}, 500);
				return OkRespObject(null);
			}
			else {
				return OkRespObject(pass);	
			}	
		}
		catch(e) {
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(e.number, false)}, 500);
			}
			return FailedRespObject(e.number, e.description);
		}		
		finally{		
			// 释放文件流
			if (streamFactory){
				streamFactory.CloseStream(fileStream);
			}
		}
	}	
	/*
	 *	签名杂凑
	 */	
	this.signDigest = function (keyIndex, alg, type, flags, digest, digestAlg) {		
		var signObj = new ActiveXObject(_signObjName);
		var keyObj = new ActiveXObject(_deviceObjName);
		var certObj = new ActiveXObject(_certObjName);
		
		// 找到对应的Key，进行签名
		if (keyIndex >= 0 && keyIndex < _deviceEnum.Count) {
			_deviceEnum.get_Item(keyIndex, keyObj);
			
			// 没有指定签名算法，使用默认的签名证书算法
			if (ZJCA_KEY_UNKNOWN == alg) {
				var certCnt = keyObj.CertificateCount;
				for (var index = 0; index < certCnt; index++) {
					keyObj.get_Certificate(index, certObj);
					if (ZJCA_CERT_SIGN == certObj.KeyUsage) {
						alg = certObj.KeyType;
						break;
					}
				}			
			}
			// 无签名证书
			if (ZJCA_KEY_UNKNOWN == alg) {
				return FailedRespObject(0x80000004, "签名证书不存在");
			}
			// 签名
			try {
				keyObj.SignDigest(alg, digest, digestAlg, type, flags, signObj);
				return OkRespObject(signObj.ToString());
			}catch (e) {
				return FailedRespObject(e.number, e.description);	
			}	
		}else {
			return FailedRespObject(0x80000003, "选择的介质序号错误");
		}
	}
	/*
	 *	验证杂凑的签名
	 */	
	this.verifyDigest = function (keyIndex, digest, digestAlg, base64Sign, base64Cert) {
		var pass = false;
		
		try {
			var certObj = new ActiveXObject(_certObjName);
			var signObj = new ActiveXObject(_signObjName);
			var keyObj = new ActiveXObject(_deviceObjName);
		
			// 构造签名对象
			signObj.FromString(base64Sign);
			
			// 构造证书对象
			if (base64Cert != "") {
				certObj.FromString(base64Cert);					
			}
			else {
				signObj.get_Certificate(certObj);
			}
		
			//使用软件验签
			if (-1 == keyIndex) {
				pass = signObj.VerifyDigest(digest, digestAlg, certObj);				
			}
			//使用硬件KEY验签
			else {
				_deviceEnum.get_Item(keyIndex, keyObj);
				pass = keyObj.VerifyDigest(digest, digestAlg, base64Sign, certObj);
			}
			return OkRespObject(pass);
		}catch (e) {
			return FailedRespObject(e.number, e.description);
		}
	}
	/*
	 *	获取P7签名中的附加信息
	 */	
	this.getSignatureAttached = function (base64Sign, charset) {
		var signObj = new ActiveXObject(_signObjName);
		var certObj = new ActiveXObject(_certObjName);
		try{
			signObj.FromString(base64Sign);
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
			
		var content = "";
		var base64Cert = "";
		var signTime = "";
		try {
			content = signObj.get_Content(charset);
		}catch(e){
			//Do nothing!
		}
		try {
			signObj.get_Certificate(certObj);
			base64Cert = certObj.ToString();
		}catch(e){
			//Do nothing!
		}
		try {
			signTime = signObj.LocalTime;
		}catch(e){
			//Do nothing!
		}
		return OkRespObject({text:content,cert:base64Cert,time:signTime});	
	}	
	/*
	 *	加密消息
	 */
	this.encryptMessage = function (keyIndex, base64Cert, msg, charset, symmAlg, cipherType, paddingType, desFile, callback) {
		var cipher = "";
		var cipherFile = null;
		var streamFactory = null;
		try {
			var saveToFile = false;
			var keyObj = new ActiveXObject(_deviceObjName);
			var cipherObj = new ActiveXObject(_cipherObjName);
			
			// 加密结果保存到文件
			if (desFile != null && desFile != undefined && desFile.length > 0) {
				streamFactory = new ActiveXObject(_streamFactoryObjName);
				cipherFile = streamFactory.GetFileStream(desFile, 2);	//2:Write File Stream
				cipherObj.put_Stream(cipherFile);
				saveToFile = true;
			}

			// 加密
			if (keyIndex < 0) { //使用外部证书加密
				cipherObj.EncryptEx(msg, charset, base64Cert, symmAlg, paddingType, cipherType, 0);
				cipher = saveToFile ? desFile : cipherObj.ToString();
			}else{			
				// 获取设备对象
				_deviceEnum.get_Item(keyIndex, keyObj);	
				
				// 加密消息
				keyObj.EncryptEx(msg, charset, base64Cert, symmAlg, paddingType, cipherType, 0, cipherObj);
				
				// Base64格式的密文，或密文文件名
				cipher = saveToFile ? desFile : cipherObj.ToString();
			}

			// 返回结果
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(0, cipher)}, 500);				
				return OkRespObject(null);
			}else{
				return OkRespObject(cipher);				
			}		
		}
		catch(e) {
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(e.number, "")}, 500);
			}
			return FailedRespObject(e.number, e.description);		
		}
		finally{		
			// 释放文件流
			if (streamFactory){
				if (cipherFile != null) streamFactory.CloseStream(cipherFile);			
			}
		}
	}
	/*
	 *	解密消息
	 */	
	this.decryptMessage = function (keyIndex, asymmAlg, symmAlg, paddingType, base64Cipher, charset, desFile, callback) {
		var plainText = "";
		var plainFile = null;
		var streamFactory = null;
		try {			
			// 获取设备对象
			var keyObj = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, keyObj);	
						
			// 解密结果保存到文件
			var saveToFile = false;
			if (desFile != null && desFile != undefined && desFile.length > 0) {
				streamFactory = new ActiveXObject(_streamFactoryObjName);
				plainFile = streamFactory.GetFileStream(desFile, 2);	//2:Write File Stream
				saveToFile = true;
			}			
			
			// 解密得到原文消息	
			var algs = Number(asymmAlg) | Number(symmAlg);
			if (saveToFile) {
				keyObj.DecryptEx(algs, base64Cipher, charset, paddingType, 0, 0, plainFile);
				plainText = desFile;
			}else {
				plainText = keyObj.DecryptEx(algs, base64Cipher, charset, paddingType, 0, 0, null);	
			}
			
			// 返回结果
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(0, plainText)}, 500);				
				return OkRespObject(null);
			}else{
				return OkRespObject(plainText);				
			}	
		}
		catch(e) {
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(e.number, "")}, 500);
			}
			return FailedRespObject(e.number, e.description);				
		}
		finally{		
			// 释放文件流
			if (streamFactory){
				if (plainFile != null) streamFactory.CloseStream(plainFile);			
			}
		}
	}
	/*
	 *	加密文件
	 */	
	this.encryptFile = function (keyIndex, base64Cert, srcFile, desFile, symmAlg, cipherType, paddingType, callback) {
		var streamFactory;
		var src = null;
		var des = null;
		var cipher = "";
		try {
			var saveToFile = false;
			var keyObj = new ActiveXObject(_deviceObjName);
			var cipherObj = new ActiveXObject(_cipherObjName);
			streamFactory = new ActiveXObject(_streamFactoryObjName);
			src = streamFactory.GetFileStream(srcFile, ZJCA_STREAM_READ);
			
			// 加密结果保存到文件
			if (desFile != null && desFile != undefined && desFile.length > 0) {
				des = streamFactory.GetFileStream(desFile, ZJCA_STREAM_WRITE);
				cipherObj.put_Stream(des);
				saveToFile = true;
			}
			
			// 加密
			if (keyIndex < 0) { //使用外部证书加密
				cipherObj.EncryptEx(src, 0, base64Cert, symmAlg, paddingType, cipherType, 0);
			}else{
			
				// 获取设备对象
				_deviceEnum.get_Item(keyIndex, keyObj);	
							
				// 加密文件(忽略字符集参数)，并生成密文文件
				keyObj.EncryptEx(src, 0, base64Cert, symmAlg, paddingType, cipherType, 0, cipherObj);
			}		
			// Base64格式的密文，或密文文件名
			cipher = saveToFile ? desFile : cipherObj.ToString();
			
			// 返回结果
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(0, cipher)}, 500);				
				return OkRespObject(null);
			}else{
				return OkRespObject(cipher);				
			}
		}
		catch(e) {
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(e.number, "")}, 500);
			}
			return FailedRespObject(e.number, e.description);			
		}
		finally{		
			// 释放文件流
			if (streamFactory){
				if (src != null) streamFactory.CloseStream(src);
				if (des != null) streamFactory.CloseStream(des);			
			}
		}
	}
	/*
	 *	解密文件(解密结果如果是消息信息返回、而不是解密到文件，则要求原文内容为可见字符，否则无法通过消息形式返回！！！)
	 */	
	this.decryptFile = function (keyIndex, asymmAlg, symmAlg, paddingType, cipherFile, desFile, callback) {
		var streamFactory;
		var src = null;
		var des = null;
		var plainText = "";
		try {			
			var keyObj = new ActiveXObject(_deviceObjName);
			streamFactory = new ActiveXObject(_streamFactoryObjName);
			src = streamFactory.GetFileStream(cipherFile, ZJCA_STREAM_READ);
			
			// 获取设备对象
			_deviceEnum.get_Item(keyIndex, keyObj);	
						
			// 解密结果保存到文件
			var saveToFile = false;
			if (desFile != null && desFile != undefined && desFile.length > 0) {
				streamFactory = new ActiveXObject(_streamFactoryObjName);
				des = streamFactory.GetFileStream(desFile, ZJCA_STREAM_WRITE);
				saveToFile = true;
			}
			
			// 解密到明文，或明文文件
			var algs = Number(asymmAlg) | Number(symmAlg);
			plainText = keyObj.DecryptEx(algs, src, 0, paddingType, 0, 0, des);
			if (saveToFile) plainText = desFile;
						
			// 返回结果
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(0, plainText)}, 500);				
				return OkRespObject(null);
			}else{
				return OkRespObject(plainText);				
			}	
		}
		catch(e) {
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(e.number, "")}, 500);
			}
			return FailedRespObject(e.number, e.description);		
		}
		finally{		
			// 释放文件流
			if (streamFactory){
				if (src != null) streamFactory.CloseStream(src);
				if (des != null) streamFactory.CloseStream(des);			
			}
		}
	}
	/*
	 *	显示文件选择对话框，返回选择的文件名
	 */	
	this.getFileName = function (is_open, caption, filter) {
		try {
			var streamFactory = new ActiveXObject(_streamFactoryObjName);
			var fileName = streamFactory.OpenFileDialog(caption, filter);
			return OkRespObject(fileName);			
		}
		catch(e) {
			return FailedRespObject(e.number, e.description);		
		}
	}
	/*
	 *	显示路径选择对话框，返回选择的路径名
	 */	
	this.getPathName = function (caption, defPath) {
		try {
			var streamFactory = new ActiveXObject(_streamFactoryObjName);
			var pathName = streamFactory.OpenPathDialog(caption, defPath);
			return OkRespObject(pathName);			
		}
		catch(e) {
			return FailedRespObject(e.number, e.description);		
		}
	}
	/*
	 *	读取文件内容，base64格式返回
	 */	
	this.readFile = function (fileName) {
		try {
			var streamFactory = new ActiveXObject(_streamFactoryObjName);
			var content = streamFactory.ReadFile(fileName);
			return OkRespObject(content);			
		}
		catch(e) {
			return FailedRespObject(e.number, e.description);		
		}
	}
	/*
	 *	写文件内容
	 */	
	this.writeFile = function (fileName, content, inBinary) {
		try {
			var streamFactory = new ActiveXObject(_streamFactoryObjName);
			streamFactory.WriteFile(fileName, content, inBinary ? -1 : 0);
			return OkRespObject(null);			
		}
		catch(e) {
			return FailedRespObject(e.number, e.description);		
		}
	}
	/*
	 *	删除文件
	 */	
	this.deleteFile = function (fileName) {
		try {
			var streamFactory = new ActiveXObject(_streamFactoryObjName);
			streamFactory.DestroyFile(fileName);
			return OkRespObject(null);			
		}
		catch(e) {
			return FailedRespObject(e.number, e.description);		
		}
	}	
	/*
	 *	创建目录
	 */
	this.createFolder = function (folderName) {
		try {
			var streamFactory = new ActiveXObject(_streamFactoryObjName);
			streamFactory.CreateFolder(folderName);
			return OkRespObject(null);			
		}
		catch(e) {
			return FailedRespObject(e.number, e.description);		
		}			
	}	
	/*
	 *	打开目录(文件夹)
	 */
	this.openFolder = function (folderName) {
		try {
			var streamFactory = new ActiveXObject(_streamFactoryObjName);
			streamFactory.OpenFolder(folderName);
			return OkRespObject(null);			
		}
		catch(e) {
			return FailedRespObject(e.number, e.description);		
		}			
	}
	/*
	 *	删除目录(文件夹)
	 */
	this.deleteFolder = function (folderName) {
		try {
			var streamFactory = new ActiveXObject(_streamFactoryObjName);
			streamFactory.DestroyFolder(folderName);
			return OkRespObject(null);			
		}
		catch(e) {
			return FailedRespObject(e.number, e.description);		
		}			
	}
	/*
	 * 获取请求码
	 */
	this.genAuthReq = function(keyIndex, authType){
		try{
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);
			var keyReq = device.GenAuthReqCode(authType);
			return OkRespObject(keyReq);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
	}	
	/*
	 *	格式化
	 */
	this.initKey = function (keyIndex, authCode, userPIN, label) {
		try{
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);
			device.Initiliaze(authCode, userPIN, label);
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
	}
	/*
	 * 解锁用户PIN码
	 */
	this.unlockPin = function(keyIndex, authCode, newPIN) {
		try{
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);
			device.UnLockPIN(authCode, newPIN);
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
	}		
	/*
	 *	校验用户PIN
	 */	
	this.verifyPin = function (keyIndex, userPIN) {
		try{
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);
			device.VerifyPIN(ZJCA_PIN_USER, userPIN);
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}	
	}
	/*
	 *	修改用户PIN码
	 */
	this.changePin = function (keyIndex, oldPIN, newPIN) {
		try{
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);
			device.ChangePIN(ZJCA_PIN_USER, oldPIN, newPIN);
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
	}
	/*
	 * 生成证书请求
	 */
	this.genCertReq = function (keyIndex, certAlg, newKeypair, bits, cn, pin) {
		try{
			var csr = "";
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);
			if (pin != undefined && pin.length > 0){
				csr = device.GenCertRequestEx(certAlg, newKeypair ? -1 : 0, bits, cn, pin);
			}else {
				csr = device.GenCertRequest(certAlg, newKeypair ? -1 : 0, bits, cn);
			}
			return OkRespObject(csr);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}	
	}
	/*
	 * 导入证书和加密密钥对(PFX格式)
	 */
	this.importCertAndPfx = function (keyIndex, signCert, exchCert, pfx, authCode) {
		try{
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);	
			device.ImportDualCertAndKeyPair(1, signCert, exchCert, pfx, authCode);
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
	}
	/*
	 * 导入证书和加密密钥对(密文格式)
	 */
	this.importCertAndEncKeyPair = function (keyIndex, alg, signCert, exchCert, keyPair, symmAlgID, symmCipher, authCode) {
		try{
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);	
			if (ZJCA_KEY_SM2 == alg) {	//SM2证书使用一次性导入函数，方便删除老容器(因为签名和加密证书在同一个容器)
				device.ImportDualCertAndKeyPair(alg, signCert, exchCert, keyPair, authCode);
				return OkRespObject(null);	
			}else if (ZJCA_KEY_RSA == alg) {
				device.ImportCert(alg, true, signCert);
				device.ImportKeyPair(alg, keyPair, symmAlgID, symmCipher, authCode);	
				device.ImportCert(alg, false, exchCert);
				return OkRespObject(null);	
			}else {
				return FailedRespObject(0x81000004, "证书算法参数错误！");
			}
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
	}		
	/*
	 *	证书算法升级(导入证书和加密密钥对)
	 */
	this.importUpgradedCertAndKeyPair = function (keyIndex, old_alg, new_alg, signCert, exchCert, keyPair, symmAlgID, symmCipher, authCode){
		try{
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);	
			device.ImportUpgradedCertsAndKeyPair(old_alg, new_alg, signCert, exchCert, keyPair, symmAlgID, symmCipher, authCode);
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
	}
	/*
	 *	导入双证书，适用于密钥对不更新的情况，比如“延期”。
	 */
	this.importDualCert = function (keyIndex, alg, signCert, exchCert){
		try{
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);
			device.ImportDualCert(alg, signCert, exchCert, "");
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
	}
	/*
	 *	导入单签名证书，适用于申请单证书的业务。
	 */
	this.importCert = function (keyIndex, alg, signCert){
		try{
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);	
			device.ImportCert(alg, true, signCert);
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}	
	}
	/*
	 *	验证介质内密钥和证书是否正确
	 */
	this.keyValidation = function (keyIndex, alg, usage){
		var test = "测试原文。Test plain text. 1234567890~！@#￥%……&*（）";
		try{
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);	
			device.Validation(alg, usage, test);
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
	}
	/*
	 *	解析时间戳，返回时间戳中的属性。params指定要返回的项，比如:"sign|time|cert|digest|digest_alg"
	 */
	this.parseTimestamp = function (ts, params) {
		var attrs = params.split("|");
		try {
			var sign = "";
			var time = "";
			var cert = "";
			var digest = "";
			var digest_alg = 0;			
			var tsObj = new ActiveXObject(_timeStampObjName);
			tsObj.FromString(ts);			
			
			for (i = 0; i < attrs.length; i++) {
				var attr_name = attrs[i];
				if (attr_name == "sign") {
					sign = tsObj.signature;
				}else if (attr_name == "time") {
					time = tsObj.localTime;
				}else if (attr_name == "cert") {
					cert = tsObj.certificate;
				}else if (attr_name == "digest") {
					digest = tsObj.messageImprint;
				}else if (attr_name == "digest_alg") {
					digest_alg = tsObj.messageImprintAlg;
				}
			}
			return OkRespObject({sign:sign,time:time,cert:cert,digest:digest,digest_alg:digest_alg});	
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}	
	}
	/*
	 *	验证时间戳(验证签名和证书链)
	 */
	this.verifyTimestamp = function (ts, srvCert) {		
		try {	
			var tsObj = new ActiveXObject(_timeStampObjName);
			tsObj.FromString(ts);
			tsObj.verify(srvCert);
			return OkRespObject(null);	
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}			
	}
	/*
	 *	验证时间戳(验证杂凑值、签名和证书链)
	 */
	this.verifyTimestampWithDigest = function (ts, digest, srvCert) {		
		try {	
			var tsObj = new ActiveXObject(_timeStampObjName);
			tsObj.FromString(ts);
			tsObj.verifyWithDigest(digest, 0, srvCert);
			return OkRespObject(null);	
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}					
	}
	/*
	 *	验证时间戳(验证原文消息、签名和证书链)
	 */
	this.verifyTimestampWithMessage = function (ts, message, charset, digest_alg, srvCert, usrId, usrCert) {	
		try {	
			var tsObj = new ActiveXObject(_timeStampObjName);
			tsObj.FromString(ts);
			tsObj.verifyWithMessage(message, charset, digest_alg, srvCert, usrId, usrCert);
			return OkRespObject(null);	
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}					
	}
	/*
	 *	验证时间戳(验证原文文件、签名和证书链)
	 */
	this.verifyTimestampWithFile = function (ts, file, digest_alg, srvCert, usrId, usrCert) {	
		try {	
			var tsObj = new ActiveXObject(_timeStampObjName);
			tsObj.FromString(ts);
			tsObj.verifyWithFile(file, digest_alg, srvCert, usrId, usrCert);
			return OkRespObject(null);	
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}					
	}	
	/*
	 *	验证随机数
	 */
	this.testRandrom = function (keyIndex, size, format, file){
		try{
			var device = new ActiveXObject(_deviceObjName);
			_deviceEnum.get_Item(keyIndex, device);	
			device.TestRandRom(size, format, file);
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}		
	}
}