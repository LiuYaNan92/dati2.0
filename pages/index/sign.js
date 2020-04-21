var app = getApp();//获取应用实例
let cropper = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
    oUrl:app.globalData.url,//请求链接前缀
    openid:wx.getStorageSync('_dati_openid'),
    coverImg:'',//封面图
    signTotal:'',//累计签到天数
    text:'',//字句
    imgUrl:'',//生成的海报图片
    loadFlag:false,
    qrCode:'',//二维码
    src:'',
    width:295,//宽度
    height: 298,//高度
    uploadImg:false,
    cropper:'',
    month:'',//当前月份
    day:'',//当前日期
    canvasFlag:false,
    imgBox:false,//裁剪图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var dateDay=new Date();//时间对象
    var year = dateDay.getFullYear();//当前年份
    var month = dateDay.getMonth()+1;//当前月份
    var day = dateDay.getDate();//当前日期
    if(month<10){
      month='0'+month;
    }
    if(day<10){
      day='0'+day;
    }
    that.setData({
      month:month,
      day:day
    })
    that.getInfo();
  },

  imageClick:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        console.log(res.tempFilePaths[0])
        that.setData({
          imgBox:true
        })
        cropper = that.selectComponent('#cropper');
        cropper.fnInit({
          imagePath:tempFilePaths,       //*必填
          debug: true,                        //可选。是否启用调试，默认值为false。true：打印过程日志；false：关闭过程日志
          outputFileType: 'jpg',              //可选。目标文件的类型。默认值为jpg，jpg：输出jpg格式图片；png：输出png格式图片
          quality: 1,                         //可选。图片的质量。默认值为1，即最高质量。目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
          aspectRatio: 0.92,                  //可选。裁剪的宽高比，默认null，即不限制剪裁宽高比。aspectRatio需大于0
          minBoxWidthRatio: 0.2,              //可选。最小剪裁尺寸与原图尺寸的比率，默认0.15，即宽度最小剪裁到原图的0.15宽。
          minBoxHeightRatio: 0.2,             //可选。同minBoxWidthRatio，当设置aspectRatio时，minBoxHeight值设置无效。minBoxHeight值由minBoxWidth 和 aspectRatio自动计算得到。
          initialBoxWidthRatio: 0.6,          //可选。剪裁框初始大小比率。默认值0.6，即剪裁框默认宽度为图片宽度的0.6倍。
          initialBoxHeightRatio: 0.6          //可选。同initialBoxWidthRatio，当设置aspectRatio时，initialBoxHeightRatio值设置无效。initialBoxHeightRatio值由initialBoxWidthRatio 和 aspectRatio自动计算得到。
          });
        
      }
    })
    
  },
  ////////  cancel ///////////////////
  fnCancel:function(){
    console.log('cancel')
    let that = this;
    //todo something
    that.setData({
      imgBox:false
    })
  },

