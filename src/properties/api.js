export var live = 'https://dev.shigele.cn/xidian_live-0.0.1'
export var apiAuth = {
  userSig: live + '/0.1/im/sig?userId=',
  login: function(){
    return "https://dev.console.shigele.cn/login.html?device="+window.pwdString.encrypt("returnUrl:"+location.href);
  },
  userInfo: live + '1.0/user/info',
  logout: live + '1.0/user/logout',

}

export var apiWs = 'wss://dev.shigele.cn/xidian_live-0.0.1/WebsocketService'

export var apiWx = {
  wechatUser: live + 'login/wechatGetUserInfo',
  wechatShareConfig: live + 'wechat/getParam',
  wechatShareRecord: live + 'statistic/joinShareRecord',
  wechatShareReaded: live + 'statistic/joinClickRecord'
}

export var apiHome = {
  // 首页轮播(获取推荐的7个直播)
  broadcast: live + '/portal_index/broadcast',
  // 选择时间，显示直播和点播
  showByDate: live + '/portal_index/showByDate',
  // 获取直播、点播的类型（已完成）
  options: live + '/1.0/type/options',
  // 一周时间轴滚动直播（每天7个）(暂时不用，换成近三个月数据)
  nearlyWeek: live + '/portal_index/nearlyWeek',
  // 5.近三个月时间轴滚动直播（每月7个）
  nearlyMonth: live + '/portal_index/nearlyMonth',
  // 分页获取点播列表（获取某一类历史直播）（已完成）
  video: live + '/0.1/wechat/video',
  // 获取最新上传点播排行榜（已完成）
  newest: live + '/1.0/pcweb/leaderboard/newest',
  // 获取点播周排行榜（已完成）
  week: live + '/1.0/pcweb/leaderboard/week',
  // 获取点播日排行榜（已完成）
  day: live + '/1.0/pcweb/leaderboard/day'
}

export var apiList = {
  // 分页分类型获取直播列表（已完成
  history: live + "/1.0/mobile/related_video",
  live: live + '/0.1/wechat/live'
}

export var apiDetail = {
  // 获取直播详情（已完成）
  live: live + "/0.1/wechat/live/",
  video: live + "/0.1/wechat/video/",
  // 获取频道的直播(分页获取)
  channel: live + '/live/getLiveInChannel'
}

export var apiQuestion = {
  historyQuestion: live + "/1.0/live/history/question"
}
