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

Component({
  properties:{
    title:{
      type:String,
      value:''
    },
   
  },
  data:{
    oUrl:app.globalData.url,//请求链接前缀  
    infoFlag:true,//个人信息弹窗
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
    value: [0,date.getMonth(),date.getDate()-1],
    realName:true,//真实姓名
    indexYear:0,//年份索引
    indexMonth:date.getMonth(),//月份索引
    indexDay:date.getDate()-1,//日期索引
  },
  created:function(){
    var that=this;
    
   that.getInfo();
  },
  ready:function(){
    var that = this
    console.log(111)
    var is_show=wx.getStorageSync('dati_on_ready')
    if(is_show=='first'){
        that.setData({
          infoFlag:false
        })
    }else{
      that.setData({
        infoFlag:true
      })
    }
  },
  methods:{
     //跳转个人信息
  toPersonal:function(){
    var that=this;
    var realname=wx.getStorageSync('realname');
    if(realname==null){
      that.setData({
        infoFlag:true,   
      })
    }else{
      wx.navigateTo({
        url: '/pages/me/center',
      })
    }
   
  },
    //关闭弹窗
    infoHideMask:function(){
      var that=this;
      that.setData({
        infoFlag:false,
      })
      console.log(that.data.grade)
      
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
      //console.log(e)
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
            title: "请输入姓名",
            icon: "none",
          })
          that.setData({
            infoFlag:false,
          })
        }else if (phone == "") {
          wx.showToast({
            title: "请输入手机号",
            icon: "none",
          })
          
        } else if (!app.phoneREG(phone)){
          
            wx.showToast({
              title: "手机号格式不正确",
              icon: "none",
            })
          
        }else if (that.data.birthday == "") {
          console.log(111)
          wx.showToast({
            title: "选择出生日期",
            icon: "none",
          })
        }else {    
          console.log('提交');
          that.setData({
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
                  title:"提交成功",
                  icon:"none"
                })
                wx.removeStorageSync('dati_on_ready')
                that.getInfo();//获取个人信息
              }else{
                wx.showToast({
                  title: res.data.msg,
                  icon:"none"
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
     
  //获取个人信息
  getInfo:function(){
    var that=this;
    that.setData({
      loadFlag:true,
    })
    wx.request({
      url: that.data.oUrl+'/winsPQW/userinfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid: wx.getStorageSync('_dati_openid'),
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          console.log(res)
        if (res.data.code == 1001) {
          var userinfo=res.data.userinfo;
          if(userinfo.realname==null||userinfo.realname==''||userinfo.realname==undefined){
            that.setData({
              realName:true,
            })
          }else{
            that.setData({
              realName:false
            })
          }
          console.log(that.data.realName)
          
          
          
          

        }else if(res.data.code==1003){
          console.log('个人信息接口，参数错误')
        }else{
         wx.showToast({
           title: res.data.msg,
           icon:'none'
         })
         that.setData({
           loadFlag:false,
         })
        }
      }
    })
  },

  }
})