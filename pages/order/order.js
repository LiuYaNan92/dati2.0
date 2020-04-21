var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
    oUrl:app.globalData.url,//请求链接前缀 
    openid:wx.getStorageSync('_dati_openid'),
    tabIndex:0,
    type:0,//0全部，1已完成，2已发货，3已删除 4待发货
    arrowFlag1:false,
    arrowFlag2:true,
    orderList:[],
    noData:false,//暂无数据
    loadFlag:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getOrderList(0);
  },
  //确认收货
  setStatus:function(e){
    var that=this;
    var oid=e.currentTarget.dataset.oid;
    var list=that.data.orderList;
    wx.request({
      url: that.data.oUrl+'/winsPQW/receivegoods',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        orderid:oid,
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1001) {
          wx.showToast({
            title: '已确认收货',
            icon:'none'
          })
          for(var i=0;i<list.length;i++){
            if(oid==list[i].orderid){
              list.splice(i,1)
            }
          }
          if(list.length==0){
            that.setData({
              noData:true,
              orderList:[],
            })
          }else{
            that.setData({
              orderList:list,
              noData:false,
            })
          }
          
          
        }else{
         
          
        }
      }
    })
  },
  //再来一单
  onMoreClick:function(e){
    console.log(e)
    var goods_id=e.currentTarget.dataset.good_id;
    wx.navigateTo({
      url: '/pages/mall/goodsDetail?goodsid='+goods_id,
    })
  },
  //提醒发货
  showClick:function(){
    wx.showToast({
      title: '提醒成功',
      icon:'none',
      duration:2000,
    })
  },
  //获取订单列表
  getOrderList:function(type){
    var that=this;
    that.setData({
      orderList:[],
      loadFlag:true,
    })
    wx.request({
      url: that.data.oUrl+'/winsPQW/order',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
        status:type,
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1001) {
          that.setData({
            orderList:res.data.list,
            loadFlag:false,
            noData:false,
          })

        }else if(res.data.code==1002){
          that.setData({
            noData:true,
            loadFlag:false,
          })
        }else{
         
          that.setData({
            loadFlag:false,
            noData:false,
          })
        }
      }
    })
  },
  //全部订单
  allList:function(){
    var that=this;
    that.setData({
      orderList:[],
      tabIndex:0,
    })
    that.getOrderList(0);
  },
  //待发货
  deliverGoods:function(){
    var that = this;
    that.setData({
      orderList: [],
      tabIndex:1,
    })
    that.getOrderList(4);
  },
  //待收货/已发货
  receivingGoods:function(){
    var that = this;
    that.setData({
      orderList: [],
      tabIndex:2,
    })
    that.getOrderList(2);
  },
  //已完成
  completeClick:function(){
    var that = this;
    that.setData({
      orderList: [],
      tabIndex:3
    })
    that.getOrderList(1);
  },
  //已取消
  cancelClick:function(){
    var that=this;
    that.setData({
      orderList:[],
      tabIndex:4,
    })
    that.getOrderList(3);
  },
  //确认收货
  confirmReceipt:function(e){
    var that=this;
    console.log(e)
    var orderId=e.currentTarget.dataset.order_id;
    console.log(orderId)
    //return;
    wx.request({
      url: 'https://win-east.cn/wins/activity.php?c=AnswerOBJ&a=order_complete',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        order_id: orderId,        
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
        console.log(res)
        if(res.data.code==10003){       
          //待收货
          that.setData({
            orderList: [],
          })
          if(that.data.tabIndex==0){
            that.getOrderList(1);
          }else{
            that.getOrderList(3);
          }
          
         
        }
      }
    })
  },
  arrowClick1:function(e){
    var that=this;
    console.log(e)
    var orderId=e.currentTarget.dataset.order_id;
    var listArr=that.data.orderList;
    for(var i=0;i<listArr.length;i++){
      if(orderId==listArr[i].order_id){
        listArr[i].arrowFlag1=false;
        listArr[i].arrowFlag2=true;
      }
    }   
    that.setData({
      orderList:listArr
    })
  },
  arrowClick2:function(e){
    var that=this;
     var orderId=e.currentTarget.dataset.order_id;
    var listArr=that.data.orderList;
    for(var i=0;i<listArr.length;i++){
      if(orderId==listArr[i].order_id){
        listArr[i].arrowFlag1=true;
        listArr[i].arrowFlag2=false;
      }
    }  
    that.setData({
      orderList:listArr
    }) 
    // that.setData({
    //   arrowFlag1:true,
    //   arrowFlag2:false,
    // })
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