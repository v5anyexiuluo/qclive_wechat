//给问题页面增加一个问题
function addquestion(msg){
    var ul, li, paneDiv, textDiv, nickNameSpan, contentSpan;
    ul = document.getElementById("question");
    li = document.createElement("li");
    paneDiv = document.createElement("div");
    paneDiv.setAttribute('class', 'video-sms-pane');
    textDiv = document.createElement("div");
    textDiv.setAttribute('class', 'video-sms-text');
    nickNameSpan = document.createElement("span");
    nickNameSpan.setAttribute('class', 'user-name-blue');
    nickNameSpan.innerHTML = webim.Tool.formatText2Html("" + msg.nickName + "");
    contentSpan = document.createElement("span"); 
    timespan=document.createElement("p");
    timespan.innerHTML=getMyDate(msg.time);
    contentSpan.innerHTML = msg.content; 
    textDiv.appendChild(timespan);      
    textDiv.appendChild(nickNameSpan);
    textDiv.appendChild(contentSpan);
    paneDiv.appendChild(textDiv);
    li.appendChild(paneDiv);
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;
}
//聊天页面增加一条消息
function addMsg(msg, prepend) {
    var isSelfSend, fromAccount, fromAccountNick, fromAccountImage, sessType, subType;
    //获取会话类型，目前只支持群聊
    //webim.SESSION_TYPE.GROUP-群聊，
    //webim.SESSION_TYPE.C2C-私聊，
    sessType = msg.getSession().type();
    isSelfSend = msg.getIsSend(); //消息是否为自己发的
    fromAccount = msg.getFromAccount();
    if (!fromAccount) {
        return;
    }
    if (isSelfSend) { //如果是自己发的消息
        if (loginInfo.identifierNick) {
            fromAccountNick = loginInfo.identifierNick;
        } else {
            fromAccountNick = fromAccount;
        }
        //获取头像
        if (loginInfo.headurl) {
            fromAccountImage = loginInfo.headurl;
        } else {
            fromAccountImage = friendHeadUrl;
        }
    } else { //如果别人发的消息
        var key = webim.SESSION_TYPE.C2C + "_" + fromAccount;
        var info = infoMap[key];
        if (info && info.name) {
            fromAccountNick = info.name;
        } else if (msg.getFromAccountNick()) {
            fromAccountNick = msg.getFromAccountNick();
        } else {
            fromAccountNick = fromAccount;
        }
        //获取头像
        if (info && info.image) {
            fromAccountImage = info.image;
        } else if (msg.fromAccountHeadurl) {
            fromAccountImage = msg.fromAccountHeadurl;
        } else {
            fromAccountImage = friendHeadUrl;
        }
    }
    var onemsg = document.createElement("div");
    if (msg.sending) {
        onemsg.id = "id_" + msg.random;
        //发送中
        var spinner = document.createElement("div");
        spinner.className = "spinner";
        spinner.innerHTML = '<div class="bounce1"></div> <div class="bounce2"></div> <div class="bounce3"></div>';
        onemsg.appendChild(spinner);
    } else {
        $("#id_" + msg.random).remove();
    }
    onemsg.className = "onemsg";
    var msghead = document.createElement("p");
    var msgbody = document.createElement("p");
    var msgPre = document.createElement("pre");
    msghead.className = "msghead";
    msgbody.className = "msgbody";
    //如果是发给自己的消息
    if (!isSelfSend)
        msghead.style.color = "blue";
    //昵称  消息时间
    msghead.innerHTML = "<img class='headurlClass' src='" + fromAccountImage + "'>" + "&nbsp;&nbsp;" + webim.Tool.formatText2Html(fromAccountNick + "&nbsp;&nbsp;" + webim.Tool.formatTimeStamp(msg.getTime()));
    //解析消息

    //获取消息子类型
    //会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
    //会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
    subType = msg.getSubType();
    switch (subType) {

        case webim.GROUP_MSG_SUB_TYPE.COMMON: //群普通消息
            msgPre.innerHTML = convertMsgtoHtml(msg);
            break;
        case webim.GROUP_MSG_SUB_TYPE.REDPACKET: //群红包消息
            msgPre.innerHTML = "[群红包消息]" + convertMsgtoHtml(msg);
            break;
        case webim.GROUP_MSG_SUB_TYPE.LOVEMSG: //群点赞消息
            //业务自己可以增加逻辑，比如展示点赞动画效果
            msgPre.innerHTML = "[群点赞消息]" + convertMsgtoHtml(msg);
            //展示点赞动画
            //showLoveMsgAnimation();
            break;
        case webim.GROUP_MSG_SUB_TYPE.TIP: //群提示消息
            msgPre.innerHTML = "[青葱直播]" + convertMsgtoHtml(msg);
            break;
    }

    msgbody.appendChild(msgPre);

    onemsg.appendChild(msghead);
    onemsg.appendChild(msgbody);
    //消息列表
    var msgflow = document.getElementsByClassName("question")[0];
    if (prepend) {
        //300ms后,等待图片加载完，滚动条自动滚动到底部
        msgflow.insertBefore(onemsg, msgflow.firstChild);
        if (msgflow.scrollTop == 0) {
            setTimeout(function() {
                msgflow.scrollTop = 0;
            }, 300);
        }
    } else {
        msgflow.appendChild(onemsg);
        //300ms后,等待图片加载完，滚动条自动滚动到底部
        setTimeout(function() {
            msgflow.scrollTop = msgflow.scrollHeight;
        }, 300);
    }
}
//sdk登录
function sdkLogin(cbOk, cbErr) {
    //web sdk 登录
    webim.login(loginInfo, listeners, options,
        function(identifierNick) {
            //identifierNick为登录用户昵称(没有设置时，为帐号)，无登录态时为空
            webim.Log.info('webim登录成功');
            applyJoinBigGroup(avChatRoomId,cbOk,cbErr); //加入大群
            hideDiscussForm(); //隐藏评论表单
            //initEmotionUL(); //初始化表情
            //typeof(cbOk)!="undefined"&&cbOk();
        },
        function(err) {
            alert(err.ErrorInfo);
            typeof(cbErr)!="undefined"&&cbErr();
        }
    ); //
}
//进入大群
function applyJoinBigGroup(groupId,cbOk,cbErr) {
    var options = {
        'GroupId': groupId //群id
    };
    webim.applyJoinBigGroup(
        options,
        function(resp) {
            //JoinedSuccess:加入成功; WaitAdminApproval:等待管理员审批
            if (resp.JoinedStatus && resp.JoinedStatus == 'JoinedSuccess') {
                webim.Log.info('进群成功');
                isLogin = true;
                selToID = groupId;
                //getLastGroupHistoryMsgs(getHistoryMsgCallback());
                typeof(cbOk)!="undefined"&&cbOk();
            } else {
                alert('进群失败');
            }
        },
        function(err) {
            alert(err.ErrorInfo);
        }
    );
}
//显示消息（群普通+点赞+提示+红包）
//package
function showMsg1(msg) {
    var isSelfSend, fromAccount, fromAccountNick, sessType, subType;
    var ul, li, paneDiv, textDiv, nickNameSpan, contentSpan;

    fromAccount = msg.getFromAccount();
    if (!fromAccount) {
        fromAccount = '';
    }
    fromAccountNick = msg.getFromAccountNick();
    if (!fromAccountNick) {
        fromAccountNick = '未知用户';
    }
    ul = document.getElementById("video_sms_list");
    var maxDisplayMsgCount = 30;
    //var opacityStep=(1.0/4).toFixed(2);
    var opacityStep = 0.2;
    var opacity;
    var childrenLiList = $("#video_sms_list").children();
    if (childrenLiList.length == maxDisplayMsgCount) {
        $("#video_sms_list").children(":first").remove();
        for (var i = 0; i < maxDisplayMsgCount; i++) {
            opacity = opacityStep * (i + 1) + 0.2;
            $('#video_sms_list').children().eq(i).css("opacity", opacity);
        }
    }
    li = document.createElement("li");
    paneDiv = document.createElement("div");
    paneDiv.setAttribute('class', 'video-sms-pane');
    textDiv = document.createElement("div");
    textDiv.setAttribute('class', 'video-sms-text');
    nickNameSpan = document.createElement("span");

    var colorList = ['red', 'green', 'blue', 'org'];
    var index = Math.round(fromAccount.length % colorList.length);
    var color = colorList[index];
    nickNameSpan.setAttribute('class', 'user-name-' + color);
    nickNameSpan.innerHTML = webim.Tool.formatText2Html("" + fromAccountNick + "");
    contentSpan = document.createElement("span");

    //解析消息
    //获取会话类型，目前只支持群聊
    //webim.SESSION_TYPE.GROUP-群聊，
    //webim.SESSION_TYPE.C2C-私聊，
    sessType = msg.getSession().type();
    //获取消息子类型
    //会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
    //会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
    subType = msg.getSubType();

    isSelfSend = msg.getIsSend(); //消息是否为自己发的

    switch (subType) {

        case webim.GROUP_MSG_SUB_TYPE.COMMON: //群普通消息
            contentSpan.innerHTML = convertMsgtoHtml(msg);
            break;
        case webim.GROUP_MSG_SUB_TYPE.REDPACKET: //群红包消息
            contentSpan.innerHTML = "[群红包消息]" + convertMsgtoHtml(msg);
            break;
        case webim.GROUP_MSG_SUB_TYPE.LOVEMSG: //群点赞消息
            //业务自己可以增加逻辑，比如展示点赞动画效果
            contentSpan.innerHTML = "[群点赞消息]" + convertMsgtoHtml(msg);
            //展示点赞动画
            showLoveMsgAnimation();
            break;
        case webim.GROUP_MSG_SUB_TYPE.TIP: //群提示消息
            contentSpan.innerHTML = "[群提示消息]" + convertMsgtoHtml(msg);
            break;
        default:
            contentSpan.innerHTML = msg.tipText;
            break;
    }
    textDiv.appendChild(nickNameSpan);
    textDiv.appendChild(contentSpan);

    paneDiv.appendChild(textDiv);
    li.appendChild(paneDiv);
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;
}
//把消息转换成Html
function convertMsgtoHtml(msg) {
    var html = "",
        elems, elem, type, content;
    elems = msg.getElems(); //获取消息包含的元素数组
    for (var i in elems) {
        elem = elems[i];
        type = elem.getType(); //获取元素类型
        content = elem.getContent(); //获取元素对象
        switch (type) {
            case webim.MSG_ELEMENT_TYPE.TEXT:
                html += convertTextMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.FACE:
                html += convertFaceMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.IMAGE:
                html += convertImageMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.SOUND:
                html += convertSoundMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.FILE:
                html += convertFileMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.LOCATION: //暂不支持地理位置
                //html += convertLocationMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.CUSTOM:
                html += convertCustomMsgToHtml(content);
                break;
            case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
                html += convertGroupTipMsgToHtml(content);
                break;
            default:
                webim.Log.error('未知消息元素类型: elemType=' + type);
                break;
        }
    }
    return webim.Tool.formatHtml2Text(html);
}
//解析文本消息元素
function convertTextMsgToHtml(content) {
    return content.getText();
}
//解析自定义消息元素
function convertCustomMsgToHtml(content) {
    var data = content.getData();
    var desc = content.getDesc();
    var ext = content.getExt();
    return "<span style='color:red;font-size:18px;'>提问：" + data +"</span>";
}
//解析群提示消息元素
function convertGroupTipMsgToHtml(content) {
    var WEB_IM_GROUP_TIP_MAX_USER_COUNT = 10;
    var text = "";
    var maxIndex = WEB_IM_GROUP_TIP_MAX_USER_COUNT - 1;
    var opType, opUserId, userIdList;
    var memberCount;
    opType = content.getOpType(); //群提示消息类型（操作类型）
    opUserId = content.getOpUserId(); //操作人id
    userIdList = content.getUserInfo();
    switch (opType) {
        case webim.GROUP_TIP_TYPE.JOIN: //加入群
            //text += opUserId + "邀请了";
            for (var m in userIdList) {
                if (userIdList[m].NickName != undefined) {
                    text += userIdList[m].NickName + ",";
                } else {
                    text += userIdList[m].UserId + ",";
                }
                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + userIdList.length + "人";
                    break;
                }
            }
            text = text.substring(0, text.length - 1);
            text += "加入";
            //房间成员数加1
            memberCount = $('#user-icon-fans').html();
            $('#user-icon-fans').html(parseInt(memberCount) + 1);
            break;
        case webim.GROUP_TIP_TYPE.QUIT: //退出群
            var quitName = content.getQuitGorupName()
            text += quitName + "离开房间";
            //房间成员数减1
            memberCount = parseInt($('#user-icon-fans').html());
            if (memberCount > 0) {
                $('#user-icon-fans').html(memberCount - 1);
            }
            break;
        case webim.GROUP_TIP_TYPE.KICK: //踢出群
            text += opUserId + "将";
            for (var m in userIdList) {
                if (userIdList[m].NickName != undefined) {
                    text += userIdList[m].NickName + ",";
                } else {
                    text += userIdList[m].UserId + ",";
                }
                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + userIdList.length + "人";
                    break;
                }
            }
            text += "踢出该群";
            break;
        case webim.GROUP_TIP_TYPE.SET_ADMIN: //设置管理员
            text += opUserId + "将";
            for (var m in userIdList) {
                if (userIdList[m].NickName != undefined) {
                    text += userIdList[m].NickName + ",";
                } else {
                    text += userIdList[m].UserId + ",";
                }
                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + userIdList.length + "人";
                    break;
                }
            }
            text += "设为管理员";
            break;
        case webim.GROUP_TIP_TYPE.CANCEL_ADMIN: //取消管理员
            text += opUserId + "取消";
            for (var m in userIdList) {
                if (userIdList[m].NickName != undefined) {
                    text += userIdList[m].NickName + ",";
                } else {
                    text += userIdList[m].UserId + ",";
                }
                if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + userIdList.length + "人";
                    break;
                }
            }
            text += "的管理员资格";
            break;

        case webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO: //群资料变更
            text += opUserId + "修改了群资料：";
            var groupInfoList = content.getGroupInfoList();
            var type, value;
            for (var m in groupInfoList) {
                type = groupInfoList[m].getType();
                value = groupInfoList[m].getValue();
                switch (type) {
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL:
                        text += "群头像为" + value + "; ";
                        break;
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME:
                        text += "群名称为" + value + "; ";
                        break;
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER:
                        text += "群主为" + value + "; ";
                        break;
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION:
                        text += "群公告为" + value + "; ";
                        break;
                    case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION:
                        text += "群简介为" + value + "; ";
                        break;
                    default:
                        text += "未知信息为:type=" + type + ",value=" + value + "; ";
                        break;
                }
            }
            break;

        case webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO: //群成员资料变更(禁言时间)
            text += opUserId + "修改了群成员资料:";
            var memberInfoList = content.getMemberInfoList();
            var userId, shutupTime;
            for (var m in memberInfoList) {
                userId = memberInfoList[m].getUserId();
                shutupTime = memberInfoList[m].getShutupTime();
                text += userId + ": ";
                if (shutupTime != null && shutupTime !== undefined) {
                    if (shutupTime == 0) {
                        text += "取消禁言; ";
                    } else {
                        text += "禁言" + shutupTime + "秒; ";
                    }
                } else {
                    text += " shutupTime为空";
                }
                if (memberInfoList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
                    text += "等" + memberInfoList.length + "人";
                    break;
                }
            }
            break;
        default:
            text += "未知群提示消息类型：type=" + opType;
            break;
    }
    return text;
}


