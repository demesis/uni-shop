import { mapGetters } from 'vuex'

// 导出一个mixin对象
export default {
  computed: {
    // 将m_cart模块中的tatal映射到当前页面的计算属性
    ...mapGetters('m_cart', ['total'])
  },
  watch: {
    total() {
      this.setBadge()
    }
  },
  onShow() {
    // 页面刚显示的时候设置数字徽标
    this.setBadge()
  },
  methods: {
    setBadge() {
      uni.setTabBarBadge({
        index: 2,
        text: this.total + ''
      })
    }
  }
}