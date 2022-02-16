// 导入Vue和Vuex
import Vue from 'vue'
import Vuex from 'vuex'
// 导入购物车的vuex模块
import moduleCart from './cart.js'
// 导入用户的vuex模块
import moduleUser from './user.js'

// 将Vuex安装成为Vue插件
Vue.use(Vuex)

// 创建Store的实例对象
const store = new Vuex.Store({
  // TODO：挂载store模块
  modules: {
    // 挂载购物车的vuex模块，模块成员的访问路径调整为m_cart
    m_cart: moduleCart,
    // 挂载用户的vuex模块，访问路径为m_user
    m_user: moduleUser
  }
})

// 向外共享Store的实例对象
export default store