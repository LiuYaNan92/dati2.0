// pages/welfare/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //跳转邀请好友
  toInvitation:function(){
    wx.navigateTo({
      url: '/pages/index/invitation',
    })
  },
  toWelfare:function(){
    wx.navigateTo({
      url: '/pages/welfare/welfare',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  //跳转首页
toIndex:function(){
  wx.redirectTo({
    url: '/pages/index/index'
  })
},
//跳转商城
toMall:function(){
  wx.redirectTo({
    url: '/pages/mall/mall'
  })
},

//跳转我的页面
toMe:function(){
  wx.redirectTo({
    url: '/pages/me/index'
  })
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