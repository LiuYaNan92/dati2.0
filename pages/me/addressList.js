var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
    oUrl:app.globalData.url,//请求链接前缀 
    openid:wx.getStorageSync('_dati_openid'),
    addressList:[],//地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getAddressList();
  },
  //设置默认地址
  setDefaultClick:function(e){
    console.log(e)
    var that=this;
    var address_id=e.currentTarget.dataset.addressid;
    var list=that.data.addressList;
    wx.request({
      url: that.data.oUrl+'/winsPQW/defaultaddress',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
        addressid:address_id,
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          console.log(res)
          if(res.data.code==1001){
            for(var i=0;i<list.length;i++){
              list[i].is_default=0;
              list[i].isCheck=false;
              if(address_id==list[i].addressid){
                list[i].is_default=1;
                list[i].isCheck=true;
              }
            }
            that.setData({
              addressList:list,
            })
          }
          
          
       
      }
    })
  },
  //选择地址
  selectCheck:function(e){
    console.log(e)
    var that=this;
    var address_id=e.currentTarget.dataset.addressid;
    var isCheck=e.currentTarget.dataset.ischeck;
    var list=that.data.addressList;
    if(isCheck){
      for(var i=0;i<list.length;i++){
        list[i].isCheck=false;
        if(address_id==list[i].addressid){
          list[i].isCheck=false;
        }
      }
    }else{
      for(var i=0;i<list.length;i++){
        list[i].isCheck=false;
        if(address_id==list[i].addressid){
          list[i].isCheck=true;
        }
      }
    }
    that.setData({
      addressList:list,
    })
    
  },
  //修改地址
  editAddress:function(e){
    console.log(e)
    var that=this;
    var list=that.data.addressList;
    var address_id=e.currentTarget.dataset.addressid;
    for(var i=0;i<list.length;i++){
      if(address_id==list[i].addressid){
        wx.setStorageSync('address_info', list[i])
      }
    }
    wx.navigateTo({
      url: '/pages/me/addAddress?addressid='+address_id,
    })
  },
  //添加地址按钮
  addressBtn:function(){
    wx.navigateTo({
      url: '/pages/me/addAddress',
    })
  },
  //获取地址列表
  getAddressList:function(){
    var that=this;
    wx.request({
      url: that.data.oUrl+'/winsPQW/address',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          console.log(res)
          if(res.data.code==1001){
            var list=res.data.list;
            for(var i=0;i<list.length;i++){
              list[i].isCheck=false;
              if(list[i].is_default==1){
                list[i].isCheck=true;
              }
            }
            that.setData({
              addressList:list,
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
    var that=this;
    that.getAddressList();
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