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
    addressId:'',//地址ID
    isRepeat:true,// 避免重复下单
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getAddressList();
  },
  
  //选择地址
  selectCheck:function(e){
    console.log(e)
    var that=this;
    var address_id=e.currentTarget.dataset.addressid;
    var isCheck=e.currentTarget.dataset.ischeck;
    var list=that.data.addressList;
    that.setData({
      addressId:address_id,
    })
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
  //下单
  addOrderInfo:function(){
    var  that=this;
    var orderText=wx.getStorageSync('order_text');//福利ID
    that.setData({
      isRepeat:false,
    })
    if(orderText=="福利领取"){
      that.getWelfare();//福利领取
    }else{
      that.addGoodsOrder();//实物下单
    }
  },
  //福利领取
  getWelfare:function(){
    var that=this;
    var welfare_id=wx.getStorageSync('welfare_id');//福利ID
    if(that.data.addressId==''){
      wx.showToast({
        title: '请正确选择地址',
        icons:'none'
      })
    }else{
      wx.request({
        url: that.data.oUrl+'/winsPQW/getwelfare',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
        },
        data:{
          openid:wx.getStorageSync('_dati_openid'),
          welfareid:welfare_id,//福利ID
          addressid:that.data.addressId,//地址ID
        },
        dataType: 'json', // 添加这个配置
        method: 'get',
        success: function (res) {
            console.log(res)
          if(res.data.code==1001){
            wx.showToast({
              title: "领取成功",
              icon:'none',
              suration:2000,
            })
            setTimeout(function(){
              wx.navigateBack({
                data:1,
              })
            },1000)
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            }) 
            that.setData({
              welMaskFlag1:false,
              welMaskFlag2:false,
            }) 
          }
        
        },
        complete:function () {
          setTimeout(function(){
            that.setData({
              isRepeat:true
            })
          },1000)
        },
      })
    }
   
  },
  //签到提醒
  remindClick:function(){
    let that=this;
    wx.requestSubscribeMessage({
      tmplIds: ['RbdayuwVXktCCRZ-rxOPFIiBUoNnrQjdiCV8Ebeq_YM'],//订单模版Id
      success (res) { 
        console.log('模版消息',res)
        if(res.errMsg=="requestSubscribeMessage:ok"){
          console.log('允许接收')
          wx.request({
            url: that.data.oUrl+'/winsPQW/subion',
            header: {
              'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
            },
            data: {
              template_id:'RbdayuwVXktCCRZ-rxOPFIiBUoNnrQjdiCV8Ebeq_YM',
              openid: wx.getStorageSync('_dati_openid'),
            },
            dataType: 'json', // 添加这个配置
            method: 'post',
            success: function (res) {
                console.log(res)
                if(res.data.code==1001){
                  setTimeout(function(){
                    wx.navigateBack({
                      
                    })
                  },1000)
                }
             
            }
          })
          
        }
      }
    })
  },
 //实物订单
 addGoodsOrder:function(){
  var that=this;
  var order_info=wx.getStorageSync('order_info');
  console.log(order_info);
  //return
  if(that.data.addressId==''){
    wx.showToast({
      title: '请正确选择地址',
      icon:'none'
    })
  }else{
    wx.request({
      url: that.data.oUrl+'/winsPQW/addorder',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        source:order_info.source,//1是实物  2是音频 
        type:order_info.type,//1是实物  2是音频 
        openid:wx.getStorageSync('_dati_openid'),
        goodsid:order_info.goodsid,//商品Id
        addressid:that.data.addressId,//地址ID
        amount:order_info.amount,//商品数量
        label:order_info.label,//规格标签
      },
      dataType: 'json', // 添加这个配置
      method: 'post',
      success: function (res) {
          console.log(res)
          if(res.data.code==1001){
              wx.showToast({
                title: '提交成功',
                icon:'none',
                suration:2000,
              })
              that.remindClick();//开启提醒
          }else if(res.data.code==1004){
            wx.showToast({
              title: '金币不足',
              icon:'none'
            })
            setTimeout(function(){
              wx.navigateBack({
                
              })
            },1000)
          }else if(res.data.code==1005){
            wx.showToast({
              title: '等级不足',
              icon:'none'
            })
            setTimeout(function(){
              wx.navigateBack({
                
              })
            },1000)
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }
      },
      complete:function(){
        setTimeout(function(){
          that.setData({
            isRepeat:true
          })
        },1000)
      }
    })
  }
 
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
                that.setData({
                  addressId:list[i].addressid,//默认地址ID
                })
              }
            }
            that.setData({
              addressList:list,
            })
          }else if(res.data.code==1002){
            that.setData({
              addressList:[],
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