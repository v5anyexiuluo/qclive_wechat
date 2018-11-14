<template>
	<!-- Component template requires a root element, rather than just text. -->
	<div class="body">
		<div v-show="liveStatus==1" style="position: relative; background-color:black;">
			<div id="idvideo" ref="idvideo" style="width:100%; height:220px;"></div>
		</div>
		<div v-show="liveStatus!=1" style="position: relative; height:240px;background-size: cover;font-size: 20px;" :style="{background:'url('+(curMediaData&&curMediaData.coverPictureUrl? curMediaData.coverPictureUrl:'')+') 0% 0% / cover no-repeat'}">
			<div v-if="liveStatus==0" style="width:100%; height:100%; position:absolute; left:0px; top:0px;color:white;display: flex;flex-wrap: nowrap;flex-direction: column;justify-content: center;align-items: center;">
				<span>{{curMediaData.startTime | formatDate}}</span>
				<span>敬请期待...</span>
			</div>
			<div v-if="liveStatus==2" style="width:100%; height:100%; position:absolute; left:0px; top:0px;color:white;display: flex;flex-wrap: nowrap;flex-direction: column;justify-content: center;align-items: center;">
				<span>直播已结束</span>
			</div>
		</div>
		<div style="height:30px;display:flex;flex-wrap:nowrap;justify-content:space-between;align-items: center;padding: 0 10px;color:#1296db;">
			<span class="marquee">
				<div>{{(curMediaData? (curMediaData.liveName? curMediaData.liveName:curMediaData.videoName):'')}}</div>
			</span>
			<span style="max-width:40%;white-space:nowrap;overflow:hidden;">
				<span style="" v-if="isLiveMedia"><img src="/static/images/user-white.png" style="display:inline-block; width: 12px;height:12px;margin-right:4px;" />{{onlineCount}}</span>
				<span style="margin-left:6px;"><img src="/static/images/love.png" style="display:inline-block; width: 12px;height:12px;margin-right:4px;" />{{likeCount}}</span>
			</span>
		</div>
		<div style="flex-grow:1;position: relative;overflow:hidden;">
			<mt-navbar v-model="selected" style="background-color: rgb(249, 249, 249);">
				<mt-tab-item id="1">介绍</mt-tab-item>
				<mt-tab-item id="2">评论</mt-tab-item>
				<mt-tab-item v-if="isLiveMedia" id="3">回放</mt-tab-item>
				<mt-tab-item  id="4">现场提问</mt-tab-item>
			</mt-navbar>
			<!-- tab-container -->
			<mt-tab-container v-model="selected" style="width:100%;position: absolute;left: 0px;top: 48px;bottom: 0px;overflow-y: auto;">
				<mt-tab-container-item id="1">
					<div class="tab-container" style="text-indent: 2em;line-height: 24px;">
						{{curMediaData? (curMediaData.introduction? curMediaData.introduction:"暂无简介"):""}}
					</div>
				</mt-tab-container-item>
				<mt-tab-container-item id="2">
					<div class="video-pane-body">
			            <div class="video-discuss">
			                <ul class="video-sms-list" id="video_sms_list">
			                    <!-- <li>
			                        <div class="video-sms-pane">
			                            <div class="video-sms-text"><span class="user-name-green" >毛利晴</span>有品位</div>
			                        </div>
			                    </li>
			                    <li>
			                        <div class="video-sms-pane">
			                            <div class="video-sms-text"><span class="user-name-org">cherylma</span>美女你好美女你好美女你好重要的事情说3遍</div>
			                        </div>
			                    </li> -->
			                </ul>
			                <div class="video-discuss-pane">
			                    <!-- <div class="video-discuss-tool" id="video-discuss-tool">
			                        <span class="like-icon zoomIn green"></span>
			                        <a href="javascript:void(0);" class="video-discuss-sms" onclick="smsPicClick()"></a>	    
			                    </div> -->
			                    <div class="video-discuss-form" id="video-discuss-form" >
			                        <input type="text" class="video-discuss-input" id="send_msg_text">
			                        <!-- <a href="javascript:void(0);" class="video-discuss-face" onclick="showEmotionDialog()"></a> -->
			                        <button class="video-discuss-button" onclick="onSendMsg()">发送</button>
			                    </div>
			              		<span class="like-icon zoomIn green"></span>
		                        <a href="javascript:void(0);" class="video-discuss-like" @click="sendMsg"></a>
			                </div>
			            </div>
			        </div>
				</mt-tab-container-item>
				<mt-tab-container-item v-if="isLiveMedia" id="3">
					<list-template ref="listTemp"></list-template>
				</mt-tab-container-item>
				<mt-tab-container-item id="4">
					<div style="height: 100%; display: flex; flex-wrap: nowrap; flex-direction: column; justify-content: flex-start;" >
					<mt-button @click="getHistoryQuestion" style="color:#26a2ff;text-align:center;" id="loadmore" v-if="visible">点击查看历史问题</mt-button>
					<ul class="video-sms-list " id="question"  >
						<li v-for="msg in msglist">
						<div class="video-sms-pane">
							<div class="video-sms-text">
								<p>{{getMyDate(msg.time)}}</p>
								<span class="user-name-blue">{{msg.nickName}}</span>
								<span>{{msg.content}}</span>
							</div>
						</div>	
						</li>
					</ul>				
					<!-- <div class="modal fade" id="edit_custom_msg_dialog" tabindex="-1" role="dialog" aria-labelledby="edit_custom_msg_label" aria-hidden="true" data-backdrop="static">-->
					<div class="modal-body" style="height:50px;width:100%;background-color:#4C4C4C;">
	                    <form role="form" onkeydown="if(event.keyCode==13)return false;" id="ecm_form" name="ecm_form" style="margin-bottom: 0px;"> 
	                        <div style="height: 50px;display: flex;flex-wrap: nowrap;align-items: center;">    
	                            <input type="text"  id="ecm_data"  placeholder="请输入问题" maxlength="50" style="padding: 0px 6px;height:33px;flex:1;margin-left: 10px;"> 
	                            <button type="button" style="background-color:#e7505a;color:white;width:60px;height:33px;font-size:14px;margin: 0px 10px;"  @click="sendQuestionMsg">提交</button>      
	                        </div>
	                    </form>	                     
	                </div>
	                </div>				                	               
			    	<!-- </div> -->
				</mt-tab-container-item>
			</mt-tab-container>
		</div>
	</div>
