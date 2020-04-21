var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskFlag:false,//弹窗
    oUrl:app.globalData.url,//请求链接前缀  
    openid:wx.getStorageSync('_dati_openid'),
    logList:[],//金币明细
    changeList:[],//兑换记录
    noData:false,//暂无数据
    goldFlag:true,//金币 明细
    changeFlag:false,//兑换记录
    loadFlag:false,
    scene:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options)
    
    that.getInfoLog();//金币明细
   
  },
  
  //金币明细点击
  goldClick:function(){
    var that=this;
    that.setData({
      goldFlag:true,//金币 明细
      changeFlag:false,//兑换记录
    })
  },
  //兑换记录点击
  changeClick:function(){
    var that=this;
    that.setData({
      goldFlag:false,//金币 明细
      changeFlag:true,//兑换记录
    })
  },
  //金币明细
  getInfoLog:function(){
    var that=this;
    that.setData({
      loadFlag:true,
    })
    wx.request({
      url: that.data.oUrl+'/winsPQW/goldlog',
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
          if(res.data.code==1001){
            that.setData({
              logList:res.data.list,
              noData:false,
              loadFlag:false,
            })
          }else if(res.data.code==1002){
            that.setData({
              noData:true,
              loadFlag:false,
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
            that.setData({
              loadFlag:false,
            })
          }
       
      }
    })
  },
  
  //弹窗显示
  showMask:function(){
    var that=this;
    that.setData({
      maskFlag:true,
    })
  },
  //弹窗隐藏
  hideMask:function(){
    var that=this;
    that.setData({
      maskFlag:false,
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
      title: '养娃必备题库',
      imageUrl:'../../images/share_img.png',
      path: '/pages/index/index?scene='+that.data.scene
    }
    
  }
})




