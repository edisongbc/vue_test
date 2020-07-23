/* 
 * ZJCA Websocket object Script Interface for HTML
 * Version: v0.0.1
 * Date: 2018-04-25
 * 2015 - 2018 ZJCA. All rights reserved.
 * 
 *
*/

// HTTPS服务端口
var g_serverPort = 80;

// 异步Ajax请求
function asyncAjax(param, callback) {
	var str = JSON.stringify(param);
	//console.log(str);
	var params = toUnicode(str);
	//console.log(params);
	$.ajax({
		url:"https://cmt.zjca.com.cn:" + g_serverPort,
		type: "POST",
		async:true,
		data: params,
		crossDomain: true,
		dataType: "json",
		success: function(result) {
			callback(result);
		},
		error: function(xhr, status, error) {
			//网络异常错误不返回给应用,只是增加log输出
			if (console) {
				console.log("asyncAjax() error!" + status.message);
			}
			//callback({res:0x80000002,msg:status.message});
		}
	});
}
// 同步Ajax请求
function syncAjax(param) {
	var res = undefined;
	var str = JSON.stringify(param);
	//console.log(str);
	var params = toUnicode(str);
	//console.log(params);
	$.ajax({
		url:"https://cmt.zjca.com.cn:" + g_serverPort,
		type: "POST",
		async:false,
		data: params,
		crossDomain: true,
		dataType: "json",
		success: function(result) {
			res = result;
			//console.log(JSON.stringify(result));
		},
		error: function(xhr, status, error) {
			//网络异常错误不返回给应用,只是增加log输出
			if (console && console != undefined) {
				console.log("asyncAjax() error!" + status.message);
			}
			//res = {res:0x80000002,msg:status.message};
		}
	});
	return res;
}
/*
 * 原型：字符串格转UNICODE字符串
 */
function toUnicode(str) {
	return str.split('').map(function (value, index, array) {
		var temp = value.charCodeAt(0).toString(16).toUpperCase();
		if (temp.length > 2) {
			return '\\u' + temp;
		}
		return value;
	}).join('');
}

/*
 *	ZJCA客户端Websocket接口封装，用来支持非IE浏览器
 */