</template>
<script>
	import listTemplate from "@/components/commons/listTemplate.vue"
	import {Toast} from "mint-ui"
	import {formatDate} from '@/assets/js/date'
	import ReconnectingWebSocket from 'reconnecting-websocket';
	export default {
		data(){
            return {
            	ws: null,
            	selected: "1",
                player: null,
                isLiveMedia: true,
                curMediaData: null,
                liveStatus: 2,
                theRequest: null,
                userInfo: null,
                userProfile: "https://picsum.photos/30/30/?image=927",
                onlineCount:0,
                likeCount:0,
                popupVisible: false,
                isChatInited: false,
                msglist:[],
                page:1,
                visible:true,
                time:null,
                sendqueston:false,
            }
        },
        components:{
        	listTemplate: listTemplate
        },
        methods:{
        	initApp(){
        		let theRequestTemp = new Array();
        		let url = location.search;
				if (url.indexOf("?") != -1) {
					let str = url.substr(1);
					let strs = str.split("&");
					for(let i = 0; i < strs.length; i ++) {
						theRequestTemp[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
					}
				}
				this.theRequest=theRequestTemp;
				if(typeof(this.theRequest["jsessionid"])!="undefined"&&this.theRequest["jsessionid"]!="undefined"&&this.theRequest["jsessionid"]!="null"&&this.theRequest["jsessionid"]){
					window.sessionStorage.setItem("jsessionid",this.theRequest["jsessionid"])
					let queryStr = "";
					for(var key in this.theRequest){
			            if(key!="jsessionid"){
							queryStr+=(key+"="+this.theRequest[key]+"&")
						}
			        }
					queryStr = queryStr.substring(0,queryStr.length-1)
					location.href=protocol+location.host+location.pathname+(queryStr? "?"+queryStr:"");
				}else{
					this.theRequest["jsessionid"]=window.sessionStorage.getItem("jsessionid")
				}
        	},
        	uuid(len, radix){
				var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			    var uuid = [],
			        i;
			    radix = radix || chars.length;

			    if (len) {
			        // Compact form
			        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
			    } else {
			        // rfc4122, version 4 form
			        var r;

			        // rfc4122 requires these characters
			        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			        uuid[14] = '4';

			        // Fill in random data.  At i==19 set the high bits of clock sequence as
			        // per rfc4122, sec. 4.1.5
			        for (i = 0; i < 36; i++) {
			            if (!uuid[i]) {
			                r = 0 | Math.random() * 16;
			                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
			            }
			        }
			    }

			    return uuid.join('');
        	},
        	connect(){
        		let $this = this;
        		
        		var lockReconnect = false;//避免重复连接  ajaxBasePath ajax_websocket
        		var wsUrl = wsProtocol+ajaxBasePathWithoutProtocol+ajax_websocket+"/"+($this.isLiveMedia? $this.curMediaData.liveId:$this.curMediaData.videoId);

        		function createWebSocket(url) {
     //    			if ('WebSocket' in window){
			  //           $this.ws = new WebSocket(wsUrl);
					// }    
				 //    else if ('MozWebSocket' in window){
				 //        $this.ws = new MozWebSocket(wsUrl);
				 //    }
				 //    else{
				 //        Toast("该浏览器不支持websocket");    
				 //    }
				 	$this.ws = new ReconnectingWebSocket(wsUrl);
        		}
        		createWebSocket(wsUrl);

			    $this.ws.onmessage = function(evt) {    
			        //Toast(evt.data);  //接受后台的消息推送
			        console.log(evt);
			        console.log(evt.data);
			        var msg=JSON.parse(evt.data);
			        if(msg.key==3){			        	
			        	console.log('question: '+msg.liveId);
			        	console.log('question: '+msg.time);
			        	console.log('question: '+msg.nickName);
			        	console.log('question: '+msg.content);
			        	if(msg.content==''){
			        		Toast('输入的问题不能为空！');
			        		return;
			        	}
			        	/*for(var i=conTent.length-1;i>=0;i--){
			        		if(conTent[i]==msg.content){
			        		return;
			        		}
			        	}			        	
			        	conTent.push(msg.content);*/
			        	$this.msglist.push(msg);
			        }
			        else if(msg.key==2){
			        	console.log('like msg');
			        	//let onLineTemp = evt.data.split("||")
			        	//$this.onlineCount = onLineTemp[0].split(":")[1].trim();
			        	//$this.likeCount = onLineTemp[1].split(":")[1].trim();
			        	console.log('online: '+msg.OnlineCount);
			        	console.log('like: '+msg.LikeCount);

			        	$this.onlineCount =msg.OnlineCount;
			        	$this.likeCount = msg.LikeCount;
			        }
			        
			    };

			    // function reconnect(url) {  
		     //        if(lockReconnect) return;  
		     //        lockReconnect = true;
		     //        //没连接上会一直重连，设置延迟避免请求过多  
		     //        setTimeout(function () {  
		     //            createWebSocket(url);  
		     //            lockReconnect = false;  
		     //        }, 2000);
		     //    } 
			        
			    $this.ws.onclose = function(evt) {    
			        // console.log("WS连接中断");
			        // $this.ws.close();
			        // reconnect(wsUrl);
			        Toast("连接中断，提问失败，请重新提问!")
			    };

			    $this.ws.onerror = function (evnt) {  
	                //console.log('websocket服务出错了');  
	                // reconnect(wsUrl);  
	            };

			    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
			    window.onbeforeunload = function () {
			        $this.ws.close();
			    }
			        
			    $this.ws.onopen = function(evt) {
			    	if($this.ws){

			    		let userid = "";
			    		if ($this.userInfo&&$this.userInfo.id) {
					        userid = $this.userInfo.id;
					    } else {
					        userid = "NNNN" + $this.uuid(28, 16);
					    }
				    	let live_user_info = {
					        "key": 1,
					        "ip": returnCitySN.cip,
					        "ua": navigator.userAgent,
					        "userId": userid
					    }
					    let json_user_info  = JSON.stringify(live_user_info);
					    $this.ws.send(json_user_info);
				    }
			        // $this.send_user_info();
			        console.log("WS连接成功");
			    };
			}, 
			sendMsg() {
				let $this = this;
				$this.likeCount=parseInt($this.likeCount)+1;
				sendGroupLoveMsg();
			    if($this.ws){
			    	let live_user_info = {
				        "key": 2,
				        "msg": '点赞'
				    }
				    let json_user_info  = JSON.stringify(live_user_info);
				    $this.ws.send(json_user_info);
			    }
			},
			callback(){
				console.log("i am back");
			},
			sendQuestionMsg(){
	    		let $this=this;	
	    		if(!$this.sendqueston){
	    			$this.sendqueston=true;
	    			$this.time=parseInt((new Date().getTime())/1000);
	    			console.log($this.time);
	    		}
	    		
	    		if (!loginInfo.identifier) { //未登录      
            		location.href=loginPath();
            		return;
    			}    			    		
	    		let liveId=$this.theRequest["liveId"];
	    		let nickName=loginInfo.identifierNick+'';
	    		console.log('nickName:'+nickName);
	    		let date=new Date().getTime();
	    		let content=document.getElementById("ecm_data").value;
	    		if($this.ws){
			    	let live_question_info = {
				        "key": 3,
				        "liveId": liveId,
				        "nickName":nickName,
				        "time":date,
				        "content":content
				    }
				    console.log('send: '+live_question_info);
				    let json_question_info  = JSON.stringify(live_question_info);
				    $this.ws.send(json_question_info);
				    document.getElementById("ecm_data").value="";
			    }
	    	},
	    	//将时间戳转换为时间格式
			getMyDate(str){  
			            var oDate = new Date(str),  
			            oYear = oDate.getFullYear(),  
			            oMonth = oDate.getMonth()+1,  
			            oDay = oDate.getDate(),  
			            oHour = oDate.getHours(),  
			            oMin = oDate.getMinutes(),  
			            oSen = oDate.getSeconds(),  
			            oTime = oYear +'-'+ this.$options.methods.getzf(oMonth)+'-'+ this.$options.methods.getzf(oDay) +' '+this.$options.methods.getzf(oHour) +':'+ this.$options.methods.getzf(oMin) +':'+this.$options.methods.getzf(oSen);//最后拼接时间  
			            return oTime;  
			        },
			//补0操作
			getzf(num){  
			    if(parseInt(num) < 10){  
			        num = '0'+num;  
			    }  
			    return num;  
			},

	    	goBack(){
        		this.$router.go(-1)
        	},
	    	getUserInfo(cbOk){
	    		let $this = this;
	    		$this.$axios.get(ajax_user_info)
				.then(function(response){
					if(response.data.retureValue==0){
						$this.userInfo = response.data.retureData;
						if(response.data.retureData.headPicId){
							$this.userProfile = headPicId;
						}
						
						typeof(cbOk)=="function" && cbOk()
					}else{
						// Toast('登录失败，请重试！');
						console.log(response.data.retureMsg);
					}
				})
				.catch(function(error){
					// Toast('登录失败，请重试！');
				    console.log(error);
				});
	    	},

	    	getLiveData(){
	    		let $this = this;
	        	let strs = null;
	        	let url = "";
	        	if(typeof($this.theRequest["liveId"])!="undefined"&&$this.theRequest["liveId"]){
	        		url = ajax_wechat_live+$this.theRequest["liveId"];
	        		$this.isLiveMedia=true;
	        		//getHistoryQuestion($this.theRequest["liveId"]);
	        		// mediaId = "liveId:"+$this.theRequest["liveId"];
	        	}else if(typeof($this.theRequest["videoId"])!="undefined"&&$this.theRequest["videoId"]){
	        		url = ajax_wechat_video+$this.theRequest["videoId"];
	        		$this.isLiveMedia=false;
	        		// mediaId = "videoId:"+$this.theRequest["videoId"];
	        	}
	        	// if($this.theRequest["jsessionid"]){
	        	// 	url = url+";jsessionid="+$this.theRequest.jsessionid;
	        	// }
				$this.$axios.get(url)
				.then(function(response){
					if(response.data.retureValue==0){
						$this.curMediaData = response.data.retureData;
						$this.liveStatus = response.data.retureData.liveStatus;
						$this.theRequest["type"]=response.data.retureData.type;
						$this.onlineCount = response.data.retureData.onLineNum;
				        $this.likeCount = response.data.retureData.likeCount;
				        $this.wxConfig();
				        //$this.time=new Date().getTime();
						// if($this.isLiveMedia){
						// 	$this.$refs.listTemp.initComponent($this.theRequest);
						// }
					} else if (response.data.retureValue == 2400) {
		                Toast('没有观看权限！请登录或切换用户');
		                // location.href=loginPath();
		            } else {
						Toast('服务器开小差了！');
						console.log(response.data.retureMsg);
					}
				})
				.catch(function(error){
					Toast('服务器开小差了！');
				    console.log(error);
				});
	    	},
	    	getHistoryQuestion(){
	    		let $this=this;
	    		if(!$this.sendqueston){
	    			$this.time=new Date().getTime();
	    		}
	    		console.log($this.time);
	    		let url="";
	    		let url2="";
	    		url = ajax_history_question + "?liveId=" + $this.theRequest["liveId"] + "&page=" + $this.page + "&size=" + 10 + "&time=" + $this.time;
				console.log($this.page);
				$this.$axios.get(url).then(function (response) {
							console.log(response);
							console.log(response.data.retureData.list.length);
							if (response.data.retureValue == 0) {
								for (var i = 0; i < response.data.retureData.list.length; i++) {
									$this.msglist.unshift(response.data.retureData.list[i]);
									console.log(response.data.retureData.list[i]);
								}
								$this.page++;
								if($this.page>response.data.retureData.totalPage){
									Toast('问题全部加载！');
									$this.visible=false;
								}
							} else {
								console.log(response.data.retureMsg);
							}
						}).catch(function (error) {
							mint_ui_lib_toast__WEBPACK_IMPORTED_MODULE_1___default()('服务器开小差了！');
							console.log(error);
						});
	    	},
	    	onShare(){

	    	},
	    	showPopup(){
	    		let $this = this;
	    		$this.popupVisible = true;
	    	},
	    	redirectLogin(){
	    		location.href=loginPath();
	    	},
	    	loginOut(){
	    		let $this = this;
	    		let url = ajax_user_logout;//+";jsessionid="+$this.theRequest.jsessionid;
	    		$this.$axios.get(url)
				.then(function(res) {
			        if(res.data.retureValue==0){
			        	// $this.theRequest["jsessionid"]=null;
			        	// window.sessionStorage.removeItem("jsessionid")
			        	Toast("退出成功!");	
			        	location.reload();
			        }else{
			        	Toast("退出失败!")
			        }
			        $this.popupVisible = false;
			    })
				.catch(function(error){
					Toast('服务器开小差了！');
				    console.log(error);
				    $this.popupVisible = false;
				})
	    	},

	    	fnGetQueryString(key) { //正则获取url后面的参数值，如?env=dev&exp=123中可以通过fnGetQueryString('exp')=>得到123
		        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
		        var result = window.location.search.substr(1).match(reg);
		        return result ? decodeURIComponent(result[2]) : false;
		    },

		    funcUrlDel(name) {//删除url指定参数名并返回新的url
		        var loca = window.location;
		        var baseUrl = loca.origin + loca.pathname + "?";
		        var query = loca.search.substr(1);
		        if (query.indexOf(name) > -1) {
		            var obj = {};
		            var arr = query.split("&");
		            for (var i = 0; i < arr.length; i++) {
		                arr[i] = arr[i].split("=");
		                obj[arr[i][0]] = arr[i][1];
		            };
		            delete obj[name];
		            var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
		            return url
		        };
		    },

		    getlinkSearch(key, reqStr) {//这个作用同fnGetQueryString(key)函数差不多，不过它将reqStr参数替代了window.searsh获取的东西,因为上个函数在删除了url的某一参数后会返回一个新的带?参数查询的链接
		        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
		        var result = reqStr.substr(1).match(reg);
		        return result ? decodeURIComponent(result[2]) : false;
		    },

		    refreshUrl() {//强制刷新到不带二次分享参数页面
		    	var $this = this;
		        var url = "",
		            reqStr = "";
		        if ($this.fnGetQueryString('from')) {//from为微信二次分享自带参数
		            url = $this.funcUrlDel('from');
		            var reqIndex = url.indexOf('?');
		            reqStr = url.substr(reqIndex);//截取去除from参数后的地址
		            console.log(url, reqStr);
		            if ($this.getlinkSearch('isappinstalled', reqStr)) {//isappinstalled为微信二次分享自带参数
		                url = url.substr(0, url.indexOf('&'));//截取去除isappinstalled参数后的地址
		                console.log(url);
		                window.location.href = url;
		            } else {
		                window.location.href = url;
		            }
		        }
		    },


	    	wxConfig(){
	    		var $this = this;
	    		// console.log("1"+location.href)
	    		$this.$axios.get(ajaxBasePath+"wechat/getParam?url="+location.href)
	    		.then(function(res) {
                    if(res.data.retureValue == 0){
                        wx.config({
					        debug: false,////生产环境需要关闭debug模式
					        appId: res.data.retureData.appid,//appId通过微信服务号后台查看
					        timestamp: res.data.retureData.timestamp,//生成签名的时间戳
					        nonceStr: res.data.retureData.nonceStr,//生成签名的随机字符串
					        signature: res.data.retureData.signature,//签名
					        jsApiList: [//需要调用的JS接口列表
					            'onMenuShareTimeline',//分享到朋友圈
					            'onMenuShareAppMessage',//分享给好友
					            'onMenuShareQQ'
					        ]
					    });
					    wx.ready(function () {
					        //分享朋友圈
					        // console.log($this.curMediaData)
					        wx.onMenuShareTimeline({
					            title: '青葱直播| '+($this.curMediaData? ($this.curMediaData.liveName? $this.curMediaData.liveName:$this.curMediaData.videoName):''),
					            link: location.href,
					            imgUrl: $this.curMediaData.coverPictureUrl,// 自定义图标location.href.substring(0,location.href.indexOf('&from='))
					            trigger: function (res) {
					                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回.
					                //alert('click shared');
					            },
					            success: function (res) {
					                //alert('shared success');
					                //some thing you should do
					                // alert("分享成功");
					                // console.log(res)
					            },
					            cancel: function (res) {
					                //alert('shared cancle');
					                // alert("分享取消");
					                // console.log(res)
					            },
					            fail: function (res) {
					                //alert(JSON.stringify(res));
					                // alert("分享失败");
					                // console.log(res)
					            }
					        });
					        //分享给好友
					        wx.onMenuShareAppMessage({
					            title: '青葱直播| '+($this.curMediaData? ($this.curMediaData.liveName? $this.curMediaData.liveName:$this.curMediaData.videoName):''), // 分享标题
					            desc: '【'+$this.$options.filters.formatDate($this.curMediaData.startTime)+'】'+($this.curMediaData? ($this.curMediaData.introduction? $this.curMediaData.introduction:"暂无简介"):""), // 分享描述
					            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					            imgUrl: $this.curMediaData.coverPictureUrl, // 自定义图标
					            type: 'link', // 分享类型,music、video或link，不填默认为link
					            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					            success: function (res) {
					                // 用户确认分享后执行的回调函数
					                // alert("分享成功");
					                // console.log(res)
					            },
					            fail: function (res) {
					                //alert(JSON.stringify(res));
					                // alert("分享失败");
					                // console.log(res)
					            },
					            cancel: function (res) {
					                // 用户取消分享后执行的回调函数
					                // alert("分享取消");
					                // console.log(res)
					            }
					        });
					        wx.onMenuShareQQ({
								title: '青葱直播| '+($this.curMediaData? ($this.curMediaData.liveName? $this.curMediaData.liveName:$this.curMediaData.videoName):''), // 分享标题
					            desc: '【'+$this.$options.filters.formatDate($this.curMediaData.startTime)+'】'+($this.curMediaData? ($this.curMediaData.introduction? $this.curMediaData.introduction:"暂无简介"):""), // 分享描述
					            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					            imgUrl: $this.curMediaData.coverPictureUrl, // 自定义图标
								success: function (res) {
								// 用户确认分享后执行的回调函数
									// alert("分享成功");
									// console.log(res)
								},
								cancel: function (res) {
								// 用户取消分享后执行的回调函数
									// alert("分享取消");
									// console.log(res)
								}
							});
					        wx.error(function (res) {
					            // console.log("congif:"+res.errMsg);
					        });
					    });
                    }
                }).catch(function(error){
					Toast('服务器开小差了！');
				})
	    	},
	    	initPlay(data){
	    		let $this = this
	    		let $format = data.fileFormat=="hls"? "m3u8":data.fileFormat;
	    		let $config = {
					"autoplay" : true,  //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
					"coverpic" : {"style": "stretch", "src": $this.curMediaData.coverPictureUrl},
					"controls" : "system",
					"width" :  '100%',//视频的显示宽度，请尽量使用视频分辨率宽度
					"height" : '100%',//视频的显示高度，请尽量使用视频分辨率高度
					"wording": {
					    2032: "请求视频失败，请检查网络",
					    2048: "请求m3u8文件失败，可能是网络错误或者跨域问题"
					},
		            "flash" : true,
		            "h5_flv": true,
					listener: function (msg) {
		                switch (msg.type){
		                	case "error":
		                		break;
	                		case "play":
		                		break;
	                		case "ended":
		                		break;
	                		default:
	                			break;
		                }
		            }
				}
				if($this.isLiveMedia){
					$config["m3u8"]=data.hlsPlayUrl;
					$config["flv"]=data.flvPlayUrl;
					// if(typeof data.hlsPlayUrl != "undefined"){
					// 	$config["m3u8"]=data.hlsPlayUrl;
					// }
					// if(typeof data.flvPlayUrl != "undefined"){
					// 	$config["flv"]=data.flvPlayUrl;
					// }
				}else{
					$config[$format]=data.playUrl
					// if(typeof data.playUrl != "undefined"){
					// 	$config[$format]=data.playUrl
					// }
				}
				// console.log(this.$refs.idvideo)
	    		$this.player = new TcPlayer('idvideo', $config)
				window.tcplayer = $this.player;
				
	    	}
        },
        computed: {
		},
		watch: {
			'selected':function(){
				let $this = this
				if($this.isLiveMedia){
					$this.$refs.listTemp.initComponent($this.theRequest);
				}
			},
			'curMediaData':function(){
				if(this.curMediaData.groupId){
					avChatRoomId = this.curMediaData.groupId;
					// sessionId = this.theRequest["jsessionid"];
					// if(typeof(sessionId)!="undefined"&&sessionId&&avChatRoomId){
					if(avChatRoomId){
						let $this = this;
						this.getUserInfo(function(){
							// loginInfo.identifier = identifier = $this.userInfo.id;
							loginInfo.identifier = identifier = $this.userInfo.nickName? $this.userInfo.nickName : '未知用户';
							loginInfo.identifierNick = identifierNick = $this.userInfo.nickName? $this.userInfo.nickName : '未知用户';
							loginInfo.userSig = userSig = tlsGetUserSig().userSig;
							// sdkLogin();
						})
					}else{
						
					}
				}
				if(typeof(this.curMediaData.playUrl)!="undefined"&&this.curMediaData.playUrl&&this.liveStatus!=0){
					try {
					    this.initPlay(this.curMediaData);
					}
					catch(err) {
					    console.log(err)
					} 
					finally {
					    this.connect();
					}
				}
			}
	    },
        created: function(){
        	// this.initApp();
        	// this.getLiveData();
        	// this.refreshUrl();
        	// this.$route.query.id;
        },
        mounted: function() {
        	// console.log(this.$refs.idvideo)
    	},
    	filters: {
			formatDate(time) {
			    let date = new Date(parseInt(time))
			    return formatDate(date, 'MM月dd hh:mm')
			}
		}
	}
	
</script>

<style>
	@-webkit-keyframes marquee {
	    30% { left: 0; }
	    100% { left: -100%; }
	}
	@-moz-keyframes marquee {
	    30% { left: 0; }
	    100% { left: -100%; }
	}
	@-ms-keyframes marquee {
	    30% { left: 0; }
	    100% { left: -100%; }
	}
	@-o-keyframes marquee {
	    30% { left: 0; }
	    100% { left: -100%; }
	}
	@keyframes marquee {
	  30%{left:0}
	  100%{left: -100%}
	}
	.body{
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		flex-wrap: nowrap;
	}
	.body>*{
		flex-shrink: 0;
	}
	.video-sms-list{
		color:black;
	}
	.marquee {
		color: gray;
		font-size: 16px;
		width: 55%;
    	height: 100%;
		overflow: hidden;
		position: relative;
	}
	.marquee div {
		display: block;
		width: 200%;
		height: 100%;
	    display: flex;
    	align-items: center;
		position: absolute;
		overflow: hidden;
		white-space: nowrap;
		-webkit-animation: marquee 4s linear infinite;
		-moz-animation: marquee 4s linear infinite;
		-ms-animation: marquee 4s linear infinite;
		-o-animation: marquee 4s linear infinite;
		animation: marquee 4s linear infinite;
	}

	.mint-header{
		height: 40px;
		width: 100%;
	}
	.mint-navbar{
		/*height: 12%;*/
	}
	.mint-tab-item-label{
		font-size: 14px;
	}
	.mint-tab-container{
	}
	.mint-tab-container-wrap{
		height: 100%;
	}
	.tab-container{
		padding: 15px
	}
	@import "/static/css/chat.css";
</style>