<template name="mediaList">
    <mt-loadmore :auto-fill="false" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottom-distance="40" ref="loadmore">
        <div class="list-container">
            <template v-for="item in page.mediaData">
              <card :key="item.videoId" :data="item"></card>
            </template>
        </div>
    </mt-loadmore>
</template>
<script>
import card from '@/components/commons/Card'
import { apiHome, apiList, apiDetail } from '@/properties/api.js'
import { settings } from '@/properties/settings.js'
export default {
  props: ['type'],
  data () {
    return {
      allLoaded: false,
      sessionId: null,
      page: {
        mediaData: null,
        // mediaData: [
        //   {
        //     videoId: 1,
        //     coverPictureUrl: 'http://placeimg.com/540/260/nature',
        //     liveStatus: 1,
        //     isLive: true,
        //     userName: 'XX',
        //     location: '本地',
        //     liveName: '视频某某',
        //     viewCount: 1000
        //   },
        //   {
        //     videoId: 1,
        //     coverPictureUrl: 'http://placeimg.com/540/260/nature',
        //     liveStatus: 1,
        //     isLive: true,
        //     userName: 'XX',
        //     location: '本地',
        //     liveName: '视频某某',
        //     viewCount: 1000
        //   },
        //   {
        //     videoId: 1,
        //     coverPictureUrl: 'http://placeimg.com/540/260/nature',
        //     liveStatus: 1,
        //     isLive: true,
        //     userName: 'XX',
        //     location: '本地',
        //     liveName: '视频某某',
        //     viewCount: 1000
        //   }
        // ],
        page: 1,
        size: 4,
        type: 0,
        sort: 0
      }
    }
  },
  components: {
    card: card
  },
  methods: {
    initComponent (params) {
      if (typeof params.type !== 'undefined') {
        this.page.type = params.type
        this.getMediaList()
      }
      if (typeof params.sessionId !== 'undefined') {
        this.sessionId = params.sessionId
      }
    },
    loadTop () {
      let $this = this
      $this.page.mediaData = []
      $this.page.page = 1
      $this.allLoaded = false
      $this.getMediaList()
      $this.$refs.loadmore.onTopLoaded()
    },
    loadBottom () {
      let $this = this
      $this.page.page += 1
      $this.getMediaList()
      $this.$refs.loadmore.onBottomLoaded()
    },

    getAllLive () {
      var $this = this
      $this.live(1, 10, 0, 0,
        function(res) {
          $this.page.mediaData = res.data.retureData.list
          console.log(res.data.retureData.list)
        }, function (res) {
          console.log("获取直播失败")
        }
      )
    },

    live (page, size, type, sort, cbOk, cbErr) {
      var $this = this
      $this.$axios.get(
        apiList.live+
          "?page="+page+
          "&size="+size+
          "&type="+type+
          "&sort="+sort+
          "&tenantId="+settings.tId,
        null,
        cbOk,
        cbErr
      )
    },

    getAllBack () {
      var $this = this
      $this.video(1, 10, 0, 0,
        function(res) {
          $this.page.mediaData = res.data.retureData
        }, function (res) {
          console.log("获取回放失败")
        }
      )
    },

    video (page, size, type, sort, cbOk, cbErr) {
      var $this = this
      $this.$axios.get(
        apiHome.video+
          "?page="+page+
          "&size="+size+
          "&type="+type+
          "&sort="+sort+
          "&tenantId="+settings.tId,
        null,
        cbOk,
        cbErr
      )
    },

    getMediaList () {
      // let $this = this
      // this.$axios
      //   .get(get_newest_path)
      //   .then(function(response) {
      //     if (response.data.retureValue == 0) {
      //       console.log(response.data)
      //       if (response.data.retureData.length > 0) {
      //         // $this.page.mediaData = response.data.retureData
      //         $this.page.mediaData.push.apply(
      //           $this.page.mediaData,
      //           response.data.retureData
      //         )
      //         console.log('成功获取数据！')
      //       } else {
      //         $this.allLoaded = true
      //       }
      //     } else {
      //       Toast('抱歉，暂时获取不到视频列表数据！')
      //       $this.allLoaded = true
      //       console.log(response.data.retureMsg)
      //     }
      //   })
      //   .catch(function(error) {
      //     Toast('抱歉，暂时获取不到视频列表数据！!!')
      //     $this.allLoaded = true
      //     console.log(error)
      //   })
    }
  },
  created () {},
  mounted () {
    console.log(this.type)
    if (this.type == 1) {
      this.getAllLive()
    } else {
      this.getAllBack()
    } 
  },
  watch: {}
}
</script>
<style scoped>
a:-webkit-any-link {
  text-decoration: none !important;
}
.list-container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  overflow: scroll;
}
</style>
