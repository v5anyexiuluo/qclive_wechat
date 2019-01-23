<template>
  <!-- Component template requires a root element, rather than just text. -->
  <div class="body">
    <mt-header title="青葱校园直播">
      <router-link to="/" slot="left">
        <mt-button icon="back" @click="goBack"></mt-button>
      </router-link>
      <a href="javascript:;" v-if="(userInfo==null)" slot="right" @click="showLoginPopup">登录</a>
      <img :src="userInfo&&userInfo.headPicId? userInfo.headPicId:userProfile" style="height:30px;width:30px;cursor: pointer;" v-else slot="right" @click="showPopup" />
    </mt-header>
      <mt-popup v-model="popupVisible" position="bottom" popup-transition="popup-fade" style="width:100%;">
        <a href="javascript:;" @click="loginOut" style="display:block;height:60px;line-height:60px;width:100%;text-align:center; color:gray;font-size:16px;">退出</a>
      </mt-popup>
      <mt-popup v-model="loginPopupVisible" position="bottom" popup-transition="popup-fade" style="width:100%;">
        <a href="javascript:;" @click="wxAuth" style="display:block;height:60px;line-height:60px;width:100%;text-align:center; color:gray;font-size:16px;">微信授权</a>
        <a href="javascript:;" @click="redirectLogin" style="display:block;height:60px;line-height:60px;width:100%;text-align:center; color:gray;font-size:16px;">其他账号</a>
      </mt-popup>
      <!-- <div id="id-video" style="width:100%; height:0; padding-bottom:60%;"></div> -->
      <div v-show="liveStatus==1||isLiveMedia==false" style="position: relative; background-color:black;">
        <div id="idvideo" ref="idvideo" style="width:100%; height:220px;">
        </div>
      </div>
      <div v-show="liveStatus!=1&&isLiveMedia==true" style="position: relative; height:240px;background-size: cover;font-size: 20px;" :style="{background:'url('+(curMediaData&&curMediaData.coverPictureUrl? curMediaData.coverPictureUrl:'')+') 0% 0% / cover no-repeat'}">
        <div v-if="liveStatus==0||(liveStatus==2&&start==false)" style="height: 30px; position: absolute; right: 0px; top: 10px; padding-right: 20px; padding-left: 20px; color: white; display: flex; flex-flow: column nowrap; justify-content: center; align-items: center; background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 30%);">
          <span v-if="curMediaData">{{curMediaData.startTime | formatDate}} 敬请期待...</span>
          <span v-else>敬请期待...</span>
        </div>
        <div v-if="liveStatus==2&&start==true" style="height: 30px; position: absolute; right: 0px; top: 10px; padding-right: 20px; padding-left: 20px; color: white; display: flex; flex-flow: column nowrap; justify-content: center; align-items: center; background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 30%);">
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
          <mt-tab-item id="4">现场提问</mt-tab-item>
        </mt-navbar>
        <!-- tab-container -->
        <mt-tab-container v-model="selected" style="width:100%;position: absolute;left: 0px;top: 48px;bottom: 0px;overflow-y: auto;">
          <mt-tab-container-item id="1">
            <div class="tab-container" style="text-indent: 2em;line-height: 24px;height:110%;">
              {{curMediaData? (curMediaData.introduction? curMediaData.introduction:"暂无简介"):""}}
            </div>
            <div style="width:100%;height:30px;position: fixed;bottom: 0;font-size:14px;text-align:center;background-color:rgb(249, 249, 249);">直播服务咨询请加QQ群：921169149</div>
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
                  <div @click="sendLike"
                  ></div>
                </form>
              </div>
            </div>
          </mt-tab-container-item>
          <mt-tab-container-item v-if="isLiveMedia" id="3">
            <list-template ref="listTemp">
            </list-template>
          </mt-tab-container-item>
          <mt-tab-container-item id="4">
            <div style="height: 100%; display: flex; flex-wrap: nowrap; flex-direction: column; justify-content: flex-start;">
              <a @click="getHistoryQuestion" style="color: rgb(38, 162, 255);text-align: center;display: block;height: 30px;line-height: 30px;font-size: 16px;" id="loadmore" v-if="questonVisible">点击查看历史问题</a>
              <ul class="video-sms-list flex-full" id="question">
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
                    <input type="text" id="ecm_data" placeholder="请输入问题" maxlength="50" style="padding: 0px 6px;height:33px;flex:1;margin-left: 10px;">
                    <button type="button" style="background-color:#e7505a;color:white;width:60px;height:33px;font-size:14px;margin: 0px 10px;" @click="sendQuestionMsg">提交</button>
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
var TcPlayer = require("@/assets/js/TcPlayer-module-2.2.2.js").TcPlayer.TcPlayer
// import TcPlayer from "../assets/js/TcPlayer-module-2.2.2.js"
import listTemplate from "@/components/commons/listTemplate.vue"
import { Toast } from "mint-ui"
import { formatDate } from '@/assets/js/date'
import utils from '@/assets/js/utils'
import ReconnectingWebSocket from 'reconnecting-websocket';
import { apiAuth, apiWx, apiWs, apiHome, apiList, apiDetail, apiQuestion } from '@/properties/api.js'
import Chat from '@/assets/js/chat.js'
export default {
  data() {
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
      onlineCount: 0,
      likeCount: 0,
      // 退出弹窗
      popupVisible: false,
      // 登录弹窗
      loginPopupVisible: false,
      // 群聊
      loginInfo: null,
      $chat: null,
      messages: [],
      message: "",
      isChatLogin: false,
      listeners: {
        onBigGroupMsgNotify: this.onBigGroupMsgNotify,
        onLogin: this.onLogin
      },
      // 提问
      msglist: [],
      page: 1,
      questonVisible: true,
      time: null,
      sendqueston: false,
      starttime: null,
      start: false,
      hidebtn: true
    }
  },
  components: {
    listTemplate: listTemplate
  },
  created: function() {
    var $this = this;
    $this.$chat = new Chat();
    var promiseUser = new Promise((resolve, reject) => {
      $this.initApp(resolve, reject);
    })
    var promiseMedia = new Promise((resolve, reject) => {
      $this.getLiveData(resolve, reject);
    })
    Promise.all([promiseUser, promiseMedia]).then((result) => {
      if (result[0] == 'user-success') {
        $this.imInit();
      }
      if (result[1] == 'media-success') {
        console.log("read:u:" + $this.userInfo)
        console.log("read:l:" + $this.curMediaData)
        $this.readedShare();
        // if($this.isWeixin()&&result[0]=='user-success'){
        if ($this.isWeixin()) {
          console.log("share:u:" + $this.userInfo)
          console.log("share:l:" + $this.curMediaData)
          $this.wxConfig();
        }
      }
    })
    // $this.showLoginPopup($this.showLoginPopup)
  },
  mounted: function() {

  },
  methods: {
    initApp(resolve, reject) {
      var $this = this;
      var theRequestTemp = new Array();
      var url = location.search;
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
          theRequestTemp[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
      }
      $this.theRequest = theRequestTemp;
      if ($this.isWeixin()) {
        // if(typeof($this.theRequest["code"]!="undefined")&&$this.theRequest["code"]){
        //  $this.getWxUser($this.theRequest["code"], function(data){
        //    $this.userInfo = data;
        //    window.sessionStorage.setItem("userInfo", JSON.stringify($this.userInfo));
        //    $this.clearQueryParams();
        //  }, function(){
        //    $this.clearQueryParams();
        //  });
        // }else{
        //  $this.userInfo = window.sessionStorage.getItem("userInfo")? JSON.parse(window.sessionStorage.getItem("userInfo")):null;
        //  if(!$this.userInfo || $this.userInfo.registerType!=2){
        //    $this.wxAuth();
        //    return;
        //        }else{
        //          $this.imInit();
        //          console.log("user-success");
        //          resolve("user-success");
        //        }
        // }
        $this.userInfo = window.sessionStorage.getItem("userInfo") ? JSON.parse(window.sessionStorage.getItem("userInfo")) : null;
        var isLogout = sessionStorage.getItem("isWxLogout");
        if (isLogout) {
          sessionStorage.removeItem("isWxLogout");
          resolve("user-fail");
          return;
        }
        if (!$this.userInfo || $this.userInfo.registerType != 2) {
          if (typeof($this.theRequest["code"] != "undefined") && $this.theRequest["code"]) {
            debugger
            $this.getWxUser($this.theRequest["code"], function(data) {
              debugger
              $this.userInfo = data;
              console.log("------wx:" + JSON.stringify($this.userInfo))
              window.sessionStorage.setItem("userInfo", JSON.stringify($this.userInfo));
              // alert("comein")
              console.log("comein")
              // 二次分享去除from等无效参数
              // $this.refreshUrl();
              console.log("user-success");
              resolve("user-success");
            }, function() {
              debugger
              // $this.wxAuth();
              console.log("获取授权信息失败!")
            });
          } else {
            $this.wxAuth();
          }
        } else {
          console.log("user-success");
          resolve("user-success");
        }
      } else {
        $this.userInfo = window.sessionStorage.getItem("userInfo") ? JSON.parse(window.sessionStorage.getItem("userInfo")) : null;
        if (!$this.userInfo) {
          $this.getUserInfo(function() {
            resolve("user-success");
            console.log("user-success");
          }, function() {
            resolve("user-fail");
            console.log("user-fail");
          })
        } else {
          resolve("user-success");
        }
        // if(typeof($this.theRequest["jsessionid"])!="undefined"&&$this.theRequest["jsessionid"]!="undefined"&&$this.theRequest["jsessionid"]!="null"&&$this.theRequest["jsessionid"]){
        //  $this.clearQueryParams();
        // }
      }
    },
    sendMessage() {
      var $this = this;
      if (!this.loginInfo || !this.loginInfo.identifier) {
        location.href = apiAuth.login();
        return
      }
      // if (this.$chat.getLoginStatus() == false) {
      if (this.isChatLogin == false) {
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
      var $this = this;
      if (!this.loginInfo || !this.loginInfo.identifier) {
        location.href = apiAuth.login();
        return
      }
      if (this.like == 1) {
        return;
      }
      if (this.isChatLogin == false) {
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
      this.isChatLogin = true;
      this.$chat.applyJoinBigGroup(this.curMediaData.groupId, cbOk, cbErr);
    },
    onLogout (cbOk, cbErr) {
      var $this = this;
      this.isChatLogin = false;
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
      var maxDisplayMsgCount = 30;
      if (this.messages.length == maxDisplayMsgCount) {
        this.messages.shift();
      }
      var fromAccountNick = msg.getFromAccountNick();
      var html = this.$chat.converMsgtoText(msg);
      this.messages.push({
        nick: fromAccountNick,
        content: html
      });
      console.log(this.messages);
    },
    tlsGetUserSig(identifier) {
      var $this = this;
      $this.$axios.get(
        apiAuth.userSig + identifier,
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
    imInit() {
      var $this = this;
      $this.loginInfo.identifier = $this.userInfo.nickName
        ? $this.userInfo.nickName
        : "未知用户";
      $this.loginInfo.identifierNick = $this.userInfo.nickName
        ? $this.userInfo.nickName
        : "未知用户";
      // $this.loginInfo.userSig = userSig = tlsGetUserSig().userSig;
      $this.tlsGetUserSig($this.loginInfo.identifier);
      console.log("im:" + JSON.stringify($this.loginInfo));
    },
    clearQueryParams() {
      var $this = this;
      var queryStr = "";
      for (var key in $this.theRequest) {
        if (key != "jsessionid" && key != "code") {
          queryStr += (key + "=" + this.theRequest[key] + "&")
        }
      }
      queryStr = queryStr.substring(0, queryStr.length - 1)
      location.href = protocol + location.host + location.pathname + (queryStr ? "?" + queryStr : "");
    },
    getWxUser(code, cbOk, cbErr) {
      var $this = this;
      $this.$axios.get(
        apiWx.wechatUser + '?code=' + code,
        null,
        function(res) {
          if (res.data.retureValue == 0) {
            cbOk && cbOk(res.data.retureData);
          } else {
            cbErr && cbErr()
            Toast("获取授权信息失败!")
          }
        }, function(error) {
          cbErr && cbErr()
          Toast("获取授权信息失败!")
        }
      )
    },
    isWeixin() { //判断是否是微信
      var ua = navigator.userAgent.toLowerCase();
      return ua.match(/MicroMessenger/i) == "micromessenger";
    },
    connect() {
      var $this = this;

      var lockReconnect = false; //避免重复连接  ajaxBasePath ajax_websocket
      var wsUrl = apiWs + "/" + ($this.isLiveMedia ? $this.curMediaData.liveId : $this.curMediaData.videoId);

      function createWebSocket(url) {
        //         if ('WebSocket' in window){
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
        //console.log(evt.data);
        var msg = JSON.parse(evt.data);
        console.log(msg);
        if (msg.key == 3) {
          console.log('question: ' + msg.liveId);
          console.log('question: ' + msg.time);
          console.log('question: ' + msg.nickName);
          console.log('question: ' + msg.content);
          $this.msglist.push(msg);
        } else if (msg.key == 2) {
          console.log('like msg');
          //var onLineTemp = evt.data.split("||")
          //$this.onlineCount = onLineTemp[0].split(":")[1].trim();
          //$this.likeCount = onLineTemp[1].split(":")[1].trim();
          console.log('online: ' + msg.OnlineCount);
          console.log('like: ' + msg.LikeCount);

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
        console.log("WS连接中断");
        // $this.ws.close();
        // reconnect(wsUrl);
        //Toast("连接中断，提问失败，请重新提问!")
      };

      $this.ws.onerror = function(evnt) {
        console.log('websocket服务出错了');
        // reconnect(wsUrl);  
      };

      //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = function() {
        $this.ws.close();
      }
      $this.ws.onopen = function(evt) {
        if ($this.ws) {

          var userid = "";
          if ($this.userInfo && $this.userInfo.id) {
            userid = $this.userInfo.id;
          } else {
            userid = "NNNN" + utils.uuid(28, 16);
          }
          var live_user_info = {
            "key": 1,
            "ip": returnCitySN.cip,
            "ua": navigator.userAgent,
            "userId": userid
          }
          var json_user_info = JSON.stringify(live_user_info);
          $this.ws.send(json_user_info);
        }
        // $this.send_user_info();
        console.log("WS连接成功");
      };
    },
    sendQuestionMsg() {
      var $this = this;
      if (!$this.sendqueston) {
        $this.sendqueston = true;
        $this.time = parseInt((new Date().getTime()) / 1000);
        console.log($this.time);
      }

      if (!this.loginInfo || !$this.loginInfo.identifier) { //未登录      
        location.href = apiAuth.login();
        return;
      }
      var liveId = $this.theRequest["liveId"];
      var nickName = $this.loginInfo.identifierNick + '';
      console.log('nickName:' + nickName);
      var date = new Date().getTime();
      var content = document.getElementById("ecm_data").value;
      if (content == "") {
        Toast('输入的问题不能为空！');
        return;
      }
      if (!$this.ws) {
        $this.connect();
      }
      console.log($this.ws);
      if ($this.ws) {
        var live_question_info = {
          "key": 3,
          "liveId": liveId,
          "nickName": nickName,
          "time": date,
          "content": content
        }
        console.log('send: ' + live_question_info);
        var json_question_info = JSON.stringify(live_question_info);
        $this.ws.send(json_question_info);
        document.getElementById("ecm_data").value = "";
      }
    },
    //将时间戳转换为时间格式  原文娟替换为过滤器
    getMyDate(str) {
      var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + this.$options.methods.getzf(oMonth) + '-' + this.$options.methods.getzf(oDay) + ' ' + this.$options.methods.getzf(oHour) + ':' + this.$options.methods.getzf(oMin) + ':' + this.$options.methods.getzf(oSen); //最后拼接时间  
      return oTime;
    },
    //补0操作
    getzf(num) {
      if (parseInt(num) < 10) {
        num = '0' + num;
      }
      return num;
    },

    goBack() {
      this.$router.go(-1)
    },
    getUserInfo(cbOk, cbErr) {
      var $this = this;
      $this.$axios.get(
        apiAuth.userInfo,
        null,
        function(response) {
          if (response.data.retureValue == 0) {
            $this.userInfo = response.data.retureData;
            window.sessionStorage.setItem("userInfo", JSON.stringify($this.userInfo));
            if (response.data.retureData.headPicId) {
              $this.userProfile = headPicId;
            }
            console.log($this.userInfo)
            typeof(cbOk) == "function" && cbOk()
          } else {
            // Toast('登录失败，请重试！');
            typeof(cbErr) == "function" && cbErr()
            console.log(response.data.retureMsg);
          }
        }, function(error) {
          // Toast('登录失败，请重试！');
          typeof(cbErr) == "function" && cbErr()
          console.log(error);
        }
      )
    },
    getLiveData(resolve, reject) {
      var $this = this;
      var strs = null;
      var url = "";
      if (typeof($this.theRequest["liveId"]) != "undefined" && $this.theRequest["liveId"]) {
        url = apiDetail.live + $this.theRequest["liveId"];
        $this.isLiveMedia = true;
        //getHistoryQuestion($this.theRequest["liveId"]);
        // mediaId = "liveId:"+$this.theRequest["liveId"];
      } else if (typeof($this.theRequest["videoId"]) != "undefined" && $this.theRequest["videoId"]) {
        url = apiDetail.video + $this.theRequest["videoId"];
        $this.isLiveMedia = false;
        // mediaId = "videoId:"+$this.theRequest["videoId"];
      }
      // if($this.theRequest["jsessionid"]){
      //  url = url+";jsessionid="+$this.theRequest.jsessionid;
      // }
      $this.$axios.get(
        url,
        null,
        function(response) {
          if (response.data.retureValue == 0) {
            $this.curMediaData = response.data.retureData;
            console.log($this.curMediaData);
            $this.liveStatus = response.data.retureData.liveStatus;
            $this.theRequest["type"] = response.data.retureData.type;
            $this.onlineCount = response.data.retureData.onLineNum;
            $this.likeCount = response.data.retureData.likeCount;
            $this.starttime = response.data.retureData.startTime;
            console.log($this.starttime);
            var timestamp = Date.parse(new Date());
            console.log(timestamp);
            if (timestamp >= $this.starttime) {
              $this.start = true;
            }
            resolve("media-success")
            console.log("media-success");
            //$this.time=new Date().getTime();
            // if($this.isLiveMedia){
            //  $this.$refs.listTemp.initComponent($this.theRequest);
            // }
          } else if (response.data.retureValue == 2400) {
            resolve("media-fail")
            console.log("media-fail");
            Toast('没有观看权限！请登录或切换用户');
            // location.href=loginPath();
          } else {
            resolve("media-fail")
            console.log("media-fail");
            Toast('服务器开小差了！');
            console.log(response.data.retureMsg);
          }
        }, function(error) {
          resolve("media-fail")
          console.log("media-fail");
          Toast('服务器开小差了！');
          console.log(error);
        }
      )
    },
    getHistoryQuestion() {
      var $this = this;
      if (!$this.sendqueston) {
        $this.time = new Date().getTime();
      }
      console.log($this.time);
      var url = "";
      var url2 = "";
      url = apiQuestion.historyQuestion + "?liveId=" + $this.theRequest["liveId"] + "&page=" + $this.page + "&size=" + 10 + "&time=" + $this.time;
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
              Toast('问题全部加载！');
              $this.questonVisible = false;
            }
          } else {
            console.log(response.data.retureMsg);
          }
        }, function(error) {
          Toast()('服务器开小差了！');
          console.log(error);
        }
      )
    },
    onShare() {

    },
    showPopup() {
      var $this = this;
      $this.popupVisible = true;
    },
    showLoginPopup() {
      var $this = this;
      if ($this.isWeixin()) {
        $this.loginPopupVisible = true;
      } else {
        $this.redirectLogin();
      }
    },
    redirectLogin() {
      location.href = apiAuth.login();
    },
    loginOut() {
      var $this = this;
      if (!window.sessionStorage.getItem("userInfo")) {
        Toast("退出成功!");
        location.reload();
        return;
      }
      if ($this.isWeixin()) {
        sessionStorage.setItem("isWxLogout", true);
        window.sessionStorage.removeItem("userInfo");
        location.href = $this.refreshUrl();
      } else {
        var url = apiAuth.logout; //+";jsessionid="+$this.theRequest.jsessionid;
        $this.$axios.get(
          url,
          null,
          function(res) {
            if (res.data.retureValue == 0) {
              // $this.theRequest["jsessionid"]=null;
              window.sessionStorage.removeItem("userInfo")
              Toast("退出成功!");
              location.reload();
            } else {
              Toast("退出失败!")
            }
            $this.popupVisible = false;
          }, function(error) {
            Toast('服务器开小差了！');
            console.log(error);
            $this.popupVisible = false;
          }
        )
      }
    },

    refreshUrl() { //强制刷新到不带二次分享参数页面
      var $this = this;
      var baseUrl = location.origin + location.pathname;
      var params = utils.fnParseQueryStrings(location.search);
      // alert("params:"+JSON.stringify(params))
      console.log("params:" + JSON.stringify(params))
      var lenOrg = Object.keys(params).length
      var delParams = ["from", "isappinstalled", "code", "state"];
      for (var i = delParams.length - 1; i >= 0; i--) {
        params = utils.delMap(params, delParams[i])
      }
      // alert("params-final:"+JSON.stringify(params))
      console.log("params-final:" + JSON.stringify(params))
      var lenResult = Object.keys(params).length;
      if (lenResult < lenOrg) {
        var queryStr = utils.concatArr2QueryString(params);
        var url = baseUrl + (lenResult > 0 ? ("?" + queryStr) : "")
        // alert("final:"+url)
        console.log("final:" + url)
        // location.href = url;
        return url;
      }
      return location.href;
    },

    wxAuth() {
      var $this = this;
      // 多参条件下redirect_uri要urlencode编码
      var url = encodeURIComponent($this.refreshUrl());
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + 'wxf79eb1ee3c893a40' + '&redirect_uri=' + url + '&response_type=code&state=no&scope=snsapi_userinfo#wechat_redirect'
    },

    shareRecord(userId, shareType) {
      var $this = this;
      console.log("share:u:" + $this.userInfo)
      console.log("share:l:" + $this.curMediaData)
      // userId: $this.userInfo? $this.userInfo.id:("NNNN" + utils.uuid(28, 16)),
      $this.$axios.post(
        apiWx.wechatShareRecord,
        {
          userId: userId,
          liveOrVideoId: ($this.isLiveMedia ? $this.curMediaData.liveId : $this.curMediaData.videoId),
          shareType: shareType,
          type: ($this.isLiveMedia ? 0 : 1)
        },
        function(res) {
          if (res.data.retureValue == 0) {
            console.log("记录分享成功");
          } else {
            console.log("记录分享失败" + res.data.retureMsg);
          }
        }, function(error) {
          console.log("记录分享失败");
        }
      )
    },

    Share2Timeline(userIdTemp) {
      var $this = this;
      // var from = $this.theRequest["from"]||"";
      // var ftype = $this.theRequest["ftype"]||"";
      $this.shareRecord(userIdTemp, 1)
      console.log("分享到朋友圈,提交分享信息")
    },

    Share2App(userIdTemp) {
      var $this = this;
      // var from = $this.theRequest["from"]||"";
      // var ftype = $this.theRequest["ftype"]||"";
      $this.shareRecord(userIdTemp, 0)
      console.log("分享到App,提交分享信息")
    },

    readedShare() {
      var $this = this;
      var clickUserId = $this.userInfo ? $this.userInfo.id : ("NNNN" + utils.uuid(28, 16));
      var from = $this.theRequest["fuser"] || clickUserId;
      var ftype = $this.theRequest["ftype"] || 3;
      $this.$axios.post(
        apiWx.wechatShareReaded,
        {
          fromUserId: from,
          clickUserId: clickUserId,
          liveOrVideoId: ($this.isLiveMedia ? $this.curMediaData.liveId : $this.curMediaData.videoId),
          shareType: ftype,
          type: ($this.isLiveMedia ? 0 : 1)
        },
        function(res) {
          if (res.data.retureValue == 0) {
            console.log("记录分享成功");
          } else {
            console.log("记录分享失败" + res.data.retureMsg);
          }
        }, function(error) {
          console.log("记录分享失败");
        }
      )
    },

    wxConfig() {
      var $this = this;
      // console.log("1"+location.href)
      // alert("config:"+location.href)
      console.log("config:" + location.href)
      // 多参条件下redirect_uri要urlencode编码
      $this.$axios.get(
        apiWx.wechatShareConfig + "?url=" + encodeURIComponent(location.href),
        null,
        function(res) {
          if (res.data.retureValue == 0) {
            wx.config({
              debug: false, ////生产环境需要关闭debug模式
              appId: res.data.retureData.appid, //appId通过微信服务号后台查看
              timestamp: res.data.retureData.timestamp, //生成签名的时间戳
              nonceStr: res.data.retureData.nonceStr, //生成签名的随机字符串
              signature: res.data.retureData.signature, //签名
              jsApiList: [ //需要调用的JS接口列表
                'onMenuShareTimeline', //分享到朋友圈
                'onMenuShareAppMessage', //分享给好友
                'onMenuShareQQ'
              ]
            });
            wx.ready(function() {
              //分享朋友圈
              // alert("share:"+location.href)
              console.log("share:" + location.href)
              var search = $this.refreshUrl();
              search = search.substring(search.indexOf("?"))
              var userIdTemp = null;
              if (!$this.userInfo) {
                userIdTemp = "NNNN" + utils.uuid(28, 16);
              } else {
                userIdTemp = $this.userInfo.id;
              }
              wx.onMenuShareTimeline({
                title: '青葱直播| ' + ($this.curMediaData ? ($this.curMediaData.liveName ? $this.curMediaData.liveName : $this.curMediaData.videoName) : ''),
                link: location.origin + location.pathname + "?" + utils.replaceParams(search, { fuser: userIdTemp, ftype: 1 }),
                imgUrl: $this.curMediaData.coverPictureUrl, //自定义图标location.href.substring(0,location.href.indexOf('&from='))
                trigger: function(res) {

                },
                success: function(res) {
                  // alert("success:"+location.href)
                  $this.Share2Timeline(userIdTemp);
                },
                cancel: function(res) {

                },
                fail: function(res) {

                }
              });
              //分享给好友
              wx.onMenuShareAppMessage({
                title: '青葱直播| ' + ($this.curMediaData ? ($this.curMediaData.liveName ? $this.curMediaData.liveName : $this.curMediaData.videoName) : ''), // 分享标题
                desc: '【' + $this.$options.filters.formatDate($this.curMediaData.startTime) + '】' + ($this.curMediaData ? ($this.curMediaData.introduction ? $this.curMediaData.introduction : "暂无简介") : ""), // 分享描述
                // link: protocol+location.host+location.pathname+"?fuser="+$this.userInfo.id+"&ftype=0", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                link: location.origin + location.pathname + "?" + utils.replaceParams(search, { fuser: userIdTemp, ftype: 0 }),
                imgUrl: $this.curMediaData.coverPictureUrl, // 自定义图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function(res) {
                  // alert("success:"+location.href)
                  $this.Share2App(userIdTemp);
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
                title: '青葱直播| ' + ($this.curMediaData ? ($this.curMediaData.liveName ? $this.curMediaData.liveName : $this.curMediaData.videoName) : ''), // 分享标题
                desc: '【' + $this.$options.filters.formatDate($this.curMediaData.startTime) + '】' + ($this.curMediaData ? ($this.curMediaData.introduction ? $this.curMediaData.introduction : "暂无简介") : ""), // 分享描述
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
        }, function(error) {
          Toast('服务器开小差了！');
        }
      )
    },
    initPlay(data) {
      var $this = this
      var $format = data.fileFormat == "hls" ? "m3u8" : data.fileFormat;
      var $config = {
        "autoplay": false, //iOS下safari浏览器，以及大部分移动端浏览器是不开放视频自动播放这个能力的
        "coverpic": { "style": "stretch", "src": $this.curMediaData.coverPictureUrl },
        "controls": "system",
        "width": '100%', //视频的显示宽度，请尽量使用视频分辨率宽度
        "height": '100%', //视频的显示高度，请尽量使用视频分辨率高度
        "wording": {
          2032: "请求视频失败，请检查网络",
          2048: "请求m3u8文件失败，可能是网络错误或者跨域问题"
        },
        "flash": true,
        "h5_flv": true,
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
      }
      if ($this.isLiveMedia) {
        $config["m3u8"] = data.hlsPlayUrl;
        $config["flv"] = data.flvPlayUrl;
        // if(typeof data.hlsPlayUrl != "undefined"){
        //  $config["m3u8"]=data.hlsPlayUrl;
        // }
        // if(typeof data.flvPlayUrl != "undefined"){
        //  $config["flv"]=data.flvPlayUrl;
        // }
      } else {
        $config[$format] = data.playUrl
        // if(typeof data.playUrl != "undefined"){
        //  $config[$format]=data.playUrl
        // }
      }
      // console.log(this.$refs.idvideo)
      $this.player = new TcPlayer('idvideo', $config)
      window.tcplayer = $this.player;
    }
  },
  computed: {},
  watch: {
    'selected': function() {
      var $this = this
      if ($this.isLiveMedia) {
        $this.$refs.listTemp.initComponent($this.theRequest);
      }
    },
    'curMediaData': function() {
      if (this.curMediaData.groupId) {
        // avChatRoomId = this.curMediaData.groupId;
        // if(avChatRoomId){
        //  var $this = this;
        //  this.getUserInfo(function(){
        //    // loginInfo.identifier = identifier = $this.userInfo.id;
        //    loginInfo.identifier = identifier = $this.userInfo.nickName? $this.userInfo.nickName : '未知用户';
        //    loginInfo.identifierNick = identifierNick = $this.userInfo.nickName? $this.userInfo.nickName : '未知用户';
        //    loginInfo.userSig = userSig = tlsGetUserSig().userSig;
        //    // sdkLogin();
        //  })
        // }else{

        // }
      }
      if (typeof(this.curMediaData.playUrl) != "undefined" && this.curMediaData.playUrl && this.liveStatus != 0) {
        try {
          this.initPlay(this.curMediaData);
        } catch (err) {
          console.log(err)
        } finally {
          if (this.isLiveMedia) {
            this.connect();
          }
        }
      }
    }
  },
  filters: {
    formatDate(time) {
      var date = new Date(parseInt(time))
      return formatDate(date, 'MM月dd hh:mm')
    }
  }
}

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
    left: 0
  }

  100% {
    left: -100%
  }
}

.body {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-wrap: nowrap;
}

.body>* {
  flex-shrink: 0;
}

.video-sms-list {
  color: black;
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

.mint-tab-container {}

.mint-tab-container-wrap {
  height: 100%;
}

.tab-container {
  padding: 15px
}

@import "/static/css/chat.css";

</style>
