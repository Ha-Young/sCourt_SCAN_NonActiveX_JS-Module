 // 시스템명		: Inzisoft NonActiveX Scan(iFormScan.EXE) 공통모듈 .js
 // 파  일  명		: inziJS-1.0
 // 작  성  자		: 인지소프트 최하영
 // 작성일자		: 2019.01.11
 // 관련모듈		: .
 // 처리내용		: Scan NonActiveX EXE를 위한 공통 기능 구현(실행, 데이터 송수신 등)
 
 // History	: 2019.01.11, 최하영, 최초작성
 //           2019.01.22, scanEXE, APIEXE Ajax 통신 포트(http, https) 두개로 나눔.(LocalWebServer)
 //           2019.02.10, EXE 실행, 종료 조정
 //           2019.02.14, APIEXE 동기, 비동기 분기
 //           2019.02.18, previewEXE 미리보기 프로그램 추가
 //           2019.04.03, LauncherEXE 로 실행 종료 추가
 //           2019.06.10, tryConnect 3번 시도에서 5번 시도로 수정
 //			  2019.~~~~~, jsonp 적용
 // 		  2019.08.12, jsonp 콜백함수 전역으로 만들었음. (jsonResultCallbackFunc)
 // 		  2019.09.27, IE버전에 따른 호출 로직 수정 json방식으로만 통신하도록 적용
 // 		  2019.11.27, MSG_IFORM_INSTALL 문구 변경
 // 		  2019.12.06, 버전업 1.0.0 -> 1.0.1
 // 		  2019.12.10, MSG_IFORM_UPDATE 문구 변경, MSG_IFORM_UPDATE 표시 메시지를 confirm에서 alert로 변경
  

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

var MSG_API_RESTART = "GeneralAPI가 실행되어 있지 않아 GeneralAPI를 실행합니다.";
var MSG_IFORM_INSTALL = "문서 스캔이나 전자서명에 필요한 프로그램이 설치되어 있지 않습니다.\n(스캔 프로그램은 윈도우즈 운영체제와 인터넷 익스플로러 7~11에 최적화되어 있습니다.)\n설치하시겠습니까?";
var MSG_IFORM_UPDATE = "문서 스캔이나 전자서명에 필요한 프로그램의 업데이트가 필요합니다.\n업데이트하지 않으면 기능이 정상 작동하지 않으므로, 반드시 업데이트하시기 바랍니다.";

//http, https 중 webserver 프로토콜에 맞게 사용
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


var IEVer = 11;			// null 값에서 11로 설정
var jsonpString;
var jsonpResultCallbackFunc;  	//jsonp 콜백함수로 받아 처리 할 콜백함수(EXE로 전송)

//----------------- 공통 스캔 EXE 실행 -----------------
// --------WorkKind - 0: 담전(채권담보)
// --------           1: 법전(법인)
// --------           2: 부전(부동산)
function startEXE_Scan(WorkKind) 
{
	var task = WorkKind;  		
	
	//var customURI = uri + task;	
	//Excute(customURI);
	
	LauncherConnect(WORKKEY_LAUNCH_SCAN, task, true);
}

// ------------- 공통 스캔 EXE 종료 -------------
function closeEXE_Scan()
{
	LauncherConnect(WORKKEY_TERMINATE_SCAN, null, true);
}

//----------------- 인감 스캔 EXE 실행 ----------------- 
function startEXE_ScanSeal() 
{
	var task = "9";  						//9 -> 인감 스캔
	
	//var broserpos = getBrowserPos();	    //브라우저 좌표 값 획득
	//var customURI = uri + task;	
	
	//Excute(customURI);
	LauncherConnect(WORKKEY_LAUNCH_SCAN, task, true);
}

// ------------- 인감 스캔 스캔 EXE 종료 -------------
function closeEXE_ScanSeal()
{
	LauncherConnect(WORKKEY_TERMINATE_SCAN, null, true);
}

//----------------- 확정일자 스캔 EXE 실행 ----------------- 
function startEXE_DefineDate() 
{
	var task = "19";  						//19 -> 인감 스캔
	
	//var customURI = uri + task;	
	//Excute(customURI);
	
	LauncherConnect(WORKKEY_LAUNCH_SCAN, task, true);
}

//----------------- 확정일자 스캔 EXE 종료 ----------------- 
function closeEXE_DefineDate()
{
	LauncherConnect(WORKKEY_TERMINATE_SCAN, null, false);
}

//----------------- 일반 API(File&Folder Control EXE) 실행 ----------------- 
function startEXE_GeneralAPI() 
{
	var customURI = uri_api;	
	
	//Excute(customURI);
	LauncherConnect(WORKKEY_LAUNCH_API, null, true);
}