function zjca_Websocket(eventCallback) {
	var _websocket = null;
	var _isConnected = false;
	var _isResponded = false;
	var _onKeyEvent = eventCallback;
	
	/*
	 *	连接成功事件响应函数
	 */
	function onConnected(e) {
		// 连接成功
		_isConnected = true;
	}	
	
	/*
	 *	服务器断开事件响应函数
	 */
	function onDisconnected(event) {
		// 未连接上客户端
		_isConnected = false;
	}
	
	/*
	 *	接受客户端发来的介质事件消息
	 */
	function onReceived(event) {
		var resp = JSON.parse(event.data);
		if (resp.respType == RESP_DEVICE_EVENT) {	
			
			//此处不能直接调用onKeyEvent()，因为一般onKeyEvent()中会发HTTP连接请求，会导致与当前
			//Websocket长连接嵌套，故需先保证onReceived()返回之后再触发onKeyEvent()!!!
			setTimeout(function(){onKeyEvent(resp.eventType, resp.keyIndex, resp.keyName)}, 1000);
		}
	}
	
	/*
	 *	初始化函数
	 */
	this.init = function (product, version) {	
		// 根据产品和版本，确定端口号
		if (1 == product) {			//ZJCA 通用版客户端
			g_serverPort = 5150;
		}else if (2 == product) {	//ZJCA 政务版客户端
			g_serverPort = 6368;//6363;
		}else if (3 == product) {	//法人证客户端
			g_serverPort = 6150;
		}
		else {
			return FailedRespObject(0x80000001, "");
		}
		
		// 先释放老的
		this.finaled();			

		// 发送初始化请求
		var param = {msgType:FUNC_INIT};		
		var res = syncAjax(param);
		if (0 != res.res){
			return FailedRespObject(0x80000002, "");
		}		
		
		// 创建一个Socket长连接，用来接收设备事件
		/*var ishttps = 'https:' == document.location.protocol ? true: false;
		if (ishttps) {
			_websocket = new WebSocket('wss://127.0.0.1:' + g_serverPort);
		}
		else {
			_websocket = new WebSocket('ws://127.0.0.1:' + g_serverPort);			
		}*/
		_websocket = new WebSocket('wss://cmt.zjca.com.cn:' + g_serverPort);
		
		// 握手成功
		_websocket.onopen = onConnected;
		
		// 监听消息
		_websocket.onmessage = onReceived; 

		// 监听Socket的关闭
		_websocket.onclose = onDisconnected;
		
		return OkRespObject(null);
	}
	
	/*
	 *	结束函数
	 */
	this.finaled = function () {
		if (_websocket) {
			_websocket.close();
			_websocket = null;
			_isResponded = false;
			_isConnected = false;
		}		
		return OkRespObject(null);
	}
	
	/*
	 *	获取版本信息
	 */	
	this.getVersion = function () {		
		var res;
		
		// 获取客户端版本
		var param = {msgType:FUNC_GET_VERSION};
		
		res = syncAjax(param);
		
		// 执行成功
		if (0 == res.res){
			return OkRespObject(res.version);			
		}
		else{
			return FailedRespObject(res.res, res.msg);
		}
	}	
	/*
	 *	功能：获取用户选项设置
	 */
	this.getUserSetting = function (opt) {		
		var res;
		
		// 获取用户选项设置
		var param = {msgType:FUNC_GET_USEROPTION,type:opt};
		
		res = syncAjax(param);
		
		// 执行成功
		if (0 == res.res){
			return OkRespObject(res.val);			
		}
		else{
			return FailedRespObject(res.res, res.msg);
		}
	}	
	/*
	 *	功能：保存用户选项设置
	 */
	this.putUserSetting = function (opt, val) {	
		var res;
		
		// 保存用户选项设置
		var param = {msgType:FUNC_SET_USEROPTION,type:opt,value:val};
		
		res = syncAjax(param);
		
		// 执行成功
		if (0 == res.res){
			return OkRespObject(null);			
		}
		else{
			return FailedRespObject(res.res, res.msg);
		}
	}		
	/*
	 *	获取所有设备信息列表(不强制刷新)
	 */
	this.getKeyList = function (forceUpdate) {	
		var res;
		var param;
		var devices;
		var keyArray = new Array;
		
		// 原来的连接已经断开，故需要重新连接
		if (forceUpdate && !_isConnected) {	
			this.finaled();
			// 发送初始化请求
			param = {msgType:FUNC_INIT};		
			res = syncAjax(param);
			if (0 != res.res){
				return FailedRespObject(0x80000002, "ZJCA 客户端未安装或未启动！如程序已启动，请关闭浏览器后重试！");
			}				
			_websocket = new WebSocket('wss://cmt.zjca.com.cn:' + g_serverPort);	
			_websocket.onopen = onConnected;
			_websocket.onmessage = onReceived; 
			_websocket.onclose = onDisconnected;
		}
			
		// 获取所有设备
		param = {msgType:FUNC_GET_DEVICE_LIST,refresh:forceUpdate};
		res = syncAjax(param);
		
		// 执行成功
		if (0 == res.res && res.devices){
			for (var i = 0; i < res.devices.length; i++){
				var key = new zjca_Key( i,								//总序号 
										res.devices[i].sn, 				//SN
										res.devices[i].label, 			//Label
										res.devices[i].manufacturer);	//厂商名
				keyArray.push(key);
			}	
			return OkRespObject(keyArray);
		}else {
			return FailedRespObject(res.res, res.msg);
		}
	}	
	/*
	 *	获取所有证书信息列表
	 */
	this.getCertList = function (keyIndex, alg, usage, flags) {		
		var res;
		var certs;
		var certArray = new Array;
		
		if (flags == undefined || isNaN(flags)) {
			flags = 0;
		}
		
		var param = {msgType:FUNC_GET_CERTIFICATE_LIST,keyIndex:keyIndex,alg:alg,usage:usage,flags:flags};				
		res = syncAjax(param)
		
		// 执行成功
		if (0 == res.res && res.certs){
			for (var i = 0; i < res.certs.length; i++){
				var cert = new zjca_Cert( i,						//总序号
										  res.certs[i].sn, 			//SN
										  res.certs[i].alg, 		//Alg
										  res.certs[i].usage,       //Usage
										  res.certs[i].dn,          //DN
										  res.certs[i].issuer,      //Issuer
										  res.certs[i].start,       //起始时间
										  res.certs[i].end,         //失效时间
										  res.certs[i].keyindex);	//所在KEY的序号
				certArray.push(cert);
			}	
			return OkRespObject(certArray);
		}else {
			return FailedRespObject(res.res, res.msg);			
		}		
	}	
	/*
	 *	通过证书序列号获取证书内容
	 */
	this.getCertContentBySN = function (sn) {	
		var param = {msgType:FUNC_GET_CERTIFICATE_BYSN,keyIndex:-1,cert_sn:sn};
		
		res = syncAjax(param)
		if (0 == res.res && res.cert) {			
			return OkRespObject(res.cert);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}	
	/*
	 *	通过算法和用途获取证书内容
	 */
	this.getCertContent = function (keyIndex, alg, usage) {		
		var param = {msgType:FUNC_GET_CERTIFICATE_DATA,keyIndex:keyIndex,alg:alg,usage:usage};
		
		res = syncAjax(param)
		if (0 == res.res && res.cert) {			
			return OkRespObject(res.cert);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}
	/*
	 *	解码证书内容，返回该证书的句柄，使用完成之后需要调用releaseCert()释放！
	 */
	this.decodeCert = function (certBase64) {
		var param = {msgType:FUNC_DECODER_CERTIFICATE,cert:certBase64};
		
		res = syncAjax(param)
		if (0 == res.res && res.obj) {			
			return OkRespObject(res.obj);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}
	/*
	 *	获取证书属性
	 */
	this.getCertAttribute = function (certHandle, attrName, attrParam) {	
		var param = {msgType:FUNC_CERT_ATTRIBUTE,obj:Number(certHandle),name:attrName,param:attrParam};			
		res = syncAjax(param)
		if (0 == res.res && res.value) {			
			return OkRespObject(res.value);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}
	/*
	 *	获取证书扩展属性
	 */
	this.getCertExtension = function (certHandle, extOid) {	
		var param = {msgType:FUNC_CERT_EXTENSION,obj:Number(certHandle),name:extOid};		
		res = syncAjax(param)
		if (0 == res.res && res.value) {			
			return OkRespObject(res.value);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}	
	/*
	 *	释放证书句柄
	 */
	this.releaseCert = function (certHandle) {	
		var param = {msgType:FUNC_RELEASE_CERTIFCATE,obj:Number(certHandle)};		
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}
	/*
	 *	显示证书
	 */	
	this.showCert = function (certBase64, hwnd) {	
		var param = {msgType:FUNC_SHOW_CERTIFICATE,cert:certBase64,parentWnd:Number(hwnd)};			
		res = syncAjax(param)
		if (0 == res.res && res.value) {			
			return OkRespObject(res.value);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}	
	/*
	 *	验证证书
	 */	
	this.verifyCert = function (certBase64, flags) {	
		var param = {msgType:FUNC_VERIFY_CERTIFICATE,cert:certBase64,flags:Number(flags)};			
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(res.status);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}	
	/*
	 *	使用PFX证书签名消息
	 */
	this.signMessageByCert = function (cert, type, flags, msg, userId, charset) {
		return FailedRespObject(0x81000005, "功能不支持!");
	}
	/*
	 *	使用介质签名消息
	 */
	this.signMessage = function (keyIndex, alg, type, flags, msg, userId, charset) {
		//如果没有指定算法，则选择默认的签名证书
		if (0 == alg) {
			var resp = this.getCertList(keyIndex, 0, 1);
			if (resp.code != 0 || resp.res.length <= 0) {
				return FailedRespObject(resp.code, "无签名证书！");	
			}
			//
			var certArrary = new Array;
			certArrary = resp.res;
			alg = certArrary[0].getAlg();			
		}
		
		// 未指定userId，则根据算法选择默认的userId
		if (userId == null || userId == undefined) {
			userId = (2 == alg) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
		}
		
		//参数charset将被忽略，因为该模式下只能时候UTF8编码
		var param = {msgType:FUNC_SIGN_MESSAGE,keyIndex:keyIndex,alg:alg,type:type,flags:flags,text:msg,encode:charset,userId:userId};		
		res = syncAjax(param)
		if (0 == res.res && res.sign) {			
			return OkRespObject(res.sign);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 *	使用证书验证消息签名
	 */
	this.verifyMessage = function (keyIndex, msg, userId, charset, base64Sign, base64Cert) {
		// 未指定userId，则根据算法选择默认的userId
		if (userId == null || userId == undefined) {
			var resp;
			//从签名中获取证书
			if (base64Cert == undefined || base64Cert == "") {
				resp = this.getSignatureAttached(base64Sign, 0x03);
				if (resp.code != 0 || resp.res == undefined || resp.res.cert == undefined) {
					return FailedRespObject(resp.code, "签名证书不能为空！");	
				}
				base64Cert = resp.res.cert;
			}
			// 获取证书算法
			resp = this.decodeCert(base64Cert);
			if (resp.code != 0) {
				return FailedRespObject(resp.code, "解码证书失败！");	
			}
			var certHandle = resp.res;
			resp = this.getCertAttribute(certHandle, FUNC_CERT_ATTRIBUTE_PARAM_KEYALG, "");
			if (resp.code != 0) {
				return FailedRespObject(resp.code, "获取证书算法失败！");	
			}
			var alg = Number(resp.res);
			userId = (2 == alg) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
			//释放对象
			this.releaseCert(certHandle);
		}
		
		//参数charset将被忽略，因为该模式下只能时候UTF8编码
		var param = {msgType:FUNC_VERIFY_MESSAGE,keyIndex:keyIndex,text:msg,encode:charset,userId:userId,sign:base64Sign,cert:base64Cert};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(true);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}
	/*
	 *	使用介质签名文件
	 */
	this.signFile = function (keyIndex, alg, type, flags, fileName, userId, callback) {
		//如果没有指定算法，则选择默认的签名证书
		if (0 == alg) {
			var resp = this.getCertList(keyIndex, 0, 1);
			if (resp.code != 0 || resp.res.length <= 0) {
				return FailedRespObject(resp.code, "无签名证书！");	
			}
			//
			var certArrary = new Array;
			certArrary = resp.res;
			alg = certArrary[0].getAlg();			
		}
		
		// 未指定userId，则根据算法选择默认的userId
		if (userId == null || userId == undefined) {
			userId = (2 == alg) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
		}
		
		// 签名文件
		var param = {msgType:FUNC_SIGN_FILE,keyIndex:keyIndex,alg:alg,type:type,flags:flags,file:fileName,userId:userId};
		
		// 异步消息
		if (callback != null && callback != undefined) {
			ajax_cb = function (res) {
				callback(res.res, res.sign);
			}
			asyncAjax(param, ajax_cb);
			return OkRespObject(null);
		}
		// 同步消息
		else {
			res = syncAjax(param)
			if (0 == res.res && res.sign) {			
				return OkRespObject(res.sign);
			}else {
				return FailedRespObject(res.res, res.msg);	
			}	
		}
	}
	/*
	 *	使用证书验证文件签名
	 */
	this.verifyFile = function (keyIndex, fileName, userId, base64Sign, base64Cert, callback) {
		// 未指定userId，则根据算法选择默认的userId
		if (userId == null || userId == undefined) {
			var resp;
			//从签名中获取证书
			if (base64Cert == undefined || base64Cert == "") {
				resp = this.getSignatureAttached(base64Sign, 0x03);
				if (resp.code != 0 || resp.res == undefined || resp.res.cert == undefined) {
					return FailedRespObject(resp.code, "签名证书不能为空！");	
				}
				base64Cert = resp.res.cert;
			}
			// 获取证书算法
			resp = this.decodeCert(base64Cert);
			if (resp.code != 0) {
				return FailedRespObject(resp.code, "解码证书失败！");	
			}
			var certHandle = resp.res;
			resp = this.getCertAttribute(certHandle, FUNC_CERT_ATTRIBUTE_PARAM_KEYALG, "");
			if (resp.code != 0) {
				return FailedRespObject(resp.code, "获取证书算法失败！");	
			}
			var alg = Number(resp.res);
			userId = (2 == alg) ? SM2_SIGATURE_DESC : RSA_SIGATURE_DESC;
			//释放对象
			this.releaseCert(certHandle);
		}
		
		// 验证签名
		var param = {msgType:FUNC_VERIFY_FILE,keyIndex:keyIndex,file:fileName,userId:userId,sign:base64Sign,cert:base64Cert};	
				
		// 异步消息
		if (callback != null && callback != undefined) {
			ajax_cb = function (res) {
				callback(res.res, 0==res.res ? true : false);
			}
			asyncAjax(param, ajax_cb);
			return OkRespObject(null);
		}
		// 同步消息
		else {
			res = syncAjax(param)
			if (0 == res.res) {			
				return OkRespObject(true);
			}else {
				return FailedRespObject(res.res, res.msg);	
			}	
		}
	}
	/*
	 *	使用介质来签名杂凑值
	 */
	this.signDigest = function (keyIndex, alg, type, flags, digest, digestAlg) {
		//如果没有指定算法，则选择默认的签名证书
		if (0 == alg) {
			var resp = this.getCertList(keyIndex, 0, 1);
			if (resp.code != 0 || resp.res.length <= 0) {
				return FailedRespObject(resp.code, "无签名证书！");	
			}
			//
			var certArrary = new Array;
			certArrary = resp.res;
			alg = certArrary[0].getAlg();			
		}
		
		// 签名杂凑值
		var param = {msgType:FUNC_SIGN_DIGEST,keyIndex:keyIndex,alg:alg,type:type,flags:flags,digestAlg:digestAlg,digest:digest};		
		res = syncAjax(param)
		if (0 == res.res && res.sign) {			
			return OkRespObject(res.sign);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 *	使用证书验证杂凑的签名
	 */
	this.verifyDigest = function (keyIndex, digest, digestAlg, base64Sign, base64Cert) {
		var param = {msgType:FUNC_VERIFY_DIGEST,keyIndex:keyIndex,digestAlg:digestAlg,digest:digest,sign:base64Sign,cert:base64Cert};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(true);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}
	/*
	 *	获取P7签名中的附加信息
	 */	
	this.getSignatureAttached = function (base64Sign, charset) {
		//参数charset将被忽略，因为该模式下只能时候UTF8编码
		var param = {msgType:FUNC_SIGNATURE_ATTACHED,sign:base64Sign};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject({text:res.text,cert:res.cert,time:res.time});
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}	
	/*
	 *	加密消息
	 */
	this.encryptMessage = function (keyIndex, base64Cert, msg, charset, symmAlg, cipherType, paddingType, desFile, callback) {
		//参数charset将被忽略，因为该模式下只能时候UTF8编码
		var param = {msgType:FUNC_ENCODE_MESSAGE,keyIndex:keyIndex,type:cipherType,text:msg,cert:base64Cert,symmAlg:symmAlg,padding:paddingType,desFile:desFile};	
		
		// 异步消息
		if (callback != null && callback != undefined) {
			ajax_cb = function (res) {
				callback(res.res, res.cipher);
			}
			asyncAjax(param, ajax_cb);
			return OkRespObject(null);
		}
		// 同步消息
		else {
			res = syncAjax(param)
			if (0 == res.res) {			
				return OkRespObject(res.cipher);
			}else {
				return FailedRespObject(res.res, res.msg);	
			}	
		}
	}
	/*
	 *	解密消息
	 */	
	this.decryptMessage = function (keyIndex, asymmAlg, symmAlg, paddingType, base64Cipher, charset, desFile, callback) {
		//参数charset将被忽略，因为该模式下只能时候UTF8编码
		var algs = Number(asymmAlg) | Number(symmAlg);
		var param = {msgType:FUNC_DECODE_MESSAGE,keyIndex:keyIndex,algs:algs,cipher:base64Cipher,padding:paddingType,desFile:desFile};	
				
		// 异步消息
		if (callback != null && callback != undefined) {
			ajax_cb = function (res) {
				callback(res.res, res.text);
			}
			asyncAjax(param, ajax_cb);
			return OkRespObject(null);
		}
		// 同步消息
		else {
			res = syncAjax(param)
			if (0 == res.res) {			
				return OkRespObject(res.text);
			}else {
				return FailedRespObject(res.res, res.msg);	
			}
		}
	}
	/*
	 *	加密文件
	 */	
	this.encryptFile = function (keyIndex, base64Cert, srcFile, desFile, symmAlg, cipherType, paddingType, callback) {
		var param = {msgType:FUNC_ENCODE_FILE,keyIndex:keyIndex,type:cipherType,src:srcFile,des:desFile,cert:base64Cert,symmAlg:symmAlg,padding:paddingType};	
				
		// 异步消息
		if (callback != null && callback != undefined) {
			ajax_cb = function (res) {
				callback(res.res, res.cipher);
			}
			asyncAjax(param, ajax_cb);
			return OkRespObject(null);
		}
		// 同步消息
		else {		
			res = syncAjax(param)
			if (0 == res.res) {			
				return OkRespObject(res.cipher);
			}else {
				return FailedRespObject(res.res, res.msg);	
			}
		}
	}
	/*
	 *	解密文件
	 */	
	this.decryptFile = function (keyIndex, asymmAlg, symmAlg, paddingType, cipherFile, desFile, callback) {
		var algs = Number(asymmAlg) | Number(symmAlg);
		var param = {msgType:FUNC_DECODE_FILE,keyIndex:keyIndex,algs:algs,cipherFile:cipherFile,decryptedFile:desFile,padding:paddingType};	
				
		// 异步消息
		if (callback != null && callback != undefined) {
			ajax_cb = function (res) {
				callback(res.res, res.text);
			}
			asyncAjax(param, ajax_cb);
			return OkRespObject(null);
		}
		// 同步消息
		else {		
			res = syncAjax(param)
			if (0 == res.res) {			
				return OkRespObject(res.text);
			}else {
				return FailedRespObject(res.res, res.msg);	
			}
		}
	}
	/*
	 *	显示文件选择对话框，返回选择的文件名
	 */	
	this.getFileName = function (is_open, caption, filter) {
		var param = {msgType:FUNC_GET_FILENAME,caption:caption,filter:filter,is_open:is_open};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(res.file);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}
	/*
	 *	显示路径选择对话框，返回选择的路径名
	 */	
	this.getPathName = function (caption, defPath) {
		var param = {msgType:FUNC_GET_PATHNAME,caption:caption,defPath:defPath};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(res.path);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 *	读取文件内容，base64格式返回
	 */	
	this.readFile = function (fileName) {
		var param = {msgType:FUNC_READ_FILE,file:fileName};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(res.content);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 *	写文件内容
	 */	
	this.writeFile = function (fileName, content, inBinary) {
		var param = {msgType:FUNC_WRITE_FILE,file:fileName,content:content,isBinary:inBinary};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 *	删除文件
	 */	
	this.deleteFile = function (fileName) {
		var param = {msgType:FUNC_DELETE_FILE,file:fileName};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}	
	/*
	 *	创建目录
	 */
	this.createFolder = function (folderName) {
		var param = {msgType:FUNC_CREATE_FOLDER,path:folderName};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 *	直接打开文件夹
	 */	
	this.openFolder = function (folderName) {
		var param = {msgType:FUNC_OPEN_FOLDER,path:folderName};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 *	删除文件夹
	 */	
	this.deleteFolder = function (folderName) {
		var param = {msgType:FUNC_DELETE_FOLDER,path:folderName};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}	
	/*
	 * 获取请求码
	 */
	this.genAuthReq = function(keyIndex, authType){
		var param = {msgType:FUNC_GEN_AUTHREQ,keyIndex:keyIndex,type:authType};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(res.reqCode);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 *	格式化
	 */
	this.initKey = function (keyIndex, authCode, userPIN, label) {
		var param = {msgType:FUNC_INITILIAZE_DEVICE,keyIndex:keyIndex,authCode:authCode,pin:userPIN,label:label};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/* 
	 * 解锁
	 */
	this.unlockPin = function(keyIndex, authCode, newPIN) {
		var param = {msgType:FUNC_UNLOCK_DEVICE,keyIndex:keyIndex,authCode:authCode,pin:newPIN};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}		
	/*
	 *	校验用户PIN
	 */	
	this.verifyPin = function (keyIndex, userPIN) {
		var param = {msgType:FUNC_VERIFY_PIN,keyIndex:keyIndex,pinType:ZJCA_PIN_USER,pin:userPIN};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 *	修改用户PIN码
	 */
	this.changePin = function (keyIndex, oldPIN, newPIN) {
		var param = {msgType:FUNC_CHANGE_PIN,keyIndex:keyIndex,pinType:ZJCA_PIN_USER,oldPIN:oldPIN,newPIN:newPIN};		
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 * 生成证书请求
	 */
	this.genCertReq = function (keyIndex, certAlg, newKeypair, bits, cn, pin) {
		var param = {msgType:FUNC_GEN_CERTREQ,keyIndex:keyIndex,alg:certAlg,bits:bits,genKeyPair:newKeypair,subjectName:cn,pin:pin};		
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(res.csr);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 * 导入证书和加密密钥对(PFX格式)
	 */
	this.importCertAndPfx = function (keyIndex, signCert, exchCert, pfx, authCode) {
		// 该函数只支持RSA，故参数alg始终为1
		var param = {msgType:FUNC_IMPORT_DUALCERT_KEYPAIR_PFX,keyIndex:keyIndex,alg:1,signCert:signCert,exchCert:exchCert,keyPair:pfx,authCode:authCode};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 * 导入证书和加密密钥对(密文格式)
	 */
	this.importCertAndEncKeyPair = function (keyIndex, alg, signCert, exchCert, keyPair, symmAlgID, symmCipher, authCode) {
		var param = {msgType:FUNC_IMPORT_DUALCERT_KEYPAIR_ENC,keyIndex:keyIndex,alg:alg,signCert:signCert,exchCert:exchCert,keyPair:keyPair,authCode:authCode,symmAlg:symmAlgID,symmKey:symmCipher};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}	
	/*
	 *	证书算法升级(导入证书和加密密钥对)
	 */
	this.importUpgradedCertAndKeyPair = function (keyIndex, old_alg, new_alg, signCert, exchCert, keyPair, symmAlgID, symmCipher, authCode){
		var param = {msgType:FUNC_IMPORT_UPGRADED_CERTKEYPAIR,keyIndex:keyIndex,old_alg:old_alg,new_alg:new_alg,signCert:signCert,exchCert:exchCert,keyPair:keyPair,authCode:authCode,symmAlg:symmAlgID,symmKey:symmCipher};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}	
	/*
	 *	导入双证书，适用于密钥对不更新的情况，比如“延期”。
	 */
	this.importDualCert = function (keyIndex, alg, signCert, exchCert){
		var param = {msgType:FUNC_IMPORT_DUALCERT,keyIndex:keyIndex,alg:alg,signCert:signCert,exchCert:exchCert,authCode:""};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 *	导入单签名证书，适用于申请单证书的业务。
	 */
	this.importCert = function (keyIndex, alg, signCert){
		var param = {msgType:FUNC_IMPORT_CERT,keyIndex:keyIndex,alg:alg,isSignCert:1,cert:signCert};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 *	验证介质内密钥和证书是否正确
	 */
	this.keyValidation = function (keyIndex, alg, usage){
		var param = {msgType:FUNC_VALIDATION,keyIndex:keyIndex,alg:alg,usage:usage};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}	
	}
	/*
	 *	解析时间戳，返回时间戳中的属性。params指定要返回的项，比如:"sign|time|cert|digest|digest_alg"
	 */
	this.parseTimestamp = function (ts, params) {
		var attrs = params.split("|");
		var get_sign = 0;
		var get_time = 0;
		var get_cert = 0;
		var get_digest = 0;
		var get_digest_alg = 0;
		for (i = 0; i < attrs.length; i++) {
			var attr_name = attrs[i];
			if (attr_name == "sign") {
				get_sign = 1;
			}else if (attr_name == "time") {
				get_time = 1;
			}else if (attr_name == "cert") {
				get_cert = 1;
			}else if (attr_name == "digest") {
				get_digest = 1;
			}else if (attr_name == "digest_alg") {
				get_digest_alg = 1;
			}
		}
		
		var param = {msgType:FUNC_TIMESTAMP_ATTRS,timestamp:ts,sign:get_sign,time:get_time,cert:get_cert,digest:get_digest,digest_alg:get_digest_alg};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject({sign:res.sign,time:res.time,cert:res.cert,digest:res.digest,digest_alg:res.digest_alg});
		}else {
			return FailedRespObject(res.res, res.msg);	
		}
	}
	/*
	 *	验证时间戳(验证签名和证书链)
	 */
	this.verifyTimestamp = function (ts, srvCert) {	
		var param = {msgType:FUNC_TIMESTAMP_VERIFY,timestamp:ts,server_cert:srvCert};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}		
	}
	/*
	 *	验证时间戳(验证杂凑值、签名和证书链)
	 */
	this.verifyTimestampWithDigest = function (ts, digest, srvCert) {
		var param = {msgType:FUNC_TIMESTAMP_VERIFYWITHDIGEST,timestamp:ts,digest:digest,digest_alg:0,server_cert:srvCert};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}		
	}
	/*
	 *	验证时间戳(验证原文消息、签名和证书链)
	 */
	this.verifyTimestampWithMessage = function (ts, message, charset, digest_alg, srvCert, usrId, usrCert) {
		var param = {msgType:FUNC_TIMESTAMP_VERIFYWITHMSG,timestamp:ts,msg:message,charset:charset,digest_alg:digest_alg,server_cert:srvCert,user_id:usrId,cert:usrCert};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}		
	}
	/*
	 *	验证时间戳(验证原文文件、签名和证书链)
	 */
	this.verifyTimestampWithFile = function (ts, file, digest_alg, srvCert, usrId, usrCert) {	
		var param = {msgType:FUNC_TIMESTAMP_VERIFYWITHFILE,timestamp:ts,file:file,digest_alg:digest_alg,server_cert:srvCert,user_id:usrId,cert:usrCert};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}		
	}		
	/*
	 *	验证随机数
	 */
	this.testRandrom = function (keyIndex, size, format, file){
		var param = {msgType:FUNC_TESTRANDROM,keyIndex:keyIndex,size:size,format:format,file:file};	
		res = syncAjax(param)
		if (0 == res.res) {			
			return OkRespObject(null);
		}else {
			return FailedRespObject(res.res, res.msg);	
		}		
	}
	/*
	 *	设备事件响应函数
	 */
	function onKeyEvent(type, index, name) {
		/* 回调 */
		if (_onKeyEvent != null) {
			_onKeyEvent(type, index, name);
		}
	}
}
