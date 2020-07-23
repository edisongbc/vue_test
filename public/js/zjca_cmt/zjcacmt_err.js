/* 
 * ZJCA CMT Errors Define JAVA Script file for HTML
 * Version: v0.0.1
 * Date: 2018-04-25
 * 2017 - 2021 ZJCA. All rights reserved.
 * 
 *
*/


/* 错误信息定义 */
var g_ZJCACmtErr = new Array;
g_ZJCACmtErr.push(new zjca_err(0, "操作成功！"));
g_ZJCACmtErr.push(new zjca_err(0x80000001, "ZJCA 客户端类型或版本设置错误！"));
g_ZJCACmtErr.push(new zjca_err(0x80000002, "ZJCA客户端未安装或未启动！\n如使用了非IE浏览器，请确认您客户端版本是否支持(V1.4及以上才支持非IE浏览器)\n如果使用的是FireFox浏览器，请确认是否已经把https://cmt.zjca.com.cn添加到安全例外！"));
g_ZJCACmtErr.push(new zjca_err(0x80000003, "JS参数错误！"));
g_ZJCACmtErr.push(new zjca_err(0x80000004, "签名证书不存在！"));
g_ZJCACmtErr.push(new zjca_err(0x80000005, "加密证书不存在！"));
g_ZJCACmtErr.push(new zjca_err(0x81000001, "未知错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000002, "未初始化！"));
g_ZJCACmtErr.push(new zjca_err(0x81000003, "已初始化！"));
g_ZJCACmtErr.push(new zjca_err(0x81000004, "参数错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000005, "功能不支持！"));
g_ZJCACmtErr.push(new zjca_err(0x81000006, "函数调用失败！"));
g_ZJCACmtErr.push(new zjca_err(0x81000007, "操作被用户取消！"));
g_ZJCACmtErr.push(new zjca_err(0x81000008, "PKCS11函数！"));
g_ZJCACmtErr.push(new zjca_err(0x81000009, "Buffer长度不够！"));
g_ZJCACmtErr.push(new zjca_err(0x8100000A, "数据长度超出限制！"));
g_ZJCACmtErr.push(new zjca_err(0x8100000B, "非法调用！"));
g_ZJCACmtErr.push(new zjca_err(0x8100000C, "密钥已存在！"));
g_ZJCACmtErr.push(new zjca_err(0x8100000D, "密钥不存在！"));
g_ZJCACmtErr.push(new zjca_err(0x8100000E, "输入数据有误！"));
g_ZJCACmtErr.push(new zjca_err(0x8100000F, "输入数据长度有误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000010, "Base64转换失败！"));
g_ZJCACmtErr.push(new zjca_err(0x81000011, "算法不支持！"));
g_ZJCACmtErr.push(new zjca_err(0x81000012, "OpenSSL生成证书请求失败！"));
g_ZJCACmtErr.push(new zjca_err(0x81000013, "会话已存在！"));
g_ZJCACmtErr.push(new zjca_err(0x81000014, "会话不存在！"));
g_ZJCACmtErr.push(new zjca_err(0x81000015, "容器不存在！"));
g_ZJCACmtErr.push(new zjca_err(0x81000016, "证书不存在！"));
g_ZJCACmtErr.push(new zjca_err(0x81000017, "证书签名无效！"));
g_ZJCACmtErr.push(new zjca_err(0x81000018, "证书颁发者无效！"));
g_ZJCACmtErr.push(new zjca_err(0x81000019, "待下载的文件不存在！"));
g_ZJCACmtErr.push(new zjca_err(0x8100001A, "加载XML失败！"));
g_ZJCACmtErr.push(new zjca_err(0x8100001C, "解析XML失败！"));
g_ZJCACmtErr.push(new zjca_err(0x8100001D, "写流数据失败！"));
g_ZJCACmtErr.push(new zjca_err(0x8100001E, "读流数据失败！"));
g_ZJCACmtErr.push(new zjca_err(0x8100001F, "创建文件失败！"));
g_ZJCACmtErr.push(new zjca_err(0x81000040, "生成随机数错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000041, "HSAH对象错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000042, "HSAH运算错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000043, "生成密钥对错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000044, "密钥对模长错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000045, "导入公钥错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000046, "公钥加密错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000047, "私钥解密错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000048, "HASH值不一致！"));
g_ZJCACmtErr.push(new zjca_err(0x81000049, "对象不可导出！"));
g_ZJCACmtErr.push(new zjca_err(0x8100004A, "解密数据补齐错误！"));
g_ZJCACmtErr.push(new zjca_err(0x8100004B, "MAC长度错误！"));
g_ZJCACmtErr.push(new zjca_err(0x8100004C, "密钥信息未找到！"));
g_ZJCACmtErr.push(new zjca_err(0x8100004D, "无设备事件！"));
g_ZJCACmtErr.push(new zjca_err(0x8100004E, "设备已移除！"));
g_ZJCACmtErr.push(new zjca_err(0x8100004F, "PIN码不正确！"));
g_ZJCACmtErr.push(new zjca_err(0x81000050, "PIN码已被锁！"));
g_ZJCACmtErr.push(new zjca_err(0x81000051, "PIN码不合法！"));
g_ZJCACmtErr.push(new zjca_err(0x81000052, "PIN码长度错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000053, "PIN码已失效！"));
g_ZJCACmtErr.push(new zjca_err(0x81000054, "用户PIN码为缺省值，建议立即修改！"));
g_ZJCACmtErr.push(new zjca_err(0x81000055, "用户类型错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000056, "应用名非法！"));
g_ZJCACmtErr.push(new zjca_err(0x81000057, "应用已存在！"));
g_ZJCACmtErr.push(new zjca_err(0x81000058, "应用不存在！"));
g_ZJCACmtErr.push(new zjca_err(0x81000059, "用户已登录！"));
g_ZJCACmtErr.push(new zjca_err(0x8100005A, "用户未登录！"));
g_ZJCACmtErr.push(new zjca_err(0x8100005B, "文件已存在！"));
g_ZJCACmtErr.push(new zjca_err(0x8100005C, "文件不存在！"));
g_ZJCACmtErr.push(new zjca_err(0x8100005D, "设备内存空间不够！"));
g_ZJCACmtErr.push(new zjca_err(0x8100005E, "COS文件错误！"));
g_ZJCACmtErr.push(new zjca_err(0x8100005F, "读COS文件错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000060, "写COS文件错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000061, "非法句柄！"));
g_ZJCACmtErr.push(new zjca_err(0x81000062, "命名长度错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000063, "密钥用途非法！"));
g_ZJCACmtErr.push(new zjca_err(0x81000064, "对象错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000065, "内存错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000066, "操作超时！"));
g_ZJCACmtErr.push(new zjca_err(0x81000080, "Slot ID非法！"));
g_ZJCACmtErr.push(new zjca_err(0x81000081, "需要创建线程！"));
g_ZJCACmtErr.push(new zjca_err(0x81000082, "设备不支持被锁！"));
g_ZJCACmtErr.push(new zjca_err(0x81000083, "该属性为“只读”属性！"));
g_ZJCACmtErr.push(new zjca_err(0x81000084, "该属性为“易变”属性！"));
g_ZJCACmtErr.push(new zjca_err(0x81000085, "属性类型非法！"));
g_ZJCACmtErr.push(new zjca_err(0x81000086, "属性值非法！"));
g_ZJCACmtErr.push(new zjca_err(0x81000087, "设备错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000088, "该函数不支持并行处理！"));
g_ZJCACmtErr.push(new zjca_err(0x81000089, "密钥长度错误！"));
g_ZJCACmtErr.push(new zjca_err(0x8100008A, "密钥类型矛盾！"));
g_ZJCACmtErr.push(new zjca_err(0x8100008B, "不需要密钥！"));
g_ZJCACmtErr.push(new zjca_err(0x8100008C, "需要密钥！"));
g_ZJCACmtErr.push(new zjca_err(0x8100008D, "密钥被修改！"));
g_ZJCACmtErr.push(new zjca_err(0x8100008E, "密钥不支持被杂凑！"));
g_ZJCACmtErr.push(new zjca_err(0x8100008F, "密钥被禁止该操作！"));
g_ZJCACmtErr.push(new zjca_err(0x81000090, "密钥不支持被Wrapped！"));
g_ZJCACmtErr.push(new zjca_err(0x81000091, "密钥不支持被导出！"));
g_ZJCACmtErr.push(new zjca_err(0x81000092, "机制非法！"));
g_ZJCACmtErr.push(new zjca_err(0x81000093, "机制参数非法！"));
g_ZJCACmtErr.push(new zjca_err(0x81000094, "操作处于活动状态！"));
g_ZJCACmtErr.push(new zjca_err(0x81000095, "操作未被初始化！"));
g_ZJCACmtErr.push(new zjca_err(0x81000096, "会话已关闭！"));
g_ZJCACmtErr.push(new zjca_err(0x81000097, "会话数已达到最大值！"));
g_ZJCACmtErr.push(new zjca_err(0x81000098, "会话句柄错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000099, "会话不支持并行操作！"));
g_ZJCACmtErr.push(new zjca_err(0x8100009A, "会话为“只读”类型！"));
g_ZJCACmtErr.push(new zjca_err(0x8100009B, "会话已经存在！"));
g_ZJCACmtErr.push(new zjca_err(0x8100009C, "“只读”会话已经存在！"));
g_ZJCACmtErr.push(new zjca_err(0x8100009D, "“读/写”会话已经存在！"));
g_ZJCACmtErr.push(new zjca_err(0x8100009E, "签名无效！"));
g_ZJCACmtErr.push(new zjca_err(0x8100009F, "签名长度非法！"));
g_ZJCACmtErr.push(new zjca_err(0x810000A0, "模板不正确！"));
g_ZJCACmtErr.push(new zjca_err(0x810000A1, "模板矛盾！"));
g_ZJCACmtErr.push(new zjca_err(0x810000A2, "设备未接入！"));
g_ZJCACmtErr.push(new zjca_err(0x810000A3, "设备无法识别！"));
g_ZJCACmtErr.push(new zjca_err(0x810000A4, "设备不可写！"));
g_ZJCACmtErr.push(new zjca_err(0x810000A5, "Unwrapping密钥句柄无效！"));
g_ZJCACmtErr.push(new zjca_err(0x810000A6, "Unwrapping密钥长度无效！"));
g_ZJCACmtErr.push(new zjca_err(0x810000A7, "Unwrapping密钥类型矛盾！"));
g_ZJCACmtErr.push(new zjca_err(0x810000A8, "Wrapped密钥句柄无效！"));
g_ZJCACmtErr.push(new zjca_err(0x810000A9, "Wrapped密钥长度无效！"));
g_ZJCACmtErr.push(new zjca_err(0x810000AA, "Wrapping密钥句柄无效！"));
g_ZJCACmtErr.push(new zjca_err(0x810000AB, "Wrapping密钥长度无效！"));
g_ZJCACmtErr.push(new zjca_err(0x810000AC, "Wrapping密钥类型矛盾！"));
g_ZJCACmtErr.push(new zjca_err(0x810000AD, "其他用户已登录！"));
g_ZJCACmtErr.push(new zjca_err(0x810000AE, "用户类型太多！"));
g_ZJCACmtErr.push(new zjca_err(0x810000AF, "随机数种子不支持！"));
g_ZJCACmtErr.push(new zjca_err(0x810000B0, "随机数失败！"));
g_ZJCACmtErr.push(new zjca_err(0x810000B1, "DOMAIN参数错误！"));
g_ZJCACmtErr.push(new zjca_err(0x810000B2, "状态不支持被保存！"));
g_ZJCACmtErr.push(new zjca_err(0x810000B3, "保存的状态非法！"));
g_ZJCACmtErr.push(new zjca_err(0x810000B4, "相关信息是易变的！"));
g_ZJCACmtErr.push(new zjca_err(0x810000B5, "Mutex失效！"));
g_ZJCACmtErr.push(new zjca_err(0x810000B6, "Mutex未锁！"));
g_ZJCACmtErr.push(new zjca_err(0x810000B7, "自定义错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000100, "OpenSSL库解码X509证书数据错误！"));
g_ZJCACmtErr.push(new zjca_err(0x81000101, "OpenSSL库获取X509证书公钥失败！"));
g_ZJCACmtErr.push(new zjca_err(0x81000102, "OpenSSL库获取到的X509证书公钥类型未知！"));
g_ZJCACmtErr.push(new zjca_err(0x81000103, "OpenSSL库创建PKCS7结构体失败！"));
g_ZJCACmtErr.push(new zjca_err(0x81000104, "OpenSSL库设置PKCS7类型失败！"));
g_ZJCACmtErr.push(new zjca_err(0x81000105, "OpenSSL库解码PKCS7结构体失败！"));
g_ZJCACmtErr.push(new zjca_err(0x81000106, "OpenSSL库解码PKCS7结构体中无签名者信息！"));
g_ZJCACmtErr.push(new zjca_err(0x81000106, "OpenSSL库设置OCTET STRING类型失败！"));
g_ZJCACmtErr.push(new zjca_err(0x81000107, "OpenSSL库设置INTEGER类型失败！"));
g_ZJCACmtErr.push(new zjca_err(0x81000108, "OpenSSL库获取X509证书的序列号失败！"));
g_ZJCACmtErr.push(new zjca_err(0x81000109, "OpenSSL库杂凑初始化时失败！"));
g_ZJCACmtErr.push(new zjca_err(0x8100010A, "OpenSSL库杂凑数据时失败！"));
g_ZJCACmtErr.push(new zjca_err(0x8100010B, "OpenSSL库验证签名失败！"));
g_ZJCACmtErr.push(new zjca_err(0x82000001, "杂凑值验证失败！"));
g_ZJCACmtErr.push(new zjca_err(0x82000002, "签发时间不在证书有效期内！"));
g_ZJCACmtErr.push(new zjca_err(0x82000003, "验证签名失败！"));
g_ZJCACmtErr.push(new zjca_err(0x82000004, "验证证书的签名失败！"));
g_ZJCACmtErr.push(new zjca_err(0x82000005, "验证证书的颁发者失败！"));
g_ZJCACmtErr.push(new zjca_err(0x82000006, "验证证书的证书链失败！"));
g_ZJCACmtErr.push(new zjca_err(0x82000007, "验证证书失败！"));
g_ZJCACmtErr.push(new zjca_err(0x83000001, "目标文件或目录不存在！"));
g_ZJCACmtErr.push(new zjca_err(0x83000002, "目标文件或目录拒绝访问！"));
g_ZJCACmtErr.push(new zjca_err(0x83000003, "目标文件或目录正被另一个程序使用，本程序无法访问。"));
g_ZJCACmtErr.push(new zjca_err(0x83000004, "目标文件夹不为空！"));



/* 错误信息帮助类 */
function zjca_err(code, desc) {
	var _code = code;
	var _desc = desc;
	
	this.getCode = function() {
		return parseInt(_code);
	}
	this.getDesc = function() {
		return _desc;
	}
}

/* 错误代码(十六进制)函数 */
function zjca_GetErrHexCode(code) {
	if (code == undefined) {
		return "未知";
	}
	
	var errCode = 0;
	if (code < 0) {
		var errNumber = 0x100000000;
		errNumber += parseInt(code);
		errCode = errNumber.toString(16); 
	}
	else {
		var errNumber = parseInt(code);
		errCode = errNumber.toString(16);
	}
	return "0x" + errCode;
}

/* 错误信息函数 */
function zjca_GetErrTxt(code) {	
	if (code == undefined) {
		return "未知";
	}
	
	var errDesc = "Unknow error!";
	var errHexCode = zjca_GetErrHexCode(code);	
	var errInt = parseInt(errHexCode);
	for (i = 0; i < g_ZJCACmtErr.length; i++) {
		if (errInt == g_ZJCACmtErr[i].getCode()) {
			errDesc = g_ZJCACmtErr[i].getDesc();
			break; 
		}
	}
	
	return errDesc;
}