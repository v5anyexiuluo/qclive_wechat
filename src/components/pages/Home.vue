<template>
  <div>
    <mt-swipe :auto="4000" class="focus-imgs">
		<mt-swipe-item v-for="(item ,index) in focusImgs">
			<img :src="item" alt="">
		</mt-swipe-item>
	</mt-swipe>
	<div class="block">
		<h1 style="overflow: hidden;">
			<span class="title">区块一</span>
			<span class="more mint-toast-icon mintui mintui-more rfloat" style="font-size: 20px;"></span>
		</h1>
		<p class="content">
			<card v-for="(item, index) in page.mediaData" :data="item"></card>
		</p>
	</div>
	<div class="block">
		<h1 style="overflow: hidden;">
			<span class="title">区块二</span>
			<span class="more mint-toast-icon mintui mintui-more rfloat" style="font-size: 20px;"></span>
		</h1>
		<p class="content">
			<card v-for="(item, index) in page.mediaData" :data="item"></card>
		</p>
	</div>
  </div>
</template>

<script>
import card from '@/components/commons/Card'
export default {
  name: 'Home',
  data () {
    return {
      focusImgs: ['http://placeimg.com/540/260/nature','http://placeimg.com/540/260/nature','http://placeimg.com/540/260/nature'],
      page: {
		mediaData: [{
			videoId: 1,
			coverPictureUrl: 'http://placeimg.com/540/260/nature',
			liveStatus: 1,
			isLive: true,
			userName: 'XX',
			location: '本地',
			liveName: '视频某某',
			viewCount: 1000
		},{
			videoId: 1,
			coverPictureUrl: 'http://placeimg.com/540/260/nature',
			liveStatus: 1,
			isLive: true,
			userName: 'XX',
			location: '本地',
			liveName: '视频某某',
			viewCount: 1000
		},{
			videoId: 1,
			coverPictureUrl: 'http://placeimg.com/540/260/nature',
			liveStatus: 1,
			isLive: true,
			userName: 'XX',
			location: '本地',
			liveName: '视频某某',
			viewCount: 1000
		}],
		page: 1,
		size: 4,
		type: 0,
		sort: 0
	  },
    }
  },
  components:{
	card: card
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.focus-imgs{
		height: 220px;
	}
	.focus-imgs img{
		height: 100%;
		width: 100%;
	}
	.block{
		padding: 10px 10px 0px;
	}
	.block h1{
	    height: 24px;
	    line-height: 24px;
	    border-left: 6px solid red;
	    margin: 10px 0px;
	}
	.block h1 .title{
		margin-left: 10px;
	}
	.block h1 .more{
	}
	.block>.content{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
</style>