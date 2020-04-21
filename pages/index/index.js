var app = getApp();//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    x: 0,
    area_width: 94,   //可滑动区域的宽，单位是百分比，设置好后自动居中
    box_width: 92,   //滑块的宽,单位是 rpx
    maxNum: 0,        //验证成功时的坐标，不需要设置，代码自动计算；
    coord:0,
    isCheck:false,//是否认证成功
    checkInviterFlag:false,// 是否验证
      signOut:false,// 用户被封停时显示
      is_stop_show:'',
      scene:'',//分享的fromuid  二维码参数scene:"fromuid-7"
      fromuId:'',//
      informationFlag:false,//个人信息弹窗
      loadFlag:false,
      startUpFlag:false,//启动页
      oUrl:app.globalData.url,//请求链接前缀  
      datList:[],//连签日期
      remindFlag:false,//是否打开签到提醒
      openid:wx.getStorageSync('_dati_openid'),
      signFlag:false,//是否签到
      signTotal:'0',//累计签到天数
      headImg:'../../images/head.png',//头像
      nickName:'',//昵称
      realName:'',//真实姓名
      gold:0,//金币
      integral:0,//积分
      userId:'',//用户Id
      levelName:'',//当前等级
      signDay:'0',//连续签到天数
      dayTime:'',//当前日期
      month:'',//当前月份
      day:'',//当前日期
      maskFlag:false,//积分说明弹窗
      advList:[],//广告列表
      answerList:[
        {
          "questionid":228,
          "title":"关于输液，下列哪种说法是正确的？",
          "question_image":"https://win-east.cn/WinsFiles/answerOBJ_question_image/image/20200210/20200210104121246128.jpeg",
          "article_url":"https://mp.weixin.qq.com/s/681weTyErCUexgsiws5fLQ",
          answer_list:[
            {"content":"输液比口服药好得快！","option":"A"},
            {"content":"输液危害大，坚决不能用！","option":"B"},
            {"content":"轻症肺炎一般不用一上来就输液","option":"C"}
          ],
          "correct_answer":"C",
          "usetime":"",
          "user_answer":null,
          "rightAnswer":"",
          "errorAnswer":""
        }
      ],//问题列表
      listArr:[
        {
          "questionid":228,
          "title":"关于输液，下列哪种说法是正确的？",
          "question_image":"https://win-east.cn/WinsFiles/answerOBJ_question_image/image/20200210/20200210104121246128.jpeg",
          "article_url":"https://mp.weixin.qq.com/s/681weTyErCUexgsiws5fLQ",
          answer_list:[
            {"content":"输液比口服药好得快！","option":"A"},
            {"content":"输液危害大，坚决不能用！","option":"B"},
            {"content":"轻症肺炎一般不用一上来就输液","option":"C"}
          ],
          "correct_answer":"C",
          "usetime":"03-10",
          "user_answer":null,
          "rightAnswer":"",
          "errorAnswer":""
        },
        {
          "questionid":228,
          "title":"2关于输液，下列哪种说法是正确的？",
          "question_image":"https://win-east.cn/WinsFiles/answerOBJ_question_image/image/20200210/20200210104121246128.jpeg",
          "article_url":"https://mp.weixin.qq.com/s/681weTyErCUexgsiws5fLQ",
          answer_list:[
            {"content":"输液比口服药好得快！","option":"A"},
            {"content":"输液危害大，坚决不能用！","option":"B"},
            {"content":"轻症肺炎一般不用一上来就输液","option":"C"}
          ],
          "correct_answer":"C",
          "usetime":"03-10",
          "user_answer":null,
          "rightAnswer":"",
          "errorAnswer":""
        },
        {
          "questionid":228,
          "title":"3关于输液，下列哪种说法是正确的？",
          "question_image":"https://win-east.cn/WinsFiles/answerOBJ_question_image/image/20200210/20200210104121246128.jpeg",
          "article_url":"https://mp.weixin.qq.com/s/681weTyErCUexgsiws5fLQ",
          answer_list:[
            {"content":"输液比口服药好得快！","option":"A"},
            {"content":"输液危害大，坚决不能用！","option":"B"},
            {"content":"轻症肺炎一般不用一上来就输液","option":"C"}
          ],
          "correct_answer":"C",
          "usetime":"03-10",
          "user_answer":null,
          "rightAnswer":"",
          "errorAnswer":""
        }
        ],
      showFlag:false,//已完成
      currentIndex:0,//当前显示的题目轮播
      levelText:'',//升级文案
      msgIsShow:wx.getStorageSync('msg_is_show'),//福利通知
      leftFlag:false,//向左按钮
      rightFlag:false,//向右按钮
      indexNum:0,//题目index
      isBand:true,//避免重复
      qHeight:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.setStorageSync('dati_on_ready', 'first')
    that.getStop();
    console.log('options',options)
    console.log(decodeURIComponent(options.scene))
    that.setData({
      msgIsShow:wx.getStorageSync('msg_is_show'),//福利通知
    })
    
    if(options.scene==undefined){
      //如果没有邀请ID
    }else{
      //如果有邀请ID
      if(options.scene.indexOf('-')==-1){
        that.setData({
          fromuId:options.scene,
        })
      }else{
        that.setData({
          fromuId:options.scene.split('-')[1],
        })
      }
     
      var openid=wx.getStorageSync('_dati_openid');
      var is_login=wx.getStorageSync('is_login');
      if(openid){
        if(is_login==''){
          that.setData({
            startUpFlag:true,
          })
          that.getSignDate();//获取日期
        }else{
          that.setData({
            startUpFlag:false,
          })
          //如果登录了，就直接调用邀请接口  如果没登录，就上传完用户信息再调用
          that.addInviterInfo();//判断是否邀请过该用户
        }
      }else{
        that.setData({
          startUpFlag:true,
        })
      }
    }
    var openid=wx.getStorageSync('_dati_openid');
    var is_login=wx.getStorageSync('is_login');
    if(openid){
      if(is_login==''){
        that.setData({
          startUpFlag:true,
        })
        that.getSignDate();//获取日期
      }else{
        that.setData({
          startUpFlag:false,
        })
        that.getInfo();//获取个人信息
      }
      
    }else{
      that.setData({
        startUpFlag:true,
      })
      that.getSignDate();//获取日期
    }
    
  },
  drag(e) {
    console.log(e)
    var that = this;
    var coord = e.detail.x;
    console.log(coord)
    that.setData({
      coord:coord
    })
  },
  dragOver(e) {
    console.log(e)
    var that = this;
    if (that.data.coord >= 192 && that.data.coord<=200) {
      that.setData({
        isCheck:true,//认证成功
      })
      //验证成功之后的代码
    } else {
      that.setData({
        x: 0,
      })
    }
    console.log(this.data.x)
  },

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
  getStop:function(){
    var that=this;
    wx.request({
      url: that.data.oUrl+'/winsPQW/isstop',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success: function (res) {
          console.log(res)
          if(res.data.is_stop==1){
            that.setData({
              is_stop_show:res.data.is_stop
            })
          }
       
      }
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
  //获取签到日期
  getSignDate:function(){
    var that=this;
    var dateDay=new Date();//时间对象
    var year = dateDay.getFullYear();//当前年份
    var month = dateDay.getMonth()+1;//当前月份
    var day = dateDay.getDate();//当前日期
    var mArr = ['一','二','三','四','五','六','七','八','九','十','十一','十二']
    // console.log('dateDay',dateDay)
    // console.log(year,month,day);
    // that.setData({
    //   month:mArr[month-1]+'月'
    // })
    that.setData({
      month:month+'月'
    })
    var newTime=new Date(year+'/'+month+'/'+day);//当前年月日
    var todayTime=newTime.getTime();//当前时间转成时间戳
    var sign_day=that.data.signDay;//连签天数
    var timeArr=[];
    for(var i=0;i<sign_day;i++){
      if(that.data.signFlag){
        var time1=app.timestampToTime((todayTime-i*86400000)/1000).split(' ')[0];//毫秒转秒  时间戳转成日期
      }else{
        var time1=app.timestampToTime((todayTime-(i+1)*86400000)/1000).split(' ')[0];//毫秒转秒
      }
   //   console.log('time1',time1)
      var time2={
        isSign:true,
        time:time1
      }
      //转成日期放到数组 2020-0-3-5
      timeArr.unshift(time2);
    }
   
    for(var i=0;i<7-sign_day;i++){
      if(that.data.signFlag){
        var time1=app.timestampToTime((todayTime+(i+1)*86400000)/1000).split(' ')[0];//毫秒转秒
      }else{
        var time1=app.timestampToTime((todayTime+i*86400000)/1000).split(' ')[0];//毫秒转秒
      }
      
      //转成日期放到数组 2020-0-3-5
      var time2={
        isSign:false,
        time:time1
      }
      timeArr.push(time2);
    }

    //console.log(timeArr)
    var dateArr=[];
    for(var i=0;i<timeArr.length;i++){
      var a_time1=timeArr[i].time.split('-');
      var a_time2='';
      if(that.data.signFlag){
        if(a_time1[1]==month&&a_time1[2]==day){
          a_time2='今日';
        }else{
          if(a_time1[2]<9){
            a_time1[2]='0'+a_time1[2];
          }
          // a_time2=a_time1[1]+'.'+a_time1[2];
          a_time2 = a_time1[2];
        }
      }else{
        // a_time2=a_time1[1]+'.'+a_time1[2];
        a_time2 = a_time1[2];
      }
      
      //a_time2=a_time1[1]+'-'+a_time1[2];
      //截取月份和日期放到数组3-5
      var a_time3={
        isSign:timeArr[i].isSign,
        time:a_time2
      };
      dateArr.push(a_time3);
    }
    console.log(dateArr)
    
    that.setData({
      datList:dateArr,//后面没有签到的数组
    })
    setTimeout(function () {
      var query = wx.createSelectorQuery();
      query.select('.tab-list').boundingClientRect(function (rect) {
        console.log(rect)
        //console.log(rect.height)
        that.setData({
          qHeight: rect.height + 30 + 'px'
        })
      }).exec();

    }, 500)
  },
  //允许授权
  //授权页登录
  agreeGetUser: function (e) {
    let that = this;
    var msg = e.detail.errMsg;
    console.log(msg)
    console.log('index 授权 e :', e);
    
    if (msg == 'getUserInfo:ok') {
      that.login();
     
    }
  },
 
  //金币记录
  goldLog:function(){
    wx.navigateTo({
      url: '/pages/index/goldLog',
    })
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
          that.getAnswerList();//问题列表
          wx.setStorageSync('dati_user_id', userinfo.userid);//用户ID
          wx.setStorageSync('level_name', userinfo.levelname);//等级信息
          wx.setStorageSync('realname', userinfo.realname);//真实姓名
          wx.setStorageSync('birthday', userinfo.birthday);//生日
          wx.setStorageSync('phonenumber', userinfo.phonenumber);//电话
          that.setData({
            signTotal:userinfo.sign_in_total,//累计签到天数
            headImg:userinfo.headimgurl,//头像
            nickName:userinfo.nickname,//昵称
            gold:userinfo.gold,//金币
            integral:userinfo.integral,//积分
            levelName:userinfo.levelname,//当前等级
            userId:userinfo.userid,//用户Id
            realName:userinfo.realname,//真实姓名
          })
          if(userinfo.status==4){
            console.log('该用户被封停')
            that.setData({
              signOut:true,
            })
          }else{
            console.log('该用户未被封停')
            that.setData({
              signOut:false,
            })
          }
          if(userinfo.realname==null){
            that.setData({
              informationFlag:true
            })
          }else{
            that.setData({
              informationFlag:false
            })
          }
          
          if(userinfo.next_level_integral==null||userinfo.next_level_integral==""){
            that.setData({
              levelText:'您已经满级了！'
            })
          }else{
            var integralText=Number(userinfo.next_level_integral)-Number(userinfo.integral);
            that.setData({
              levelText:'距离升级还差'+integralText+'分',
            })
          }
          
          if(userinfo.seven_day_continue_days>7){
            that.setData({
              signDay:0,
            })
          }else{
            that.setData({
              signDay:userinfo.seven_day_continue_days,//连续签到天数
            })
          }

          //是否签到
          if(userinfo.today_is_sign_in==1){
            that.setData({
              signFlag:true,
            }) 
          }else{
            that.setData({
              signFlag:false,
            }) 
          }
          that.getAdList();//广告列表
          that.getSignDate();//签到成功获取连签日期
        }else if(res.data.code==1003){
          console.log('个人信息接口，参数错误')
          that.setData({
            loadFlag:false,
          })
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
  //查看今日日签
  toSign:function(){
    wx.navigateTo({
      url: "/pages/index/sign",
    })
  },
  //积分说明弹窗
  integralDescription:function(){
    var that=this;
    that.setData({
      maskFlag:true,
    })
  },
  //关闭弹窗
  hideMask:function(){
    var that=this;
    that.setData({
      maskFlag:false,
    })
  },
  //模版消息
  handleContact (e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
    
},
  //签到
isSign:function(){
  var that=this;
  wx.request({
    url: that.data.oUrl+'/winsPQW/signin',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
    },
    data: {
      openid: wx.getStorageSync('_dati_openid'),
    },
    dataType: 'json', // 添加这个配置
    method: 'post',
    success: function (res) {
        //console.log(res)
      if (res.data.code == 1001) {
        that.setData({
          signFlag:true,
        }) 
        wx.showToast({
          title: '签到成功',
          icon:'none',
        })
        that.remindClick();//开启模板消息提醒
        that.getInfo();//获取个人信息
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    }
  })
},
//广告点击
advClick:function(e){
  console.log(e)
  var articleUrl=e.currentTarget.dataset.url;
  wx.setStorageSync('articleUrl', articleUrl);
  wx.navigateTo({
    url: "/pages/index/article",
  })
  
},
//选择答案
selectClick:function(e){
    console.log(e)
    var that=this;
    var question_id=e.currentTarget.dataset.qid;//题目Id
    var option=e.currentTarget.dataset.option;//选择的答案
    var right_answer=e.currentTarget.dataset.right;//正确答案
    var list=that.data.answerList;
    console.log(question_id,option,right_answer)
    that.setData({
      isBand:false
    })
    wx.request({
      url: that.data.oUrl+'/winsPQW/addanswer',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        questionid:question_id,
        answer:option,
        openid: wx.getStorageSync('_dati_openid'),
      },
      dataType: 'json', // 添加这个配置
      method: 'post',
      success: function (res) {
          console.log(res)
          if(res.data.code==1001){
            for(var i=0;i<list.length;i++){
              if(question_id==list[i].questionid){
                if(option==right_answer){
                  list[i].rightAnswer=option;
                  list[i].user_answer=option;
                }else{
                  list[i].user_answer=option;
                  list[i].errorAnswer=option;
                }
              }
            }
            that.setData({
              answerList:list,
              isBand:true
            })
            wx.showToast({
              title: '答题成功',
              icon:'none'
            })
          }else if(res.data.code==1004){
            //该题目已经答过了
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none'
            })
          }
       
      },
      complete:function(){
        setTimeout(function(){
          that.setData({
            isBand:true
          })
        },800)
      },
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
  //故事播放器跳转
  toSotryList:function(){
    wx.navigateTo({
      url: "/pages/player/storyList",
    })
  },
  //商城跳转
  toMallPage:function(){
    wx.navigateTo({
      url: "/pages/mall/mall",
    })
  },
  //已答题目
  toAnswerLog:function(){
    wx.navigateTo({
      url: "/pages/index/answerLog",
    })
  },
//获取广告列表
getAdList:function(){
  var that=this;
  wx.request({
    url: that.data.oUrl+'/winsPQW/ad',
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
    },
    data: {
    },
    dataType: 'json', // 添加这个配置
    method: 'get',
    success: function (res) {
        //console.log(res)
        if(res.data.code==1001){
          that.setData({
            advList:res.data.list,
            
          })
          setTimeout(function(){
            that.setData({
              loadFlag:false,
            })
          },500)
        }else if(res.data.code==1002){
          that.setData({
            loadFlag:false,
          })
        }else{
          that.setData({
            loadFlag:false,
          })
        }
     
    }
  })
},
//获取问题列表
getAnswerList:function(){
  var that=this;
  wx.request({
    url: that.data.oUrl+'/winsPQW/todayquestion',
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
          var list=res.data.list;
          var new_list=[];//未答过的题目
          for(var i=0;i<list.length;i++){
            list[i].answer_list=JSON.parse(list[i].answer_list);
            list[i].rightAnswer='';//答对
            list[i].errorAnswer='';//答错
            var time=list[i].usetime.split('-');
            list[i].usetime=time[1]+'-'+time[2];
            //题目如果没有答过再显示
            if(list[i].user_answer==null){
              new_list.push(list[i]);
            }
          }
          console.log('new_list.length',new_list.length)
          if(new_list.length==0){
            that.setData({
              showFlag:true,
              indexNum:0,
            })
          }else{
            that.setData({
              showFlag:false,
            })
          }
          if(new_list.length>1){
            that.setData({
              leftFlag:false,
              rightFlag:true
            })
          }else{
            that.setData({
              leftFlag:false,
              rightFlag:false
            })
          }
          console.log(new_list)
          // wx.setStorageSync('answer_list', new_list);//把问题存到缓存里
          that.setData({
            answerList:new_list,
            loadFlag:false,
          })
          setTimeout(function () {
            var query = wx.createSelectorQuery();
            query.select('.tab-list').boundingClientRect(function (rect) {
              console.log(rect)
              //console.log(rect.height)
              that.setData({
                qHeight: rect.height + 30 + 'px'
              })
            }).exec();

          }, 500)
        }
     
    }
  })
},
// 问题滑动
pageChange:function(e){
  console.log(e)
  var that = this;
  var iNum=e.detail.current;
  if(iNum==0){
    iNum=0;
    that.setData({
      leftFlag:false,
      rightFlag:true,
    })
  }else if(iNum==2){
    that.setData({
      leftFlag:true,
      rightFlag:false,
    })
  }else{
    that.setData({
      leftFlag:true,
      rightFlag:true,
    })
  }
  that.setData({
    indexNum:iNum,
    
  })
},
//上一个
prevBtn:function(){
  var that=this;
  var iNum=that.data.indexNum;
  iNum--;
  if(iNum<=0){
    iNum=0;
    that.setData({
      leftFlag:false,
      rightFlag:true,
    })
  }
  that.setData({
    indexNum:iNum,
    
  })
},
//下一个
nextBtn:function(){
  var that=this;
  var iNum=that.data.indexNum;
  var len=that.data.listArr.length-1;
  iNum++;
  if(iNum>=len){
    iNum=len;
    that.setData({
      leftFlag:true,
      rightFlag:false,
    })
  }
  that.setData({
    indexNum:iNum,
  })
},
//登录授权
login: function () {
  var that = this;
  that.setData({
    loadFlag:true,
  })
  // 登录
  wx.login({
    success: res => {
      //console.log(res)
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      wx.request({
        url: 'https://www.win-east.cn/winsPQW/getopenid',
        method: 'get',
        dataType: 'json', // 添加这个配置
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
        },
        data: {
          code: res.code
        },
        success: function (res) {
          //console.log(res)
          if(res.data.code==1001){
            wx.setStorageSync('_dati_openid', res.data.openid);
            var openid= res.data.openid;
            that.setData({
              openid:openid
            })
            wx.getSetting({
              success: res => {
               // console.log(res)
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                        console.log(res)
                      var encryptedData = res.encryptedData;
                      var iv=res.iv;
                      wx.setStorageSync('dati_nickName', res.userInfo.nickName);
                      wx.setStorageSync('dati_avatarUrl', res.userInfo.avatarUrl);
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (that.userInfoReadyCallback) {
                        that.userInfoReadyCallback(res)
                        console.log(that.userInfoReadyCallback)
                      }
                      wx.request({
                        url: 'https://www.win-east.cn/winsPQW/updateuser',
                        header: {
                          'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
                        },
                        data: {
                          openid: openid,
                          nickname: res.userInfo.nickName,
                          headimgurl: res.userInfo.avatarUrl,
                          gender: res.userInfo.gender,
                          city: res.userInfo.city,
                          province: res.userInfo.province,
                          country: res.userInfo.country
                        },
                        dataType: 'json', // 添加这个配置
                        method: 'post',
                        success: function (res) {
                            //console.log(res)
                          if (res.data.code == 1001) {
                            console.log('上传用户信息成功');  
                            wx.setStorageSync('is_login', true)
                            that.setData({
                              startUpFlag:false,
                            })
                            if(that.data.fromuId){
                              that.addInviterInfo();
                            }
                            that.getInfo();//获取个人信息
                          }else if(res.data.code==1004){
                            wx.showToast({
                              title: res.data.msg,
                              icon:'none',
                              duration:2000
                            })
                            that.setData({
                              loadFlag:false,
                            })
                          }else{
                            that.setData({
                              loadFlag:false,
                            })
                            console.log(res.data.code)
                          }
                        }
                      })
                    }
                  })
                }
              }
            })
          }
          
        }

      })
    }
  })
},
  //签到提醒
  remindClick:function(){
    let that=this;
    wx.requestSubscribeMessage({
      tmplIds: ['Go8t7SIvwUB4KnbmFAhs9uQQIim3xBbi-vt3MWWEFSg'],//签到模版Id
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
              template_id:'Go8t7SIvwUB4KnbmFAhs9uQQIim3xBbi-vt3MWWEFSg',
              openid: that.data.openid,
            },
            dataType: 'json', // 添加这个配置
            method: 'post',
            success: function (res) {
                console.log(res)
                if(res.data.code==1001){
                  wx.navigateTo({
                    url: "/pages/index/sign",
                  })
                }
             
            }
          })
          
        }
      }
    })
   
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
   
  },
  //邀请验证
  checkInviterInfo:function(){
    var that=this;
    wx.request({
      url: that.data.oUrl+'/winsPQW/checkinviter',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
        fromuid:that.data.fromuId,//邀请的用户ID
      },
      dataType: 'json', // 添加这个配置
      method: 'post',
      success: function (res) {
        console.log('是否邀请过该用户')
        console.log(res)
          if(res.data.code==1001){
            if(res.data.is_new==1){
              that.setData({
                checkInviterFlag:true,
              })
            }else{
              that.setData({
                checkInviterFlag:false
              })
            }
          }else{
            console.log('邀请',res.data.msg)
          }
       
      }
    })
  },
  //添加邀请
  addInviterInfo:function(){
    var that=this;
    console.log('openid',wx.getStorageSync('_dati_openid'))
    console.log('fromuid',that.data.fromuId)
    wx.checkSession({
      success () {
        //session_key 未过期，并且在本生命周期一直有效
        console.log('未过期')
        wx.request({
          url: that.data.oUrl+'/winsPQW/addinviter',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
          },
          data: {
            openid:wx.getStorageSync('_dati_openid'),
            // openid:'oTS5o5Pez0i0fHdLPsqdGPyUpRSIP',
            fromuid:that.data.fromuId,//邀请的用户ID
          },
          dataType: 'json', // 添加这个配置
          method: 'post',
          success: function (res) {
            console.log('邀请接口')
              console.log(res)
              if(res.data.code==1001){
                console.log('邀请成功')
                wx.showToast({
                  title: '认证成功',
                  icon:'none'
                })
                that.setData({
                  checkInviterFlag:false
                })
                
              }else if(res.data.code==1005){
                that.setData({
                  startUpFlag:true,
                  signFlag:false,//是否签到
                  signTotal:'0',//累计签到天数
                  headImg:'../../images/head.png',//头像
                  nickName:'',//昵称
                  gold:0,//金币
                  integral:0,//积分
                })
                wx.showToast({
                  title: res.data.msg,
                  icon:'none',
                  duration:2000
                })
                

              }else{
                console.log('邀请',res.data.msg)
                // wx.showToast({
                //   title: '邀请接口'+res.data.msg,
                //   icon:'none'
                // })
              }
           
          }
        })
      },
      fail () {
        // session_key 已经失效，需要重新执行登录流程
        console.log('过期')
        // wx.login() //重新登录
      }
    })
    return;
    wx.request({
      url: that.data.oUrl+'/winsPQW/addinviter',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
        fromuid:that.data.fromuId,//邀请的用户ID
      },
      dataType: 'json', // 添加这个配置
      method: 'post',
      success: function (res) {
        console.log('邀请接口')
          console.log(res)
          if(res.data.code==1001){
            console.log('邀请成功')
            wx.showToast({
              title: '认证成功',
              icon:'none'
            })
            that.setData({
              checkInviterFlag:false
            })
            
          }else{
            console.log('邀请',res.data.msg)
            // wx.showToast({
            //   title: '邀请接口'+res.data.msg,
            //   icon:'none'
            // })
          }
       
      }
    })
  },
  //跳转商城
  toMall:function(){
    wx.redirectTo({
      url: '/pages/mall/mall'
    })
  },
  //跳转福利
  toWelfare:function(){
    wx.redirectTo({
      url: '/pages/welfare/welfare'
    })
  },
  //跳转我的页面
  toMe:function(){
    wx.redirectTo({
      url: '/pages/me/index'
    })
    wx.setStorageSync('info_text', '编辑')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    var openid=wx.getStorageSync('_dati_openid');
    var is_login=wx.getStorageSync('is_login');
    that.setData({
      indexNum:0
    })
    if(openid){
      if(is_login==''){

      }else{
        that.getInfo();//获取个人信息
      }
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
  onShareAppMessage: function (res) {
   var that=this;
   console.log(res)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var userid=wx.getStorageSync('dati_user_id').toString();
    //  var userid="8000001143";
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