//第三方应用需要实现这个函数，并在这里拿到UserSig
function tlsGetUserSig() {
    var sig = '';
    $.ajax({
        url: ajaxBasePath+ajax_usersig+"?userId="+identifier,
        type: "get",
        contentType: "application/json",
        xhrFields:{withCredentials: true},
        // dataType: "json",
        async: false,
        success: function(res) {
            if(res.retureValue==0){
                sig=res.retureData;
            }else{
                alert(res.retureMsg);
            }
        },
        error: function(res){
            alert("获取sig失败！");
        }
    });
    return sig;
    // //成功拿到凭证
    // if (res.ErrorCode == webim.TLS_ERROR_CODE.OK) {
    //     //从当前URL中获取参数为identifier的值
    //     loginInfo.identifier = webim.Tool.getQueryString("identifier");
    //     //拿到正式身份凭证
    //     loginInfo.userSig = res.UserSig;
    //     //从当前URL中获取参数为sdkappid的值
    //     loginInfo.sdkAppID = loginInfo.appIDAt3rd = Number(webim.Tool.getQueryString("sdkappid"));
    //     //从cookie获取accountType
    //     var accountType = webim.Tool.getCookie('accountType');
    //     if (accountType) {
    //         loginInfo.accountType = accountType;
    //         sdkLogin(); //sdk登录
    //     } else {
    //         location.href = location.href.replace(/\?.*$/gi, "");
    //     }
    // } else {
    //     //签名过期，需要重新登录
    //     if (res.ErrorCode == webim.TLS_ERROR_CODE.SIGNATURE_EXPIRATION) {
    //         tlsLogin();
    //     } else {
    //         alert("[" + res.ErrorCode + "]" + res.ErrorInfo);
    //     }
    // }
}
//单击图片事件
function imageClick(imgObj) {
    var imgUrls = imgObj.src;
    var imgUrlArr = imgUrls.split("#"); //字符分割
    var smallImgUrl = imgUrlArr[0]; //小图
    var bigImgUrl = imgUrlArr[1]; //大图
    var oriImgUrl = imgUrlArr[2]; //原图
    webim.Log.info("小图url:" + smallImgUrl);
    webim.Log.info("大图url:" + bigImgUrl);
    webim.Log.info("原图url:" + oriImgUrl);
}
//切换播放audio对象
function onChangePlayAudio(obj) {
    if (curPlayAudio) { //如果正在播放语音
        if (curPlayAudio != obj) { //要播放的语音跟当前播放的语音不一样
            curPlayAudio.currentTime = 0;
            curPlayAudio.pause();
            curPlayAudio = obj;
        }
    } else {
        curPlayAudio = obj; //记录当前播放的语音
    }
}



