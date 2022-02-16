import Vue from 'vue'
import App from './App'

// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'

// 导入Store的实例对象
import store from './store/store.js'

// 挂载
uni.$http = $http

// 配置请求的根路径
$http.baseUrl = 'https://www.uinav.com'

// 请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...'
  })
}

// 判断请求的是否为有权限的API接口
if (options.url.indexOf('/my/') !== -1) {
  options.header = {
    Authorization: store.state.m_user.token
  }
}

// 响应拦截器
$http.afterRequest = function() {
  uni.hideLoading()
}

// 封装展示消息提示的方法
uni.$showMsg = function(title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    // 将store挂载到Vue实例上
    store
})
app.$mount()