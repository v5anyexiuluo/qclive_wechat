<template>
  <div>
    <mt-swipe :auto="4000" class="focus-imgs">
    <mt-swipe-item
      v-for="(item,index) in focusImgs"
      :key = index
    >
      <img :src="item.coverPictureUrl" alt="">
    </mt-swipe-item>
  </mt-swipe>
  <div class="block">
    <h1 style="overflow: hidden;">
      <span class="title">学术会议</span>
      <span class="more mint-toast-icon mintui mintui-more rfloat" style="font-size: 20px;"></span>
    </h1>
    <p class="content">
      <card v-for="(item, index) in page.learningData"
      :key=index
      :data="item"></card>
    </p>
  </div>
  <div class="block">
    <h1 style="overflow: hidden;">
      <span class="title">晚会</span>
      <span class="more mint-toast-icon mintui mintui-more rfloat" style="font-size: 20px;"></span>
    </h1>
    <p class="content">
      <card v-for="item in page.eveningData"
      :key=item.liveId
      :data="item"></card>
    </p>
  </div>
  </div>
</template>

<script>
import card from '@/components/commons/Card'
import { apiHome, apiList, apiDetail } from '@/properties/api.js'
import { settings } from '@/properties/settings.js'
export default {
  name: 'Home',
  components: {
    card: card
  },
  data () {
    return {
      focusImgs: null,
      page: {
        eveningData: [],
        learningData: [],
        mediaData: [
          {
            videoId: 1,
            coverPictureUrl: 'http://placeimg.com/540/260/nature',
            liveStatus: 1,
            isLive: true,
            userName: 'XX',
            location: '本地',
            liveName: '视频某某',
            viewCount: 1000
          },
          {
            videoId: 1,
            coverPictureUrl: 'http://placeimg.com/540/260/nature',
            liveStatus: 1,
            isLive: true,
            userName: 'XX',
            location: '本地',
            liveName: '视频某某',
            viewCount: 1000
          },
          {
            videoId: 1,
            coverPictureUrl: 'http://placeimg.com/540/260/nature',
            liveStatus: 1,
            isLive: true,
            userName: 'XX',
            location: '本地',
            liveName: '视频某某',
            viewCount: 1000
          }
        ],
        page: 1,
        size: 4,
        type: 0,
        sort: 0
      }
    }
  },
  methods: {
    // 获取首页轮播
    getBroadcast () {
      var $this = this
      $this.broadcast(
        function (res) {
          $this.focusImgs = res.data.retureData
        },
        function (res) {
          console.log('获取首页轮播失败！')
        }
      )
    },

    // 首页轮播
    broadcast (cbOk, cbErr) {
      var $this = this
      $this.$axios.post(
        apiHome.broadcast,
        {
          tenantId: settings.tId
        },
        cbOk,
        cbErr
      )
    },

    // 选择时间，显示直播和点播
    showByDate (date, cbOk, cbErr) {
      var $this = this
      $this.$axios.post(
        apiHome.showByDate,
        {
          date: date,
          tenantId: settings.tId
        },
        cbOk,
        cbErr
      )
    },

    // 获取直播、点播的类型
    options (cbOk, cbErr) {
      var $this = this
      $this.$axios.get(apiHome.options, null, cbOk, cbErr)
    },

    // 一周时间轴滚动直播（每天7个）(暂时不用，换成近三个月数据)
    nearlyWeek (cbOk, cbErr) {
      var $this = this
      $this.$axios.post(apiHome.nearlyWeek, null, cbOk, cbErr)
    },

    // 近三个月时间轴滚动直播（每月7个）
    nearlyMonth (cbOk, cbErr) {
      var $this = this
      $this.$axios.post(apiHome.nearlyMonth, {
        tenantId: settings.tId
      })
    },

    // 分页获取点播列表（获取某一类历史直播）
    video (page, size, type, sort, cbOk, cbErr) {
      var $this = this
      $this.$axios.get(
        apiHome.video+
          '?page=' + page +
          '&size=' + size+
          '&type='  +type+
          '&sort=' + sort+
          'tenantId=' + settings.tId,
        null,
        cbOk,
        cbErr
      )
    },

    // 获取最新上传点播排行榜（已完成）
    newest (cbOk, cbErr) {
      var $this = this
      $this.$axios.get(
        apiHome.newest,
        {
          tenantId: settings.tId
        },
        cbOk,
        cbErr
      )
    },

    // 获取点播周排行榜（已完成）
    week (cbOk, cbErr) {
      var $this = this
      $this.$axios.get(
        apiHome.week,
        {
          tenantId: settings.tId
        },
        cbOk,
        cbErr
      )
    },

    // 获取点播日排行榜（已完成）
    day (cbOk, cbErr) {
      var $this = this
      $this.$axios.get(
        apiHome.day,
        {
          tenantId: settings.tId
        },
        cbOk,
        cbErr
      )
    },

    // 获取学术直播
    getLearningLive () {
      var $this = this
      $this.live(1, 10, 0, 0,
        function(res) {
          console.log(res)
          $this.page.learningData = res.data.retureData.list
        }, function (res) {
          console.log('获取学术直播失败')
        }
      )
    },

    // 获取晚会直播
    getEveningLive () {
      var $this = this
      $this.live(1, 10, 2, 0,
        function(res) {
          $this.page.eveningData = res.data.retureData.list
        }, function (res) {
          console.log('获取晚会直播失败')
        }
      )
    },

    // 分页分类型获取直播列表（已完成）
    live (page, size, type, sort, cbOk, cbErr) {
      var $this = this
      $this.$axios.get(
        apiList.live+
          '?page=' + page +
          '&size=' + size+
          '&type=' + type+
          '&sort=' + sort+
          '&tenantId=' + settings.tId,
        null,
        cbOk,
        cbErr
      )
    },

    // 获取直播详情（已完成）
    detail (liveId, cbOk, cbErr) {
      var $this = this
      $this.$axios.get(
        apiDetail.detail,
        {
          liveId: liveId
        },
        cbOk,
        cbErr
      )
    },

    // 获取频道的直播(分页获取)
    channel (channelId, token, page, size, cbOk, cbErr) {
      var $this = this
      $this.$axios.get(
        apiDetail.channel,
        {
          channelId: channelId,
          token: token,
          page: page,
          size: size
        },
        cbOk,
        cbErr
      )
    }
  },
  mounted () {
    this.getBroadcast()
    this.getLearningLive()
    this.getEveningLive()
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.focus-imgs {
  height: 220px;
}
.focus-imgs img {
  height: 100%;
  width: 100%;
}
.block {
  padding: 10px 10px 0px;
}
.block h1 {
  height: 24px;
  line-height: 24px;
  border-left: 6px solid red;
  margin: 10px 0px;
}
.block h1 .title {
  margin-left: 10px;
}
.block h1 .more {
}
.block > .content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