//***评论模块***
//单击评论图片
function smsPicClick() {
    if (!loginInfo.identifier) { //未登录
        if (accountMode == 1) { //托管模式
            //将account_type保存到cookie中,有效期是1天
            webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
            //调用tls登录服务
            tlsLogin();
        } else { //独立模式
            // alert('请填写帐号和票据');
            // $('#login_dialog').show();
            location.href=loginPath();
        }
        return;
    } else {
        hideDiscussTool(); //隐藏评论工具栏
        showDiscussForm(); //显示评论表单
    }
}
//tls登录
function tlsLogin() {
    //跳转到TLS登录页面
    TLSHelper.goLogin({
        sdkappid: loginInfo.sdkAppID,
        acctype: loginInfo.accountType,
        url: window.location.href
    });
}
//显示消息（群普通+点赞+提示+红包）
function showMsg(msg) {
    alert("yuanlai");
    var isSelfSend, fromAccount, fromAccountNick, sessType, subType;
    var ul, li, paneDiv, textDiv, nickNameSpan, contentSpan;

    fromAccount = msg.getFromAccount();
    if (!fromAccount) {
        fromAccount = '';
    }
    fromAccountNick = msg.getFromAccountNick();
    if (!fromAccountNick) {
        fromAccountNick = '未知用户';
    }
    ul = document.getElementById("video_sms_list");
    var maxDisplayMsgCount = 30;
    //var opacityStep=(1.0/4).toFixed(2);
    var opacityStep = 0.2;
    var opacity;
    var childrenLiList = $("#video_sms_list").children();
    if (childrenLiList.length == maxDisplayMsgCount) {
        $("#video_sms_list").children(":first").remove();
        for (var i = 0; i < maxDisplayMsgCount; i++) {
            opacity = opacityStep * (i + 1) + 0.2;
            $('#video_sms_list').children().eq(i).css("opacity", opacity);
        }
    }
    li = document.createElement("li");
    paneDiv = document.createElement("div");
    paneDiv.setAttribute('class', 'video-sms-pane');
    textDiv = document.createElement("div");
    textDiv.setAttribute('class', 'video-sms-text');
    nickNameSpan = document.createElement("span");

    var colorList = ['red', 'green', 'blue', 'org'];
    var index = Math.round(fromAccount.length % colorList.length);
    var color = colorList[index];
    nickNameSpan.setAttribute('class', 'user-name-' + color);
    if(fromAccountNick.indexOf("@")==0){
         nickNameSpan.innerHTML = webim.Tool.formatText2Html("青葱直播");
    }
    else{
       nickNameSpan.innerHTML = webim.Tool.formatText2Html("" + fromAccountNick + ""); 
    }
    
    contentSpan = document.createElement("span");

    //解析消息
    //获取会话类型，目前只支持群聊
    //webim.SESSION_TYPE.GROUP-群聊，
    //webim.SESSION_TYPE.C2C-私聊，
    sessType = msg.getSession().type();
    //获取消息子类型
    //会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
    //会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
    subType = msg.getSubType();

    isSelfSend = msg.getIsSend(); //消息是否为自己发的

    switch (subType) {

        case webim.GROUP_MSG_SUB_TYPE.COMMON: //群普通消息
            contentSpan.innerHTML = convertMsgtoHtml(msg);
            break;
        case webim.GROUP_MSG_SUB_TYPE.REDPACKET: //群红包消息
            contentSpan.innerHTML = "[群红包消息]" + convertMsgtoHtml(msg);
            break;
        case webim.GROUP_MSG_SUB_TYPE.LOVEMSG: //群点赞消息
            //业务自己可以增加逻辑，比如展示点赞动画效果
            contentSpan.innerHTML = "点赞";
            //展示点赞动画
            showLoveMsgAnimation();
            break;
        case webim.GROUP_MSG_SUB_TYPE.TIP: //群提示消息
            contentSpan.innerHTML = convertMsgtoHtml(msg);
            break;
        default:
            contentSpan.innerHTML = msg.tipText;
            break;
    }
    textDiv.appendChild(nickNameSpan);
    textDiv.appendChild(contentSpan);

    paneDiv.appendChild(textDiv);
    li.appendChild(paneDiv);
    ul.appendChild(li);
    ul.scrollTop = ul.scrollHeight;
}
//发送消息(普通消息)
function onSendMsg() {
    alert("onSendMsg-chat")
    if (!loginInfo.identifier) { //未登录
        if (accountMode == 1) { //托管模式
            //将account_type保存到cookie中,有效期是1天
            webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
            //调用tls登录服务
            tlsLogin();
        } else { //独立模式
            // alert('请填写帐号和票据');
            // sdkLogin();
            location.href=loginPath()
        }
       /* hideDiscussForm(); //隐藏评论表单
        showDiscussTool(); //显示评论工具栏
        //hideDiscussEmotion(); //隐藏表情*/
        return;
    }
    if(!isLogin){
        sdkLogin(function(){
            onSendMsg();
        });
        return;
    }
    /*if (!selToID) {
        //$("#send_msg_text").val('');
        //hideDiscussForm(); //隐藏评论表单
        showDiscussTool(); //显示评论工具栏
        //hideDiscussEmotion(); //隐藏表情
        return;
    }*/
    //获取消息内容
    var msgtosend = $("#send_msg_text").val();
    var msgLen = webim.Tool.getStrBytes(msgtosend);

    if (msgtosend.length < 1) {
        alert("发送的消息不能为空!");
        //hideDiscussForm(); //隐藏评论表单
        //showDiscussTool(); //显示评论工具栏
        //hideDiscussEmotion(); //隐藏表情
        return;
    }

    var maxLen, errInfo;
    if (selType == webim.SESSION_TYPE.GROUP) {
        maxLen = webim.MSG_MAX_LENGTH.GROUP;
        errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    } else {
        maxLen = webim.MSG_MAX_LENGTH.C2C;
        errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    }
    if (msgLen > maxLen) {
        alert(errInfo);
        return;
    }

    if (!selSess) {
        selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
    }
    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
    var subType; //消息子类型
    if (selType == webim.SESSION_TYPE.GROUP) {
        //群消息子类型如下：
        //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
        //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
        //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
        //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
        subType = webim.GROUP_MSG_SUB_TYPE.COMMON;

    } else {
        //C2C消息子类型如下：
        //webim.C2C_MSG_SUB_TYPE.COMMON-普通消息,
        subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    }
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
    //解析文本和表情
    var expr = /\[[^[\]]{1,3}\]/mg;
    var emotions = msgtosend.match(expr);
    var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
    if (!emotions || emotions.length < 1) {
        text_obj = new webim.Msg.Elem.Text(msgtosend);
        msg.addText(text_obj);
    } else { //有表情

        for (var i = 0; i < emotions.length; i++) {
            tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
            if (tmsg) {
                text_obj = new webim.Msg.Elem.Text(tmsg);
                msg.addText(text_obj);
            }
            emotionIndex = webim.EmotionDataIndexs[emotions[i]];
            emotion = webim.Emotions[emotionIndex];
            if (emotion) {
                face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
                msg.addFace(face_obj);
            } else {
                text_obj = new webim.Msg.Elem.Text(emotions[i]);
                msg.addText(text_obj);
            }
            restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
            msgtosend = msgtosend.substring(restMsgIndex);
        }
        if (msgtosend) {
            text_obj = new webim.Msg.Elem.Text(msgtosend);
            msg.addText(text_obj);
        }
    }
    webim.sendMsg(msg, function(resp) {
        if (selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
            showMsg(msg);
        }
        webim.Log.info("发消息成功");
        $("#send_msg_text").val('');

        showDiscussForm(); //显示评论表单
        //showDiscussTool(); //显示评论工具栏
        //hideDiscussEmotion(); //隐藏表情
    }, function(err) {
        webim.Log.error("发消息失败:" + err.ErrorInfo);
        alert("发消息失败:" + err.ErrorInfo);
    });
}
//隐藏评论文本框
function hideDiscussForm() {
    $(".video-discuss-form").hide();
}
//显示评论文本框
function showDiscussForm() {
    $(".video-discuss-form").show();
}
//隐藏评论工具栏
function hideDiscussTool() {
    $(".video-discuss-tool").hide();
}
//显示评论工具栏
function showDiscussTool() {
    $(".video-discuss-tool").show();
}

