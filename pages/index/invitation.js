var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
    oUrl:app.globalData.url,//请求链接前缀
    openid:wx.getStorageSync('_dati_openid'),
    info:'',//信息
    maskFlag:false,//
    qCodeImg:'',//二维码
    canvasFlag:false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getInfo();
    that.getCodeImg();
    
  },
  //邀请记录
  goInvitationLog:function(){
    wx.navigateTo({
      url: '/pages/index/invitationLog',
    })
  },
  //邀请好友点击
  invitaitonClick:function(){
    var that=this;
    that.setData({
      maskFlag:true,
    })
  },
  //隐藏弹窗
  hideMask:function(){
    var that=this;
    that.setData({
      maskFlag:false,
    })
  },
  //获取信息
  getInfo:function(){
    var that=this;
    wx.request({
      url: that.data.oUrl+'/winsPQW/userinviter',
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
            that.setData({
              info:res.data
            })
            if(res.data.today_user_count>=500){
              wx.showModal({
                title: '您当日邀请达到上限',
                content: '继续邀请不可获得金币',
                showCancel:false,
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
           
          }

      }
    })
  },

  //获取二维码
  getCodeImg:function(){
    var that=this;
    wx.request({
      url: that.data.oUrl+'/winsPQW/userqrcode',
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
            that.setData({
              qCodeImg:res.data.qrcode
            })
           
          }

      }
    })
  },
  saveImgClick:function(){
    console.log(1111)
  },
  //保存海报 
  saveImg:function(){
    var that=this;
    console.log('保存海报')
    that.setData({
      // loadFlag:true,
      canvasFlag:true
    })
    //return;
    let context = wx.createCanvasContext('canvas');
    var img1=that.data.qCodeImg;//封面图
    var img2='../../images/inv_bg.png';
    var oWidth='';
    wx.getSystemInfo({
      success (res) {
        oWidth=Number(res.windowWidth+30);//设备宽
      }
    })
    context.rect(0, 0, oWidth, 667)
   context.setFillStyle('#84c9c1')
   context.fill()
    wx.downloadFile({
      url:img1,//封面图
      success(res){
        console.log(res)
        if(res.statusCode==200){
          var img_bg=res.tempFilePath;
          context.drawImage(img2, 0, (667-567)/2,375,567);
          context.drawImage(img_bg, (375-120)/2, 320,120,120);
          //调用draw()开始绘制
          context.draw(true,function(){
            //return;
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width:375,//画布宽度
              height: 667,//画布高度
              destWidth: 750,//输出图片宽度
              destHeight: 1334,//输出图片高度
              fileType:'jpg',
              quality:'1',
              canvasId: 'canvas',
              success(res) {
                console.log(res)
                console.log(res.tempFilePath)
                that.setData({
                  imgUrl:res.tempFilePath
                })
                wx.saveImageToPhotosAlbum({
                  filePath:res.tempFilePath,
                  success:function(res){
                    console.log(res)
                    setTimeout(function(){
                      wx.showToast({
                        title: '图片保存成功',
                        icon: 'success',
                        duration: 2000
                      })
                      that.setData({
                        loadFlag:false
                      })
                    },2000)
                    
                  },
                  fail:function(res){
                    console.log(res)
                  }
                })
              }
            })
            
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