//----------------- 일반 API(File&Folder Control EXE) 종료 ----------------- 
function closeEXE_GeneralAPI()
{
	LauncherConnect(WORKKEY_TERMINATE_API, null, true);
}

//----------------- 미리보기 EXE 실행----------------- 
function startEXE_Preview(downFilepath) 
{
	var filePath = downFilepath;
	//downFilepath = downFilepath.replace("\\", "/").replace(/\\/g, "/");
	//var customURI = uri_preview + downFilepath;	
	//Excute(customURI);
	LauncherConnect(WORKKEY_LAUNCH_PREVIEW, filePath, true);
}

//----------------- 미리보기 EXE 종료----------------- 
function closeEXE_Preview() 
{
	LauncherConnect(WORKKEY_TERMINATE_PREVIEW, null, true);
}

//현재 버젼 체크
function checkVersion(versionCheckSuccessFunc, versionCheckFailFunc)
{
	LauncherConnect(WORKKEY_CHECK_VERSION, null, false);
}

//----------------- 첫번째 Connection.(EXE 실행 체크) ----------------- 
function CheckEXEWithConnect(firstConnectionFunc, failConnectionFunc)
{
	ExcuteTimeOut = 3000;
	setTimeout(function(){
		tryConnect(firstConnectionFunc, failConnectionFunc);
	}, 2000);
}

//----------------- 3번 연결 시도. 성공하면 firstConnectionFunc 수행. 실패하면 failConnectionFunc 수행.
//----------------- 3번 연결 시도에서 5번 연결 시도로 수정
function tryConnect(firstConnectionFunc, failConnectionFunc){
//	//console.log("첫번째 연결 시도...");
//	EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc
//	, function(){
//		//console.log("두번째 연결 시도...");
//		EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc
//		, function(){
//			//console.log("세번째 연결 시도...");
//			EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc, failConnectionFunc);
//		});
//	});

	//console.log("첫번째 연결 시도...");
	EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc
	, function(){
		//console.log("두번째 연결 시도...");
		EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc
		, function(){
			//console.log("세번째 연결 시도...");
			EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc
			, function(){
				//console.log("네번째 연결 시도...");
				EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc
				, function(){
					//console.log("다섯번째 연결 시도...");
					EXEConnectWait_WithError("CHECK", "null", 0, firstConnectionFunc, failConnectionFunc);
				});
			});
		});
	});
}

//------------- EXE 실행 및 버젼체크 --------------
function LauncherConnect(Work_, Data_, isAsync)					
{
	var strWorkString = getWorkString(Work_, Data_, 0);
	AjaxRequest_GetReturn_Launcher(strWorkString, connectLauncherCallbackFunc, defaultErrCallback, isAsync);
}

//------------ 런쳐 콜백함수.------------------
function connectLauncherCallbackFunc(result)
{
	result = cSharpStringToJsString(result);
	var splitResult = result.split(':');

	if(splitResult[0] == WORKKEY_CHECK_VERSION)
	{
		if(splitResult[1] != SCOURT_SCAN_VERSION){
			//if(confirm(MSG_IFORM_UPDATE + "\n현재 버전 : " + splitResult[1] + "/ 업데이트된 버전 : " + SCOURT_SCAN_VERSION))
			//{
			//	doInstallation();
			//}
			// 2019.12.10
			// confirm -> alert 로 변경
			alert(MSG_IFORM_UPDATE + "\n현재 버전 : " + splitResult[1] + "/ 업데이트된 버전 : " + SCOURT_SCAN_VERSION);
			doInstallation();
		}
	}
}

//----------------- C#에서 넘어 온 string을 javascript 형식에 맞게끔 치환 ----------------- 
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

//----------------- 브라우저 좌표 획득 ----------------- 
function getBrowserPos()
{
	var xpos = window.screenX;
	var ypos = window.screenY;
	var width = window.outerWidth;
	var height = window.outerHeight;
	
	return xpos + "," + ypos + "," + width + "," +height;
}

//----------------- 재실행 API EXE -------------------
function restartAPIEXE()
{
	startEXE_GeneralAPI();
	alert(MSG_API_RESTART);
}

//----------------- TLSLocalServer1.dll에 연결 (iFormScan.EXE) ----------------- 
//----------------- 무조건 비동기 수행
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

//----------------- TLSLocalServer2.dll에 연결 (iFormAPI.EXE) ----------------- 
//----------------- API EXE는 Ajax 동기, 비동기 통신을 설정 할 수 있음.
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