//*****提出问题模块*****
function sendquestion(){
     if (!loginInfo.identifier) { //未登录
        if (accountMode == 1) { //托管模式
            //将account_type保存到cookie中,有效期是1天
            webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
            //调用tls登录服务
            tlsLogin();
        } else { //独立模式
            // alert('请填写帐号和票据');
            // $('#login_dialog').show();
            location.href=loginPath();
        }
        return;
    }
}
//***点赞模块***

//发送消息(群点赞消息)
function sendGroupLoveMsg() {
    alert("sendGroupLoveMsg")
    if (!loginInfo.identifier) { //未登录
        if (accountMode == 1) { //托管模式
            //将account_type保存到cookie中,有效期是1天
            webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
            //调用tls登录服务
            tlsLogin();
        } else { //独立模式
            // alert('请填写帐号和票据');
            // $('#login_dialog').show();
            location.href=loginPath()
        }
        return;
    }
    if(!isLogin){
        sdkLogin(function(){
            sendGroupLoveMsg();
        });
        return;
    }
    /*if (!selToID) {
        
        return;
    }*/
    if (!selSess) {
        selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
    }
    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
    //群消息子类型如下：
    //webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
    //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
    //webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
    //webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
    var subType = webim.GROUP_MSG_SUB_TYPE.LOVEMSG;

    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
    var msgtosend = 'love_msg';
    var text_obj = new webim.Msg.Elem.Text(msgtosend);
    msg.addText(text_obj);

    webim.sendMsg(msg, function(resp) {
        if (selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
            showMsg(msg);
        }
        webim.Log.info("点赞成功");
        showDiscussForm(); //显示评论表单
    }, function(err) {
        webim.Log.error("发送点赞消息失败:" + err.ErrorInfo);
        alert("发送点赞消息失败:" + err.ErrorInfo);
    });
}



