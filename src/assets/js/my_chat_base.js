function onConnNotify () {}

function jsonpCallback () {}

function onBigGroupMsgNotify () {}

function onMsgNotify () {}

function onGroupSystemNotifys () {}

function onGroupInfoChangeNotify () {}

// 监听事件
let listeners = {
  'onConnNotify': onConnNotify, // 选填
  'jsonpCallback': jsonpCallback, // IE9(含)以下浏览器用到的jsonp回调函数,移动端可不填，pc端必填
  'onBigGroupMsgNotify': onBigGroupMsgNotify, // 监听新消息(大群)事件，必填
  'onMsgNotify': onMsgNotify, // 监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
  'onGroupSystemNotifys': onGroupSystemNotifys, // 监听（多终端同步）群系统消息事件，必填
  'onGroupInfoChangeNotify': onGroupInfoChangeNotify// 监听群资料变化事件，选填
}

let const_sdkAppID = 1400036049;
let const_accountType = 8824;

let sdkAppID = const_sdkAppID;
let accountType = const_accountType;
let identifier = null;
let identifierNick = null;
let userSig = null;

let loginInfo = {
  'sdkAppID': sdkAppID, //用户所属应用id,必填
  'appIDAt3rd': sdkAppID, //用户所属应用id，必填
  'accountType': accountType, //用户所属应用帐号类型，必填
  'identifier': identifier, //当前用户ID,必须是否字符串类型，选填
  'identifierNick': identifierNick, //当前用户昵称，选填
  'userSig': userSig, //当前用户身份凭证，必须是字符串类型，选填
  'headurl': 'static/images/user-white.png'//当前用户默认头像，选填
};

var ls = null

console.log(ls)

// 进入大群
function applyJoinBigGroup (groupId, cbOk, cbErr) {
  var options = {
    'GroupId': groupId // 群id
  }
  webim.applyJoinBigGroup (
    options,
    function (resp) {
      // JoinedSuccess:加入成功; WaitAdminApproval:等待管理员审批
      if (resp.JoinedStatus && resp.JoinedStatus === 'JoinedSuccess') {
        webim.Log.info('进群成功')
        isSdkLogin = true
        selToID = groupId
        // getLastGroupHistoryMsgs(getHistoryMsgCallback());
        typeof (cbOk) !== 'undefined' && cbOk()
      } else {
        alert('进群失败')
      }
    },
    function (err) {
      alert(err.ErrorInfo)
      typeof (cbErr) !== 'undefined' && cbErr()
    }
  )
}

//退出大群
function quitBigGroup (groupId) {
  var options = {
    'GroupId': groupId //群id
  };
  webim.quitBigGroup(
      options,
      function(resp) {
        webim.Log.info('退群成功');
        //webim.Log.error('进入另一个大群:'+avChatRoomId2);
        //applyJoinBigGroup(avChatRoomId2);//加入大群
      },
      function(err) {
        // alert(err.ErrorInfo);
      }
  );
}

let isSdkLogin = false;
function getLoginStatus () {
  return isSdkLogin;
}
function setLoginStatus (status) {
  isSdkLogin = status;
  return
}

function sdkLogin (lI, ls, cbOk, cbErr) {
  // web sdk 登录
  listeners.onBigGroupMsgNotify = ls.onBigGroupMsgNotify
  loginInfo.identifier = lI.identifier;
  loginInfo.identifierNick = lI.identifierNick;
  loginInfo.userSig = lI.userSig;
  webim.login(loginInfo, listeners, options,
    function (identifierNick) {
      // identifierNick为登录用户昵称(没有设置时，为帐号)，无登录态时为空
      isSdkLogin = true
      webim.Log.info('webim登录成功')
      ls.onLogin && ls.onLogin(cbOk)
      // applyJoinBigGroup(avChatRoomId,cbOk,cbErr); //加入大群
      // hideDiscussForm(); //隐藏评论表单
      // initEmotionUL(); //初始化表情
      // typeof(cbOk)!="undefined"&&cbOk();
    },
    function (err) {
      alert(err.ErrorInfo)
      typeof (cbErr) !== 'undefined' && cbErr()
    }
  )
}

function logout (cbOk, cbErr) {
  //登出
  webim.logout (
    function(resp) {
      webim.Log.info('登出成功');
      typeof (cbOk) !== 'undefined' && cbOk()
      // isLogin = false;
      // loginInfo.identifier = null;
      // loginInfo.userSig = null;
      // $("#video_sms_list").find("li").remove();
      // var indexUrl = window.location.href;
      // var pos = indexUrl.indexOf('?');
      // if (pos >= 0) {
      //     indexUrl = indexUrl.substring(0, pos);
      // }
      // window.location.href = indexUrl;
    }, function(resp) {
      alert("退出失败")
      typeof (cbErr) !== 'undefined' && cbErr()
    }
  );
}

