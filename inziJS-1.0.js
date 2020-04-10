 // �ý��۸�		: Inzisoft NonActiveX Scan(iFormScan.EXE) ������ .js
 // ��  ��  ��		: inziJS-1.0
 // ��  ��  ��		: ��������Ʈ ���Ͽ�
 // �ۼ�����		: 2019.01.11
 // ���ø��		: .
 // ó������		: Scan NonActiveX EXE�� ���� ���� ��� ����(����, ������ �ۼ��� ��)
 
 // History	: 2019.01.11, ���Ͽ�, �����ۼ�
 //           2019.01.22, scanEXE, APIEXE Ajax ��� ��Ʈ(http, https) �ΰ��� ����.(LocalWebServer)
 //           2019.02.10, EXE ����, ���� ����
 //           2019.02.14, APIEXE ����, �񵿱� �б�
 //           2019.02.18, previewEXE �̸����� ���α׷� �߰�
 //           2019.04.03, LauncherEXE �� ���� ���� �߰�
 //           2019.06.10, tryConnect 3�� �õ����� 5�� �õ��� ����
 //			  2019.~~~~~, jsonp ����
 // 		  2019.08.12, jsonp �ݹ��Լ� �������� �������. (jsonResultCallbackFunc)
 // 		  2019.09.27, IE������ ���� ȣ�� ���� ���� json������θ� ����ϵ��� ����
 // 		  2019.11.27, MSG_IFORM_INSTALL ���� ����
 // 		  2019.12.06, ������ 1.0.0 -> 1.0.1
 // 		  2019.12.10, MSG_IFORM_UPDATE ���� ����, MSG_IFORM_UPDATE ǥ�� �޽����� confirm���� alert�� ����
  

//currentVersion
var SCOURT_SCAN_VERSION = "1.0.1";
var IFORM_SETUP_FILEPATH = "/inziSoft/install/sCourtScanSetup.exe";
var JQUERY_PATH = "/inziSoft/js/jquery-1.9.1.min.js";
var JSON2_PATH = "/inziSoft/js/json2.js";
var WORKKEY_LAUNCH_SCAN = "Launch_Scan";
var WORKKEY_TERMINATE_SCAN = "Terminate_Scan";
var WORKKEY_LAUNCH_API = "Launch_API";
var WORKKEY_TERMINATE_API = "Terminate_API";
var WORKKEY_LAUNCH_PREVIEW = "Launch_Preview";
var WORKKEY_TERMINATE_PREVIEW = "Terminate_Preview";
var WORKKEY_CHECK_VERSION = "Check_Version";

var MSG_API_RESTART = "GeneralAPI�� ����Ǿ� ���� �ʾ� GeneralAPI�� �����մϴ�.";
var MSG_IFORM_INSTALL = "���� ��ĵ�̳� ���ڼ��� �ʿ��� ���α׷��� ��ġ�Ǿ� ���� �ʽ��ϴ�.\n(��ĵ ���α׷��� �������� �ü���� ���ͳ� �ͽ��÷η� 7~11�� ����ȭ�Ǿ� �ֽ��ϴ�.)\n��ġ�Ͻðڽ��ϱ�?";
var MSG_IFORM_UPDATE = "���� ��ĵ�̳� ���ڼ��� �ʿ��� ���α׷��� ������Ʈ�� �ʿ��մϴ�.\n������Ʈ���� ������ ����� ���� �۵����� �����Ƿ�, �ݵ�� ������Ʈ�Ͻñ� �ٶ��ϴ�.";

//http, https �� webserver �������ݿ� �°� ���
var	protocol = "http";
var isJsonp = false;

//CustomURI
var uri = "iFormScan:"; 
var uri_api = "iFormAPI:";
var uri_preview = "iFormPreview:";

//exeCheck
var ExcuteTimeOut = 3000;
var ExcuteTimeOut_API = 3000;
var ExcuteTimeOut_Launcher = 3000;


var IEVer = 11;			// null ������ 11�� ����
var jsonpString;
var jsonpResultCallbackFunc;  	//jsonp �ݹ��Լ��� �޾� ó�� �� �ݹ��Լ�(EXE�� ����)

//----------------- ���� ��ĵ EXE ���� -----------------
// --------WorkKind - 0: ����(ä�Ǵ㺸)
// --------           1: ����(����)
// --------           2: ����(�ε���)
function startEXE_Scan(WorkKind) 
{
	var task = WorkKind;  		
	
	//var customURI = uri + task;	
	//Excute(customURI);
	
	LauncherConnect(WORKKEY_LAUNCH_SCAN, task, true);
}

