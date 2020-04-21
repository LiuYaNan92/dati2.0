var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
    maskFlag:false,//抽奖浮窗
    oUrl:app.globalData.url,//请求链接前缀 
    goodsList:[],
    msgIsShow:wx.getStorageSync('msg_is_show'),//福利通知
    loadFlag:false,//
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      msgIsShow:wx.getStorageSync('msg_is_show'),//福利通知
    })
    that.getGoodsList();
  },
  //获取商品列表
  getGoodsList:function(){
    var that=this;
    that.setData({
      loadFlag:true,
    })
    wx.request({
      url: that.data.oUrl+'/winsPQW/goods',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          console.log(res)
          if(res.data.code==1001){
            //return
            var list=res.data.list;
            for(var i=0;i<list.length;i++){
              for(var j=0;j<list[i].goods_list.length;j++){
                if(list[i].goods_list[j].labels==null||list[i].goods_list[j].labels==''){

                }else{
                  list[i].goods_list[j].labels=list[i].goods_list[j].labels.split(',');
                }
                
              }
            }
            that.setData({
              goodsList:list,
            })
            setTimeout(function(){
              that.setData({
                loadFlag:false,
              })
            },500);
          }
          
       
      }
    })
  },
  toDetail:function(e){
    console.log(e)
    var goods_id=e.currentTarget.dataset.good_id;
   
    wx.navigateTo({
      url: '/pages/mall/goodsDetail?goodsid='+goods_id,
    })
  },

  //关闭抽奖浮窗
  hideMask:function(){
    var that=this;
    that.setData({
      maskFlag:false,
    })
  },
  goLuckyDraw:function(){
    wx.navigateTo({
      url: "/pages/mall/luckyDraw",
    })
  },
  //跳转首页
  toIndex:function(){
    wx.redirectTo({
      url: '/pages/index/index'
    })
    wx.setStorageSync('info_text', '个人信息')
  },
  
  //跳转福利
  toWelfare:function(){
    wx.redirectTo({
      url: '/pages/welfare/welfare'
    })
  },
  //跳转我的页面
  toMe:function(){
    wx.redirectTo({
      url: '/pages/me/index'
    })
    wx.setStorageSync('info_text', '编辑')
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
    var that = this
    that.getGoodsList();
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