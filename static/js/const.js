
var const_sdkAppID = 1400036049;
var const_accountType = 8824;
var const_wxAppId = 'wxf79eb1ee3c893a40'

var protocol = "https://"
var sslProtocol = "https://"
var wsProtocol = "wss://"
var consoleBase = "dev.console.shigele.cn/"
var consoleLogin = "login.html"
var consoleIndex = "index.html?device=1"

// var consoleIndex = "http://118.25.109.191/index.html?device=1" //"http://console.shigele.cn/index.html?device=1"


var ajaxBasePathWithoutProtocol = "dev.shigele.cn/xidian_live-0.0.1/"

var ajaxBasePath = sslProtocol+ajaxBasePathWithoutProtocol
function getTrdLoginPath(origin) {
    return ajaxBasePath+'1.0/thirdparty/login/middle-login.html/' + theRequest["device"] + '/'+origin;
}

// var ajaxBasePath = "http://118.25.109.191:8080/xidian_live-0.0.1/"
var ajaxLoginPath = "user/login"
//common.js页面
var ajax_user_info = "1.0/user/info"
var ajax_user_logout = "1.0/user/logout"
//account_overview页面
var ajaxAccount_overviewPath = "account/overview"
//auth-roles页面
var ajaxAuth_roles_group = "1.0/user_group/group"
var ajaxAuth_roles_delete = "1.0/user_group/group/delete"
var ajaxAuth_roles_list = "1.0/user_group/group/list"
//auth_users_fromcustom页面
var ajaxAuth_user_fromcustom = "1.0/user_group/user"
var ajaxAuth_user_options = "1.0/user_group/user/options"
var ajaxAuth_user_condition = "1.0/user_group/user/condition"
//auth_users_fromroles页面
var ajaxAuth_user_fromroleslist = "1.0/user_group/group/list"
var ajaxAuth_user_fromroleimport = "1.0/user_group/user/import"
//auth-user页面
var ajaxAuth_user_delete = "1.0/user_group/user/delete"
var ajaxAuth_user_list = "1.0/user_group/user/list/"
//charts_amcharts页面
var ajaxLivestatistic = "statistic/liveStatistic"
var ajaxwatchbar = "statistic/watchBarGraph"
var ajaxonline = "statistic/online"
var ajaxgetlive = "statistic/getLiveList"
//charts_forms页面
var ajaxuserlist = "statistic/userListStatistics"
//forget页面
var ajaxget_regsms = "user/getRegisterSMS"
var ajax_forget = "user/forgetPassword"
//get_file_sign.js文件
var ajaxget_sign = "objectStorage/getUpObjectStorageSign"
//live_add页面
var ajaxlive_type = "1.0/type/options"
var ajaxcreate_live = "live/createNewLive"
//live-detail页面
var ajax_liveinfo = "live/getLiveInfo"
//live-modify页面
var ajax_liveedit = "live/editLive"
var ajax_live_delete = "1.0/live/delete"
//live页面
var ajax_getlivelist = "1.0/cms/live/list"
//media_detail页面
var ajax_getvideo = "1.0/cms/video/"
//media页面
var ajax_video_list = "0.1/video/list"
//register页面
var ajax_register = "user/register"
//multi_account_management页面
var ajax_multi_account_management_search = "1.0/childaccount/search"
var ajax_multi_account_management_edit = "1.0/childaccount/edit/"
var ajax_multi_account_management_delete = "1.0/childaccount/delete/"
var ajax_multi_account_management_add = "1.0/childaccount/creat"
//sub_count_manage页面
var sub_count_path = "statisitic/subAccountStatistic"
//live_cost页面
var ajax_statistic_live_list = "account/liveCost"
//type_statistic页面
var ajax_statistic_type = "statistic/typeStatistic"
var ajax_websocket = "WebsocketService"

var ajax_wechat_live = "0.1/wechat/live/"
var ajax_wechat_video = "0.1/wechat/video/"
var ajax_usersig = "0.1/im/sig"
var ajax_history_question="1.0/live/history/question"
var get_newest_path = "1.0/pcweb/leaderboard/newest?tenantId='38cf6b6b81e24d068524433a3dd92b0c'";

var wechatShareConfig = 'wechat/getParam'
var wechatAuth = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code";

var wechatUser = 'login/wechatGetUserInfo'
var wechatShareRecord = 'statistic/joinShareRecord'
var wechatShareReaded = 'statistic/joinClickRecord'