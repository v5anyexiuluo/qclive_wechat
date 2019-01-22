<template>
  <!-- Component template requires a root element, rather than just text. -->
  <div class="body full-heigth">
    <mt-header title="青葱校园直播">
      <span slot="left">
        <mt-button icon="back" @click="$router.go(-1)"></mt-button>
      </span>
      <router-link v-if="!isLiveMedia" to="/" slot="left">
        <mt-button icon="back" @click="goBack"></mt-button>
      </router-link>
      <a href="javascript:;" v-if="(userInfo==null)" slot="right" @click="redirectLogin">登录</a>
      <img
        :src="userProfile"
        style="height:30px;width:30px;"
        v-else
        slot="right"
        @click="showPopup"
      >
    </mt-header>
    <mt-popup
      v-model="popupVisible"
      position="bottom"
      popup-transition="popup-fade"
      style="width:100%;"
    >
      <a
        href="javascript:;"
        @click="loginOut"
        style="display:block;height:60px;line-height:60px;width:100%;text-align:center; color:gray;font-size:16px;"
      >退出</a>
    </mt-popup>
    <!-- <div id="id-video" style="width:100%; height:0; padding-bottom:60%;"></div> -->
    <div v-show="liveStatus==1" style="position: relative; background-color:black;">
      <div id="idvideo" ref="idvideo" style="width:100%; height:220px;"></div>
    </div>
    <div
      v-show="liveStatus!=1"
      style="position: relative; height:240px;background-size: cover;font-size: 20px;"
      :style="{background:'url('+(curMediaData&&curMediaData.coverPictureUrl? curMediaData.coverPictureUrl:'')+') 0% 0% / cover no-repeat'}"
    >
      <div
        v-if="liveStatus==0"
        style="width:100%; height:100%; position:absolute; left:0px; top:0px;color:white;display: flex;flex-wrap: nowrap;flex-direction: column;justify-content: center;align-items: center;"
      >
        <span>{{curMediaData.startTime | formatDate}}</span>
        <span>敬请期待...</span>
      </div>
      <div
        v-if="liveStatus==2"
        style="width:100%; height:100%; position:absolute; left:0px; top:0px;color:white;display: flex;flex-wrap: nowrap;flex-direction: column;justify-content: center;align-items: center;"
      >
        <span>直播已结束</span>
      </div>
    </div>
    <div
      style="height:30px;display:flex;flex-wrap:nowrap;justify-content:space-between;align-items: center;padding: 0 10px;color:#1296db;"
    >
      <span class="marquee">
        <div>{{(curMediaData? (curMediaData.liveName? curMediaData.liveName:curMediaData.videoName):'')}}</div>
      </span>
      <span style="max-width:40%;white-space:nowrap;overflow:hidden;">
        <span style v-if="isLiveMedia">
          <img
            src="/static/images/user-white.png"
            style="display:inline-block; width: 12px;height:12px;margin-right:4px;"
          >
          {{onlineCount}}
        </span>
        <span style="margin-left:6px;">
          <img
            src="/static/images/love.png"
            style="display:inline-block; width: 12px;height:12px;margin-right:4px;"
          >
          {{likeCount}}
        </span>
      </span>
    </div>
    <div style="flex-grow:1;position: relative;overflow:hidden;">
      <mt-navbar v-model="selected" style="background-color: rgb(249, 249, 249);">
        <mt-tab-item id="1">介绍</mt-tab-item>
        <mt-tab-item id="2">评论</mt-tab-item>
        <mt-tab-item v-if="isLiveMedia" id="3">回放</mt-tab-item>
        <mt-tab-item id="4">现场提问</mt-tab-item>
      </mt-navbar>
      <!-- tab-container -->
      <mt-tab-container
        v-model="selected"
        style="width:100%;position: absolute;left: 0px;top: 48px;bottom: 0px;overflow-y: auto;"
      >
        <mt-tab-container-item id="1">
          <div
            class="tab-container"
            style="text-indent: 2em;line-height: 24px;"
          >{{curMediaData? (curMediaData.introduction? curMediaData.introduction:"暂无简介"):""}}</div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <div
            style="height: 100%; display: flex; flex-wrap: nowrap; flex-direction: column; justify-content: flex-start;"
          >
            <ul class="video-sms-list flex-full" id="video_sms_list">
              <li
                v-for="(item,index) in messages"
                :key="index"
              >
                <div
                  class="video-sms-pane"
                >
                  <div class="video-sms-text">
                    <span
                      class="user-name-green" 
                    >
                      {{item.nick}}
                    </span>
                    {{item.content}}
                  </div>
                </div>
              </li>
            </ul>
            <!-- <ul class="video-sms-list flex-full" id="question">
              <li v-for="msg in msglist">
                <div class="video-sms-pane">
                  <div class="video-sms-text">
                    <p>{{getMyDate(msg.time)}}</p>
                    <span class="user-name-blue">{{msg.nickName}}</span>
                    <span>{{msg.content}}</span>
                  </div>
                </div>
              </li>
            </ul> -->
            <div class="modal-body" style="height:50px;width:100%;background-color:#4C4C4C;">
              <form
                role="form"
                onkeydown="if(event.keyCode==13)return false;"
                id="ecm_form"
                name="ecm_form"
                style="margin-bottom: 0px;"
              >
                <div style="height: 50px;display: flex;flex-wrap: nowrap;align-items: center;">
                  <input
                    type="text"
                    id="ecm_data"
                    placeholder="请输入问题"
                    maxlength="50"
                    v-model="message"
                    style="padding: 0px 6px;height:33px;flex:1;margin-left: 10px;"
                  >
                  <button
                    type="button"
                    style="background-color:#e7505a;color:white;width:60px;height:33px;font-size:14px;margin: 0px 10px;"
                    @click="sendMessage"
                  >发送</button>
                </div>
                <div
                  :class="like == 0 ? 'video-pane-like' : 'video-pane-liked'"
                  @click="sendLike"
                ></div>
              </form>
            </div>
          </div>
          <!-- </div> -->
        </mt-tab-container-item>
        <!-- <mt-tab-container-item id="2">
          <div class="video-pane-body">
            <div class="video-discuss">
              <ul class="video-sms-list flex-full" id="video_sms_list">
                <li
                  v-for="(item,index) in messages"
                  :key="index"
                >
                  <div
                    class="video-sms-pane"
                  >
                    <div class="video-sms-text">
                      <span
                        class="user-name-green" 
                      >
                        {{item.nick}}
                      </span>
                      {{item.content}}
                    </div>
                  </div>
                </li>
              </ul>
              <div class="video-discuss-pane">
                <div class="video-discuss-form" id="video-discuss-form">
                  <input
                    type="text"
                    class="video-discuss-input"
                    id="send_msg_text"
                    v-model="message"
                  >
                  <button class="video-discuss-button" @click="sendMessage">发送</button>
                </div>
                <span class="like-icon zoomIn green"></span>
                <a href="javascript:void(0);" class="video-discuss-like" @click="sendMsg"></a>
              </div>
            </div>
          </div>
        </mt-tab-container-item> -->
        <mt-tab-container-item v-if="isLiveMedia" id="3">
          <list-template ref="listTemp"></list-template>
        </mt-tab-container-item>
        <mt-tab-container-item id="4">
          <div
            style="height: 100%; display: flex; flex-wrap: nowrap; flex-direction: column; justify-content: flex-start;"
          >
            <!-- <mt-button
              @click="getHistoryQuestion"
              style="color:#26a2ff;text-align:center;"
              id="loadmore"
              v-if="visible"
            >点击查看历史问题</mt-button> -->
            <a id="loadmore" v-if="visible" href="javascript:void(0)" @click="getHistoryQuestion" class="a-btn">点击查看历史问题</a>
            <ul class="video-sms-list flex-full" id="question">
              <li
                v-for="(msg, index) in msglist"
                :key="index"
              >
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
              <form
                role="form"
                onkeydown="if(event.keyCode==13)return false;"
                id="ecm_form"
                name="ecm_form"
                style="margin-bottom: 0px;"
              >
                <div style="height: 50px;display: flex;flex-wrap: nowrap;align-items: center;">
                  <input
                    type="text"
                    id="ecm_data"
                    placeholder="请输入问题"
                    maxlength="50"
                    style="padding: 0px 6px;height:33px;flex:1;margin-left: 10px;"
                  >
                  <button
                    type="button"
                    style="background-color:#e7505a;color:white;width:60px;height:33px;font-size:14px;margin: 0px 10px;"
                    @click="sendQuestionMsg"
                  >提交</button>
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
import listTemplate from "@/components/commons/listTemplate.vue";
import { Toast } from "mint-ui";
import { formatDate } from "@/assets/js/date";
import utils from "@/assets/js/utils";
import ReconnectingWebSocket from "reconnecting-websocket";
import { live, tId, apiHome, apiList, apiDetail } from '@/properties/api.js'
export default {
  data() {
    return {
      like: 0,
      ws: null,
      selected: "1",
      player: null,
      isLiveMedia: true,
      curMediaData: null,
      liveStatus: 2,
      theRequest: null,
      userInfo: null,
      loginInfo: {
        'identifier': '', //当前用户ID,必须是否字符串类型，选填
        'identifierNick': '', //当前用户昵称，选填
        'userSig': '', //当前用户身份凭证，必须是字符串类型，选填
      },
      userProfile: "https://picsum.photos/30/30/?image=927",
      onlineCount: 0,
      likeCount: 0,
      popupVisible: false,
      isChatInited: false,
      msglist: [],
      page: 1,
      visible: true,
      time: null,
      sendqueston: false,
      message: "",
      messages: [],
      isLogin: false,
      listeners: {
        onBigGroupMsgNotify: this.onBigGroupMsgNotify,
        onLogin: this.onLogin
      },
      avChatRoomId : null
    };
  },
  components: {
    listTemplate: listTemplate
  },
  mounted: function() {
    var $this = this;
    var promiseUser = new Promise((resolve, reject) => {
      $this.initApp(resolve, reject);
    });
    var promiseMedia = new Promise((resolve, reject) => {
      $this.getLiveData(resolve, reject);
    });
    Promise.all([promiseUser, promiseMedia]).then(result => {
      if (result[1] == "media-success") {
        console.log("read:u:" + $this.userInfo);
        console.log("read:l:" + $this.curMediaData);
        $this.readedShare();
        if ($this.isWeixin() && result[0] == "user-success") {
          console.log("share:u:" + $this.userInfo);
          console.log("share:l:" + $this.curMediaData);
          $this.wxConfig();
        }
      }
    });
  },
  created: function() {
    // location.reload();
    this.$chat.setLoginStatus(false)
    console.log(this.$refs.idvideo)
    let $this = this;
    let liveId = window.sessionStorage.getItem("liveId");
    if(liveId && liveId != $this.$route.query.liveId) {
      location.reload();
      window.sessionStorage.setItem(
        "liveId",
        $this.$route.query.liveId
      )
    } else {
      window.sessionStorage.setItem(
        "liveId",
        $this.$route.query.liveId
      )
    }
  },
  methods: {
    sendMessage() {
      let $this = this;
      if (!this.loginInfo.identifier) {
        location.href = this.$chat.loginPath();
        return
      }
      // if (this.$chat.getLoginStatus() == false) {
      if (this.isLogin == false) {
        this.$chat.sdkLog(this.loginInfo, this.listeners, function() {
          $this.$chat.sendMsg($this.loginInfo, $this.message);
          $this.message = "";
        });
      } else {
        this.$chat.sendMsg(this.loginInfo, this.message);
        this.message = "";
      }
    },
    sendLike () {
      let $this = this;
      if (!this.loginInfo.identifier) {
        location.href = this.$chat.loginPath();
        return
      }
      if (this.like == 1) {
        return;
      }
      if (this.isLogin == false) {
        this.$chat.sdkLog(this.loginInfo, this.listeners, function() {
          $this.$chat.sendLike($this.loginInfo)
        });
      } else {
        this.$chat.sendLike(this.loginInfo)
      }
      this.like = 1;
      this.likeCount ++;
    },
    onLogin (cbOk, cbErr) {
      this.isLogin = true;
      this.$chat.applyJoinBigGroup(this.avChatRoomId, cbOk, cbErr);
    },
    onLogout (cbOk, cbErr) {
      var $this = this;
      this.isLogin = false;
      // $this.loginInfo.identifier = null
      // $this.loginInfo.identifierNick = null
      // $this.loginInfo.userSig = null
    },
    onBigGroupMsgNotify (msgList) {
      for (var i = msgList.length - 1; i >= 0; i--) {
        //遍历消息，按照时间从后往前
        var msg = msgList[i];
        //显示收到的消息
        this.showMsg(msg);
      }
    },
    showMsg (msg) {
      let maxDisplayMsgCount = 30;
      if (this.messages.length == maxDisplayMsgCount) {
        this.messages.shift();
      }
      let fromAccountNick = msg.getFromAccountNick();
      let html = this.$chat.converMsgtoText(msg);
      this.messages.push({
        nick: fromAccountNick,
        content: html
      });
      console.log(this.messages);
    },
    initApp (resolve, reject) {
      let $this = this;
      let theRequestTemp = new Array();
      let url = location.search;
      if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
          theRequestTemp[strs[i].split("=")[0]] = decodeURI(
            strs[i].split("=")[1]
          );
        }
      }
      $this.theRequest = theRequestTemp;
      $this.userInfo = window.sessionStorage.getItem("userInfo")  
          ? JSON.parse(window.sessionStorage.getItem("userInfo"))
          : null;
      if (!$this.userInfo) {
        $this.getUserInfo(
          function() {
            $this.imInit();
            resolve("user-success");
            console.log("user-success");
          },
          function() {
            resolve("user-fail");
            console.log("user-fail");
          }
        );
      } else {
        $this.userProfile = $this.userInfo.headPicId
        $this.imInit();
      }
    },
    // initApp(resolve, reject) {
    //   var $this = this;
    //   let theRequestTemp = new Array();
    //   let url = location.search;
    //   if (url.indexOf("?") != -1) {
    //     let str = url.substr(1);
    //     let strs = str.split("&");
    //     for (let i = 0; i < strs.length; i++) {
    //       theRequestTemp[strs[i].split("=")[0]] = decodeURI(
    //         strs[i].split("=")[1]
    //       );
    //     }
    //   }
    //   $this.theRequest = theRequestTemp;
    //   if ($this.isWeixin()) {
    //     // if(typeof($this.theRequest["code"]!="undefined")&&$this.theRequest["code"]){
    //     // 	$this.getWxUser($this.theRequest["code"], function(data){
    //     // 		$this.userInfo = data;
    //     // 		window.sessionStorage.setItem("userInfo", JSON.stringify($this.userInfo));
    //     // 		$this.clearQueryParams();
    //     // 	}, function(){
    //     // 		$this.clearQueryParams();
    //     // 	});
    //     // }else{
    //     // 	$this.userInfo = window.sessionStorage.getItem("userInfo")? JSON.parse(window.sessionStorage.getItem("userInfo")):null;
    //     // 	if(!$this.userInfo || $this.userInfo.registerType!=2){
    //     // 		$this.wxAuth();
    //     // 		return;
    //     // 				}else{
    //     // 					$this.imInit();
    //     // 					console.log("user-success");
    //     // 					resolve("user-success");
    //     // 				}
    //     // }
    //     $this.userInfo = window.sessionStorage.getItem("userInfo")
    //       ? JSON.parse(window.sessionStorage.getItem("userInfo"))
    //       : null;
    //     if (!$this.userInfo || $this.userInfo.registerType != 2) {
    //       if (
    //         typeof ($this.theRequest["code"] != "undefined") &&
    //         $this.theRequest["code"]
    //       ) {
    //         $this.getWxUser(
    //           $this.theRequest["code"],
    //           function(data) {
    //             $this.userInfo = data;
    //             window.sessionStorage.setItem(
    //               "userInfo",
    //               JSON.stringify($this.userInfo)
    //             );
    //             // alert("comein")
    //             console.log("comein");
    //             // 二次分享去除from等无效参数
    //             $this.refreshUrl();

    //             $this.imInit();
    //             console.log("user-success");
    //             resolve("user-success");
    //           },
    //           function() {
    //             $this.wxAuth();
    //           }
    //         );
    //       } else {
    //         $this.wxAuth();
    //       }
    //     } else {
    //       $this.imInit();
    //       console.log("user-success");
    //       resolve("user-success");
    //     }
    //   } else {
    //     $this.userInfo = window.sessionStorage.getItem("userInfo")
    //       ? JSON.parse(window.sessionStorage.getItem("userInfo"))
    //       : null;
    //     if (!$this.userInfo) {
    //       $this.getUserInfo(
    //         function() {
    //           $this.imInit();
    //           resolve("user-success");
    //           console.log("user-success");
    //         },
    //         function() {
    //           resolve("user-fail");
    //           console.log("user-fail");
    //         }
    //       );
    //     } else {
    //       $this.imInit();
    //     }
    //     // if(typeof($this.theRequest["jsessionid"])!="undefined"&&$this.theRequest["jsessionid"]!="undefined"&&$this.theRequest["jsessionid"]!="null"&&$this.theRequest["jsessionid"]){
    //     // 	$this.clearQueryParams();
    //     // }
    //   }
    // },
    imInit() {
      var $this = this;
      $this.loginInfo.identifier = $this.userInfo.nickName
        ? $this.userInfo.nickName
        : "未知用户";
      $this.loginInfo.identifierNick = $this.userInfo.nickName
        ? $this.userInfo.nickName
        : "未知用户";
      // $this.loginInfo.userSig = userSig = tlsGetUserSig().userSig;
      $this.tlsGetUserSig($this.loginInfo.identifier)
      console.log("im:" + JSON.stringify($this.loginInfo));
    },
    tlsGetUserSig(identifier) {
      var $this = this;
      $this.$axios.get(
        'https://dev.shigele.cn/xidian_live-0.0.1/0.1/im/sig?userId=' + identifier,
        null,
        function(res) {
          if(res.data.retureValue==0){
            $this.loginInfo.userSig=res.data.retureData.userSig;
          }else{
            alert("错误" + res.retureMsg);
          }
        },function(res){
          alert("获取sig失败！");
        }
      )
    },
    imInit1() {
      var $this = this;
      loginInfo.identifier = identifier = $this.userInfo.nickName
        ? $this.userInfo.nickName
        : "未知用户";
      loginInfo.identifierNick = identifierNick = $this.userInfo.nickName
        ? $this.userInfo.nickName
        : "未知用户";
      loginInfo.userSig = userSig = tlsGetUserSig().userSig;
      console.log("im:" + JSON.stringify(loginInfo));
    },
    clearQueryParams() {
      var $this = this;
      var queryStr = "";
      for (var key in $this.theRequest) {
        if (key != "jsessionid" && key != "code") {
          queryStr += key + "=" + this.theRequest[key] + "&";
        }
      }
      queryStr = queryStr.substring(0, queryStr.length - 1);
      location.href =
        protocol +
        location.host +
        location.pathname +
        (queryStr ? "?" + queryStr : "");
    },
    getWxUser(code, cbOk, cbErr) {
      var $this = this;
      $this.$axios.get(
        ajaxBasePath + wechatUser + "?code=" + code,
        null,
        function(res) {
          if (res.data.retureValue == 0) {
            cbOk && cbOk(res.data.retureData);
          } else {
            cbErr && cbErr();
            Toast("获取授权信息失败!");
          }
        },
        function(error) {
          cbErr && cbErr();
          Toast("获取授权信息失败!");
        }
      );
    },
    isWeixin() {
      //判断是否是微信
      var ua = navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },
    connect() {
      let $this = this;
      var lockReconnect = false; //避免重复连接  ajaxBasePath ajax_websocket
      var wsUrl =
        wsProtocol +
        ajaxBasePathWithoutProtocol +
        ajax_websocket +
        "/" +
        ($this.isLiveMedia
          ? $this.curMediaData.liveId
          : $this.curMediaData.videoId);

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
        var msg = JSON.parse(evt.data);
        if (msg.key == 3) {
          console.log("question: " + msg.liveId);
          console.log("question: " + msg.time);
          console.log("question: " + msg.nickName);
          console.log("question: " + msg.content);
          if (msg.content == "") {
            Toast("输入的问题不能为空！");
            return;
          }
          /*for(var i=conTent.length-1;i>=0;i--){
			        		if(conTent[i]==msg.content){
			        		return;
			        		}
			        	}			        	
			        	conTent.push(msg.content);*/
          $this.msglist.push(msg);
        } else if (msg.key == 2) {
          console.log("like msg");
          //let onLineTemp = evt.data.split("||")
          //$this.onlineCount = onLineTemp[0].split(":")[1].trim();
          //$this.likeCount = onLineTemp[1].split(":")[1].trim();
          console.log("online: " + msg.OnlineCount);
          console.log("like: " + msg.LikeCount);

          $this.onlineCount = msg.OnlineCount;
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
        Toast("连接中断，提问失败，请重新提问!");
      };

      $this.ws.onerror = function(evnt) {
        //console.log('websocket服务出错了');
        // reconnect(wsUrl);
      };

      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function() {
        $this.ws.close();
      };

      $this.ws.onopen = function(evt) {
        if ($this.ws) {
          let userid = "";
          if ($this.userInfo && $this.userInfo.id) {
            userid = $this.userInfo.id;
          } else {
            userid = "NNNN" + utils.uuid(28, 16);
          }
          let live_user_info = {
            key: 1,
            ip: returnCitySN.cip,
            ua: navigator.userAgent,
            userId: userid
          };
          let json_user_info = JSON.stringify(live_user_info);
          $this.ws.send(json_user_info);
        }
        // $this.send_user_info();
        console.log("WS连接成功");
      };
    },
    sendMsg() {
      let $this = this;
      $this.likeCount = parseInt($this.likeCount) + 1;
      sendGroupLoveMsg();
      if ($this.ws) {
        let live_user_info = {
          key: 2,
          msg: "点赞"
        };
        let json_user_info = JSON.stringify(live_user_info);
        $this.ws.send(json_user_info);
      }
    },
    callback() {
      console.log("i am back");
    },
    sendQuestionMsg() {
      let $this = this;
      if (!$this.sendqueston) {
        $this.sendqueston = true;
        $this.time = parseInt(new Date().getTime() / 1000);
        console.log($this.time);
      }

      if (!loginInfo.identifier) {
        //未登录
        location.href = loginPath();
        return;
      }
      let liveId = $this.theRequest["liveId"];
      let nickName = loginInfo.identifierNick + "";
      console.log("nickName:" + nickName);
      let date = new Date().getTime();
      let content = document.getElementById("ecm_data").value;
      if ($this.ws) {
        let live_question_info = {
          key: 3,
          liveId: liveId,
          nickName: nickName,
          time: date,
          content: content
        };
        console.log("send: " + live_question_info);
        let json_question_info = JSON.stringify(live_question_info);
        $this.ws.send(json_question_info);
        document.getElementById("ecm_data").value = "";
      }
    },
    //将时间戳转换为时间格式
    getMyDate(str) {
      var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime =
          oYear +
          "-" +
          this.$options.methods.getzf(oMonth) +
          "-" +
          this.$options.methods.getzf(oDay) +
          " " +
          this.$options.methods.getzf(oHour) +
          ":" +
          this.$options.methods.getzf(oMin) +
          ":" +
          this.$options.methods.getzf(oSen); //最后拼接时间
      return oTime;
    },
    //补0操作
    getzf(num) {
      if (parseInt(num) < 10) {
        num = "0" + num;
      }
      return num;
    },

    goBack() {
      this.$router.go(-1);
    },
    getUserInfo(cbOk, cbErr) {
      let $this = this;
      $this.$axios.get(
        apiDetail.ajax_user_info,
        null,
        function(response) {
          if (response.data.retureValue == 0) {
            $this.userInfo = response.data.retureData;
            window.sessionStorage.setItem(
              "userInfo",
              JSON.stringify($this.userInfo)
            );
            Toast('登录成功');
            if (response.data.retureData.headPicId) {
              $this.userProfile = response.data.retureData.headPicId;
            }
            typeof cbOk == "function" && cbOk();
          } else {
            // Toast('登录失败，请重试！');
            typeof cbErr == "function" && cbErr();
            console.log(response.data.retureMsg);
          }
        },
        function(error) {
          // Toast('登录失败，请重试！');
          typeof cbErr == "function" && cbErr();
          console.log(error);
        }
      );
    },

    getLiveData(resolve, reject) {
      let $this = this;
      let strs = null;
      let url = "";
      if (
        typeof $this.theRequest["liveId"] != "undefined" &&
        $this.theRequest["liveId"]
      ) {
        // url = ajax_wechat_live + $this.theRequest["liveId"];
        url = '0.1/wechat/live/' + $this.theRequest["liveId"];
        $this.isLiveMedia = true;
        //getHistoryQuestion($this.theRequest["liveId"]);
        // mediaId = "liveId:"+$this.theRequest["liveId"];
      } else if (
        typeof $this.theRequest["videoId"] != "undefined" &&
        $this.theRequest["videoId"]
      ) {
        url = ajax_wechat_video + $this.theRequest["videoId"];
        $this.isLiveMedia = false;
        // mediaId = "videoId:"+$this.theRequest["videoId"];
      }
      // if($this.theRequest["jsessionid"]){
      // 	url = url+";jsessionid="+$this.theRequest.jsessionid;
      // }
      $this.$axios.get(
        live + "/" + url,
        null,
        function(response) {
          if (response.data.retureValue == 0) {
            $this.curMediaData = response.data.retureData;
            $this.liveStatus = response.data.retureData.liveStatus;
            $this.theRequest["type"] = response.data.retureData.type;
            $this.onlineCount = response.data.retureData.onLineNum;
            $this.likeCount = response.data.retureData.likeCount;
            resolve("media-success");
            console.log("media-success");
            //$this.time=new Date().getTime();
            // if($this.isLiveMedia){
            // 	$this.$refs.listTemp.initComponent($this.theRequest);
            // }
          } else if (response.data.retureValue == 2400) {
            resolve("media-fail");
            console.log("media-fail");
            Toast("没有观看权限！请登录或切换用户");
            // location.href=loginPath();
          } else {
            resolve("media-fail");
            console.log("media-fail");
            Toast("服务器开小差了！");
            console.log(response.data.retureMsg);
          }
        },
        function(error) {
          resolve("media-fail");
          console.log("media-fail");
          Toast("服务器开小差了！");
          console.log(error);
        }
      );
    },
    getHistoryQuestion() {
      let $this = this;
      if (!$this.sendqueston) {
        $this.time = new Date().getTime();
      }
      console.log($this.time);
      let url = "";
      let url2 = "";
      url =
        ajax_history_question +
        "?liveId=" +
        $this.theRequest["liveId"] +
        "&page=" +
        $this.page +
        "&size=" +
        10 +
        "&time=" +
        $this.time;
      console.log($this.page);
      $this.$axios.get(
        url,
        null,
        function(response) {
          console.log(response);
          console.log(response.data.retureData.list.length);
          if (response.data.retureValue == 0) {
            for (var i = 0; i < response.data.retureData.list.length; i++) {
              $this.msglist.unshift(response.data.retureData.list[i]);
              console.log(response.data.retureData.list[i]);
            }
            $this.page++;
            if ($this.page > response.data.retureData.totalPage) {
              Toast("问题全部加载！");
              $this.visible = false;
            }
          } else {
            console.log(response.data.retureMsg);
          }
        },
        function(error) {
          mint_ui_lib_toast__WEBPACK_IMPORTED_MODULE_1___default()(
            "服务器开小差了！"
          );
          console.log(error);
        }
      );
    },
    onShare() {},
    showPopup() {
      let $this = this;
      $this.popupVisible = true;
    },
    redirectLogin() {
      location.href = this.$chat.loginPath();
    },
    loginOut() {
      let $this = this;
      let url = apiDetail.ajax_user_logout; //+";jsessionid="+$this.theRequest.jsessionid;
      $this.$axios.get(
        url,
        null,
        function(res) {
          if (res.data.retureValue == 0) {
            // $this.theRequest["jsessionid"]=null;
            window.sessionStorage.removeItem("userInfo");
            Toast("退出成功!");
            location.reload();
          } else {
            Toast("退出失败!");
          }
          $this.popupVisible = false;
        },
        function(error) {
          Toast("服务器开小差了！");
          console.log(error);
          $this.popupVisible = false;
        }
      );
    },

    refreshUrl() {
      //强制刷新到不带二次分享参数页面
      var $this = this;
      var baseUrl = location.origin + location.pathname;
      var params = utils.fnParseQueryStrings(location.search);
      // alert("params:"+JSON.stringify(params))
      console.log("params:" + JSON.stringify(params));
      var lenOrg = Object.keys(params).length;
      var delParams = ["from", "isappinstalled", "code", "state"];
      for (var i = delParams.length - 1; i >= 0; i--) {
        params = utils.delMap(params, delParams[i]);
      }
      // alert("params-final:"+JSON.stringify(params))
      console.log("params-final:" + JSON.stringify(params));
      var lenResult = Object.keys(params).length;
      if (lenResult < lenOrg) {
        var queryStr = utils.concatArr2QueryString(params);
        var url = baseUrl + (lenResult > 0 ? "?" + queryStr : "");
        // alert("final:"+url)
        console.log("final:" + url);
        location.href = url;
      }
    },

    wxAuth() {
      var $this = this;
      // 多参条件下redirect_uri要urlencode编码
      window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
        const_wxAppId +
        "&redirect_uri=" +
        encodeURIComponent(location.href) +
        "&response_type=code&state=no&scope=snsapi_userinfo#wechat_redirect";
    },

    shareRecord(shareType) {
      var $this = this;
      console.log("share:u:" + $this.userInfo);
      console.log("share:l:" + $this.curMediaData);
      $this.$axios.post(
        ajaxBasePath + wechatShareRecord,
        {
          userId: $this.userInfo
            ? $this.userInfo.id
            : "NNNN" + utils.uuid(28, 16),
          liveOrVideoId: $this.isLiveMedia
            ? $this.curMediaData.liveId
            : $this.curMediaData.videoId,
          shareType: shareType,
          type: $this.isLiveMedia ? 0 : 1
        },
        function(res) {
          if (res.data.retureValue == 0) {
            console.log("记录分享成功");
          } else {
            console.log("记录分享失败" + res.data.retureMsg);
          }
        },
        function(error) {
          console.log("记录分享失败");
        }
      );
    },

    Share2Timeline() {
      var $this = this;
      // var from = $this.theRequest["from"]||"";
      // var ftype = $this.theRequest["ftype"]||"";
      $this.shareRecord(1);
      console.log("分享到朋友圈,提交分享信息");
    },

    Share2App() {
      var $this = this;
      // var from = $this.theRequest["from"]||"";
      // var ftype = $this.theRequest["ftype"]||"";
      $this.shareRecord(0);
      console.log("分享到App,提交分享信息");
    },

    readedShare() {
      var $this = this;
      var clickUserId = $this.userInfo
        ? $this.userInfo.id
        : "NNNN" + $this.uuid(28, 16);
      var from = $this.theRequest["fuser"] || clickUserId;
      var ftype = $this.theRequest["ftype"] || 3;
      $this.$axios.post(
        ajaxBasePath + wechatShareReaded,
        {
          fromUserId: from,
          clickUserId: clickUserId,
          liveOrVideoId: $this.isLiveMedia
            ? $this.curMediaData.liveId
            : $this.curMediaData.videoId,
          shareType: ftype,
          type: $this.isLiveMedia ? 0 : 1
        },
        function(res) {
          if (res.data.retureValue == 0) {
            console.log("记录分享成功");
          } else {
            console.log("记录分享失败" + res.data.retureMsg);
          }
        },
        function(error) {
          console.log("记录分享失败");
        }
      );
    },

    wxConfig() {
      var $this = this;
      // console.log("1"+location.href)
      // alert("config:"+location.href)
      console.log("config:" + location.href);
      // 多参条件下redirect_uri要urlencode编码
      $this.$axios.get(
        ajaxBasePath +
          wechatShareConfig +
          "?url=" +
          encodeURIComponent(location.href),
        null,
        function(res) {
          if (res.data.retureValue == 0) {
            wx.config({
              debug: false, ////生产环境需要关闭debug模式
              appId: res.data.retureData.appid, //appId通过微信服务号后台查看
              timestamp: res.data.retureData.timestamp, //生成签名的时间戳
              nonceStr: res.data.retureData.nonceStr, //生成签名的随机字符串
              signature: res.data.retureData.signature, //签名
              jsApiList: [
                //需要调用的JS接口列表
                "onMenuShareTimeline", //分享到朋友圈
                "onMenuShareAppMessage", //分享给好友
                "onMenuShareQQ"
              ]
            });
            wx.ready(function() {
              //分享朋友圈
              // alert("share:"+location.href)
              console.log("share:" + location.href);
              wx.onMenuShareTimeline({
                title:
                  "青葱直播| " +
                  ($this.curMediaData
                    ? $this.curMediaData.liveName
                      ? $this.curMediaData.liveName
                      : $this.curMediaData.videoName
                    : ""),
                link:
                  location.origin +
                  location.pathname +
                  "?" +
                  utils.replaceParams(location.search, {
                    fuser: $this.userInfo.id,
                    ftype: 1
                  }),
                imgUrl: $this.curMediaData.coverPictureUrl, //自定义图标location.href.substring(0,location.href.indexOf('&from='))
                trigger: function(res) {},
                success: function(res) {
                  // alert("success:"+location.href)
                  $this.Share2Timeline();
                },
                cancel: function(res) {},
                fail: function(res) {}
              });
              //分享给好友
              wx.onMenuShareAppMessage({
                title:
                  "青葱直播| " +
                  ($this.curMediaData
                    ? $this.curMediaData.liveName
                      ? $this.curMediaData.liveName
                      : $this.curMediaData.videoName
                    : ""), // 分享标题
                desc:
                  "【" +
                  $this.$options.filters.formatDate(
                    $this.curMediaData.startTime
                  ) +
                  "】" +
                  ($this.curMediaData
                    ? $this.curMediaData.introduction
                      ? $this.curMediaData.introduction
                      : "暂无简介"
                    : ""), // 分享描述
                // link: protocol+location.host+location.pathname+"?fuser="+$this.userInfo.id+"&ftype=0", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                link:
                  location.origin +
                  location.pathname +
                  "?" +
                  utils.replaceParams(location.search, {
                    fuser: $this.userInfo.id,
                    ftype: 0
                  }),
                imgUrl: $this.curMediaData.coverPictureUrl, // 自定义图标
                type: "link", // 分享类型,music、video或link，不填默认为link
                dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
                success: function(res) {
                  // alert("success:"+location.href)
                  $this.Share2App();
                },
                fail: function(res) {
                  //alert(JSON.stringify(res));
                  // alert("分享失败");
                  // console.log(res)
                },
                cancel: function(res) {
                  // 用户取消分享后执行的回调函数
                  // alert("分享取消");
                  // console.log(res)
                }
              });
              wx.onMenuShareQQ({
                title:
                  "青葱直播| " +
                  ($this.curMediaData
                    ? $this.curMediaData.liveName
                      ? $this.curMediaData.liveName
                      : $this.curMediaData.videoName
                    : ""), // 分享标题
                desc:
                  "【" +
                  $this.$options.filters.formatDate(
                    $this.curMediaData.startTime
                  ) +
                  "】" +
                  ($this.curMediaData
                    ? $this.curMediaData.introduction
                      ? $this.curMediaData.introduction
                      : "暂无简介"
                    : ""), // 分享描述
                link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: $this.curMediaData.coverPictureUrl, // 自定义图标
                success: function(res) {
                  // 用户确认分享后执行的回调函数
                  // alert("分享成功");
                  // console.log(res)
                },
                cancel: function(res) {
                  // 用户取消分享后执行的回调函数
                  // alert("分享取消");
                  // console.log(res)
                }
              });
              wx.error(function(res) {
                // console.log("congif:"+res.errMsg);
              });
            });
          }
        },
        function(error) {
          Toast("服务器开小差了！");
        }
      );
    },
    initPlay(data) {
      let $this = this;
      let $format = data.fileFormat == "hls" ? "m3u8" : data.fileFormat;
      let $config = {
        autoplay: true, //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
        coverpic: { style: "stretch", src: $this.curMediaData.coverPictureUrl },
        controls: "system",
        width: "100%", //视频的显示宽度，请尽量使用视频分辨率宽度
        height: "100%", //视频的显示高度，请尽量使用视频分辨率高度
        wording: {
          2032: "请求视频失败，请检查网络",
          2048: "请求m3u8文件失败，可能是网络错误或者跨域问题"
        },
        flash: true,
        h5_flv: true,
        listener: function(msg) {
          switch (msg.type) {
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
      };
      if ($this.isLiveMedia) {
        $config["m3u8"] = data.hlsPlayUrl;
        $config["flv"] = data.flvPlayUrl;
        // if(typeof data.hlsPlayUrl != "undefined"){
        // 	$config["m3u8"]=data.hlsPlayUrl;
        // }
        // if(typeof data.flvPlayUrl != "undefined"){
        // 	$config["flv"]=data.flvPlayUrl;
        // }
      } else {
        $config[$format] = data.playUrl;
        // if(typeof data.playUrl != "undefined"){
        // 	$config[$format]=data.playUrl
        // }
      }
      // console.log(this.$refs.idvideo)
      $this.player = new TcPlayer("idvideo", $config);
      window.tcplayer = $this.player;
    }
  },
  computed: {},
  watch: {
    selected: function() {
      let $this = this;
      if ($this.isLiveMedia) {
        $this.$refs.listTemp.initComponent($this.theRequest);
      }
    },
    curMediaData: function() {
      if (this.curMediaData.groupId) {
        this.avChatRoomId = this.curMediaData.groupId;
        // if(avChatRoomId){
        // 	let $this = this;
        // 	this.getUserInfo(function(){
        // 		// loginInfo.identifier = identifier = $this.userInfo.id;
        // 		loginInfo.identifier = identifier = $this.userInfo.nickName? $this.userInfo.nickName : '未知用户';
        // 		loginInfo.identifierNick = identifierNick = $this.userInfo.nickName? $this.userInfo.nickName : '未知用户';
        // 		loginInfo.userSig = userSig = tlsGetUserSig().userSig;
        // 		// sdkLogin();
        // 	})
        // }else{

        // }
      }
      this.initPlay(this.curMediaData);
      if (
        typeof this.curMediaData.playUrl != "undefined" &&
        this.curMediaData.playUrl &&
        this.liveStatus != 0
      ) {
        try {
          this.initPlay(this.curMediaData);
        } catch (err) {
          console.log(err);
        } finally {
          this.connect();
        }
      }
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(parseInt(time));
      return formatDate(date, "MM月dd hh:mm");
    }
  }
};
</script>

