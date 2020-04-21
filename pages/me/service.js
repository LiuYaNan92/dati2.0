var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
    oUrl:app.globalData.url,//请求链接前缀 
    nickName:'',//昵称
    headImg:'',//头像
    imageUrl:'',//图片
    textVal:'',//
    imageArr:[],//图片消息
    newArr:[],//文本消息
    maskFlag:false,
    list:[
      // {
      //   text1:'1.何时发货？',
      //   text2:'每周五统一发货，发货后会更新快递信息，如遇商城礼品缺货，兑换金币退回，并额外补偿一定的金币数。已兑换订单，会陆续正常发货。'
      // },{
      //   text1:'2.哪里查看兑换订单？',
      //   text2:'点击小程序“我的订单”查看兑换订单详情'
      // },{
      //   text1:'3.无法正常签到？',
      //   text2:'请关闭小程序后清除微信缓存在进行签到，如果仍然不能签到请联系人工客服说明。'
      // },{
      //   name:wx.getStorageSync('nickName'),
      //   headimg:wx.getStorageSync('avatarUrl'),
      //   text1:'4.连签奖励未获得？',
      //   text2:'可查看金币记录查询金币获得详情'
      // }
    ],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    
    that.setData({
      nickName:wx.getStorageSync('dati_nickName'),//昵称
      headImg:wx.getStorageSync('dati_avatarUrl'),//头像
    })
    var info=wx.getStorageSync('service_info');
    if(info==''||info==null||info==undefined){

    }else{
      that.setData({
        list:wx.getStorageSync('service_info')
      })
      that.pageScrollToBottom();//滚动条滚动到底部
    }
  
  },
  showMask:function(){
    var that=this;
    that.setData({
      maskFlag:true,
    })
  },
  hideMask:function(){
    var that=this;
    that.setData({
      maskFlag:false,
    })
  },
  //发送
  sendClick:function(){
    var that=this;
    var arr=that.data.list;
    var text={
        text1:'',
        text2:'',
        text3:that.data.textVal,
        imgurl:'',
      }
      arr.push(text)
      that.setData({
        list:arr,
      })
      that.pageScrollToBottom();//滚动条滚动到底部
   // that.getServiceInfo();//收集客服消息
  },
  //添加图片
  addImg:function(){
    var that=this;
    var arr=that.data.list;
    
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        console.log(res)
        wx.uploadFile({
          url:  that.data.oUrl+'/winsPQW/uploadappimage',
          filePath: tempFilePaths,
          header:{
            'content-type':'multipart/form-data',
            'accept': 'application/json',
          },
          name: 'image',
          success:function(res){
            console.log(res)
            var data=JSON.parse(res.data);
            console.log(data)
            if(data.code==1001){             
              var text={
                text1:'',
                text2:'',
                text3:'',
                imgurl:data.image.image_source_url,
              }
              arr.push(text)
              that.setData({
                list:arr,
                imageUrl:data.image.image_source_url,
              })
              that.pageScrollToBottom();//滚动条滚动到底部
              that.getServiceInfo();//收集客服消息
            }
          },
         
        })
        
      }
    })
  },
  //获取信息
  getInfo:function(e){
    var that=this;
    that.setData({
      textVal:e.detail.value,
    })
  },
  //收集客服消息接口
  getServiceInfo:function(){
    var that=this;
    
    wx.request({
      url: that.data.oUrl+'/winsPQW/addserve',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync("_dati_openid"),
        content: that.data.textVal,
        image:that.data.imageUrl,
      },
      dataType: 'json', // 添加这个配置
      method: 'post',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1001) {  
          that.setData({
            textVal:'',//把input清空
            imageUrl:'',
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      },
      
    })
  },
//滚动条滚动到底部
  pageScrollToBottom:function() {
    var that=this;
    wx.createSelectorQuery().select('#warp').boundingClientRect(function(rect){
     // console.log(rect)
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.bottom + 5000
      })
    }).exec()
    wx.setStorageSync('service_info', that.data.list)
  },
  //问题一点击
  question1Click:function(inde){
    var that=this;
    var arr=that.data.list;
    var text={
        text1:'1.何时发货？',
        text2:'',
        text3:'',
        imgurl:'',
      }
      arr.push(text)
      that.setData({
        list:arr,
      })
      that.pageScrollToBottom();//滚动条滚动到底部
      setTimeout(function(){
        text.text2='每周五统一发货，发货后会更新快递信息，如遇商城礼品缺货，兑换金币退回，并额外补偿一定的金币数。已兑换订单，会陆续正常发货。'
        that.setData({
          list:arr,
        })
        that.pageScrollToBottom();//滚动条滚动到底部
      },1000)
  },
  //问题二点击
  question2Click:function(){
    var that=this;
    var arr=that.data.list;
    var text={
        text1:'2.哪里查看兑换订单？',
        text2:'',
        text3:'',
        imgurl:'',
      }
      arr.push(text)
      that.setData({
        list:arr,
      })
      that.pageScrollToBottom();//滚动条滚动到底部
      setTimeout(function(){
        text.text2='点击小程序“我的订单”查看兑换订单详情'
        that.setData({
          list:arr,
        })
        that.pageScrollToBottom();//滚动条滚动到底部
      },1000)
  },
  //问题三点击
  question3Click:function(){
    var that=this;
    var arr=that.data.list;
    var text={
        text1:'3.无法正常签到？',
        text2:'',
        text3:'',
        imgurl:'',
      }
      arr.push(text)
      that.setData({
        list:arr,
      })
      that.pageScrollToBottom();//滚动条滚动到底部
      setTimeout(function(){
        text.text2='请关闭小程序后清除微信缓存在进行签到，如果仍然不能签到请联系人工客服说明。'
        that.setData({
          list:arr,
        })
        that.pageScrollToBottom();//滚动条滚动到底部
      },1000)
  },
   //问题四点击
   question4Click:function(){
    var that=this;
    var arr=that.data.list;
    var text={
        text1:'4.连签奖励未获得？',
        text2:'',
        text3:'',
        imgurl:'',
      }
      arr.push(text)
      that.setData({
        list:arr,
      })
      that.pageScrollToBottom();//滚动条滚动到底部
      setTimeout(function(){
       text.text2='可查看金币记录查询金币获得详情'
        that.setData({
          list:arr,
        })
        that.pageScrollToBottom();//滚动条滚动到底部
      },1000)
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
    var info=wx.getStorageSync('service_info');
    if(info==''||info==null||info==undefined){

    }else{
      that.setData({
        list:wx.getStorageSync('service_info')
      })
      that.pageScrollToBottom();//滚动条滚动到底部
    }
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