function onSendMsg (lI, msgtosend) {
  // 未登录
  if (!lI.identifier) {
    console.log("未登录")
    return  '错误码1001'
  }
  if (!isSdkLogin) {
    console.log("SDK未登录")
    return '错误码1003'
  }
  var msgLen = webim.Tool.getStrBytes(msgtosend);
  if (msgtosend.length < 1) {
    alert('发送的消息不能为空!!!')
    return
  }
  var maxLen, errInfo
  if (selType === webim.SESSION_TYPE.GROUP) {
    maxLen = webim.MSG_MAX_LENGTH.GROUP
    errInfo = '消息长度超出限制(最多' + Math.round(maxLen / 3) + '汉字)'
  } else {
    maxLen = webim.MSG_MAX_LENGTH.C2C
    errInfo = '消息长度超出限制(最多' + Math.round(maxLen / 3) + '汉字)'
  }
  if (msgLen > maxLen) {
    alert(errInfo)
    return
  }
  if (!selSess) {
    selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000))
  }
  var isSend = true // 是否为自己发送
  var seq = -1 // 消息序列，-1表示sdk自动生成，用于去重
  var random = Math.round(Math.random() * 4294967296) // 消息随机数，用于去重
  var msgTime = Math.round(new Date().getTime() / 1000) // 消息时间戳
  var subType // 消息子类型
  if (selType === webim.SESSION_TYPE.GROUP) {
    // 群消息子类型如下：
    // webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
    // webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
    // webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
    // webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
    subType = webim.GROUP_MSG_SUB_TYPE.COMMON
  } else {
    // C2C消息子类型如下：
    // webim.C2C_MSG_SUB_TYPE.COMMON-普通消息,
    subType = webim.C2C_MSG_SUB_TYPE.COMMON
  }
  var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, lI.identifier, subType, lI.identifierNick)
  //解析文本和表情
  var expr = /\[[^[\]]{1,3}\]/mg
  var emotions = msgtosend.match(expr)
  var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex
  if (!emotions || emotions.length < 1) {
    text_obj = new webim.Msg.Elem.Text(msgtosend)
    msg.addText(text_obj)
  } else { // 有表情
    for (var i = 0; i < emotions.length; i++) {
      tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]))
      if (tmsg) {
        text_obj = new webim.Msg.Elem.Text(tmsg);
        msg.addText(text_obj)
      }
      emotionIndex = webim.EmotionDataIndexs[emotions[i]];
      emotion = webim.Emotions[emotionIndex]
      if (emotion) {
        face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i])
        msg.addFace(face_obj)
      } else {
        text_obj = new webim.Msg.Elem.Text(emotions[i])
        msg.addText(text_obj)
      }
      restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length
      msgtosend = msgtosend.substring(restMsgIndex);
    }
    if (msgtosend) {
      text_obj = new webim.Msg.Elem.Text(msgtosend);
      msg.addText(text_obj)
    }
  }
  webim.sendMsg(msg, function(resp) {
    if (selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
      showMsg(msg)
    }
    webim.Log.info('发消息成功')
  }, function (err) {
    webim.Log.error('发消息失败:' + err.ErrorInfo)
    alert('发消息失败:' + err.ErrorInfo)
  })
}

function convertMsgtoHtml (msg) {
  var html, elems, elem, type, content
  html = ''
  elems = msg.getElems() // 获取消息包含的元素数组
  for (var i in elems) {
    elem = elems[i]
    type = elem.getType() // 获取元素类型
    content = elem.getContent() // 获取元素对象
    switch (type) {
      case webim.MSG_ELEMENT_TYPE.TEXT:
        html += convertTextMsgToHtml(content)
        break
      case webim.MSG_ELEMENT_TYPE.FACE:
        html += convertFaceMsgToHtml(content)
        break;
      case webim.MSG_ELEMENT_TYPE.IMAGE:
        html += convertImageMsgToHtml(content)
        break
      case webim.MSG_ELEMENT_TYPE.SOUND:
        html += convertSoundMsgToHtml(content)
        break
      case webim.MSG_ELEMENT_TYPE.FILE:
        html += convertFileMsgToHtml(content)
        break
      case webim.MSG_ELEMENT_TYPE.LOCATION: // 暂不支持地理位置
        // html += convertLocationMsgToHtml(content);
        break
      case webim.MSG_ELEMENT_TYPE.CUSTOM:
        html += convertCustomMsgToHtml(content)
        break
      case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
        html += convertGroupTipMsgToHtml(content)
        break
      default:
        webim.Log.error('未知消息元素类型: elemType=' + type)
        break
    }
  }
  return webim.Tool.formatHtml2Text(html)
}

function loginPath(){
  return protocol+consoleBase+consoleLogin+"?device="+window.pwdString.encrypt("returnUrl:"+location.href);
}

export default {
  sendMsg: function (lI, msg) {
    return onSendMsg(lI, msg)
  },
  sdkLog: function (lI, ls, cbOK, cbErr) {
    return sdkLogin(lI, ls, cbOK,cbErr)
  },
  logout: function (cbOk, cbErr) {
    return logout(cbOk, cbErr)
  },
  applyJoinBigGroup: function (avChatRoomId, cbOk, cbErr) {
    return applyJoinBigGroup(avChatRoomId, cbOk, cbErr)
  },
  quitBigGroup: function(avChatRoomId) {
    return quitBigGroup(avChatRoomId)
  },
  converMsgtoText: function (msg) {
    return convertMsgtoHtml(msg)
  },
  loginPath: function () {
    return loginPath()
  },
  getLoginStatus: function () {
    return getLoginStatus()
  },
  setLoginStatus: function (status) {
    return setLoginStatus(status)
  }
}