//展示点赞动画
function showLoveMsgAnimation() {
    //点赞数加1
    var loveCount = $('#user-icon-like').html();
    $('#user-icon-like').html(parseInt(loveCount) + 1);
    var toolDiv = document.getElementById("video-discuss-form");
    var loveSpan = document.createElement("span");
    var colorList = ['red', 'green', 'blue'];
    var max = colorList.length - 1;
    var min = 0;
    var index = parseInt(Math.random() * (max - min + 1) + min, max + 1);
    var color = colorList[index];
    loveSpan.setAttribute('class', 'like-icon zoomIn ' + color);
    toolDiv.appendChild(loveSpan);
}



//*****拉取历史记录模块

//读取群组基本资料-高级接口
var getGroupInfo = function (group_id, cbOK, cbErr) {
    var options = {
        'GroupIdList': [
            group_id
        ],
        'GroupBaseInfoFilter': [
            'Type',
            'Name',
            'Introduction',
            'Notification',
            'FaceUrl',
            'CreateTime',
            'Owner_Account',
            'LastInfoTime',
            'LastMsgTime',
            'NextMsgSeq',
            'MemberNum',
            'MaxMemberNum',
            'ApplyJoinOption'
        ],
        'MemberInfoFilter': [
            'Account',
            'Role',
            'JoinTime',
            'LastSendMsgTime',
            'ShutUpUntil'
        ]
    };
    webim.getGroupInfo(
            options,
            function (resp) {
                if (cbOK) {
                    cbOK(resp);
                }
            },
            function (err) {
                alert(err.ErrorInfo);
            }
    );
};
//拉取历史消息成功回调函数
function getHistoryMsgCallback(msgList, prepage) {
    var msg;
    prepage = prepage || false;
    alert("getHistoryMsgCallback")
    //如果是加载前几页的消息，消息体需要prepend，所以先倒排一下
    if (prepage) {
        msgList.reverse();
    }

    for (var j in msgList) { //遍历新消息
        msg = msgList[j];
        if (msg.getSession().id() == selToID) { //为当前聊天对象的消息
            selSess = msg.getSession();
            //在聊天窗体中新增一条消息
            showMsg(msg);
        }
    }
    //消息已读上报，并将当前会话的消息设置成自动已读
    webim.setAutoRead(selSess, true, true);
}
//获取最新的群历史消息,用于切换群组聊天时，重新拉取群组的聊天消息
var getLastGroupHistoryMsgs = function (cbOk, cbError) {

    if (selType == webim.SESSION_TYPE.C2C) {
        alert('当前的聊天类型为好友聊天，不能进行拉取群历史消息操作');
        return;
    }
    getGroupInfo(selToID, function (resp) {
        //拉取最新的群历史消息
        console.log(resp);
        var options = {
            'GroupId': selToID,
            'ReqMsgSeq': resp.GroupInfo[0].NextMsgSeq - 1,
            'ReqMsgNumber': reqMsgCount
        };

        if (options.ReqMsgSeq == null || options.ReqMsgSeq == undefined || options.ReqMsgSeq<=0) {
            webim.Log.warn("该群还没有历史消息:options=" + JSON.stringify(options));
            return;
        }
        /*selSess = null;
        webim.MsgStore.delSessByTypeId(selType, selToID);
        recentSessMap[webim.SESSION_TYPE.GROUP + "_" + selToID] = {};

        recentSessMap[webim.SESSION_TYPE.GROUP + "_" + selToID].MsgGroupReadedSeq = resp.GroupInfo && resp.GroupInfo[0] && resp.GroupInfo[0].MsgSeq;
     */   
        webim.syncGroupMsgs(
                options,
                function (msgList) {
                    console.log(msgList);
                    if (msgList.length == 0) {
                        console.log("该群没有历史消息了:options=" + JSON.stringify(options));
                        return;
                    }
                    var msgSeq = msgList[0].seq - 1;
                    getPrePageGroupHistroyMsgInfoMap[selToID] = {
                        // "ReqMsgSeq": msgList[msgList.length - 1].MsgSeq - 1
                        "ReqMsgSeq": msgSeq
                    };
                    
                    if (cbOk)
                        cbOk(msgList);
                },
                function (err) {
                    //alert(err.ErrorInfo);
                }
        );
    });
};
//向上翻页，获取更早的历史消息
var getPrePageGroupHistoryMsgs = function(cbOk) {
    if (selType == webim.SESSION_TYPE.C2C) {
        alert('当前的聊天类型为好友聊天，不能进行拉取群历史消息操作');
        return;
    }
    var tempInfo = getPrePageGroupHistroyMsgInfoMap[selToID]; //获取下一次拉取的群消息seq
    var reqMsgSeq;
    if (tempInfo) {
        reqMsgSeq = tempInfo.ReqMsgSeq;
        if (reqMsgSeq <= 0) {
            webim.Log.warn('该群没有历史消息可拉取了');
            return;
        }
    } else {
        webim.Log.error('获取下一次拉取的群消息seq为空');
        return;
    }
    var options = {
        'GroupId': selToID,
        'ReqMsgSeq': reqMsgSeq,
        'ReqMsgNumber': reqMsgCount
    };

    webim.syncGroupMsgs(
        options,
        function(msgList) {
            if (msgList.length == 0) {
                webim.Log.warn("该群没有历史消息了:options=" + JSON.stringify(options));
                return;
            }
            var msgSeq = msgList[0].seq - 1;
            getPrePageGroupHistroyMsgInfoMap[selToID] = {
                "ReqMsgSeq": msgSeq
            };

            if (cbOk) {
                cbOk(msgList);
            } else {
                getHistoryMsgCallback(msgList, true);
            }
        },
        function(err) {
            alert(err.ErrorInfo);
        }
    );
};

