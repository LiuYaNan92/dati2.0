// pages/index/address.js
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1900; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
    name: '',//收货人
    phone: '',//电话
    date: '请选择出生年月日',//日期
    birthday:'',//生日
    isBand:false,//避免重复
    dateFlag:false,//日期
    dateHeight:'',//日期弹窗向上高度
    dateBox:false,//年龄日期选择
    years: years.reverse(),
    year: date.getFullYear(),
    months: months,
    month:date.getMonth(),
    days: days,
    day: date.getDate(),
    value: [0, 0, 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    that.setData({
      value:[0,that.data.month,that.data.day-1]
    })
    
    
  },


    //选择日期下拉
    selectDateShow:function(){
      var that=this;
      that.setData({
        dateFlag:true,
        dateHeight:-80,//高度向上
      })
    },
  //选择日期
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
    
  },
  //取消选择日期
  hideData:function(){
    var that=this;
    that.setData({
      dateFlag:false,    
      dateHeight:'',//高度恢复
    })
  },
  //确定选择日期
  selectData:function(){
    var that=this;
    that.setData({
      date:that.data.year+'年'+that.data.month+'月'+that.data.day+'日',
      birthday:that.data.year+','+that.data.month+','+that.data.day,
      nameFlag: true,//改变按钮颜色
      dateFlag:false,
      dateHeight:'',//高度恢复
    })
    wx.setStorageSync('year', that.data.year);//年份
  },
  //手机号码验证
  phoneREG: function (res) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(res)) {
      return false;
    } else {
      return true;
    }
  },
  //提交地址
  addressEdit: function (e) {
    console.log(e)
    let that = this;
    var name = e.detail.value.name, phone = e.detail.value.phone, address = e.detail.value.detailAddress;
    console.log(name)
    console.log(phone)
    console.log(address)
    that.setData({
      name: name,
      phone: phone,
      address: address,
      isBand:true,
    })
    console.log(that.data.province)
    //console.log(data)
    if (name == "") {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        location: 2000
      })
    }else if (phone == "") {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        location: 2000
      })
      
    } else if (!that.phoneREG(phone)){
      
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          location: 2000
        })
      
    }else if (that.data.province == "选择地址") {
      console.log(111)
      wx.showToast({
        title: '请选择所在省市',
        icon: 'none',
        location: 2000
      })
    } else if (address == "") {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        location: 2000
      })
    } else {    
      console.log('提交');
      wx.request({
        url: 'https://www.win-east.cn/wins/activity.php?c=AnswerOBJ&a=address_edit',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
        },
        data: {
          unionid:wx.getStorageSync("_unionid"),
          name: name,
          mobile: phone,
          province: that.data.pro,//省
          city: that.data.city,//市
          county: that.data.county,//区
          location: that.data.province,//省市区
          address: address,//详细地址                   
        },
        dataType: 'json', // 添加这个配置
        method: 'post',
        success: function (res) {
          console.log(res)
          if (res.data.code == 10001) {
            that.submitOrder();//提交订单
          }else if(res.data.code==10008){
            wx.showToast({
              title: '请修改之后再提交',
              icon:'none'
            })
          }
        },
        complete:function(res){
          // that.setData({
          //   isBand:false,
          // })
        }
      })
    }

  },
  //提交订单
  submitOrder:function(){
    var that=this;    
    wx.request({
      url: 'https://www.win-east.cn/wins/activity.php?c=AnswerOBJ&a=order',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        unionid: wx.getStorageSync("_unionid"),
        gold:that.data.goldNum,
        goods_id:that.data.goodsid,
        goods_specification:that.data.skuName,//商品规格            
      },
      dataType: 'json', // 添加这个配置
      method: 'post',
      success: function (res) {
        console.log(res)
        if (res.data.code == 10113) {
          //没有收货地址
          wx.showToast({
            title: res.message,
            icon:'none'
          })
          maskfun(res.message);
        } else if (res.data.code == 10101) {
          //金币不足
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        } else if (res.data.code == 10001) {
          //提交成功跳回商品列表页
          wx.showToast({
            title:'提交成功',
            icon: 'none'
          })
          setTimeout(function () {
            wx.navigateTo({
              url: "/pages/index/mall",
            })
          }, 1000)
         
          

        }
      },
      complete:function(res){
        that.setData({
          isBand:false,
        })
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