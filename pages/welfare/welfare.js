var app = getApp();//获取应用实例
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
    month:date.getMonth()+1,
    days: days,
    day: date.getDate(),
    value: [0, 0, 0],
    infoFlag:false,//完善个人信息弹窗
    oUrl:app.globalData.url,//请求链接前缀 
    list:[],//
    welMaskFlag1:false,//福利获得成功弹窗
    welMaskFlag2:false,//福利领取失败弹窗
    msgIsShow:wx.getStorageSync('msg_is_show'),//福利通知
    openid:wx.getStorageSync('_dati_openid'),
    welfareInfo:'',//福利信息
    welfareType:'',//是实物/音频 2是金币
    welfareId:'',//福利ID
    getType:'',//1是实物，2是音频
    loadFlag:false,
    indexYear:0,//年份索引
    indexMonth:date.getMonth(),//月份索引
    indexDay:date.getDate()-1,//日期索引
    gitType:'',//
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    that.setData({
      value:[0,that.data.month,that.data.day-1],
    })
    that.getWelfareInfo();//获取福利
    setInterval(function(){
      that.getMassage();
    },1000)
    
  },
  //获取福利通知
  getMassage:function(){
    var that=this;
    wx.request({
      url: 'https://www.win-east.cn/winsPQW/msg',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          //console.log(res)
          if(res.data.code==1001){
            wx.setStorageSync('msg_is_show', res.data.msg_is_show);
            // console.log('福利',res.data.msg_is_show)
            that.setData({
              msgIsShow:res.data.msg_is_show,//福利通知
              loadFlag:false,
            })
          }
      }
    })
  },
  //跳转邀请好友
  toInvitation:function(){
    wx.navigateTo({
      url: '/pages/index/invitation',
    })
  },
  //完善个人信息
  fillInfo:function(){
    var that=this;
    that.setData({
      infoFlag:true,
    })
  },
  //隐藏日期下拉
  hideMask:function(){
    var that=this;
    that.setData({
      infoFlag:false,//完善个人信息弹窗
      welMaskFlag1:false,//福利获得成功弹窗
      welMaskFlag2:false,//福利领取失败弹窗
    })
  },
  //时间戳转换天时分秒
  formatDuring:function(mss){
    var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = (mss % (1000 * 60)) / 1000;
    return days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds +'秒';
},

  //立即领取按钮
  receiveBtn:function(){
    var that=this;
    that.setData({
      maskFlag:true,
    })
  },
  
    //选择日期下拉
    selectDateShow:function(){
      var that=this;
      that.setData({
        dateFlag:true,
        dateHeight:-80,//高度向上
        value: [that.data.indexYear,that.data.indexMonth,that.data.indexDay],
      })
    },
  //选择日期
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
      indexYear:val[0],//年份索引
      indexMonth:val[1],//月份索引
      indexDay:val[2],//日期索引
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
      birthday:that.data.year+'-'+that.data.month+'-'+that.data.day,
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
  //立即领取
  getWelfare:function(){
    var that=this;
    var data={};
    if(that.data.gitType==1){
      wx.navigateTo({
        url: '/pages/me/addressList1',
      })
      wx.setStorageSync('welfare_id', that.data.welfareId);//福利ID
      wx.setStorageSync('order_text', '福利领取');//福利ID
    }else{
      data={
        openid:wx.getStorageSync('_dati_openid'),
        welfareid:that.data.welfareId,//福利ID
        addressid:'',//地址ID
      }
      console.log(data)
      wx.request({
        url: that.data.oUrl+'/winsPQW/getwelfare',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
        },
        data:data,
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
            that.setData({
              welMaskFlag1:false,
              welMaskFlag2:false,
            })
            that.getWelfareInfo();
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
        
        }
      })
    }
  },
