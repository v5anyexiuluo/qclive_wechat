// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from '@/properties/axios.js'
import { Button, Header, Navbar, Swipe, SwipeItem, Cell, Tabbar, TabItem, TabContainer, TabContainerItem, Loadmore, Popup, Toast } from 'mint-ui'
import 'mint-ui/lib/style.css'
import '@/assets/css/clear.css'
import '@/assets/css/common.css'
import Chat from './assets/js/my_chat_base.js'

Vue.prototype.$axios = Axios
Vue.prototype.$chat = Chat
Vue.config.productionTip = false

Vue.component(Button.name, Button)
Vue.component(Header.name, Header)
Vue.component(Navbar.name, Navbar)
Vue.component(Swipe.name, Swipe)
Vue.component(SwipeItem.name, SwipeItem)
Vue.component(Cell.name, Cell)
Vue.component(Tabbar.name, Tabbar)
Vue.component(TabItem.name, TabItem)
Vue.component(TabContainer.name, TabContainer)
Vue.component(TabContainerItem.name, TabContainerItem)
Vue.component(Loadmore.name, Loadmore)
Vue.component(Popup.name, Popup)
Vue.component(Toast.name, Toast)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