// ------------- ���� ��ĵ EXE ���� -------------
function closeEXE_Scan()
{
	LauncherConnect(WORKKEY_TERMINATE_SCAN, null, true);
}

//----------------- �ΰ� ��ĵ EXE ���� ----------------- 
function startEXE_ScanSeal() 
{
	var task = "9";  						//9 -> �ΰ� ��ĵ
	
	//var broserpos = getBrowserPos();	    //������ ��ǥ �� ȹ��
	//var customURI = uri + task;	
	
	//Excute(customURI);
	LauncherConnect(WORKKEY_LAUNCH_SCAN, task, true);
}

// ------------- �ΰ� ��ĵ ��ĵ EXE ���� -------------
function closeEXE_ScanSeal()
{
	LauncherConnect(WORKKEY_TERMINATE_SCAN, null, true);
}

//----------------- Ȯ������ ��ĵ EXE ���� ----------------- 
function startEXE_DefineDate() 
{
	var task = "19";  						//19 -> �ΰ� ��ĵ
	
	//var customURI = uri + task;	
	//Excute(customURI);
	
	LauncherConnect(WORKKEY_LAUNCH_SCAN, task, true);
}

//----------------- Ȯ������ ��ĵ EXE ���� ----------------- 
function closeEXE_DefineDate()
{
	LauncherConnect(WORKKEY_TERMINATE_SCAN, null, false);
}

//----------------- �Ϲ� API(File&Folder Control EXE) ���� ----------------- 
function startEXE_GeneralAPI() 
{
	var customURI = uri_api;	
	
	//Excute(customURI);
	LauncherConnect(WORKKEY_LAUNCH_API, null, true);
}

//----------------- �Ϲ� API(File&Folder Control EXE) ���� ----------------- 
function closeEXE_GeneralAPI()
{
	LauncherConnect(WORKKEY_TERMINATE_API, null, true);
}

//----------------- �̸����� EXE ����----------------- 
function startEXE_Preview(downFilepath) 
{
	var filePath = downFilepath;
	//downFilepath = downFilepath.replace("\\", "/").replace(/\\/g, "/");
	//var customURI = uri_preview + downFilepath;	
	//Excute(customURI);
	LauncherConnect(WORKKEY_LAUNCH_PREVIEW, filePath, true);
}

//----------------- �̸����� EXE ����----------------- 
function closeEXE_Preview() 
{
	LauncherConnect(WORKKEY_TERMINATE_PREVIEW, null, true);
}

//���� ���� üũ
function checkVersion(versionCheckSuccessFunc, versionCheckFailFunc)
{
	LauncherConnect(WORKKEY_CHECK_VERSION, null, false);
}

//----------------- ù��° Connection.(EXE ���� üũ) ----------------- 
function CheckEXEWithConnect(firstConnectionFunc, failConnectionFunc)
{
	ExcuteTimeOut = 3000;
	setTimeout(function(){
		tryConnect(firstConnectionFunc, failConnectionFunc);
	}, 2000);
}

//----------------- 3�� ���� �õ�. �����ϸ� firstConnectionFunc ����. �����ϸ� failConnectionFunc ����.
//----------------- 3�� ���� �õ����� 5�� ���� �õ��� ����
function tryConnect(firstConnectionFunc, failConnectionFunc){
//	//console.log("ù��° ���� �õ�...");
//	EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc
//	, function(){
//		//console.log("�ι�° ���� �õ�...");
//		EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc
//		, function(){
//			//console.log("����° ���� �õ�...");
//			EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc, failConnectionFunc);
//		});
//	});

	//console.log("ù��° ���� �õ�...");
	EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc
	, function(){
		//console.log("�ι�° ���� �õ�...");
		EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc
		, function(){
			//console.log("����° ���� �õ�...");
			EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc
			, function(){
				//console.log("�׹�° ���� �õ�...");
				EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc
				, function(){
					//console.log("�ټ���° ���� �õ�...");
					EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc, failConnectionFunc);
				});
			});
		});
	});
}

