<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#afafaf"></uni-icons>
    
    <!-- 登录按钮 -->
    <button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
    
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益~</view>
  </view>
</template>

<script>
  import { mapMutations } from 'vuex'
  
  export default {
    name:"my-login",
    data() {
      return {
        
      };
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken']),
      // 获取微信用户的基本信息
      getUserInfo() {
        uni.getUserProfile({
          desc:'获取您的昵称、头像、地区及性别',
          success:(res)=>{
            // console.log(res);
            if (res.errMsg === 'getUserProfile:ok') {
              // 将用户基本信息存储到vuex中
              this.updateUserInfo(res.userInfo)
              // 获取登录成功之后的Token字符串
              this.getToken(res)
              console.log(res)
            } else {
              uni.$showMsg('授权失败！')
            }
        	},
        	fail:(err)=>{
            // console.log(err);
            if (res.errMsg === 'getUserProfile:fail auth deny') return uni.$showMsg('您取消了登陆授权！')
          },
        })
      },
      // 调用登录接口，获取永久的token
      async getToken(info) {
        // 调用微信登录的接口
        const [err, res] = await uni.login().catch(err => err)
        console.log(res)
        // 判断uni.login()是否调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('登陆失败！')
        
        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        
        // 换取Token
        const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        console.log(loginResult)
        console.log(loginResult.message)
        console.log(loginResult.meta.status)
        if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        uni.$showMsg('登录成功！')
        
        // 更新vuex中的token
        this.uodateToken(loginResult.message.token)
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #F8F8F8;
    position: relative;
    overflow: hidden;
    
    &::after {
      content: ' ';
      display: block;
      position: absolute;
      width: 100%;
      height: 40px;
      left: 0;
      bottom: 0;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }
    
    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #C00000;
    }
    
    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>
