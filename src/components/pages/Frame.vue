<template>
  <div>
    <mt-header title="青葱校园直播" fixed>
		<span slot="left">
			<mt-button icon="back" @click="$router.go(-1)"></mt-button>
		</span>
	    <a v-if="true" slot="right" href="javascript:;">登录</a>
		<img v-else src="https://unsplash.it/30/30/?random" class="user-profile" slot="right"/>
	</mt-header>
	<mt-popup v-model="popupVisible" position="bottom" popup-transition="popup-fade" class="full-width">
		<a href="javascript:;" class="pop-bottom">退出</a>
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
export default {
	name: 'Frame',
	data () {
	return {
		popupVisible: false,
		active: "home",
		tabIcon:{
			home: require('@/assets/images/home.png'),
			list: require('@/assets/images/list.png'),
			my: require('@/assets/images/my.png')
		}
	}
	},
	components:{
	},
	created: function(){

	},
	mounted: function(){

	},
	methods:{

	},
	computed: {
	},
	watch: {
		active: {
			immediate: true,
			handler:function(val, oldVal){
				var $this = this;
				if(oldVal){
					$this.tabIcon[oldVal] = require('@/assets/images/'+oldVal+'.png')
				}
				$this.tabIcon[val] = require('@/assets/images/'+val+'_fill.png')
				if(val=='home'){
					$this.$router.push({name: 'home'})
				}else if(val=='list'){
					$this.$router.push({name: 'list'})
				}else if(val=='my'){
					$this.$router.push({name: 'my'})
				}else{
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
	.user-profile{
		height:30px;
		width:30px;
	}
	.pop-bottom{
		display:block;
		height:60px;
		line-height:60px;
		width:100%;
		text-align:center;
		color:gray;
		font-size:16px;
	}
</style>