<template name="mediaList">
    <mt-loadmore :auto-fill="false" :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :bottom-distance="40" ref="loadmore">
        <div class="list-container">
            <template v-for="(item, index) in page.mediaData">
            	<card :data="item"></card>
            </template>
        </div>
    </mt-loadmore>
</template>
<script>
	// import {Toast} from "mint-ui"
	import card from '@/components/commons/Card'
	export default {
		props: ["type"],
		data(){
            return {
            	allLoaded: false,
            	sessionId: null,
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
              }
            }
        },
        components:{
      		card: card
        },
        methods:{
        	initComponent(params){
				if(typeof(params.type)!="undefined"){
					this.page.type=params.type;
					this.getMediaList();
				}
				if(typeof(params.sessionId)!="undefined"){
	        		this.sessionId = params.sessionId;
	        	}
        	},
        	loadTop(){
        		let $this = this;
        		$this.page.mediaData=[];
        		$this.page.page=1;
        		$this.allLoaded=false;
        		$this.getMediaList();
        		$this.$refs.loadmore.onTopLoaded()
        	},
        	loadBottom(){
				let $this = this;
        		$this.page.page+=1;
        		$this.getMediaList();
        		$this.$refs.loadmore.onBottomLoaded();
        	},
        	getMediaList(){
	    		let $this = this;
				// this.$axios.get(get_newest_path)
				// .then(function(response){
				// 	if(response.data.retureValue==0){
				// 		console.log(response.data);
				// 		if(response.data.retureData.length>0){
				// 			// $this.page.mediaData = response.data.retureData;
				// 			$this.page.mediaData.push.apply($this.page.mediaData, response.data.retureData);
				// 			console.log('成功获取数据！');
				// 		}else{
				// 			$this.allLoaded=true;
				// 		}
				// 	}else{
				// 		Toast('抱歉，暂时获取不到视频列表数据！');
				// 		$this.allLoaded=true;
				// 		console.log(response.data.retureMsg);
				// 	}
				// })
				// .catch(function(error){
				// 	Toast('抱歉，暂时获取不到视频列表数据！!!');
				// 	$this.allLoaded=true;
				//     console.log(error);
				// });
	    	}
        },
        created: function(){
        },
		mounted: function(){
		},
		watch:{
			
		}
	}
</script>
<style scoped>
	a:-webkit-any-link{
		text-decoration: none!important;
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