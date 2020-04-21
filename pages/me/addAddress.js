var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
    oUrl:app.globalData.url,//请求链接前缀 
    oName:'',//收货人
    oPhone:'',//电话
    oAddress: '',//地址
    oProvince: '请选择地区',
    isRepeat:true,//避免重复
    sizeFlag:true,//选择地区的颜色
    openid:wx.getStorageSync("_dati_openid"),
    addressId:'',//地址id
    isDefault:1,//新增地址自动默认
    delFlag:false,//删除地址按钮
    remindFlag:false,//设为默认
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    if(options.addressid==undefined){
      //新增
      that.setData({
        addressId:"",
        delFlag:false,//删除按钮
      })
    }else{
      //修改
      var address_info=wx.getStorageSync("address_info")
      console.log(address_info)
      that.setData({
        addressId:options.addressid,
        oName:address_info.username,//收货人
        oPhone:address_info.phonenumber,//联系方式
        oProvince:address_info.local,//省市区
        oAddress:address_info.detail,//详细地址
        isDefault:address_info.is_default,//是否默认
        sizeFlag:false,//选择地址文字 颜色 
        delFlag:true,//删除按钮
      })
      //不是默认地址，显示关，是默认地址显示开
      if(address_info.is_default==0){
        that.setData({
          remindFlag:false,
        })
      }else{
        that.setData({
          remindFlag:true,
        })
      }
    }
    var skuList=wx.getStorageSync('goodsSku');//规则数组
    var sku=that.data.genderArr;
    for(var i=0;i<skuList.length;i++){
      sku.push(skuList[i])
    }
    console.log()
    that.setData({
      goodsid: options.goodsid,//商品id
      goldNum: Number(options.gold),//兑换商品所需要的金币数
      genderArr:sku,//商品规格
    })
    
    
  },
  //获取收货人姓名
  getName:function(e){
    //console.log(e)
    var that=this;
    that.setData({
      oName:e.detail.value,
    })
  },
  //获取手机号
  getPhoneNumber:function(e){
    var that=this;
    that.setData({
      oPhone:e.detail.value,
    })
  },
  //获取详细地址
  getAddress:function(e){
    var that=this;
    that.setData({
      oAddress:e.detail.value,
    })
  },
  //选择地址
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var region = e.detail.value;
    this.setData({
      oProvince: region[0] + region[1] + region[2],
      sizeFlag: false
    })
  },
  //手机号码验证
  phoneREG: function (res) {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(res)) {
      return false;
    } else {
      return true;
    }
  },
  //设为默认
  remindClick:function(){
    var that=this;
    if(that.data.isDefault==1){
      that.setData({
        remindFlag:false,
        isDefault:0,
      })
    }else{
      that.setData({
        remindFlag:true,
        isDefault:1,
      })
    }
    
  },
  //设置默认地址
  setDefaultClick:function(){
    var that=this;
    wx.request({
      url: that.data.oUrl+'/winsPQW/defaultaddress',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
        addressid:that.data.addressId,
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          console.log(res)
          if(res.data.code==1001){
            wx.showToast({
              title: '保存成功',
              icon:'none'
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },1000)
          }
      }
    })
  },
  //提交地址
  addressEdit: function (e) {
    console.log(e)
    let that = this;
    console.log(that.data.addressId)
    console.log(wx.getStorageSync('_dati_openid'))
    console.log(that.data.oName)
    console.log(that.data.oPhone)
    console.log(that.data.oProvince)
    console.log(that.data.oAddress)
    console.log(that.data.isDefault)

   
   // return
    if(that.data.oName== "") {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
      })
    }else if (that.data.oPhone == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
    } else if(!that.phoneREG(that.data.oPhone)){
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
        })
    }else if(that.data.oProvince=='请选择地区') {
      wx.showToast({
        title: '请选择所在省市',
        icon: 'none',
      })
    } else if (that.data.oAddress == "") {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
      })
    } else {    
      console.log('提交');
      that.setData({
        isRepeat:false,
      })
      wx.request({
        url: that.data.oUrl+'/winsPQW/addaddress',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
        },
        data: {
          addressid:that.data.addressId,
          openid:wx.getStorageSync('_dati_openid'),
          username: that.data.oName,
          phonenumber: that.data.oPhone,
          local: that.data.oProvince,//省市区
          detail: that.data.oAddress,//详细地址  
          is_default:that.data.isDefault,//自动默认                 
        },
        dataType: 'json', // 添加这个配置
        method: 'post',
        success: function (res) {
          console.log(res)
          if(res.data.code==1001){
            if(that.data.remindFlag==true){
              that.setDefaultClick();//设置为默认地址接口
            }else{
              wx.showToast({
                title: '保存成功',
                icon:'none'
              })
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1
                })
              },1000)
            }
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
              isRepeat:true,
            })
          },2000)
          
        }
      })
    }

  },
  //删除地址
  delAddress:function(){
    var that=this;
    wx.showModal({
      title:"是否删除该地址",
      content:"",
      success(res){
        if (res.confirm) {
          console.log('用户点击确定')
          that.removeAddress();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
     
    })
    
  },
  //删除地址接口
  removeAddress:function(){
    var that=this;
    wx.request({
      url: that.data.oUrl+'/winsPQW/deladdress',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        addressid:that.data.addressId,
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          console.log(res)
          if(res.data.code==1001){
            wx.navigateBack({
              delta: 1
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