/* 
 * ZJCA NPAPI object Script Interface for HTML
 * Version: v0.0.1
 * Date: 2018-04-25
 * 2015 - 2018 ZJCA. All rights reserved.
 * 
 *
*/

function zjca_NPAPI(eventCallback) {
	var _zjcaPlugin = null;
	var _onKeyEvent = eventCallback;
	var _decodedCertArray = new Array;
	
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
		this.finaled();		
		
		// 获取插件对象
		_zjcaPlugin = document.getElementById("ZjcaPlugin");
		if (_zjcaPlugin) {
			_zjcaPlugin.Init();
			_zjcaPlugin.OnKeyEvent = OnKeyChanged;
			return OkRespObject(null);
		}
		return FailedRespObject(-2, "ZJCA客户端NPAPI安全插件'ZjcaPlugin'未安装！");	
	}
	/*
	 *	结束函数，请在页面关闭前调用
	 */
	this.finaled = function () {
		return OkRespObject(null);
	}			
	/*
	 *	获取版本信息
	 */	
	this.getVersion = function () {	
		var version = "0.0.0.0";
		
		try {
			version = _zjcaPlugin.GetVersion();
			return OkRespObject(version);
		}catch (e) {
			return FailedRespObject(e.number, e.description);	
		}
	}	
	/*
	 *	获取所有设备信息列表
	 */
	this.getKeyList = function (forceUpdate) {
		var keyCnt = 0;
		var keyArray = new Array;
		
		// 获取所有设备
		try {
			keyCnt = _zjcaPlugin.GetKeyCnt(forceUpdate);
			for (i = 0; i < keyCnt; i++) {
				var keyObj = _zjcaPlugin.GetKey(i);
				var key = new zjca_Key(i, keyObj.SN, keyObj.Label, keyObj.Manufacturer);
				keyArray.push(key);
			}		
			return OkRespObject(keyArray);
		}catch (e) {
			return FailedRespObject(e.number, e.message);	
		}
	}	
	/*
	 *	获取所有证书信息列表
	 */
	this.getCertList = function (keyIndex, type, usage) {
		var keyObj;
		var certObj;
		var certIndex = 0;
		var certArray = new Array;
		
		try {
			var keyCnt = _zjcaPlugin.GetKeyCnt(0);
			for (i = 0; i < keyCnt; i++) {
				if ((-1 != keyIndex) && (i != keyIndex)) {
					continue;
				}
				keyObj = _zjcaPlugin.GetKey(i);
				
				var certCnt = keyObj.GetCertificateCnt();
				for (var index = 0; index < certCnt; index++) {
					certObj = keyObj.GetCertificateByIndex(index);
					if ((0 != type) && (certObj.KeyType != type)) {
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
	/*
	 *	获取证书内容
	 */
	this.getCertContent = function (keyIndex, alg, usage) {	
		var keyObj;
		var certObj;
		var content = "";
		
		try {
			// 获取对应的设备对象
			keyObj = _zjcaPlugin.GetKey(keyIndex);
			
			// 遍历证书
			var certCnt = keyObj.GetCertificateCnt();	
			for (var index = 0; index < certCnt; index++) {
				certObj = keyObj.GetCertificateByIndex(index);
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
			cert = _zjcaPlugin.CreateCert();
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
				return FailedRespObject(-1, "参数错误!");
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
			var certObj = _zjcaPlugin.CreateCert();
			certObj.FromString(certBase64);
			certObj.OpenViewDialog(hwnd);
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
			var certObj = _zjcaPlugin.CreateCert();
			certObj.FromString(certBase64);
			result = certObj.IsVaild(flags);
			return OkRespObject(Number(result));		
		}
		catch (e) {
			return FailedRespObject(e.number, e.description);			
		}
	}	
	/*
	 *	签名消息
	 */
	this.signMessage = function (keyIndex, alg, type, flags, msg, userId, charset) {	
		var keyObj = null;
		var certObj = null;			
		var sign = "";
						
		// 找到对应的Key，进行签名
		keyObj = _zjcaPlugin.GetKey(keyIndex);
		if (keyObj != null) {			
			// 没有指定签名算法，使用默认的签名证书算法
			if (0 == alg) {
				var certCnt = keyObj.GetCertificateCnt();	
				for (var index = 0; index < certCnt; index++) {
					certObj = keyObj.GetCertificateByIndex(index);
					if (1 == certObj.KeyUsage) {
						alg = certObj.KeyType;
						break;
					}
				}	
			}
			// 无签名证书
			if (0 == alg) {
				return FailedRespObject(-1, "签名证书不存在");
			}
			
			// 未指定userId，则根据算法选择默认的userId
			if (userId == undefined) {
				userId = (2 == alg) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
			}
			// 签名
			try {
				sign = keyObj.SignMessage(alg, msg, charset, 0, userId, type, flags);
				return OkRespObject(sign);
			}catch (e) {
				return FailedRespObject(e.number, e.description);	
			}	
		}else {
			return FailedRespObject(-1, "选择的介质序号错误");
		}
	}
	/*
	 *	验证消息签名
	 */
	this.verifyMessage = function (keyIndex, msg, userId, charset, base64Sign, base64Cert) {
		var pass = false;

		try {
			var certObj = null;
			var keyObj = null;
			var signObj = null;
			
			// 构造证书对象
			certObj = _zjcaPlugin.CreateCert();
			certObj.FromString(base64Cert);
			
			// 未指定userId，则根据算法选择默认的userId
			if (userId == undefined) {
				userId = (2 == certObj.KeyType) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
			}
			
			//使用软件验签
			if (-1 == keyIndex) {
				signObj = _zjcaPlugin.CreateSign();
				signObj.FromString(base64Sign);
				pass = signObj.VerifyMessage(msg, charset, 0, userId, base64Cert);				
			}
			//使用硬件KEY验签
			else {
				keyObj = _zjcaPlugin.GetKey(keyIndex);
				if (keyObj) {
					pass = keyObj.VerifyMessage(msg, charset, 0, userId, base64Cert, base64Sign);
				}else {
					return FailedRespObject(-1, "选择的介质序号错误");
				}
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
		var keyObj = null;
		var certObj = null;
		var sign = "";
		
		// 找到对应的Key，进行签名
		keyObj = _zjcaPlugin.GetKey(keyIndex);
		if (keyObj != null) {				
			// 没有指定签名算法，使用默认的签名证书算法
			if (0 == alg) {
				var certCnt = keyObj.GetCertificateCnt();	
				for (var index = 0; index < certCnt; index++) {
					certObj = keyObj.GetCertificateByIndex(index);
					if (1 == certObj.KeyUsage) {
						alg = certObj.KeyType;
						break;
					}
				}	
			}
			// 无签名证书
			if (0 == alg) {
				return FailedRespObject(-1, "签名证书不存在");
			}
			// 未指定userId，则根据算法选择默认的userId
			if (userId == undefined) {
				userId = (2 == alg) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
			}
			// 签名
			try {
				sign = keyObj.SignFile(alg, file, 0, userId, type, flags);
				
				// 返回结果
				if (callback != null && callback != undefined) {
					setTimeout(function(){callback(0, sign)}, 500);
					return OkRespObject(null);
				}
				else {
					return OkRespObject(sign);
				}
			}catch (e) {
				if (callback != null && callback != undefined) {
					setTimeout(function(){callback(e.number, "")}, 500);
				}
				return FailedRespObject(e.number, e.description);	
			}
		}
		// 介质序号错误
		else{
			return FailedRespObject(-1, "选择的介质序号错误");				
		}
	}
	/*
	 *	验证文件的签名
	 */	
	this.verifyFile = function (keyIndex, file, userId, base64Sign, base64Cert, callback) {		
		var pass = false;

		try {
			var certObj = null;
			var keyObj = null;
			var signObj = null;
			
			// 构造证书对象
			certObj = _zjcaPlugin.CreateCert();
			certObj.FromString(base64Cert);
			
			// 未指定userId，则根据算法选择默认的userId
			if (userId == undefined) {
				userId = (2 == certObj.KeyType) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
			}
			
			//使用软件验签
			if (-1 == keyIndex) {
				signObj = _zjcaPlugin.CreateSign();
				signObj.FromString(base64Sign);
				pass = signObj.VerifyFile(file, 0, userId, base64Cert);				
			}
			//使用硬件KEY验签
			else {
				keyObj = _zjcaPlugin.GetKey(keyIndex);
				if (keyObj) {
					pass = keyObj.VerifyFile(file, 0, userId, base64Cert, base64Sign);
				}
			}
			
			// 返回结果
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(0, pass)}, 500);
				return OkRespObject(null);
			}
			else {
				return OkRespObject(pass);	
			}
		}catch(e) {
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(e.number, false)}, 500);
			}
			return FailedRespObject(e.number, e.description);
		}
	}	
	/*
	 *	签名杂凑
	 */	
	this.signDigest = function (keyIndex, alg, type, flags, digest, digestAlg) {		
		var keyObj = null;
		var certObj = null;			
		var sign = "";
						
		// 找到对应的Key，进行签名
		keyObj = _zjcaPlugin.GetKey(keyIndex);
		if (keyObj != null) {			
			// 没有指定签名算法，使用默认的签名证书算法
			if (0 == alg) {
				var certCnt = keyObj.GetCertificateCnt();	
				for (var index = 0; index < certCnt; index++) {
					certObj = keyObj.GetCertificateByIndex(index);
					if (1 == certObj.KeyUsage) {
						alg = certObj.KeyType;
						break;
					}
				}	
			}
			// 无签名证书
			if (0 == alg) {
				return FailedRespObject(-1, "签名证书不存在");
			}
			
			// 签名
			try {
				sign = keyObj.SignDigest(alg, digest, digestAlg, type, flags);
				return OkRespObject(sign);
			}catch (e) {
				return FailedRespObject(e.number, e.description);	
			}	
		}else {
			return FailedRespObject(-1, "选择的介质序号错误");
		}
	}
	/*
	 *	验证杂凑的签名
	 */	
	this.verifyDigest = function (keyIndex, digest, digestAlg, base64Sign, base64Cert) {
		var pass = false;

		try {
			var keyObj = null;
			var signObj = null;						
			
			//使用软件验签
			if (-1 == keyIndex) {
				signObj = _zjcaPlugin.CreateSign();
				signObj.FromString(base64Sign);
				pass = signObj.VerifyDigest(digest, digestAlg, base64Cert);				
			}
			//使用硬件KEY验签
			else {
				keyObj = _zjcaPlugin.GetKey(keyIndex);
				if (keyObj) {
					pass = keyObj.VerifyDigest(digest, digestAlg, base64Cert, base64Sign);
				}else {
					return FailedRespObject(-1, "选择的介质序号错误");
				}
			}
			return OkRespObject(pass);
		}catch(e) {
			return FailedRespObject(e.number, e.description);
		}
	}	
	/*
	 *	获取P7签名中的附加信息
	 */	
	this.getSignatureAttached = function (base64Sign, charset) {
		var signObj = null;
		try{
			signObj = _zjcaPlugin.CreateSign();
			signObj.FromString(base64Sign);
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
			
		var content = "";
		var base64Cert = "";
		var signTime = "";
		try {
			content = signObj.GetContent(charset);
		}catch(e){
			//Do nothing!
		}
		try {
			base64Cert = signObj.GetCert();
		}catch(e){
			//Do nothing!
		}
		try {
			signTime = signObj.GetTimestamp();
		}catch(e){
			//Do nothing!
		}
		return OkRespObject({text:content,cert:base64Cert,time:signTime});	
	}
	/*
	 *	加密消息
	 */
	this.encryptMessage = function (keyIndex, base64Cert, msg, charset, symmAlg, cipherType, paddingType, desFile, callback) {
		try {
			var cipher = "";
			var saveToFile = false;
			
			// 加密结果保存到文件
			if (desFile != null && desFile != undefined && desFile.length > 0) {
				saveToFile = true;
			}else {
				saveToFile = false;
				desFile = "";
			}

			// 加密
			if (keyIndex < 0) { //使用外部证书加密
				var cipherObj = _zjcaPlugin.CreateCipher();
				cipherObj.EncryptMessage(msg, charset, base64Cert, symmAlg, paddingType, cipherType, 0, desFile);
				cipher = saveToFile ? desFile : cipherObj.ToString();
			}else{			
				// 获取设备对象
				var keyObj = _zjcaPlugin.GetKey(keyIndex);
				if (keyObj) {
					cipher = keyObj.EncryptMessage(msg, charset, base64Cert, symmAlg, paddingType, cipherType, 0, desFile);
				}else {
					return FailedRespObject(-1, "选择的介质序号错误");
				}
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
	}
	/*
	 *	解密消息
	 */	
	this.decryptMessage = function (keyIndex, asymmAlg, symmAlg, paddingType, base64Cipher, charset, desFile, callback) {
		try {	
			// 获取设备对象
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			if (!keyObj) {
				return FailedRespObject(-1, "选择的介质序号错误");
			}
			
			// 没有指定非对称算法，使用默认的加密证书算法
			if (0 == asymmAlg) {
				var certCnt = keyObj.GetCertificateCnt();	
				for (var index = 0; index < certCnt; index++) {
					certObj = keyObj.GetCertificateByIndex(index);
					if (1 == certObj.KeyUsage) {
						asymmAlg = certObj.KeyType;
						break;
					}
				}	
			}
			// 无加密证书
			if (0 == asymmAlg) {
				return FailedRespObject(-1, "加密证书不存在");
			}
			
			// 解密结果保存到文件
			var saveToFile = false;
			if (desFile != null && desFile != undefined && desFile.length > 0) {
				saveToFile = true;
			}else {
				saveToFile = false;
				desFile = "";
			}				
			
			// 解密得到原文消息	
			var algs = Number(asymmAlg) | Number(symmAlg);
			var decrypted = keyObj.DecryptMessage(algs, base64Cipher, charset, paddingType, 0, 0, desFile);
			
			// 返回结果
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(0, decrypted)}, 500);				
				return OkRespObject(null);
			}else{
				return OkRespObject(decrypted);				
			}	
		}
		catch(e) {
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(e.number, "")}, 500);
			}
			return FailedRespObject(e.number, e.description);				
		}
	}	
	/*
	 *	加密文件
	 */	
	this.encryptFile = function (keyIndex, base64Cert, srcFile, desFile, symmAlg, cipherType, paddingType, callback) {
		try {
			var cipher = "";
			var saveToFile = false;
			
			// 加密结果保存到文件
			if (desFile != null && desFile != undefined && desFile.length > 0) {
				saveToFile = true;
			}else {
				saveToFile = false;
				desFile = "";
			}
			
			// 加密
			if (keyIndex < 0) { //使用外部证书加密
				var cipherObj = _zjcaPlugin.CreateCipher();
				cipherObj.EncryptFile(srcFile, base64Cert, symmAlg, paddingType, cipherType, 0, desFile);
				cipher = saveToFile ? desFile : cipherObj.ToString();
			}else{	
				// 获取设备对象
				var keyObj = _zjcaPlugin.GetKey(keyIndex);
				if (keyObj) {
					cipher = keyObj.EncryptFile(srcFile, base64Cert, symmAlg, paddingType, cipherType, 0, desFile);
				}else {
					return FailedRespObject(-1, "选择的介质序号错误");
				}
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
	}
	/*
	 *	解密文件(解密结果如果是消息信息返回、而不是解密到文件，则要求原文内容为可见字符，否则无法通过消息形式返回！！！)
	 */	
	this.decryptFile = function (keyIndex, asymmAlg, symmAlg, paddingType, cipherFile, desFile, callback) {
		try {		
			// 获取设备对象
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			if (!keyObj) {
				return FailedRespObject(-1, "选择的介质序号错误");
			}
			
			// 没有指定非对称算法，使用默认的加密证书算法
			if (0 == asymmAlg) {
				var certCnt = keyObj.GetCertificateCnt();	
				for (var index = 0; index < certCnt; index++) {
					certObj = keyObj.GetCertificateByIndex(index);
					if (1 == certObj.KeyUsage) {
						asymmAlg = certObj.KeyType;
						break;
					}
				}	
			}
			// 无加密证书
			if (0 == asymmAlg) {
				return FailedRespObject(-1, "加密证书不存在");
			}
			
			// 解密结果保存到文件
			var saveToFile = false;
			if (desFile != null && desFile != undefined && desFile.length > 0) {
				saveToFile = true;
			}else {
				saveToFile = false;
				desFile = "";
			}
			
			// 解密到明文，或明文文件
			var algs = Number(asymmAlg) | Number(symmAlg);
			var decrypted = keyObj.DecryptFile(algs, cipherFile, paddingType, 0, 0, desFile);
						
			// 返回结果
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(0, decrypted)}, 500);				
				return OkRespObject(null);
			}else{
				return OkRespObject(decrypted);				
			}	
		}
		catch(e) {
			if (callback != null && callback != undefined) {
				setTimeout(function(){callback(e.number, "")}, 500);
			}
			return FailedRespObject(e.number, e.description);		
		}
	}	
	/*
	 *	显示文件选择对话框，返回选择的文件名
	 */	
	this.getFileName = function (caption, filter) {
		try {
			var fileName = _zjcaPlugin.OpenFileDialog("选择文件", "");
			return OkRespObject(fileName);			
		}
		catch(e) {
			return FailedRespObject(e.number, e.description);		
		}
	}
	/*
	 *	显示路径选择对话框，返回选择的路径名
	 */	
	this.getPathName = function (caption) {
		try {
			var pathName = _zjcaPlugin.OpenPathDialog("选择文件夹", "");
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
			var content = _zjcaPlugin.ReadFile(fileName);
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
			_zjcaPlugin.WriteFile(fileName, content, inBinary);
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
			_zjcaPlugin.DestroyFile(fileName);
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
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			var keyReq = keyObj.GenAuthReqCode(authType);
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
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			keyObj.Initiliaze(authCode, userPIN, label);
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
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			keyObj.UnLockPIN(authCode, newPIN);
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
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			keyObj.ChangePIN(1, oldPIN, newPIN);
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
	}
	/*
	 * 生成证书请求
	 */
	this.genCertReq = function (keyIndex, certAlg, newKeypair, bits, cn) {
		try{
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			var csr = keyObj.GenCertRequest(certAlg, newKeypair, bits, cn);
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
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			keyObj.ImportDualCertAndKeyPair(1, signCert, exchCert, pfx, authCode);
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
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			keyObj.ImportCert(alg, true, signCert);
			keyObj.ImportKeyPair(alg, keyPair, symmAlgID, symmCipher, authCode);	
			keyObj.ImportCert(alg, false, exchCert);
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
	}		
	/*
	 *	证书算法升级(导入证书和加密密钥对)
	 */
	this.importUpgradedCertAndKeyPair = function (keyIndex, old_alg, new_alg, signCert, exchCert, keyPair, symmAlgID, symmCipher, authCode){
		try{
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			keyObj.ImportUpgradedCertsAndKeyPair(old_alg, new_alg, signCert, exchCert, keyPair, symmAlgID, symmCipher, authCode);
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
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			keyObj.ImportDualCert(alg, signCert, exchCert, "");
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
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			keyObj.ImportCert(alg, true, signCert);
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
			var keyObj = _zjcaPlugin.GetKey(keyIndex);
			keyObj.Validation(alg, usage, test);
			return OkRespObject(null);			
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}
	}
	/*
	 *	解析时间戳，返回时间戳中的属性。params指定要返回的项，比如:"sign|time|cert|digest|digest_alg"
	 */
	this.parseTimestamp = function (ts, params) {
		var tsObj = null;
		var attrs = params.split("|");
		try {
			var sign = "";
			var time = "";
			var cert = "";
			var digest = "";
			var digest_alg = 0;			
			tsObj = _zjcaPlugin.CreateTimestamp();
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
		}finally {
			_zjcaPlugin.ReleaseTimestamp(tsObj);
		}			
	}
	/*
	 *	验证时间戳(验证签名和证书链)
	 */
	this.verifyTimestamp = function (ts) {	
		var tsObj = null;
		try {	
			tsObj = _zjcaPlugin.CreateTimestamp();
			tsObj.FromString(ts);
			tsObj.verify();
			return OkRespObject(null);	
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}finally {
			_zjcaPlugin.ReleaseTimestamp(tsObj);
		}			
	}
	/*
	 *	验证时间戳(验证杂凑值、签名和证书链)
	 */
	this.verifyTimestampWithDigest = function (ts, digest) {		
		var tsObj = null;	
		try {	
			tsObj = _zjcaPlugin.CreateTimestamp();
			tsObj.FromString(ts);
			tsObj.verifyWithDigest(digest, 0);
			return OkRespObject(null);	
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}finally {
			_zjcaPlugin.ReleaseTimestamp(tsObj);
		}				
	}
	/*
	 *	验证时间戳(验证原文消息、签名和证书链)
	 */
	this.verifyTimestampWithMessage = function (ts, message, charset, digest_alg, userId, cert) {		
		var tsObj = null;		
		try {	
			tsObj = _zjcaPlugin.CreateTimestamp();
			tsObj.FromString(ts);
			tsObj.verifyWithMessage(message, charset, digest_alg, userId, cert);
			return OkRespObject(null);	
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}finally {
			_zjcaPlugin.ReleaseTimestamp(tsObj);
		}					
	}
	/*
	 *	验证时间戳(验证原文文件、签名和证书链)
	 */
	this.verifyTimestampWithFile = function (ts, file, digest_alg, userId, cert) {			
		var tsObj = null;		
		try {	
			tsObj = _zjcaPlugin.CreateTimestamp();
			tsObj.FromString(ts);
			tsObj.verifyWithFile(file, digest_alg, userId, cert);
			return OkRespObject(null);	
		}catch(e){
			return FailedRespObject(e.number, e.description);
		}finally {
			_zjcaPlugin.ReleaseTimestamp(tsObj);
		}					
	}		
}