<template>
  <view class="goods-detail-container" v-if="goods_info.goods_name">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>

    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goods_info.goods_price}}</view>

      <!-- 主体信息 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods_name">{{goods_info.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>

      <!-- 运费 -->
      <view class="yf">快递：免运费 -- {{cart.length}}</view>
    </view>

    <!-- 商品详情 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>

    <!-- 商品导航组件 -->
    <view class="goods_nav">
      <!-- fill：控制右侧按钮的样式 -->
      <!-- options：左侧按钮的配置项 -->
      <!-- buttonGroup：右侧按钮的配置项 -->
      <!-- @click：左侧按钮的点击事件处理函数 -->
      <!-- @buttonClick：右侧按钮的点击事件处理函数 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  // 从vuex中按需导入mapState，mapMutations，mapGetters辅助方法
  import { mapState, mapMutations, mapGetters } from 'vuex'
  
  export default {
    computed: {
      // 调用mapState方法，把m_cart模块中的cart数组映射到当前页面，作为计算属性使用
      // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
      ...mapState('m_cart', ['cart']),
      // 调用mapGetters方法，把m_cart模块中的total的getter映射到当前页面
      ...mapGetters('m_cart', ['total'])
    },
    data() {
      return {
        // 商品详情对象
        goods_info: {},
        options: [
          {
            icon: 'headphones',
            text: '客服'
          },
          {
            icon: 'shop',
            text: '店铺',
            info: 2,
            infoBackgroundColor:'#007aff',
            infoColor:"red"
          },
          {
            icon: 'cart',
            text: '购物车',
            info: 2
          }
        ],
        buttonGroup: [
          {
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ]
      }
    },
    onLoad(options) {
      // 获取商品id
      const goods_id = options.goods_id
      // 调用请求商品详情数据的方法
      this.getGoodsDetail(goods_id)
    },
    methods: {
      // 定义请求商品详情数据的方法
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        if (res.meta.status !== 200) return uni.$showMsg()

        // 使用字符串的replace()方法，给img标签添加行内的style样式
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,
            '<img style="display:block;" ')
          .replace(/webp/g, 'jpg')
        // 赋值
        this.goods_info = res.message
      },
      // 实现轮播图的预览效果
      preview(i) {
        // 调用方法预览图片
        uni.previewImage({
          // 预览时默认显示图片的索引
          current: i,
          // 所有图片的url地址数组
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      // 左侧按钮的点击事件处理函数
      onClick(e) {
        // console.log(e)
        if (e.content.text === '购物车') {
          // 切换到购物车页面
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      // 右侧按钮的点击事件处理函数
      buttonClick(e) {
        if (e.content.text === '加入购物车') {
          const goods = {
            // 商品的id
            goods_id: this.goods_info.goods_id,
            // 商品的名称
            goods_name: this.goods_info.goods_name,
            // 商品的价格
            goods_price: this.goods_info.goods_price,
            // 商品的数量
            goods_count: 1,
            // 商品的图片
            goods_small_logo: this.goods_info.goods_small_logo,
            // 商品的勾选状态
            goods_state: true
          }
          this.addToCart(goods)
        }
      },
      // 把m_cart模块中的addToCart方法映射到当前页面
      ...mapMutations('m_cart', ['addToCart'])
    },
    watch: {
      // 监听total值的变化
      total: {
        handler(newVal) {
          const findResult = this.options.find((x) => x.text === '购物车')
          if (findResult) {
            findResult.info = newVal
          }
        },
        // immediate属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
        immediate: true
      }
    }
  }
</script>

<style lang="scss">
  goods-detail-container {
    padding-bottom: 50px;
  }
  
  // 轮播图区域
  swiper {
    height: 750rpx;
  
    image {
      width: 100%;
      height: 100%;
    }
  }
  
  // 商品信息区域
  .goods-info-box {
    padding: 10px;
    padding-right: 0;
  
    .price {
      color: #C00000;
      font-size: 18px;
      margin: 10px 0;
    }
  
    .goods-info-body {
      display: flex;
      justify-content: space-between;
  
      .goods_name {
        font-size: 13px;
        padding-right: 10px;
      }
  
      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #efefef;
      }
    }
  
    .yf {
      width: 10px 0;
      font-size: 12px;
      color: gray;
    }
  }
  
  // 商品导航组件
  .goods_nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
</style>