<style>
@-webkit-keyframes marquee {
  30% {
    left: 0;
  }
  100% {
    left: -100%;
  }
}
@-moz-keyframes marquee {
  30% {
    left: 0;
  }
  100% {
    left: -100%;
  }
}
@-ms-keyframes marquee {
  30% {
    left: 0;
  }
  100% {
    left: -100%;
  }
}
@-o-keyframes marquee {
  30% {
    left: 0;
  }
  100% {
    left: -100%;
  }
}
@keyframes marquee {
  30% {
    left: 0;
  }
  100% {
    left: -100%;
  }
}
.body {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: nowrap;
}
.body > * {
  flex-shrink: 0;
}
/* .video-sms-list {
  color: black;
} */

.video-sms-list {
  color: #fff;
  padding: 15px;
  overflow: scroll;
  flex: 1;
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

.mint-header {
  height: 40px;
  width: 100%;
}
.mint-navbar {
  /*height: 12%;*/
}
.mint-tab-item-label {
  font-size: 14px;
}
.mint-tab-container {
}
.mint-tab-container-wrap {
  height: 100%;
}
.tab-container {
  padding: 15px;
}
.a-btn{
  display: block;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  color: #26a2ff;
  text-decoration: none;
}

.video-pane-body {
    z-index: 1000;
    height: 100%;
    position: relative;
}

.video-discuss {
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  position: relative;
}

.video-discuss-pane{
  /*position: fixed;
  bottom: 0px;*/
  width: 100%;
}

.video-discuss-form {
  height: 30px;
  background: url(/static/images/chat/form-back.png);
  padding: 8px 60px 10px 8px;
  position: relative
}

.video-discuss-input {
  width: 100%;
  height: 30px;
  vertical-align: top;
  padding: 0 13% 0 2%;
  border-radius: 2px
}

.video-discuss-button {
  background-color: #dc4b53;
  height: 30px;
  color: #fff;
  width: 45px;
  position: absolute;
  right: 10px;
  font-size: 14px;
  top: 8px;
  border-radius: 2px
}

.video-sms-list {
    color: #fff;
    padding: 15px;
    overflow: scroll;
    flex: 1;
}

.video-sms-list li {
    margin-bottom: 5px
}

.video-sms-list li:nth-child(1) {
    opacity: .4
}

.video-sms-list li:nth-child(2) {
    opacity: .6
}

.video-sms-list li:nth-child(3) {
    opacity: .8
}

.video-sms-pane {
    display: inline-block;
}

.video-sms-text {
    padding: 2px 10px;
    font-size: 14px;
    /*background-color: #fff;*/
    border-radius: 10px;
    text-align: left;
    line-height: 18px;
    color: #000;
    word-wrap: break-word
}

.video-sms-text span {
    padding-right: 10px;
    vertical-align: top;
    color: #000
}

.video-sms-text span.user-name-green {
    color: #1fbcb6
}

.video-sms-text span.user-name-red {
    color: #f12b5b
}

.video-sms-text span.user-name-blue {
    color: #2b84f1
}

.video-sms-text span.user-name-org {
    color: #ff7906
}

.video-pane-like {
  position: absolute;
  bottom: 70px;
  right: 20px;
  width: 70px;
  height: 70px;
  padding: 0;
  background: url("../../assets/images/chat/like.png") no-repeat;
}

.video-pane-liked {
  position: absolute;
  bottom: 70px;
  right: 20px;
  width: 70px;
  height: 70px;
  padding: 0;
  background: url("../../assets/images/chat/like_hover.png") no-repeat;
}

@import "/static/css/chat.css";
</style>