//查看节日福利
festivalWelfare:function(e){
  var that=this;
  //console.log(e)
  var welfare_id=e.currentTarget.dataset.welfareid;
  var welfare_type=e.currentTarget.dataset.type;
  var git_type=e.currentTarget.dataset.gittype;//1是实物，2是音频 3是金币
  that.setData({
    welfareId:welfare_id,//福利ID
    getType:welfare_type,//1是实物  2是音频
    gitType:git_type
  })
  wx.request({
    url: that.data.oUrl+'/winsPQW/welfaredetail',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
    },
    data: {
      welfareid:welfare_id,
    },
    dataType: 'json', // 添加这个配置
    method: 'get',
    success: function (res) {
        console.log(res)
       if(res.data.code==1001){
         var info=res.data.giftinfo;
         if(info.cover_image==null||info.cover_image==''||info.cover_image==undefined){
          info.cover_image='https://win-east.cn/winsPQW/img/w_pic.png';//如果没有礼品图片显示默认图片
         }else{
          info.cover_image=info.cover_image;
         }
          that.setData({
            welMaskFlag1:true,
            welfareInfo:info,
          })
          if(info.gold==undefined){
           that.setData({
            welfareType:1,//实物/音频
           })
          }else{
            that.setData({
              welfareType:2,//金币
             })
          }
        
       }
     
    }
  })
},

//获取福利列表
getWelfareInfo:function(){
  var that=this;
  that.setData({
    loadFlag:true,
  })
  wx.request({
    url: that.data.oUrl+'/winsPQW/welfare',
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
         var dateDay=new Date();
         var year = dateDay.getFullYear();
         var month = dateDay.getMonth()+1;//当前月份
         var day = dateDay.getDate();//当前日期
         for(var i=0;i<list.length;i++){
           if(list[i].type==1){
             if(list[i].user_birthday_date){
              var user_birthday=list[i].user_birthday_date.split('-');
              if(Number(month)==Number(user_birthday[0])&&Number(day)==Number(user_birthday[1])){
                console.log('查看生日礼包')
                list[i].isShow=false;
              }else{
               list[i].isShow=true;
                console.log('生日当天领取')
              }
             }
             
           }
         }
         that.setData({
           list:list,
           
         })
        
       }else{

       }
     
    }
  })
},
    //提交个人信息
  addInformation: function (e) {
      console.log(e)
      let that = this;
      var name = e.detail.value.name;
      var phone = e.detail.value.phone;
      console.log(name)
      console.log(phone)
      that.setData({
        name: name,
        phone: phone,
       
      })
      console.log(phone)
      console.log(that.data.date)
      console.log(that.data.birthday)
      //console.log(data)
      //return
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
        
      } else if (!app.phoneREG(phone)){
          wx.showToast({
            title: '手机号格式不正确',
            icon: 'none',
            location: 2000
          })
        
      }else if (that.data.birthday == "") {
        console.log(111)
        wx.showToast({
          title: '选择出生日期',
          icon: 'none',
          location: 2000
        })
      }else {    
        that.setData({
          loadFlag:true,
          isBand:true,
        })
       // return
        wx.request({
          url: that.data.oUrl+'/winsPQW/setuserinfo',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
          },
          data: {
            openid:wx.getStorageSync("_dati_openid"),
            realname: name,
            phonenumber: phone,
            birthday: that.data.birthday,//生日
                              
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
              that.getWelfareInfo();//福利列表
              setTimeout(function(){
                that.setData({
                  loadFlag:false,
                })
              },500);
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
    var that=this;
    that.setData({
      welMaskFlag1:false,//福利获得成功弹窗
    })
    that.getWelfareInfo();//获取福利列表
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
  //跳转首页
  toIndex:function(){
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  //跳转商城
  toMall:function(){
    wx.redirectTo({
      url: '/pages/mall/mall'
    })
  },
  
  //跳转我的页面
  toMe:function(){
    wx.redirectTo({
      url: '/pages/me/index'
    })
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