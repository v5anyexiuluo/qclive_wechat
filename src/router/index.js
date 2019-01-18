import Vue from 'vue'
import Router from 'vue-router'
import Frame from '@/components/pages/Frame'
import Home from '@/components/pages/Home'
import List from '@/components/pages/List'
import Detail from '@/components/pages/Detail'
import My from '@/components/pages/My'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: { name: 'home' }
    },
    {
      path: '/frame',
      name: 'frame',
      component: Frame,
      children: [{
        path: '/home',
        name: 'home',
        component: Home
      }, {
        path: '/list',
        name: 'list',
        component: List
      }, {
        path: '/my',
        name: 'my',
        component: My
      }]
    },
    {
      path: '/detail',
      name: 'detail',
      component: Detail
    }
  ]
})