//*****提出问题模块

//弹出发自定义消息对话框
function showEditCustomMsgDialog() {
    $('#ecm_form')[0].reset();
    $('#edit_custom_msg_dialog').modal('show');
}
//发送自定义消息
function sendCustomMsg() {
     if (!loginInfo.identifier) { //未登录
        if (accountMode == 1) { //托管模式
            //将account_type保存到cookie中,有效期是1天
            webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
            //调用tls登录服务
            tlsLogin();
        } else { //独立模式
            // alert('请填写帐号和票据');
            // $('#login_dialog').show();
            location.href=loginPath()
        }
        return;
    }
    if(!isLogin){
        sdkLogin(function(){
            sendCustomMsg();
        });
        return;
    }
    /*if (!selToID) {        
        return;
    }*/
    var data = $("#ecm_data").val();
    var desc = $("#ecm_desc").val();
    var ext = $("#ecm_ext").val();
    var msgLen = webim.Tool.getStrBytes(data);
    if (data.length < 1) {
        alert("发送的消息不能为空!");
        return;
    }
    var maxLen, errInfo;
    if (selType == webim.SESSION_TYPE.C2C) {
        maxLen = webim.MSG_MAX_LENGTH.C2C;
        errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    } else {
        maxLen = webim.MSG_MAX_LENGTH.GROUP;
        errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    }
    if (msgLen > maxLen) {
        alert(errInfo);
        return;
    }
    if (!selSess) {
        selSess = new webim.Session(selType, selToID, selToID, friendHeadUrl, Math.round(new Date().getTime() / 1000));
    }
    var msg = new webim.Msg(selSess, true,-1,-1,-1,loginInfo.identifier,0,loginInfo.identifierNick);
    var custom_obj = new webim.Msg.Elem.Custom(data, desc, ext);
    msg.addCustom(custom_obj);
    //调用发送消息接口
    webim.sendMsg(msg, function (resp) {
        addMsg(msg);
        $("#ecm_data").val('');
        //$("#id_" + msg.random).find(".spinner").remove();
        /*if(selType==webim.SESSION_TYPE.C2C){//私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
            addMsg(msg);
        }*/
        //$('#edit_custom_msg_dialog').hide();
    }, function (err) {
        alert(err.ErrorInfo);
    });
}



