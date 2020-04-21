//app.js
App({
  onLaunch: function () {
    var that=this;
    wx.removeStorageSync('inShow')
    wx.removeStorageSync('answerList')
    wx.removeStorageSync('_openid')
    wx.removeStorageSync('_unionid')
    wx.removeStorageSync('nickName')
    wx.removeStorageSync('avatarUrl')
    wx.removeStorageSync('answerArr')
    wx.removeStorageSync('nowCount')
    wx.removeStorageSync('changeCount')
    wx.removeStorageSync('goldNum')
    wx.removeStorageSync('orderList')
    setInterval(function(){
      that.getMassage();//福利通知
    },1000)

  },
  

  //时间戳转日期
   timestampToTime:function(timestamp) {

            var  date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    
            var Y = date.getFullYear() + '-';
    
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    
            var D = date.getDate() + ' ';
    
            var h = date.getHours() + ':';
    
            var m = date.getMinutes() + ':';
    
            var s = date.getSeconds();
    
            return Y+M+D+h+m+s;
    
        },

  //手机号码验证
phoneREG: function (res) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(res)) {
    return false;
  } else {
    return true;
  }
},
  //获取福利通知
  getMassage:function(){
    wx.request({
      url: 'https://www.win-east.cn/winsPQW/msg',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          //console.log(res)
          if(res.data.code==1001){
            wx.setStorageSync('msg_is_show', res.data.msg_is_show);
            // console.log('福利',res.data.msg_is_show)
            // wx.showToast({
            //   title: res.data.msg_is_show,
            //   icon:'none'
            // })
          }
      }
    })
  },
  onShow:function(){
    wx.request({
      url: 'https://www.win-east.cn/winsPQW/openexit',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
        loginstatus:1,//1是打开  2是关闭
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          //console.log(res)
          if(res.data.code==1001){
            console.log('进入小程序')
            wx.setStorageSync('dati_inShow',true);
            
          }
      }
    })
    var hasupdate;
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('版本信息', res)
      console.log(res.hasUpdate)
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
          // wx.showModal({
          //   title: '更新提示',
          //   content: '新版本已经准备好，是否重启应用？',
          //   success(res) {
          //     console.log(res)
          //     if (res.confirm) {
          //       // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          //       updateManager.applyUpdate()
          //     }
          //   }
          // })
        })
      }
    })



    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      console.log('更新失败')
      wx.showModal({
        title: '已经有新版本咯~',
        content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开呦~',
      })
    })
  },
  onHide: function () {
    wx.request({
      url: 'https://www.win-east.cn/winsPQW/openexit',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
        loginstatus:2,//1是打开  2是关闭
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
         // console.log(res)
          if(res.data.code==1001){
            wx.setStorageSync('dati_inShow', false)
            console.log('退出小程序')
          }
          
      }
    })
    
  },
  //登录授权
login: function () {
  var that = this;
  that.setData({
    loadFlag:true,
  })
  // 登录
  wx.login({
    success: res => {
      //console.log(res)
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      wx.request({
        url: 'https://www.win-east.cn/winsPQW/openid',
        method: 'get',
        dataType: 'json', // 添加这个配置
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
        },
        data: {
          code: res.code
        },
        success: function (res) {
          //console.log(res)
          if(res.data.code==1001){
            wx.setStorageSync('_dati_openid', res.data.openid);
            var openid= res.data.openid;
            that.setData({
              openid:openid
            })
            wx.getSetting({
              success: res => {
               // console.log(res)
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                        console.log(res)
                      var encryptedData = res.encryptedData;
                      var iv=res.iv;
                      wx.setStorageSync('dati_nickName', res.userInfo.nickName);
                      wx.setStorageSync('dati_avatarUrl', res.userInfo.avatarUrl);
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (that.userInfoReadyCallback) {
                        that.userInfoReadyCallback(res)
                        console.log(that.userInfoReadyCallback)
                      }
                      wx.request({
                        url: 'https://www.win-east.cn/winsPQW/updateuser',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
                        },
                        data: {
                          openid: openid,
                          nickname: res.userInfo.nickName,
                          headimgurl: res.userInfo.avatarUrl,
                          gender: res.userInfo.gender,
                          city: res.userInfo.city,
                          province: res.userInfo.province,
                          country: res.userInfo.country
                        },
                        dataType: 'json', // 添加这个配置
                        method: 'post',
                        success: function (res) {
                            //console.log(res)
                          if (res.data.code == 1001) {
                            console.log('上传用户信息成功');  
                            that.setData({
                              startUpFlag:false,
                            })
                            if(that.data.fromuId){
                              that.checkInviterInfo();
                            }
                            that.getInfo();//获取个人信息
                          }else{
                            console.log(res.data.code)
                          }
                        }
                      })
                    }
                  })
                }
              }
            })
          }
          
        }

      })
    }
  })
},

  globalData: {
    url: 'https://www.win-east.cn',
  }
})