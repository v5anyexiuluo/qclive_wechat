<template>
<!--index.wxml-->
<div class="container">
  <div class="userinfo">
    <template v-if="userInfo">
      <img class="userinfo-avatar" :src="userInfo.headPicId? userInfo.headPicId:'https://placehold.it/70x70/09f/fff.png?text=暂无头像'" background-size="cover"></img>
      <span class="userinfo-nickname">{{userInfo.nickName? userInfo.nickName:"未知"}}</span>
    </template>
    <template v-else>
      <router-link to="../login/login" class="a-login">登录</router-link>
    </template>
  </div>
  <div class="info_list">
    <template v-for="item in userListInfo">
        <div class="weui_cell">
            <div class="weui_cell_hd"><img :src="item.icon"></img></div>
            <div class="weui_cell_bd">
                <div class="weui_cell_bd_p"> {{item.text}} </div>
            </div>
            <div v-if="item.isunread" class="badge">{{item.unreadNum}}</div>
            <div class="with_arrow"></div>
        </div>
    </template>
  </div>
</div>
</template>

<script>
export default {
  name: 'my',
  data () {
    return {
      userInfo: null,
      userListInfo: [ {
	      icon: require('@/assets/images/iconfont-history.png'),
	      text: '历史纪录',
	      isunread: true,
	      unreadNum: 2
	    }, {
	        icon: require('@/assets/images/iconfont-love.png'),
	        text: '我的收藏',
	        isunread: false,
	        unreadNum: 2
	      }, {
	        icon: require('@/assets/images/iconfont-kefu.png'),
	        text: '联系客服'
	      }, {
	        icon: require('@/assets/images/iconfont-help.png'),
	        text: '常见问题'
	      }]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	/**index.wxss**/
	.container {
	  background-color: #F2f2f2;
	}
	.userinfo {
	  height: 140px;
	  background: url("data:image/jpeg;base64,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") no-repeat left top;
	  /* padding: 50rpx 0; */
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  flex-wrap: nowrap;
	  justify-content: center;
	}
	.userinfo a{
	  color: white;
	  text-decoration: none;
	}
	.userinfo a:hover{
	  color: red;
	}
	.userinfo-avatar {
	  width: 65px;
	  height: 65px;
	  margin: 10px;
	  border-radius: 50%;
	}
	.userinfo-nickname {
	  color: white;
	}
	.weui_cell{
	    position: relative;
	    display: flex;
	    padding: 15px;
	    -webkit-box-align: center;
	    -ms-flex-align: center;
	    align-items: center;
	    border-bottom: 1px solid #dadada;
	}
	.weui_cell_hd{
	  display: inline-block;
	  width: 20px;
	  height: 20px;
	  margin-right: 5px;
	}
	.weui_cell_hd img{
	  width: 100%;
	  height: 20px;
	  vertical-align: -2px;
	}
	.weui_cell_bd{
	  display: inline-block;
	}
	.weui_cell_bd_p{
	  font-size: 14px;
	  color: #939393;
	}
	.badge{
	  position: absolute;
	  top: 18px;
	  right: 40px;
	  width: 15px;
	  height: 15px;
	  line-height: 15px;
	  background: #ff0000;
	  color: #fff;
	  border-radius: 50%;
	  text-align: center;
	  font-size: 8px;
	}
	.with_arrow{
	  position: absolute;
	  top: 18px;
	  right: 15px;
	  width: 15px;
	  height: 15px;
	  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA8UExURQAAAJOTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk5OTk3d0CiEAAAAUdFJOUwAFDbevoZiOeGxhRKeHf1hRSz0ybptjKgAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAHNJREFUOE+tk0EOgCAQAwFRUARE//9XL/Vm7R6c0yRtAoFd91AuCCNMfzROGMPSKDBGiAPG8PGAMQyNvcMYft5gDENjWWEU3UgZQqkNwsgJQmgVQlAHqCuqXD2CyNVHyFwMg8zFuHkx0iF+L4VcmvG6ds7dcpoCmzwNk7cAAAAASUVORK5CYII=);
	  background-repeat: no-repeat;
	  background-size: 100% 100%;
	}
</style>