//------------- EXE ���� �� ����üũ --------------
function LauncherConnect(Work_, Data_, isAsync)					
{
	var strWorkString = getWorkString(Work_, Data_, 0);
	AjaxRequest_GetReturn_Launcher(strWorkString, connectLauncherCallbackFunc, defaultErrCallback, isAsync);
}

//------------ ���� �ݹ��Լ�.------------------
function connectLauncherCallbackFunc(result)
{
	result = cSharpStringToJsString(result);
	var splitResult = result.split(':');

	if(splitResult[0] == WORKKEY_CHECK_VERSION)
	{
		if(splitResult[1] != SCOURT_SCAN_VERSION){
			//if(confirm(MSG_IFORM_UPDATE + "\n���� ���� : " + splitResult[1] + "/ ������Ʈ�� ���� : " + SCOURT_SCAN_VERSION))
			//{
			//	doInstallation();
			//}
			// 2019.12.10
			// confirm -> alert �� ����
			alert(MSG_IFORM_UPDATE + "\n���� ���� : " + splitResult[1] + "/ ������Ʈ�� ���� : " + SCOURT_SCAN_VERSION);
			doInstallation();
		}
	}
}

//----------------- C#���� �Ѿ� �� string�� javascript ���Ŀ� �°Բ� ġȯ ----------------- 
function cSharpStringToJsString(cSharpString)
{
	var result;
	result = cSharpString.replace(/\\n/g, "\\n")
								.replace(/\\'/g, "\\'")
								.replace(/\\"/g, '\\"')
								.replace(/\\&/g, "\\&")
								.replace(/\\r/g, "\\r")
								.replace(/\\t/g, "\\t")
								.replace(/\\b/g, "\\b")
								.replace(/\\f/g, "\\f");
								
	result = result.replace(/[\u0000-\u0019]+/g,"");
	
	return result;
}

//----------------- ������ ��ǥ ȹ�� ----------------- 
function getBrowserPos()
{
	var xpos = window.screenX;
	var ypos = window.screenY;
	var width = window.outerWidth;
	var height = window.outerHeight;
	
	return xpos + "," + ypos + "," + width + "," +height;
}

//----------------- ����� API EXE -------------------
function restartAPIEXE()
{
	startEXE_GeneralAPI();
	alert(MSG_API_RESTART);
}

//----------------- TLSLocalServer1.dll�� ���� (iFormScan.EXE) ----------------- 
//----------------- ������ �񵿱� ����
function AjaxRequest_GetReturn(WorkString, callbackFunc, errorCallback)
{
	var port = "";
	
	try{
		if(protocol == "https"){
			port = "4490";
		}else if(protocol == "http"){
			port = "4491";
		}
		jsonpResultCallbackFunc = callbackFunc;
		Call_Ajax(port, WorkString, callbackFunc, errorCallback);
	}
	catch(ex)
	{
		alert(ex.message);
	}
}

//----------------- TLSLocalServer2.dll�� ���� (iFormAPI.EXE) ----------------- 
//----------------- API EXE�� Ajax ����, �񵿱� ����� ���� �� �� ����.
function AjaxRequest_GetReturn_API(WorkString, callbackFunc, isAsync)
{
	var port = "";
	
	try{
		if(protocol == "https"){
			port = "4492";
		}else if(protocol == "http"){
			port = "4493";
		}
		jsonpResultCallbackFunc = callbackFunc;
		Call_Ajax_API(port, WorkString, callbackFunc, restartAPIEXE, isAsync);
	}
	catch(ex)
	{
		if(confirm(MSG_IFORM_INSTALL)){
			doInstallation();
		}
		//alert(ex.message);
	}
}

//----------------- TLSLocalServer.dll3�� ���� (Launcher) ----------------- 
function AjaxRequest_GetReturn_Launcher(WorkString, callbackFunc, errorCallbackFunc, isAsync)
{
	var port = "";
	
	try{
		if(protocol == "https"){
			port = "4494"; 			//Launcher�� ����ϴ� TLSLocalServer�� port�� �ٲ��ּž� �մϴ�.
		}else if(protocol == "http"){
			port = "4495";			//Launcher�� ����ϴ� TLSLocalServer�� port�� �ٲ��ּž� �մϴ�.
		}
		jsonpResultCallbackFunc = callbackFunc;
		Call_Ajax_Launcher(port, WorkString, callbackFunc, errorCallbackFunc, isAsync);
	}
	catch(ex)
	{
		if(confirm(MSG_IFORM_INSTALL)){
			
			doInstallation();
		}
		//alert(ex.message);
	}
}

//----------------- TLSLocalServer URLȹ�� ----------------- 
function getURL(port){
	var param = "/NeedWait/1";
	var encodeString=encodeURI(param);
	encodeString=encodeString.replace("#", "%23");
	return protocol + "://127.0.0.1:" + port + encodeString;
}

//----------------- Ajax call And get Return for callbackFunc ----------------- 
function Call_Ajax(port, WorkString, callbackFunc, timeOutCallback)
{
		var remoteURL = getURL(port);
		var workException=null;
		var result=null;

		if(IEVer == null)
			ChkIEVer();

		//alert("Call_Ajax WorkString \n\n" + WorkString)	// Test

		$.support.cors=true;

		if(IEVer == "7"){
			isJsonp = true;
			$.ajax({
				url :  remoteURL,
				type : "GET",
				dataType : "jsonp",
				data : WorkString,
				jsonp: "callback",
				jsonpCallback: "jsonCallback",
				async : true,
				cache : false,
				crossDomain : true,
				crossOrigin : null,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				timeout:ExcuteTimeOut,
				error : function(request,status,error) {
					//alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

					if(error != null && timeOutCallback != null)
						timeOutCallback();
					else
						defaultErrCallback(request,status,error);
				},
				beforeSend:function(){
					
				},
				success : function(result){
					// alert("Call_Ajax Success \n\n" + jsonpString)	// Test
					// result = cSharpStringToJsString(jsonpString);
					// ExcuteTimeOut = null;
					// callbackFunc(result);
				},
				complete : function(){
					
				}
			});
		}
		else{
			isJsonp = false;
			$.ajax({
				url :  remoteURL,
				type : "POST",
				dataType : "text",
				data : WorkString,
				async : true,
				cache : false,
				crossDomain : true,
				crossOrigin : null,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				timeout:ExcuteTimeOut,
				error : function(request,status,error) {
					if(error != null && timeOutCallback != null)
						timeOutCallback();
					else
						defaultErrCallback(request,status,error);
				},
				beforeSend:function(){
					
				},
				success : function(result){
					//alert("Call_Ajax Success \n\n" + result)	// Test
					result = cSharpStringToJsString(result);
					ExcuteTimeOut = null;
					callbackFunc(result);
				},
				complete : function(){
					
				}
			});

		}

		if(workException!=null)
			throw new Error(workException);
		else
		{
			
		}
}

//----------------- Ajax call And get Return for callbackFunc For APIEXE----------------- 
function Call_Ajax_API(port, WorkString, callbackFunc, errorCallback, isAsync)
{
		var remoteURL = getURL(port);
		var workException=null;
		var result=null;

		if(IEVer == null)
			ChkIEVer();

		//alert("Call_Ajax_API WorkString \n\n" + WorkString)	// Test

		$.support.cors=true;

		if(IEVer == "7"){
			isJsonp = true;
			$.ajax({
				url : remoteURL,
				type : "GET",
				dataType : "jsonp",
				data : WorkString,
				jsonp: "callback",
				jsonpCallback: "jsonCallback",
				async : isAsync,
				cache : false,
				crossDomain : true,
				crossOrigin : null,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				timeout:ExcuteTimeOut_API,
				error : function(request,status,error) {
					//alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
					if(request.status == 0 || request.status == 12029) //API EXE�� ��� ��������� �� ��.
						errorCallback();
					else
						defaultErrCallback(request,status,error);
				},
				beforeSend:function(){
					
				},
				success : function(result){
					// alert("Call_Ajax_API Success \n\n" + jsonpString)	// Test
					// result = cSharpStringToJsString(jsonpString);
					// callbackFunc(result);
				},
				complete : function(){
					
				}
			});
		}
		else{
			isJsonp = false;
			$.ajax({
				url : remoteURL,
				type : "POST",
				dataType : "text",
				data : WorkString,
				async : isAsync,
				cache : false,
				crossDomain : true,
				crossOrigin : null,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				timeout:ExcuteTimeOut_API,
				error : function(request,status,error) {
					//alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
					if(request.status == 0 || request.status == 12029) //API EXE�� ��� ��������� �� ��.
						errorCallback();
					else
						defaultErrCallback(request,status,error);
				},
				beforeSend:function(){
					
				},
				success : function(result){
					//alert("Call_Ajax_API Success \n\n" + result)	// Test
					result = cSharpStringToJsString(result);
					callbackFunc(result);
				},
				complete : function(){
					
				}
			});
		}

		if(workException!=null)
			throw new Error(workException);
		else
		{
			
		}
}

//----------------- Ajax call And get Return for callbackFunc For APIEXE----------------- 
function Call_Ajax_Launcher(port, WorkString, callbackFunc, errorCallback, isAsync)
{
		var remoteURL = getURL(port);
		var workException=null;
		var result=null;

		if(IEVer == null)
			ChkIEVer();

		//alert("Call_Ajax_Launcher WorkString \n\n" + WorkString)	// Test

		$.support.cors=true;

		if(IEVer == "7"){
			isJsonp = true;
			$.ajax({
				url : remoteURL,
				type : "GET",
				dataType : "jsonp",
				data : WorkString,
				jsonp: "callback",
				jsonpCallback: "jsonCallback",
				async : isAsync,
				cache : false,
				crossDomain : true,
				crossOrigin : null,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				timeout:ExcuteTimeOut_Launcher,
				error : function(request,status,error) {
					//alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
					
					if(request.status == 0 || request.status == 12029) //Launch EXE�� ��� Ȥ�� ���� �������̾ ��������� �� ��.
					{	
						if(confirm(MSG_IFORM_INSTALL)){
							doInstallation();
						}
						// alert(MSG_IFORM_INSTALL);
						// doInstallation();   //-> �缳ġ �۾� ����
					}
					else
						errorCallback(request,status,error);
				},
				beforeSend:function(){
					
				},
				success : function(result){
					// alert("Call_Ajax_Launcher Success \n\n" + jsonpString)	// Test
					// result = cSharpStringToJsString(jsonpString);
					// callbackFunc(result);
				},
				complete : function(){
					
				}
			});
		}
		else{
			isJsonp = false;
			$.ajax({
				url : remoteURL,
				type : "POST",
				dataType : "text",
				data : WorkString,
				async : isAsync,
				cache : false,
				crossDomain : true,
				crossOrigin : null,
				contentType: "application/x-www-form-urlencoded; charset=UTF-8",
				timeout:ExcuteTimeOut_Launcher,
				error : function(request,status,error) {
					//alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
					
					if(request.status == 0 || request.status == 12029) //Launch EXE�� ��� Ȥ�� ���� �������̾ ��������� �� ��.
					{	
						if(confirm(MSG_IFORM_INSTALL)){
							doInstallation();
						}
						// alert(MSG_IFORM_INSTALL);
						// doInstallation();   //-> �缳ġ �۾� ����
					}
					else
						errorCallback(request,status,error);
				},
				beforeSend:function(){
					
				},
				success : function(result){
					//alert("Call_Ajax_Launcher Success \n\n" + result)	// Test
					result = cSharpStringToJsString(result);
					callbackFunc(result);
				},
				complete : function(){
					
				}
			});
		}

		if(workException!=null)
			throw new Error(workException);
		else
		{
			
		}
}



//--------- IE ���� üũ
function ChkIEVer()
{
	var agent = navigator.userAgent, match;
	var app, version;

	if((match = agent.match(/MSIE ([0-9]+)/)) || (match = agent.match(/Trident.*rv:([0-9]+)/))) app = 'Internet Explorer';
	else if(match = agent.match(/Chrome\/([0-9]+)/)) app = 'Chrome';
	else if(match = agent.match(/Firefox\/([0-9]+)/)) app = 'Firefox';
	else if(match = agent.match(/Safari\/([0-9]+)/)) app = 'Safari';
	else if((match = agent.match(/OPR\/([0-9]+)/)) || (match = agent.match(/Opera\/([0-9]+)/))) app = 'Opera';
	else app = 'Unknown';

	if(app == 'Internet Explorer') IEVer = match[1];
	else IEVer = 'etc';

	//alert('Browser: ' + app + '\nVersion: ' + IEVer);
}


//--------- jsonp Callback ó��
function jsonCallback(json)
{
	//alert("jsonCallback Message Receive")	// Test

	//var obj = JSON.stringify(json);
	//var ojson = JSON.parse(obj);
	
	jsonpString = json.Work_;

	if(json.Work_.constructor == Object){
		jsonpString = JSON.stringify(json.Work_);
	}
	
	var result = cSharpStringToJsString(jsonpString);
	ExcuteTimeOut = null;
	jsonpResultCallbackFunc(result);

	//alert("jsonCallback - Data \n\n" + jsonpString)	// Test
}


//--------- iForm ��ĵ ��ġ ���� (������ �¾����� ���)
function doInstallation()
{
	window.open(IFORM_SETUP_FILEPATH);
}

//-------- EXE�� ��� �� �ַ� Function
function defaultErrCallback(request, status, error)
{
	if(isJsonp == true)
	{
		if(confirm(MSG_IFORM_INSTALL)){
			doInstallation();
		}
	}
	workException="������ ��� �� ������ �߻��Ͽ����ϴ�.";
	workException+="\n";
	//workException+="code : " + request.status + " , " + request.statusText + " , " + error.message;
	workException+="code : " + request.status + " , " + request.statusText;
	if(error != null)
		workException+= " , " + error.message;
	
	isJsonp = false;
}

//----------------- scanEXE�� Data������ Wait(callbackFunc) ----------------- 
function EXEConnectWait(Work_, Data_, dataType, callbackFunc)   //dataType : Data_�� Ÿ�� ���� (0 : string Data Type/ 1 : Json or JsonArray) 
{
	var strWorkString = getWorkString(Work_, Data_, dataType);
	AjaxRequest_GetReturn(strWorkString, callbackFunc, null);
}

//----------------- scanEXE�� Data������ Wait(callbackFunc, ErrorCallback) ----------> ErrorCallback�� Ajax ����� ���������� ���� �ʾ��� ��쿡 �߻�.
function EXEConnectWait_WithError(Work_, Data_, dataType, callbackFunc, ErrorCallback)    //dataType : Data_�� Ÿ�� ���� (0 : string Data Type/ 1 : Json or JsonArray) 
{
	var strWorkString = getWorkString(Work_, Data_, dataType);
	AjaxRequest_GetReturn(strWorkString, callbackFunc, ErrorCallback);
}

//----------------- scanEXE�� Data������ (���� �� ���� ��)  ----------------- 
function EXEConnect(Work_, Data_, dataType)						//dataType : Data_�� Ÿ�� ���� (0 : string Data Type/ 1 : Json or JsonArray) 
{
	var strWorkString = getWorkString(Work_, Data_, dataType);
	AjaxRequest_GetReturn(strWorkString, defaultcallbackFunc, null);
}

//----------------- API EXE�� Data������ Wait(callbackFunc)  ----------------- 
function APIConnect (Work_, Data_, dataType)					//dataType : Data_�� Ÿ�� ���� (0 : string Data Type/ 1 : Json or JsonArray) 
{
	var strWorkString = getWorkString(Work_, Data_, dataType);
	AjaxRequest_GetReturn_API(strWorkString, defaultcallbackFunc, true);
}

//----------------- API EXE�� Data������ (���� �� ���� ��)  ----------------- 
function APIConnectWait(Work_, Data_, dataType, callbackFunc)	//dataType : Data_�� Ÿ�� ���� (0 : string Data Type/ 1 : Json or JsonArray) 
{
	var strWorkString = getWorkString(Work_, Data_, dataType);
	AjaxRequest_GetReturn_API(strWorkString, callbackFunc, true);
}

//---------------- API EXE�� Data������ <������> ---------------
function APIConnect_Sync(Work_, Data_, dataType)
{
	var strWorkString = getWorkString(Work_, Data_, dataType);
	AjaxRequest_GetReturn_API(strWorkString, defaultcallbackFunc, false);
}

//----------------- EXE�� ���� �� WorkString �������� ----------------- 
function getWorkString(Work_, Data_, dataType)					//dataType : Data_�� Ÿ�� ���� (0 : string Data Type/ 1 : Json or JsonArray) 
{
	if(dataType == 0){
		return "{ 'Work_': '" + Work_ + "', 'Data_': '" + Data_ + "' }";
	}else{
		return "{ 'Work_': '" + Work_ + "', 'Data_': " + Data_ + " }";
	}
}

//----------------- Default callbackFunc. ----------------- 
function defaultcallbackFunc(result)
{
	
}

function initJS(){
	document.write("<script type='text/javascript' charset='utf-8' src='/inziSoft/js/jquery-1.9.1.min.js'></script>");
	document.write("<script type='text/javascript' charset='utf-8' src='/inziSoft/js/json2.js'></script>");
}
initJS();