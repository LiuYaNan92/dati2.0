var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
    oUrl:app.globalData.url,//请求链接前缀  
    openid:wx.getStorageSync('_dati_openid'),
    logList:[],//邀请记录
    noData:false,//暂无数据
    loadFlag:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(options)
    that.getInfo();
   
  },

 //获取信息
 getInfo:function(){
  var that=this;
  that.setData({
    loadFlag:true,
  })
  wx.request({
    url: that.data.oUrl+'/winsPQW/userinviter',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
    },
    data: {
      openid: wx.getStorageSync('_dati_openid'),
    },
    dataType: 'json', // 添加这个配置
    method: 'get',
    success: function (res) {
        //console.log(res)
        if(res.data.code==1001){
          that.setData({
            logList:res.data.list,
            loadFlag:false,
          })
          if(res.data.list.length==0){
            that.setData({
              noData:true,
            })
          }else{
            that.setData({
              noData:false,
            })
          }
         
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
          that.setData({
            noData:false,
            loadFlag:false,
          })
        }

    }
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
      title: '右上角养娃必备题库',
      imageUrl:'../../images/share_img.png',
      path: '/pages/index/index?scene='+that.data.scene
    }
  }
})




