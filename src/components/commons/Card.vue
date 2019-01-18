<template>
  <router-link :to="{name:'detail', query:{liveId: data.videoId?data.videoId:data.liveId}}" class="item">
    <div class="imgview">
      <img :src="data.coverPictureUrl? data.coverPictureUrl:'https://unsplash.it/200/200/?image='+index" />
    </div>
    <div v-if="data.liveStatus==0" class="islive onlinecolor">
      直播预告
    </div>
    <div v-else-if="data.liveStatus==1" class="islive onlinecolor">
      正在直播
    </div>
    <div v-else class="islive offlinecolor">
      离线
    </div>
    <div class="infoin">
      <div class="theme">
        <span v-if="data.isLive" class="dot onlinecolor"></span>
        <span v-else class="dot offlinecolor"></span>
        <span>{{data.userName? data.userName:'无'}}</span>
      </div>
      <div class="location">
        <img src="/static/images/location.png"/>
        <span>{{data.location? data.location:'未知'}}</span>
      </div>
    </div>
    <div class="infodown">
      <div class="title">
        <span class="media">{{data.liveName? data.liveName:'无'}}</span>
      </div>
      <div class="livecount">
        <span class="livecount" style="background:url('/static/images/user.png') no-repeat left center;padding-left: 16px;margin-right:6px">{{data.viewCount? data.viewCount:0}}</span>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'Card',
  props: ['data'],
  data () {
    return {}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .item {
    display: block;
    width: 49%;
    height: 200px;
    box-sizing: border-box;
    margin-bottom: 10px;
    border-radius: 8px;
    background-color: #fff;
    border: 1px solid #e4e4e4;
    box-shadow: 0 10px 20px #eee;
    overflow: hidden;
    position: relative;
  }
  .item .imgview{
    width: 100%;
    height: 170px;
  }
  .item .imgview img{
    width: 100%;
    height: 100%;
  }
  .onlinecolor{
    background-color: darkred;
  }
  .offlinecolor{
    background-color: gray;
  }
  .item .islive{
    /* width: 120rpx; */
    height: 25px;
    padding: 0px 13px;
    line-height: 25px;
    border-radius: 13px;
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 10pt;
    text-align: center;
    color: white;
  }
  .item .infoin{
    font-size: 10pt;
    position: absolute;
    top: 130px;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  .item .infoin .theme{
    height: 24px;
    line-height: 24px;
    padding: 0 15px 0 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: rgba(211,211,211,0.4);
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    color: white;
  }
  .item .infoin .theme .dot{
    align-self: center;
    display: block;
    width: 10px;
    height: 10px;
    margin-right: 3px;
    border-radius: 10px;
    background-color: white;
  }
  .item .infoin .location{
    margin-right: 10px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    color: white;
  }
  .item .infoin .location img{
    align-self: center;
    display: block;
    width: 15px;
    height: 15px;
    margin-right: 3px;
  }
  .item .infodown{
    width: 100%;
    height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    font-size: 10pt;
    color: gray;
  }
  .item .infodown .title{
    margin-left: 10px;
    height: 30px;
    line-height: 30px;
  }
  .item .infodown .livecount{
    height: 30px;
    line-height: 30px;
  }
  .item .infodown .livecount text{
    padding-left: 18px;
    margin-right: 10px;
    height: 20px;
    width: 20px;
  }
</style>
