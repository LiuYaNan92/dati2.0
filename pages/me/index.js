var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oUrl:app.globalData.url,//请求链接前缀
    scene:'',
    nickName:wx.getStorageSync('dati_nickName'),//昵称
    headImg:wx.getStorageSync('dati_avatarUrl'),//头像
    levelName:wx.getStorageSync('level_name'),//当前等级
    userId:wx.getStorageSync('dati_user_id'),//用户id
    msgIsShow:wx.getStorageSync('msg_is_show'),//福利通知
    realName:wx.getStorageSync('realname'),//真实姓名
    isFlag:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getInfoFun();
    that.setData({
      nickName:wx.getStorageSync('dati_nickName'),//昵称
      headImg:wx.getStorageSync('dati_avatarUrl'),//头像
      levelName:wx.getStorageSync('level_name'),//当前等级
      userId:wx.getStorageSync('dati_user_id'),//用户id
    })
    that.setData({
      msgIsShow:wx.getStorageSync('msg_is_show'),//福利通知
    })
   
  },
  //跳转个人信息
  toPersonal:function(){
    var that=this;
    var realname=wx.getStorageSync('realname');
    if(realname==null){
      that.setData({
        infoFlag:true,   
      })
    }else{
      wx.navigateTo({
        url: '/pages/me/center',
      })
    }
   
  },
  //获取个人信息
  getInfoFun:function(){
    var that=this;
    console.log(111)
    wx.request({
      url: that.data.oUrl+'/winsPQW/userinfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid: wx.getStorageSync('_dati_openid'),
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          console.log(res)
        if (res.data.code == 1001) {
          var userinfo=res.data.userinfo;
          if(userinfo.realname==null||userinfo.realname==''||userinfo.realname==undefined){
            that.setData({
              isFlag:true,
            })
          }else{
            that.setData({
              isFlag:false
            })
          }
          console.log(that.data.realName)
        }else if(res.data.code==1003){
          console.log('个人信息接口，参数错误')
        }else{
        //  wx.showToast({
        //    title: res.data.msg,
        //    icon:'none'
        //  })
        //  that.setData({
        //    loadFlag:false,
        //  })
        }
      }
    })
  },
  //故事播放器跳转
  toSotryList:function(){
    wx.navigateTo({
      url: "/pages/player/storyList",
    })
  },
  //往期题目
  toAnswerLog:function(){
    wx.navigateTo({
      url: "/pages/index/answerLog",
    })
  },
  //订单列表
  toOrderList:function(){
    wx.navigateTo({
      url: "/pages/order/order",
    })
  },
  //地址列表
  toAddressList:function(){
    wx.navigateTo({
      url: "/pages/me/addressList",
    })
  },
  //我的兑换
  toGoldLog:function(){
    wx.navigateTo({
      url: "/pages/index/changeList",
    })
  },
  //跳转客服页面
  toService:function(){
    wx.navigateTo({
      url: '/pages/me/service',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //模版消息
  handleContact (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
    
},
//跳转首页
toIndex:function(){
  wx.redirectTo({
    url: '/pages/index/index'
  })
  wx.setStorageSync('info_text', '个人信息')
},
//跳转商城
toMall:function(){
  wx.redirectTo({
    url: '/pages/mall/mall'
  })
},
//跳转福利
toWelfare:function(){
  wx.redirectTo({
    url: '/pages/welfare/welfare'
  })
},



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that=this;
    // 来自页面内转发按钮
    var userid=wx.getStorageSync('dati_user_id').toString();
    var uid=userid.substring(0,userid.length-1);
    var num=userid.charAt(userid.length-1);
    var aid=uid.substr(-num,num)
    that.setData({
      scene:aid,
    })
    return {
      title: '右上角养娃必备题库',
      imageUrl:'../../images/share_img.png',
      path: '/pages/index/index?scene='+that.data.scene
    }
  }
})