var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
    oUrl:app.globalData.url,//请求链接前缀 
    goodsid:'',//商品id
    maxNum:99,
    detailInfo:'',
    labelsList:[],//商品规格
    loadFlag:false,//loading
    goodsId:'',//商品Id
    price:'',//价格
    type:'',//类型，1是实物，2 是音频 
    openid:wx.getStorageSync('_dati_openid'),
    goodsNum:1,//商品数量
    maskFlag:false,//兑换实物弹窗
    labelName:'',//规格标签
    loadFlag:false,
    oIndex:1,//图片索引
    audioFlag:false,//音频明细
    voiceFlag:false,//音频弹窗

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that=this;
    that.setData({
      goodsid: options.goodsid,
      loadFlag:false,
    })
    that.getDetailInfo();
  },
  //音频明细显示隐藏
  selectVoice:function(){
    var that=this;
    that.setData({
      audioFlag:!that.data.audioFlag,
    })
  },
  //减少商品数量
  revNum:function(){
    var that=this;
    var iNum= that.data.goodsNum;
    iNum--;
    if(iNum<1){
      that.setData({
        goodsNum:1,
      })
    }else{
      that.setData({
        goodsNum:iNum,
      })
    }
  },
  //增加商品数量
  addNum:function(){
    var that=this;
    var iNum= that.data.goodsNum;
    iNum++;
    if(iNum>10){
      that.setData({
        goodsNum:10,
      })
    }else{
      that.setData({
        goodsNum:iNum,
      })
    }
   
  },
  hideMask:function(){
    var that=this;
    that.setData({
      maskFlag:false,
      voiceFlag:false,
    })
  },
  //选择规格
  selectCheck:function(e){
    console.log(e)
    var that=this;
    var id=e.currentTarget.dataset.id;
    var isCheck=e.currentTarget.dataset.is_check;
    var label_name=e.currentTarget.dataset.label_name;
    var labelList=that.data.labelsList;
    console.log(labelList)
    if(isCheck){
      for(var i=0;i<labelList.length;i++){
        labelList[i].isCheck=false;
        if(id==labelList[i].id){
          labelList[i].isCheck=false;
        }
      }
    }else{
      for(var i=0;i<labelList.length;i++){
        labelList[i].isCheck=false;
        if(id==labelList[i].id){
          labelList[i].isCheck=true;
        }
      }
    }
   
    that.setData({
      labelName:label_name,
      labelsList:labelList,
    })
  },
  //轮播图滑动
  swiperChange:function(e){
    console.log(e)
    var that=this;
    that.setData({
      oIndex:e.detail.current+1
    })
  },
  //获取详情信息
  getDetailInfo:function(){
    var that=this;
    that.setData({
      loadFlag:true,
      maskFlag:false
    })
    wx.request({
      url: that.data.oUrl+'/winsPQW/goodsinfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        goodsid:that.data.goodsid
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
        console.log(res)
        if (res.data.code == 1001) {
          var info=res.data;
          if(info.goodsinfo.images==''||info.goodsinfo.images==null){
            info.goodsinfo.images=[];
          }else{
            info.goodsinfo.images=info.goodsinfo.images.split(',');
           // info.goodsinfo.images.push('https://win-east.cn/WinsVideo/winspqw/goods/轮播图1.jpeg')
          }
          if(info.goodsinfo.detail==null||info.goodsinfo.detail==""){
            info.goodsinfo.detail=[];
          }else{
            info.goodsinfo.detail=info.goodsinfo.detail.split(',');
          }
          if(info.goodsinfo.labels==null||info.goodsinfo.labels==''){
            info.goodsinfo.labels=[];
          }else{
            var newArr=info.goodsinfo.labels.split(',');
            var labelArr=[];
            for(var i=0;i<newArr.length;i++){
              var aLi={
                id:i,
                sku:newArr[i],
                isCheck:false,
              }
              labelArr.push(aLi);
            }
            //默认选中第一个规格
            labelArr[0].isCheck=true;
            that.setData({
              labelName:labelArr[0].sku,
            })
            info.goodsinfo.labels=labelArr;
          }
          
          console.log(info)
          that.setData({
            detailInfo:info,
            labelsList:info.goodsinfo.labels,
            goodsId:info.goodsinfo.goodsid,//商品ID
            type:info.type,//1是实物2是音频
          })
          setTimeout(function(){
            that.setData({
              loadFlag:false,
            })
          },500)

        }
      }
    })
  },
  //图片加载
  imageLoad:function(e){
   // console.log(e)
    var that=this;
    that.setData({
      loadFlag:false, 
    })
  },
  //立即兑换
  changeClick:function(e){
    console.log(e)
    var that=this;
    var goods_id=e.currentTarget.dataset.goodsid;
    var price=e.currentTarget.dataset.price;
    var type=e.currentTarget.dataset.type;
    //var type=1;
    that.setData({
      goodsId:goods_id,//商品Id
      price:price,//价格
      type:type,//类型，1是实物，2 是音频 
    })
    if(type==1){
      //实物商品
      that.setData({
        maskFlag:true,
        goodsNum:1,
      })
    }else{
      //音频商品
      that.setData({
        voiceFlag:true,
      })
    }
  },
  //立即兑换
  changeGoodsClick:function(){
    var that=this;
    if(that.data.type==1){
      var orderInfo={
        source:1,//实物商品
        type:that.data.type,//兑换类型1，是实物2是音频
        goodsid:that.data.goodsId,//商品ID
        amount:that.data.goodsNum,//商品数量
        label:that.data.labelName,//规格标签
      }
      wx.setStorageSync('order_info', orderInfo)//下单需要参数
      wx.setStorageSync('order_text', '商品下单');//福利ID
      wx.navigateTo({
        url: '/pages/me/addressList1',
      })
    }else{
      that.addAudioOrder();//音频订单
    }
  },
    //订单提醒
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
                    
                  }
               
              }
            })
            
          }
        }
      })
    },
  //音频订单
  addAudioOrder:function(){
    var that=this;
    wx.request({
      url: that.data.oUrl+'/winsPQW/addorder',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        source:that.data.type,//1是实物  2是音频 
        type:that.data.type,//1是实物  2是音频 
        openid:wx.getStorageSync('_dati_openid'),
        goodsid:that.data.goodsId,//商品Id
      },
      dataType: 'json', // 添加这个配置
      method: 'post',
      success: function (res) {
          console.log(res)
          if(res.data.code==1001){
            that.setData({
              voiceFlag:false,
            })
              wx.showToast({
                title: '兑换成功',
                icon:'none',
              })
              that.remindClick();//唤醒订单提醒
          }else if(res.data.code==1004){
            wx.showToast({
              title: '金币不足',
              icon:'none'
            })
          }else{
            wx.showToast({
              title: 'res.data.msg',
              icon:'none'
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
      var label_list=that.data.labelsList;
      for(var i=0;i<label_list.length;i++){
        label_list[i].isCheck=false,
        label_list[0].isCheck=true;
      }
      that.setData({
        maskFlag:false,
      })
      that.getDetailInfo();
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