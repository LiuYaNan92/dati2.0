var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArr:[],
    oUrl:app.globalData.url,//请求链接前缀  
    openid:wx.getStorageSync('_dati_openid'),
    loadFlag:false,
    noData:false,
    scene:'',
    date:'',//当前日期
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getInfo(); //获取题目列表
    var dateDay=new Date();//时间对象
    var year = dateDay.getFullYear();//当前年份
    var month = dateDay.getMonth()+1;//当前月份
    var day = dateDay.getDate();//当前日期
    if(month<=9){
      month='0'+month;
    }
    if(day<=9){
      day='0'+day
    }
    that.setData({
      date:year+'-'+month+'-'+day
    })
  },
  //查看文章
  viewArticles:function(e){
    //console.log(e)
    var articleUrl=e.currentTarget.dataset.url;
    wx.setStorageSync('articleUrl', articleUrl);
    wx.navigateTo({
      url: "/pages/index/article",
    })

  },
  //获取题目列表
  getInfo:function(){
    var that=this;
    that.setData({
      loadFlag:true,
    })
    wx.request({
      url: that.data.oUrl+'/winsPQW/allquestion',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
        limit:'',
        page:'',
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          console.log(res)
          if(res.data.code==1001){
            var list=res.data.list;
            for(var i=0;i<list.length;i++){
              list[i].answer_list=JSON.parse(list[i].answer_list);
              list[i].rightAnswer=list[i].correct_answer;
              list[i].errorAnswer='';
              for(var j=0;j<list[i].answer_list.length;j++){
                list[i].id=list.length-i;
                if(list[i].correct_answer==list[i].user_answer){
                  list[i].rightAnswer=list[i].correct_answer;//答对
                }else{
                  list[i].errorAnswer=list[i].user_answer;//答错
                }
              }
            }
            //如果是同一天的题，用户答了就显示，用户没答就不显示
            // if(list[0].usetime==that.data.date){
             
            // }
            if(list[0].user_answer==null){
              list.splice(0,1)
            }
            that.setData({
              listArr:list,
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
              noData:false,
              loadFlag:false,
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
  onShareAppMessage: function (res) {
    var that=this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var userid=wx.getStorageSync('dati_user_id').toString();
      var uid=userid.substring(0,userid.length-1);
      var num=userid.charAt(userid.length-1);
      var aid=uid.substr(-num,num)
      that.setData({
        scene:aid,
      })
      console.log(typeof(userid))
      console.log(uid)
      console.log('aid',aid)
      console.log(res.target)
      return {
        title: '养娃必备题库',
        imageUrl:'../../images/share_img.png',
        path: '/pages/index/index?scene='+that.data.scene
      }
    }
     // 来自页面内转发按钮
     var userid=wx.getStorageSync('dati_user_id').toString();
     //  var userid="8000001143";
       var uid=userid.substring(0,userid.length-1);
       var num=userid.charAt(userid.length-1);
       var aid=uid.substr(-num,num)
       that.setData({
         scene:aid,
       })
    console.log('scene',that.data.scene)
    return {
      title: '养娃必备题库',
      imageUrl:'../../images/share_img.png',
      path: '/pages/index/index?scene='+that.data.scene
    }
   }
})