//隐藏表情框
function hideDiscussEmotion() {
    $(".video-discuss-emotion").hide();
    //$(".video-discuss-emotion").fadeOut("slow");
}
//显示表情框
function showDiscussEmotion() {
    $(".video-discuss-emotion").show();
    //$(".video-discuss-emotion").fadeIn("slow");

}
//初始化表情
function initEmotionUL() {
    for (var index in webim.Emotions) {
        var emotions = $('<img>').attr({
            "id": webim.Emotions[index][0],
            "src": webim.Emotions[index][1],
            "style": "cursor:pointer;"
        }).click(function() {
            selectEmotionImg(this);
        });
        $('<li>').append(emotions).appendTo($('#emotionUL'));
    }
}
//打开或显示表情
function showEmotionDialog() {
    if (openEmotionFlag) { //如果已经打开
        openEmotionFlag = false;
        hideDiscussEmotion(); //关闭
    } else { //如果未打开
        openEmotionFlag = true;
        showDiscussEmotion(); //打开
    }
}
//选中表情
function selectEmotionImg(selImg) {
    $("#send_msg_text").val($("#send_msg_text").val() + selImg.id);
}
//退出大群
function quitBigGroup() {
    var options = {
        'GroupId': avChatRoomId //群id
    };
    webim.quitBigGroup(
        options,
        function(resp) {

            webim.Log.info('退群成功');
            $("#video_sms_list").find("li").remove();
            //webim.Log.error('进入另一个大群:'+avChatRoomId2);
            //applyJoinBigGroup(avChatRoomId2);//加入大群
        },
        function(err) {
            alert(err.ErrorInfo);
        }
    );
}
//登出
function logout() {
    //登出
    webim.logout(
        function(resp) {
            webim.Log.info('登出成功');
            isLogin = false;
            loginInfo.identifier = null;
            loginInfo.userSig = null;
            $("#video_sms_list").find("li").remove();
            var indexUrl = window.location.href;
            var pos = indexUrl.indexOf('?');
            if (pos >= 0) {
                indexUrl = indexUrl.substring(0, pos);
            }
            window.location.href = indexUrl;
        }
    );
}
//点击登录按钮(独立模式)
function independentModeLogin() {
    if ($("#login_account").val().length == 0) {
        alert('请输入帐号');
        return;
    }
    if ($("#login_pwd").val().length == 0) {
        alert('请输入UserSig');
        return;
    }
    loginInfo.identifier = $('#login_account').val();
    loginInfo.userSig = $('#login_pwd').val();
    $('#login_dialog').hide();
    sdkLogin();
}
//group start
//监听 申请加群 系统消息
function onApplyJoinGroupRequestNotify(notify) {
    webim.Log.warn("执行 加群申请 回调：" + JSON.stringify(notify));
    var timestamp = notify.MsgTime;
    var reportTypeCh = "[申请加群]";
    var content = notify.Operator_Account + "申请加入你的群";
    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, timestamp);
}
//监听 申请加群被同意 系统消息
function onApplyJoinGroupAcceptNotify(notify) {
    webim.Log.warn("执行 申请加群被同意 回调：" + JSON.stringify(notify));
    var reportTypeCh = "[申请加群被同意]";
    var content = notify.Operator_Account + "同意你的加群申请，附言：" + notify.RemarkInfo;
    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
}
//监听 申请加群被拒绝 系统消息
function onApplyJoinGroupRefuseNotify(notify) {
    webim.Log.warn("执行 申请加群被拒绝 回调：" + JSON.stringify(notify));
    var reportTypeCh = "[申请加群被拒绝]";
    var content = notify.Operator_Account + "拒绝了你的加群申请，附言：" + notify.RemarkInfo;
    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
}
//监听 被踢出群 系统消息
function onKickedGroupNotify(notify) {
    webim.Log.warn("执行 被踢出群  回调：" + JSON.stringify(notify));
    var reportTypeCh = "[被踢出群]";
    var content = "你被管理员" + notify.Operator_Account + "踢出该群";
    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
}
//监听 解散群 系统消息
function onDestoryGroupNotify(notify) {
    webim.Log.warn("执行 解散群 回调：" + JSON.stringify(notify));
    var reportTypeCh = "[群被解散]";
    var content = "群主" + notify.Operator_Account + "已解散该群";
    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
}
//监听 创建群 系统消息
function onCreateGroupNotify(notify) {
    webim.Log.warn("执行 创建群 回调：" + JSON.stringify(notify));
    var reportTypeCh = "[创建群]";
    var content = "你创建了该群";
    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
}
//监听 被邀请加群 系统消息
function onInvitedJoinGroupNotify(notify) {
    webim.Log.warn("执行 被邀请加群  回调: " + JSON.stringify(notify));
    var reportTypeCh = "[被邀请加群]";
    var content = "你被管理员" + notify.Operator_Account + "邀请加入该群";
    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
}
//监听 主动退群 系统消息
function onQuitGroupNotify(notify) {
    webim.Log.warn("执行 主动退群  回调： " + JSON.stringify(notify));
    var reportTypeCh = "[主动退群]";
    var content = "你退出了该群";
    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
}
//监听 被设置为管理员 系统消息
function onSetedGroupAdminNotify(notify) {
    webim.Log.warn("执行 被设置为管理员  回调：" + JSON.stringify(notify));
    var reportTypeCh = "[被设置为管理员]";
    var content = "你被群主" + notify.Operator_Account + "设置为管理员";
    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
}
//监听 被取消管理员 系统消息
function onCanceledGroupAdminNotify(notify) {
    webim.Log.warn("执行 被取消管理员 回调：" + JSON.stringify(notify));
    var reportTypeCh = "[被取消管理员]";
    var content = "你被群主" + notify.Operator_Account + "取消了管理员资格";
    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
}
//监听 群被回收 系统消息
function onRevokeGroupNotify(notify) {
    webim.Log.warn("执行 群被回收 回调：" + JSON.stringify(notify));
    var reportTypeCh = "[群被回收]";
    var content = "该群已被回收";
    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
}
//监听 用户自定义 群系统消息
function onCustomGroupNotify(notify) {
    webim.Log.warn("执行 用户自定义系统消息 回调：" + JSON.stringify(notify));
    var reportTypeCh = "[用户自定义系统消息]";
    var content = notify.UserDefinedField; //群自定义消息数据
    showGroupSystemMsg(notify.ReportType, reportTypeCh, notify.GroupId, notify.GroupName, content, notify.MsgTime);
}

//监听 群资料变化 群提示消息
function onGroupInfoChangeNotify(groupInfo) {
    webim.Log.warn("执行 群资料变化 回调： " + JSON.stringify(groupInfo));
    var groupId = groupInfo.GroupId;
    var newFaceUrl = groupInfo.GroupFaceUrl; //新群组图标, 为空，则表示没有变化
    var newName = groupInfo.GroupName; //新群名称, 为空，则表示没有变化
    var newOwner = groupInfo.OwnerAccount; //新的群主id, 为空，则表示没有变化
    var newNotification = groupInfo.GroupNotification; //新的群公告, 为空，则表示没有变化
    var newIntroduction = groupInfo.GroupIntroduction; //新的群简介, 为空，则表示没有变化

    if (newName) {
        //更新群组列表的群名称
        //To do
        webim.Log.warn("群id=" + groupId + "的新名称为：" + newName);
    }
}
//显示一条群组系统消息
function showGroupSystemMsg(type, typeCh, group_id, group_name, msg_content, msg_time) {
    var sysMsgStr = "收到一条群系统消息: type=" + type + ", typeCh=" + typeCh + ",群ID=" + group_id + ", 群名称=" + group_name + ", 内容=" + msg_content + ", 时间=" + webim.Tool.formatTimeStamp(msg_time);
    webim.Log.warn(sysMsgStr);
    alert(sysMsgStr);
}

//读取群组基本资料-高级接口
var getGroupInfo = function (group_id, cbOK, cbErr) {
    var options = {
        'GroupIdList': [
            group_id
        ],
        'GroupBaseInfoFilter': [
            'Type',
            'Name',
            'Introduction',
            'Notification',
            'FaceUrl',
            'CreateTime',
            'Owner_Account',
            'LastInfoTime',
            'LastMsgTime',
            'NextMsgSeq',
            'MemberNum',
            'MaxMemberNum',
            'ApplyJoinOption'
        ],
        'MemberInfoFilter': [
            'Account',
            'Role',
            'JoinTime',
            'LastSendMsgTime',
            'ShutUpUntil'
        ]
    };
    webim.getGroupInfo(
            options,
            function (resp) {
                if (cbOK) {
                    cbOK(resp);
                }
            },
            function (err) {
                alert(err.ErrorInfo);
            }
    );
};