//----------------- TLSLocalServer.dll3에 연결 (Launcher) ----------------- 
function AjaxRequest_GetReturn_Launcher(WorkString, callbackFunc, errorCallbackFunc, isAsync)
{
	var port = "";
	
	try{
		if(protocol == "https"){
			port = "4494"; 			//Launcher가 사용하는 TLSLocalServer의 port로 바꿔주셔야 합니다.
		}else if(protocol == "http"){
			port = "4495";			//Launcher가 사용하는 TLSLocalServer의 port로 바꿔주셔야 합니다.
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

//----------------- TLSLocalServer URL획득 ----------------- 
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
					if(request.status == 0 || request.status == 12029) //API EXE가 없어서 응답오류가 날 때.
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
					if(request.status == 0 || request.status == 12029) //API EXE가 없어서 응답오류가 날 때.
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
					
					if(request.status == 0 || request.status == 12029) //Launch EXE가 없어서 혹은 서비스 중지중이어서 응답오류가 날 때.
					{	
						if(confirm(MSG_IFORM_INSTALL)){
							doInstallation();
						}
						// alert(MSG_IFORM_INSTALL);
						// doInstallation();   //-> 재설치 작업 수행
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
					
					if(request.status == 0 || request.status == 12029) //Launch EXE가 없어서 혹은 서비스 중지중이어서 응답오류가 날 때.
					{	
						if(confirm(MSG_IFORM_INSTALL)){
							doInstallation();
						}
						// alert(MSG_IFORM_INSTALL);
						// doInstallation();   //-> 재설치 작업 수행
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



//--------- IE 버전 체크
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


//--------- jsonp Callback 처리
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


//--------- iForm 스캔 설치 수행 (웹서버 셋업파일 경로)
function doInstallation()
{
	window.open(IFORM_SETUP_FILEPATH);
}

//-------- EXE와 통신 중 애러 Function
function defaultErrCallback(request, status, error)
{
	if(isJsonp == true)
	{
		if(confirm(MSG_IFORM_INSTALL)){
			doInstallation();
		}
	}
	workException="서버와 통신 중 오류가 발생하였습니다.";
	workException+="\n";
	//workException+="code : " + request.status + " , " + request.statusText + " , " + error.message;
	workException+="code : " + request.status + " , " + request.statusText;
	if(error != null)
		workException+= " , " + error.message;
	
	isJsonp = false;
}

//----------------- scanEXE에 Data보내고 Wait(callbackFunc) ----------------- 
function EXEConnectWait(Work_, Data_, dataType, callbackFunc)   //dataType : Data_의 타입 지정 (0 : string Data Type/ 1 : Json or JsonArray) 
{
	var strWorkString = getWorkString(Work_, Data_, dataType);
	AjaxRequest_GetReturn(strWorkString, callbackFunc, null);
}

//----------------- scanEXE에 Data보내고 Wait(callbackFunc, ErrorCallback) ----------> ErrorCallback은 Ajax 통신이 정상적으로 되지 않았을 경우에 발생.
function EXEConnectWait_WithError(Work_, Data_, dataType, callbackFunc, ErrorCallback)    //dataType : Data_의 타입 지정 (0 : string Data Type/ 1 : Json or JsonArray) 
{
	var strWorkString = getWorkString(Work_, Data_, dataType);
	AjaxRequest_GetReturn(strWorkString, callbackFunc, ErrorCallback);
}

//----------------- scanEXE에 Data보내기 (리턴 값 없을 때)  ----------------- 
function EXEConnect(Work_, Data_, dataType)						//dataType : Data_의 타입 지정 (0 : string Data Type/ 1 : Json or JsonArray) 
{
	var strWorkString = getWorkString(Work_, Data_, dataType);
	AjaxRequest_GetReturn(strWorkString, defaultcallbackFunc, null);
}

//----------------- API EXE에 Data보내고 Wait(callbackFunc)  ----------------- 
function APIConnect (Work_, Data_, dataType)					//dataType : Data_의 타입 지정 (0 : string Data Type/ 1 : Json or JsonArray) 
{
	var strWorkString = getWorkString(Work_, Data_, dataType);
	AjaxRequest_GetReturn_API(strWorkString, defaultcallbackFunc, true);
}

//----------------- API EXE에 Data보내기 (리턴 값 없을 때)  ----------------- 
function APIConnectWait(Work_, Data_, dataType, callbackFunc)	//dataType : Data_의 타입 지정 (0 : string Data Type/ 1 : Json or JsonArray) 
{
	var strWorkString = getWorkString(Work_, Data_, dataType);
	AjaxRequest_GetReturn_API(strWorkString, callbackFunc, true);
}

//---------------- API EXE에 Data보내기 <동기방식> ---------------
function APIConnect_Sync(Work_, Data_, dataType)
{
	var strWorkString = getWorkString(Work_, Data_, dataType);
	AjaxRequest_GetReturn_API(strWorkString, defaultcallbackFunc, false);
}

//----------------- EXE에 전송 할 WorkString 가져오기 ----------------- 
function getWorkString(Work_, Data_, dataType)					//dataType : Data_의 타입 지정 (0 : string Data Type/ 1 : Json or JsonArray) 
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