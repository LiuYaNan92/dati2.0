var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
    oUrl:app.globalData.url,//请求链接前缀  
    nickName:wx.getStorageSync('dati_nickName'),//昵称
    headImg:wx.getStorageSync('dati_avatarUrl'),//头像
    userId:wx.getStorageSync('dati_user_id'),//用户id
    phoneNumber:wx.getStorageSync('phonenumber'),//手机号
    birthday:wx.getStorageSync('birthday'),//生日
    isBand:false,//避免重复
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      nickName:wx.getStorageSync('dati_nickName'),//昵称
      headImg:wx.getStorageSync('dati_avatarUrl'),//头像
      userId:wx.getStorageSync('dati_user_id'),//用户id
      phoneNumber:wx.getStorageSync('phonenumber'),//手机号
      birthday:wx.getStorageSync('birthday'),//生日
    })
  },

      //提交个人信息
  addInformation: function (e) {
      console.log(e)
      let that = this;
      that.setData({
        phoneNumber:e.detail.value,
      })
      

  },
  submitInfo:function(){
    var that=this;
    var phone=that.data.phoneNumber;
      if (phone == "") {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
          location: 2000
        })
        
      } else if (!app.phoneREG(phone)){
          wx.showToast({
            title: '手机号格式不正确',
            icon: 'none',
            location: 2000
          })
        
      }else {    
        console.log('提交');
        that.setData({
          isBand:true,
        })
        wx.request({
          url: that.data.oUrl+'/winsPQW/setuserinfo',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
          },
          data: {
            openid:wx.getStorageSync("_dati_openid"),
            phonenumber: that.data.phoneNumber,
          },
          dataType: 'json', // 添加这个配置
          method: 'post',
          success: function (res) {
            console.log(res)
            if (res.data.code == 1001) {  
              that.setData({
                 infoFlag:false,
              })
              wx.showToast({
                title:'提交成功',
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
          complete:function(res){
            setTimeout(function(){
              that.setData({
                isBand:false,
              })
            },2000)
            
          }
        })
        
      }
   
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