//获取最新的群历史消息,用于切换群组聊天时，重新拉取群组的聊天消息
var getLastGroupHistoryMsgs = function (cbOk, cbError) {

    if (selType == webim.SESSION_TYPE.C2C) {
        alert('当前的聊天类型为好友聊天，不能进行拉取群历史消息操作');
        return;
    }
    getGroupInfo(selToID, function (resp) {
        //拉取最新的群历史消息
        var options = {
            'GroupId': selToID,
            'ReqMsgSeq': resp.GroupInfo[0].NextMsgSeq - 1,
            'ReqMsgNumber': reqMsgCount
        };
        if (options.ReqMsgSeq == null || options.ReqMsgSeq == undefined || options.ReqMsgSeq<=0) {
            webim.Log.warn("该群还没有历史消息:options=" + JSON.stringify(options));
            return;
        }
        webim.syncGroupMsgs(
                options,
                function (msgList) {
                    if (msgList.length == 0) {
                        webim.Log.error("该群没有历史消息了:options=" + JSON.stringify(options));
                        return;
                    }
                    getPrePageGroupHistroyMsgInfoMap[selToID] = {
                        "ReqMsgSeq": msgList[msgList.length - 1].MsgSeq - 1
                    };
                    if (cbOk)
                        cbOk(msgList);
                },
                function (err) {
                    alert(err.ErrorInfo);
                }
        );
    });
};
//检查是否登陆
function checkLogin(){
    return webim.checkLogin();
}
//解析表情消息元素
function convertFaceMsgToHtml(content) {
    var faceUrl = null;
    var data = content.getData();
    var index = webim.EmotionDataIndexs[data];

    var emotion = webim.Emotions[index];
    if (emotion && emotion[1]) {
        faceUrl = emotion[1];
    }
    if (faceUrl) {
        return "<img src='" + faceUrl + "'/>";
    } else {
        return data;
    }
}
//解析图片消息元素
function convertImageMsgToHtml(content) {
    var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL); //小图
    var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE); //大图
    var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN); //原图
    if (!bigImage) {
        bigImage = smallImage;
    }
    if (!oriImage) {
        oriImage = smallImage;
    }
    return "<img src='" + smallImage.getUrl() + "#" + bigImage.getUrl() + "#" + oriImage.getUrl() + "' style='CURSOR: hand' id='" + content.getImageId() + "' bigImgUrl='" + bigImage.getUrl() + "' onclick='imageClick(this)' />";
}
//解析语音消息元素
function convertSoundMsgToHtml(content) {
    var second = content.getSecond(); //获取语音时长
    var downUrl = content.getDownUrl();
    if (webim.BROWSER_INFO.type == 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 8) {
        return '[这是一条语音消息]demo暂不支持ie8(含)以下浏览器播放语音,语音URL:' + downUrl;
    }
    return '<audio src="' + downUrl + '" controls="controls" onplay="onChangePlayAudio(this)" preload="none"></audio>';
}
//解析文件消息元素
function convertFileMsgToHtml(content) {
    var fileSize = Math.round(content.getSize() / 1024);
    return '<a href="' + content.getDownUrl() + '" title="点击下载文件" ><i class="glyphicon glyphicon-file">&nbsp;' + content.getName() + '(' + fileSize + 'KB)</i></a>';

}
//解析位置消息元素
function convertLocationMsgToHtml(content) {
    return '经度=' + content.getLongitude() + ',纬度=' + content.getLatitude() + ',描述=' + content.getDesc();
}
//IE9(含)以下浏览器用到的jsonp回调函数
function jsonpCallback(rspData) {
    //设置接口返回的数据
    webim.setJsonpLastRspData(rspData);
}

//监听大群新消息（普通，点赞，提示，红包）

function onBigGroupMsgNotify(msgList) {
    // alert("onBigGroupMsgNotify")
    for (var i = msgList.length - 1; i >= 0; i--) { //遍历消息，按照时间从后往前
        var msg = msgList[i];
        //console.warn(msg);
        webim.Log.warn('receive a new avchatroom group msg: ' + msg.getFromAccountNick());
        //显示收到的消息
        showMsg(msg);
    }
}
//监听新消息(私聊(包括普通消息、全员推送消息)，普通群(非直播聊天室)消息)事件
//newMsgList 为新消息数组，结构为[Msg]
function onMsgNotify(newMsgList) {
    var newMsg;
    for (var j in newMsgList) { //遍历新消息
        newMsg = newMsgList[j];
        handlderMsg(newMsg); //处理新消息
    }
}
//处理消息（私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息）
function handlderMsg(msg) {
    var fromAccount, fromAccountNick, sessType, subType, contentHtml;

    fromAccount = msg.getFromAccount();
    if (!fromAccount) {
        fromAccount = '';
    }
    fromAccountNick = msg.getFromAccountNick();
    if (!fromAccountNick) {
        fromAccountNick = fromAccount;
    }
    //解析消息
    //获取会话类型
    //webim.SESSION_TYPE.GROUP-群聊，
    //webim.SESSION_TYPE.C2C-私聊，
    sessType = msg.getSession().type();
    //获取消息子类型
    //会话类型为群聊时，子类型为：webim.GROUP_MSG_SUB_TYPE
    //会话类型为私聊时，子类型为：webim.C2C_MSG_SUB_TYPE
    subType = msg.getSubType();

    switch (sessType) {
        case webim.SESSION_TYPE.C2C: //私聊消息
            switch (subType) {
                case webim.C2C_MSG_SUB_TYPE.COMMON: //c2c普通消息
                    //业务可以根据发送者帐号fromAccount是否为app管理员帐号，来判断c2c消息是否为全员推送消息，还是普通好友消息
                    //或者业务在发送全员推送消息时，发送自定义类型(webim.MSG_ELEMENT_TYPE.CUSTOM,即TIMCustomElem)的消息，在里面增加一个字段来标识消息是否为推送消息
                    contentHtml = convertMsgtoHtml(msg);
                    webim.Log.warn('receive a new c2c msg: fromAccountNick=' + fromAccountNick + ", content=" + contentHtml);
                    //c2c消息一定要调用已读上报接口
                    var opts = {
                        'To_Account': fromAccount, //好友帐号
                        'LastedMsgTime': msg.getTime() //消息时间戳
                    };
                    webim.c2CMsgReaded(opts);
                    alert('收到一条c2c消息(好友消息或者全员推送消息): 发送人=' + fromAccountNick + ", 内容=" + contentHtml);
                    break;
            }
            break;
        case webim.SESSION_TYPE.GROUP: //普通群消息，对于直播聊天室场景，不需要作处理
            break;
    }
}