////////// do crop ////////////////////
  fnSubmit:function(){
    console.log('submit')
    var that = this;
    //do crop
    cropper.fnCrop({

      //剪裁成功的回调
      success:function(res){
        console.log(res)
         //生成文件的临时路径
        console.log(res.tempFilePath);
        // wx.previewImage({
        //   urls: [res.tempFilePath],
        // })
        wx.uploadFile({
          url:  that.data.oUrl+'/winsPQW/uploadappimage',
          filePath: res.tempFilePath,
          header:{
            'content-type':'multipart/form-data',
            'accept': 'application/json',
          },
          name: 'image',
          success:function(res){
            console.log(res)
            var data=JSON.parse(res.data);
            console.log(data)
            wx.showToast({
              title: data.msg,
              icon:'none'
            })
            if(data.code==1001){             
              that.changeUrl(data.image.image_source_url);
              that.setData({
                imgBox:false
              })
            }
          },
          fail:function(res){
            console.log(res)
            // var abc=JSON.stringify(res);
            // wx.showToast({
            //   title: abc,
            //   icon:'none',
            //   duration:3000
            // })
          },
         
        })
      },
      //剪裁失败的回调
      fail:function(res){
        console.log(res);
      },

      //剪裁结束的回调
      complete:function(){
        //complete
      }
    });
  },


  //获取默认图片
  getInfo:function(){
    var that=this;
    that.setData({
      loadFlag:true,
    })
    wx.request({
      url: that.data.oUrl+'/winsPQW/poster',
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
            var info=res.data.info;
            that.setData({
              coverImg:info.image,//封面图
              signTotal:info.sign_in_total,//累计签到天数
              qrCode:info.qrcode,
              text:info.statement,//字句
              loadFlag:false,
            })
          }

      }
    })
  },

  //换张海报
  changeImg:function(){
    var that=this;
    that.setData({
      loadFlag:true,
    })
    wx.request({
      url: that.data.oUrl+'/winsPQW/changeposter',
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
          if(res.data.code==1001){
            var info=res.data.info;
             
            that.setData({
              coverImg:info.image,//封面图
              signTotal:info.sign_in_total,//累计签到天数
              text:info.statement,//字句
              loadFlag:false,
            })
          }

      }
    })
  },
  //更换图片
  addImgClick:function(){
    var that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res)
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        console.log(res.tempFilePaths[0])
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
            wx.showToast({
              title: data.msg,
              icon:'none'
            })
            if(data.code==1001){             
              that.changeUrl(data.image.image_source_url);
            }
          },
          fail:function(res){
            console.log(res)
            // var abc=JSON.stringify(res);
            // wx.showToast({
            //   title: abc,
            //   icon:'none',
            //   duration:3000
            // })
          },
         
        })
      
      

      }
    })
    
    
    
    
  },

  //更换海报接口
  changeUrl:function(img){
    var that=this;
 
    wx.request({
      url: that.data.oUrl+'/winsPQW/updateposter',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
        image_source_url:img,
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          console.log(res)
          if(res.data.code==1001){
            console.log('更换海报成功')
            that.setData({
              coverImg:img,//封面图
           })
          }

      },
      
    })
  },
   




  //保存海报 
  saveImg:function(){
    var that=this;
    console.log('保存海报')
    that.setData({
      loadFlag:true,
      canvasFlag:true
    })
    var oWidth='';
    wx.getSystemInfo({
      success (res) {
        oWidth=res.windowWidth;//设置宽
      }
    })
    //return;
    let context = wx.createCanvasContext('canvas');
    var img1=that.data.coverImg;//封面图
    var img2='../../images/ewm.jpg';
    var img3="../../images/signbg4.jpg";
    var img4="../../images/simg1.png";
    var img5="../../images/simg2.png";
    var text=that.data.text;
    console.log(text.length);
    var text1='';
    var text2='';
    //如果文字长度大于12，就截取成两段
    if(text.length>12){
      text1=text.slice(0,12);//从第0 个字符截取到第12个之前 的字符
      text2=text.slice(12);//从第12个字符截取到最后
    }else{
      text1=text;
    }
    console.log(text1)
    console.log(text2)
   
   
    context.rect(0, 0, oWidth, 667)
   context.setFillStyle('#bdd8d1')
   context.fill()
   
    wx.downloadFile({
      url:img1,//封面图
      success(res){
        console.log(res)
        if(res.statusCode==200){
          var img_bg=res.tempFilePath;
          context.drawImage('../../images/signbg3.jpg', (oWidth-320)/2, 40,320, 600);
          that.imgfillet(context, img_bg, (oWidth-278)/2, 60, 278,303, 2, 10);//海报图
          //     ctx   图片  起始点X Y   图片宽  高   适配单位  圆角半径
          context.setFillStyle('#222')//文字颜色：默认黑色
          context.setFontSize(18)//设置字体大小，默认10
          context.fillText("您的累计签到天数", (oWidth-278)/2, 410)//绘制文本
          context.setFillStyle('#222')//文字颜色：默认黑色
          context.setFontSize(26)//设置字体大小，默认10
          context.fillText(that.data.signTotal, (oWidth-278)/2+150, 410)//绘制文本
          context.drawImage('../../images/bg2.png', (oWidth-278)/2, 430, 105, 26);
          context.setFillStyle('#171717')//文字颜色：默认黑色
          context.setFontSize(14)//设置字体大小，默认10
          context.fillText(text1, (oWidth-278)/2, 480)//绘制文本
          context.setFillStyle('#171717')//文字颜色：默认黑色
          context.setFontSize(14)//设置字体大小，默认10
          context.fillText(text2, (oWidth-278)/2, 500)//绘制文本
          context.drawImage(img3, 248, 380, 70, 95);//日期图片背景
          
          context.setFillStyle('#222')//文字颜色：默认黑色
          context.setFontSize(22)//设置字体大小，默认10
          context.fillText(that.data.month+'月', 260, 412,)//绘制月份
          context.setFillStyle('#222')//文字颜色：默认黑色
          context.setFontSize(50)//设置字体大小，默认10
          context.fillText(that.data.day, 253, 460,)//绘制月份

          context.drawImage(img2, (oWidth-100)/2, 510, 100, 100);
          context.setFillStyle('#222')//文字颜色：默认黑色
          context.setFontSize(12)//设置字体大小，默认10
          context.fillText('长按识别二维码进入小程序', 110, 630,)//绘制
          context.drawImage(img4, (oWidth-320)/2-12, 30, 93, 90);
          context.drawImage(img5, (oWidth-93)-(oWidth-320)/2+12, 560, 93, 90);
         
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
    /* 绘制圆角图片 */ 
    imgfillet(ctx, img, left, top, width, height, w, fillet) {
      //     ctx   图片  起始点X Y   图片宽  高   适配单位  圆角半径
      ctx.beginPath();
      ctx.save();
      left = left / 2 * w;
      top = top / 2 * w;
      width = width / 2 * w;
      height = height / 2 * w;
      fillet = fillet / 2 * w;
      ctx.setLineWidth(1);
      ctx.setStrokeStyle('#ffffff');
      ctx.moveTo(left + fillet, top);           // 创建开始点
      ctx.lineTo(left + width - fillet, top);          // 创建水平线
      ctx.arcTo(left + width, top, left + width, top + fillet, fillet); // 创建弧
      ctx.lineTo(left + width, top + height - fillet);         // 创建垂直线
      ctx.arcTo(left + width, top + height, left + width - fillet, top + height, fillet); // 创建弧
      ctx.lineTo(left + fillet, top + height);         // 创建水平线
      ctx.arcTo(left, top + height, left, top + height - fillet, fillet); // 创建弧
      ctx.lineTo(left, top + fillet);         // 创建垂直线
      ctx.arcTo(left, top, left + fillet, top, fillet); // 创建弧
      ctx.stroke(); // 这个具体干什么用的？
      ctx.clip();
      ctx.drawImage(img, left, top, width, height);
      ctx.restore();
      ctx.closePath();
    },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    //that.saveImg();//保存海报
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