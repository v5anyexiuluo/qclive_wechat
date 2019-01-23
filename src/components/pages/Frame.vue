<template>
  <div>
    <mt-header title="青葱校园直播" fixed>
      <span slot="left">
        <!-- <mt-button icon="back" @click="$router.go(-1)"></mt-button> -->
      </span>
      <a v-if="userInfo==null" slot="right" href="javascript:;" @click="redirectLogin">登录</a>
      <img
        v-else
        :src="userProfile"
        class="user-profile"
        slot="right"
        @click="showPopup"
      />
    </mt-header>
  <mt-popup v-model="popupVisible" position="bottom" popup-transition="popup-fade" class="full-width">
    <a
      href="javascript:;"
      class="pop-bottom"
      @click="loginOut"
    >退出</a>
  </mt-popup>
  <!-- <mt-tab-container v-model="active" style="margin-top: 40px; margin-bottom: 55px;">
    <mt-tab-container-item id="home">
      <home></home>
    </mt-tab-container-item>
    <mt-tab-container-item id="list">
      <list></list>
    </mt-tab-container-item>
    <mt-tab-container-item id="my">
      <my></my>
    </mt-tab-container-item>
  </mt-tab-container> -->
  <div style="margin-top: 40px; margin-bottom: 55px;">
    <router-view/>
  </div>
  <mt-tabbar v-model="active" fixed>
    <mt-tab-item id="home">
      <img slot="icon" :src="tabIcon['home']">
    首页
    </mt-tab-item>
    <mt-tab-item id="list">
      <img slot="icon" :src="tabIcon['list']">
    分类
    </mt-tab-item>
    <mt-tab-item id="my">
      <img slot="icon" :src="tabIcon['my']">
    我的
    </mt-tab-item>
  </mt-tabbar>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
import { apiHome, apiList, apiDetail } from '@/properties/api.js'
export default {
  name: 'Frame',
  data () {
    return {
      popupVisible: false,
      active: 'home',
      userInfo: null,
      userProfile:'https://picsum.photos/30/30/?image=927',
      tabIcon: {
        home: require('@/assets/images/home.png'),
        list: require('@/assets/images/list.png'),
        my: require('@/assets/images/my.png')
      }
    }
  },
  components: {},
  created () {},
  mounted () {
    // window.location.href='www.baidu.com'
    this.initApp();
  },
  methods: {
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf79eb1ee3c893a40&redirect_uri=https://dev.mobile.shigele.cn/?liveId=19f2c944fba04b688ff59787124ecd88&response_type=code&scope=snsapi_userinfo#wechat_redirect
    redirectLogin() {
      location.href = this.$chat.loginPath();
    },
    showPopup() {
      let $this = this;
      $this.popupVisible = true;
    },
    initApp() {
      let $this = this;
      $this.userInfo = window.sessionStorage.getItem("userInfo")  
          ? JSON.parse(window.sessionStorage.getItem("userInfo"))
          : null;
      if (!$this.userInfo) {
        $this.getUserInfo (
          function() {
            console.log("user-success");
          },
          function() {
            console.log("user-fail");
          }
        );
      } else {
        $this.userProfile = $this.userInfo.headPicId
      }
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
            typeof cbErr == "function" && cbErr();
            console.log(response.data.retureMsg);
          }
        },
        function(error) {
          typeof cbErr == "function" && cbErr();
          console.log(error);
        }
      );
    },
    loginOut () {
      let $this = this;
      $this.$axios.get(
        apiDetail.ajax_user_logout,
        null,
        function(res) {
          console.log("tuichu")
          console.log(res)
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
    }
  },
  computed: {},
  watch: {
    active: {
      immediate: true,
      handler: function (val, oldVal) {
        var $this = this
        if (oldVal) {
          $this.tabIcon[oldVal] = require('@/assets/images/' + oldVal + '.png')
        }
        $this.tabIcon[val] = require('@/assets/images/' + val + '_fill.png')
        if (val === 'home') {
          $this.$router.push({ name: 'home' })
        } else if (val === 'list') {
          $this.$router.push({ name: 'list' })
        } else if (val === 'my') {
          $this.$router.push({ name: 'my' })
        } else {
          // 页面未找到
        }
      },
      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user-profile {
  height: 30px;
  width: 30px;
}
.pop-bottom {
  display: block;
  height: 60px;
  line-height: 60px;
  width: 100%;
  text-align: center;
  color: gray;
  font-size: 16px;
}
</style>
