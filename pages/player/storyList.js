const app=getApp();
const backgroundAudio = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene:'',
    oUrl:app.globalData.url,//请求链接前缀
    listFlag:false,//播放列表显示隐藏
    musicFlag:false,//遮罩
    play1:true,//第一次点击播放按钮
    play2:false,//继续播放按钮
    pause:false,//点击暂停图片
    audioCtx:'',//音频
    storyName:'',//故事名称
    storyAuthor:'',//故事作者
    storyId:'',// 
    startTime:'00:00',//
    endTime:'00:00',
    seekTime:0,
    longTime:'',//总时长
    iNum:0,//第一首
    storyIndex:'0',// 当前正在播放的音频
    animation:false,//滚动效果
    refresh:false,//刷新按钮
    refreshBtn:'',//刷新点击
    toView:'',//定位锚点
    aList:[
      {
        id:101,
        title:'麦草、煤块和豆子',
        listtotal:'2',
        isShow:false,
        list:[
          {
            id:0,
            url:'https://win-east.cn/WinsVideo/AnswerOBJ/answer_voice/2019-11-23/2305245002.mp3',
            name:'科大大发烧',
            author:'123',
            time:"02:00",
          },
          {
            id:1,
            url:'https://www.win-east.cn/WinsMS/application/webapi/view/double_eleven/mp3/wanghouyusheng.mp3',
            name:'往后余生',
            author:'朱习爱',
            time:"02:00",
          }
        ]
      },     
      {
        id:102,
        title:'小狮子和跳伞',
        listtotal:'4',
        isShow:false,
        list:[
          {
            id:2,
            url:'https://www.win-east.cn/WinsMS/application/webapi/view/double_eleven/mp3/clayderman.mp3',
            name:'梦中的婚礼',
            author:'不知道',
            time:"02:00",
          },
          {
            id:3,
            url:'https://www.win-east.cn/WinsMS/application/webapi/view/double_eleven/mp3/xiguanyigeren.mp3',
            name:'习惯一个人',
            author:'刘以兮，刘崇健',
            time:"02:00",
          },
          {
            id:4,
            url:'https://www.win-east.cn/WinsMS/application/webapi/view/double_eleven/mp3/aidebeipan.mp3',
            name:'爱的背版',
            author:'尚文祁',
            time:"02:00",
          },
          {
            id:5,
            url:'https://www.win-east.cn/WinsMS/application/webapi/view/double_eleven/mp3/heyGirl.mp3',
            name:'HeyGirl',
            author:'弦心乐',
            time:"02:00",
          }
        ]
        
      }
    ],
    list:[
      {
        id:0,
        url:'https://win-east.cn/WinsVideo/AnswerOBJ/answer_voice/2019-11-23/2305245002.mp3',
        name:'晚安喵',
        author:'艾索',
        time:"02:00",
      },
      {
        id:1,
        url:'https://www.win-east.cn/WinsMS/application/webapi/view/double_eleven/mp3/wanghouyusheng.mp3',
        name:'往后余生',
        author:'朱习爱',
        time:"02:00",
      },
      {
        id:2,
        url:'https://www.win-east.cn/WinsMS/application/webapi/view/double_eleven/mp3/clayderman.mp3',
        name:'梦中的婚礼',
        author:'不知道',
        time:"02:00",
      },
      {
        id:3,
        url:'https://www.win-east.cn/WinsMS/application/webapi/view/double_eleven/mp3/xiguanyigeren.mp3',
        name:'习惯一个人',
        author:'刘以兮，刘崇健',
        time:"02:00",
      },
      {
        id:4,
        url:'https://www.win-east.cn/WinsMS/application/webapi/view/double_eleven/mp3/aidebeipan.mp3',
        name:'爱的背版',
        author:'尚文祁',
        time:"02:00",
      },
      {
        id:5,
        url:'https://www.win-east.cn/WinsMS/application/webapi/view/double_eleven/mp3/heyGirl.mp3',
        name:'HeyGirl',
        author:'弦心乐',
        time:"02:00",
      }
    ],
    newPlayList:'',//随机播放的列表
    playText:'顺序',
    isDown:false,//没有拖动进度条
    openid:wx.getStorageSync('_dati_openid'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;  
    
    //获取当前播放进度和音频时长
    backgroundAudio.onTimeUpdate(()=>{
      var that=this;
      var currentTime1 = Math.floor(backgroundAudio.currentTime / 60);
      var currentTime2 = Math.floor(backgroundAudio.currentTime % 60);
      var duration1 = Math.floor(backgroundAudio.duration/60);    
      var duration2 = Math.floor(backgroundAudio.duration%60);
      var time1,time2;
      var ctime1,ctime2;
      //
      if(!that.data.isDown){
        that.setData({
          longTime:backgroundAudio.duration,
          seekTime:backgroundAudio.currentTime,
        })
      } 
      if(duration1<10){
        time1='0'+duration1;
      }else{
        time1=''+duration1;
        
      }
      if(duration2<10){
        time2='0'+duration2;
      }else{
        time2=''+duration2;
        
      }
      if(currentTime1<10){
        ctime1='0'+currentTime1;
      }else{
        ctime1=''+currentTime1;
        
      }
      if(currentTime2<10){
        ctime2='0'+currentTime2;
      }else{
        ctime2=''+currentTime2;
        
      }
      that.setData({
        endTime: `${time1}:${time2}`,
        startTime: `${ctime1}:${ctime2}`,
      })
    });
    //播放到结束的时候
    backgroundAudio.onEnded(()=>{
      console.log('结束')
     var that=this;
      var num=that.data.iNum;
      var mList; 
      if(that.data.playText=='顺序'){
        mList=that.data.list;//顺序播放列表
      }else{
        mList=that.data.newPlayList;//随机播放列表
      }
      if(that.data.playText=='单曲'){
        backgroundAudio.src = that.data.audioCtx;
        backgroundAudio.title = that.data.storyName;
        backgroundAudio.singer =that.data.storyAuthor;
      }else{ 
        if(num==mList.length-1){          
          //循环播放
          num=0;        
          that.setData({
            audioCtx:mList[num].url,//音频
            storyName:mList[num].name,//故事名称
            storyAuthor:mList[num].author,//故事作者
            iNum:num,
            storyIndex:mList[num].id,//当前正在播放的音频
            toView: 'item' + mList[num].id,//锚点定位
          })
          backgroundAudio.src = mList[num].url;
          backgroundAudio.title = mList[num].name;
          backgroundAudio.singer = mList[num].author;         
        }else{          
          num++;          
          that.setData({
            audioCtx:mList[num].url,//音频
            storyName:mList[num].name,//故事名称
            storyAuthor:mList[num].author,//故事作者
            iNum:num,
            storyIndex:mList[num].id,//当前正在播放的音频
            toView:'item'+mList[num].id,//锚点定位
          })
          backgroundAudio.src = mList[num].url;
          backgroundAudio.title = mList[num].name;
          backgroundAudio.singer = mList[num].author;
          that.setData({
            play2: false,
            pause: true,
            animation:true,//开始滚动滚动
          })
        }
      }
      
    });
    //监听用户在系统音乐播放面板点击下一首
    backgroundAudio.onNext(()=>{
      var that = this;
      var num = that.data.iNum;
      var mList = that.data.list;
      console.log(mList)
      if (num == mList.length - 1) {
        console.log('最后一首')
        num=0;
        that.setData({
          audioCtx: mList[num].url,//音频
          storyName: mList[num].name,//故事名称
          storyAuthor: mList[num].author,//故事作者
          iNum: num,
          storyIndex: mList[num].id,//当前正在播放的音频
          toView: 'item' + mList[num].id,//锚点定位
          startTime: '00:00',
          endTime: '00:00',
          play2: false,
          pause: true,
        })
        backgroundAudio.src = mList[num].url;
        backgroundAudio.title = mList[num].name;
        backgroundAudio.singer = mList[num].author;
        return;
      } else {
        num++;
        that.setData({
          audioCtx: mList[num].url,//音频
          storyName: mList[num].name,//故事名称
          storyAuthor: mList[num].author,//故事作者
          iNum: num,
          storyIndex: mList[num].id,//当前正在播放的音频
          toView: 'item' + mList[num].id,//锚点定位
          startTime: '00:00',
          endTime: '00:00',
          play2: false,
          pause: true,
        })
        backgroundAudio.src = mList[num].url;
        backgroundAudio.title = mList[num].name;
        backgroundAudio.singer = mList[num].author;
      }
    });
    //监听用户在系统音乐播放面板点击上一首
    backgroundAudio.onPrev(()=>{
      var num = that.data.iNum;
      var mList = that.data.list;
      if (num <= 0) {
        //第一首
        num=mList.length-1;
        that.setData({
          audioCtx: mList[num].url,//音频
          storyName: mList[num].name,//故事名称
          storyAuthor: mList[num].author,//故事作者
          iNum: num,
          storyIndex: mList[num].id,//当前正在播放的音频
          toView: 'item' + mList[num].id,//锚点定位
          startTime: '00:00',
          endTime: '00:00',
          play2: false,
          pause: true,
        })        
        backgroundAudio.src = mList[num].url;
        backgroundAudio.title = mList[num].name;
        backgroundAudio.singer = mList[num].author;  
        return;
      } else {
        num--;
        that.setData({
          audioCtx: mList[num].url,//音频
          storyName: mList[num].name,//故事名称
          storyAuthor: mList[num].author,//故事作者
          iNum: num,
          storyIndex: mList[num].id,//当前正在播放的音频
          toView: 'item' + mList[num].id,//锚点定位
          startTime: '00:00',
          endTime: '00:00',
          play2: false,
          pause: true,
        })        
        backgroundAudio.src = mList[num].url;
        backgroundAudio.title = mList[num].name;
        backgroundAudio.singer = mList[num].author;        

      }
    });
    //监听用户系统音乐播放面板点击暂停
    backgroundAudio.onPause(()=>{
      backgroundAudio.pause();
      console.log('监听暂停')
      that.setData({
        play2: true,
        pause: false,
        animation: false,//停止滚动
      })
    });
    //监听用户系统音乐播放面板点击播放
    backgroundAudio.onPlay(()=>{
      var that = this;
      backgroundAudio.play();
      that.setData({
        play2: false,
        pause: true,
        animation: true,//开始滚动
      })
    });
    //监听音乐播放停止
    backgroundAudio.onStop(()=>{      
      backgroundAudio.pause();
      console.log('监听暂停')
      that.setData({
        play2: true,//继续播放按钮
        pause: false,//点击暂停图片
        animation: false,//开始滚动
        startTime:'00:00',//
      })      
      wx.reLanch({
        url: '/pages/index/index',
        
      })
    })
    console.log(app.globalData.list)
    that.setData({
      list:wx.getStorageSync('list')
    })
   that.getStoryList();//获取故事列表
   
  },
  //获取故事列表
  getStoryList:function(){
    var that=this;
    wx.request({
      url: that.data.oUrl+'/winsPQW/voice',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 改变默认值为这个配置
      },
      data: {
        openid:wx.getStorageSync('_dati_openid'),
      },
      dataType: 'json', // 添加这个配置
      method: 'get',
      success:function(res){
        console.log(res)
        if(res.data.code==1001){
           var list=res.data.list;
           var voiceList=[];
           for(var i=0;i<list.length;i++){
            list[i].isShow=false;
            for(var j=0;j<list[i].voice_list.length;j++){
              voiceList.push(list[i].voice_list[j])
            }
            
           }
           console.log(voiceList)
           if(voiceList.length==0){
            that.setData({
              aList:[],//展示列表
              list:[],//顺序播放的列表   
              storyName:'',//音频名称
            })
           }else{
             for(var i=0;i<voiceList.length;i++){
              voiceList[i].index=i;
             }
            that.setData({
              aList:list,//展示列表
              list:voiceList,//顺序播放的列表   
              storyName:voiceList[0].name,//音频名称
            })
           }
          

          // that.setData({
          //   list:list,//顺序播放的列表            
          //   storyName: list[0].name,
          //   storyAuthor: list[0].author,
          // })
           wx.setStorageSync('dati_orderList', list);//随机播放的列表
          
         
        }
      }
    })
  },
  // 手动结束后
  seek(e) {
    var that = this;
    var value = e.detail.value;
    that.setData({
      isDown:false,
      seekTime:value,//播放进度
    })
    backgroundAudio.seek(value);//音频自动跳转到播放进度
  },
  /**
   * 滑动中
   */
  seeking(e) {
    //console.log(e)
    var that = this;
    var value = e.detail.value;
    that.setData({
      seekTime:e.detail.value,//当前播放进度
     // startTime:that.formatS2M(value),
      isDown:true,
    })  
  },
  //顺序播放、随机播放
  playOrder:function(){
    var that=this;
    if(that.data.playText=='顺序'){
      var newList=that.shuffle(wx.getStorageSync('dati_orderList'));
      var num=0;
      that.setData({
        playText:'随机',
        audioCtx: newList[num].url,//音频
        storyName: newList[num].name,//故事名称
        storyAuthor: newList[num].author,//故事作者
        iNum: num,
        animation:true,//开始滚动
        listFlag: 0,//弹窗隐藏
        play1:false,
        play2:false,
        pause:true,
        storyIndex:newList[num].id,//当前正在播放的音频
        toView:'item'+newList[num].id,//锚点定位
        musicFlag:false,//隐藏遮罩
        newPlayList:newList,//随机播放列表
      }) 
      backgroundAudio.src = newList[num].url;
      backgroundAudio.title = newList[num].name;
      backgroundAudio.singer = newList[num].author;
    }else if(that.data.playText=='随机'){
      that.setData({
        playText:'单曲',
      })     
    }else{
      var mList=that.data.list;
      var num=0;
      that.setData({
        playText:'顺序',
        audioCtx: mList[num].url,//音频
        storyName: mList[num].name,//故事名称
        storyAuthor: mList[num].author,//故事作者
        iNum: num,
        animation:true,//开始滚动
        listFlag: 0,//弹窗隐藏
        play1:false,
        play2:false,
        pause:true,
        storyIndex:mList[num].id,//当前正在播放的音频
        toView:'item'+mList[num].id,//锚点定位
        musicFlag:false,//隐藏遮罩
      }) 
      backgroundAudio.src = mList[num].url;
      backgroundAudio.title = mList[num].name;
      backgroundAudio.singer = mList[num].author;
    }
    
  },
  //随机排序
  shuffle:function(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        var index = parseInt(Math.random() * (len - i));
        var temp = arr[index];
        arr[index] = arr[len - i - 1];
        arr[len - i - 1] = temp;
    }
    return arr;
  },
  //播放全部
  playAll:function(){
    var that=this;
    var num=0;
    var mList=that.data.list;
    
    that.setData({
      audioCtx: mList[num].url,//音频
      storyName: mList[num].name,//故事名称
      storyAuthor: mList[num].author,//故事作者
      iNum: num,
      animation:true,//开始滚动
      listFlag: 0,//弹窗隐藏
      play1:false,
      play2:false,
      pause:true,
      storyIndex:mList[num].id,//当前正在播放的音频
      toView:'item'+mList[num].id,//锚点定位
      musicFlag:false,//隐藏遮罩
    }) 
    backgroundAudio.src = mList[num].url;
    backgroundAudio.title = mList[num].name;
    backgroundAudio.singer = mList[num].author;
  },
  //上一首 
  prevClick:function(){
    var that=this;
    var num=that.data.iNum;
    var mList; 
    if(that.data.playText=='顺序'){
      mList=that.data.list;//顺序播放列表
    }else{
      mList=that.data.newPlayList;//随机播放列表
    }
    if(num<=0){
      console.log('第一首')
      num=mList.length-1;
      that.setData({
        audioCtx:mList[num].url,//音频
        storyName:mList[num].name,//故事名称
        storyAuthor:mList[num].author,//故事作者
        iNum:num,
        storyIndex:mList[num].id,//当前正在播放的音频
        toView:'item'+mList[num].id,//锚点定位
        startTime:'00:00',
        endTime:'00:00',
      })
      backgroundAudio.src = mList[num].url;
      backgroundAudio.title = mList[num].name;
      backgroundAudio.singer = mList[num].author;
      return;
    }else{
      num--;
      that.setData({
        audioCtx:mList[num].url,//音频
        storyName:mList[num].name,//故事名称
        storyAuthor:mList[num].author,//故事作者
        iNum:num,
        storyIndex:mList[num].id,//当前正在播放的音频
        toView:'item'+mList[num].id,//锚点定位
        startTime:'00:00',
        endTime:'00:00',
      })      
      if(that.data.play1){
        //如果没有播放，就不自动播放
        that.setData({
          play1: true,
          pause: false,
        })
      }
      if(that.data.play2){
        that.setData({
          play1: false,
          play2:true,
          pause: false,
        })        
      }else{
        that.setData({
          play2: false,
          pause: true,
        })
        backgroundAudio.src = mList[num].url;
        backgroundAudio.title = mList[num].name;
        backgroundAudio.singer = mList[num].author;
      }
      
    }
  //  console.log('prev', num)
  },
  //下一首
  nextClick:function(){
    var that=this;
    var num=that.data.iNum;
    var mList; 
    if(that.data.playText=='顺序'){
      mList=that.data.list;//顺序播放列表
    }else{
      mList=that.data.newPlayList;//随机播放列表
    }
   // console.log(mList)
    if(num==mList.length-1){
      console.log('最后一首');
      num=0;
      that.setData({
        audioCtx:mList[num].url,//音频
        storyName:mList[num].name,//故事名称
        storyAuthor:mList[num].author,//故事作者
        iNum:num,
        storyIndex:mList[num].id,//当前正在播放的音频
        toView:'item'+mList[num].id,//锚点定位
        startTime:'00:00',
        endTime:'00:00',
      })
      backgroundAudio.src = mList[num].url;
      backgroundAudio.title = mList[num].name;
      backgroundAudio.singer = mList[num].author;
      return;
    }else{
      num++;
     // console.log(num)
      that.setData({
        audioCtx:mList[num].url,//音频
        storyName:mList[num].name,//故事名称
        storyAuthor:mList[num].author,//故事作者
        iNum:num,
        storyIndex:mList[num].id,//当前正在播放的音频
        toView:'item'+mList[num].id,//锚点定位
        startTime:'00:00',
        endTime:'00:00',
      })
      
      if(that.data.play1){
        that.setData({
          play1: true,
          pause: false,
        })
      }
      if(that.data.play2){
          that.setData({
            play1: false,
            play2:true,
            pause: false,
          })
        }else{
          backgroundAudio.src = mList[num].url;
          backgroundAudio.title = mList[num].name;
          backgroundAudio.singer = mList[num].author;
          that.setData({
            play2: false,
            play1:false,
            pause: true,
          })
        }
     
    }
   // console.log('next', num)
  },
  //选择音乐播放
  selectMusic:function(e){
    console.log(e)
    var that=this;   
    var indexId=e.currentTarget.dataset.id;
    let list = that.data.list
    for(var i=0;i<list.length;i++){
      if(indexId==list[i].id){
        that.setData({
          iNum:list[i].index,//索引
        })
      }
    }
    that.setData({
      audioCtx:e.currentTarget.dataset.url,
      play1: false,
      play2:false,
      pause:true,
      listFlag:0,
      storyName:e.currentTarget.dataset.name,
      storyAuthor:e.currentTarget.dataset.author,
      storyIndex:indexId,//当前正在播放的音频
      animation:true,//开始滚动
      toView:'item'+indexId,//锚点定位
      musicFlag:false,//隐藏遮罩
    })
    backgroundAudio.src = e.currentTarget.dataset.url;
    backgroundAudio.title = e.currentTarget.dataset.name;
    backgroundAudio.singer = e.currentTarget.dataset.author;
   
  },
  //第一次播放
  play:function(){
    var that=this;
    //console.log(that.data.list)
    backgroundAudio.src = that.data.list[that.data.iNum].url;
    backgroundAudio.title = that.data.list[that.data.iNum].name;
    backgroundAudio.singer = that.data.list[that.data.iNum].author;
    that.setData({
      play1: false,//第一次点击播放按钮
      play2: false,//继续播放按钮
      pause: true,//点击暂停图片
      storyIndex:that.data.list[that.data.iNum].id,//当前正在播放的音频
      toView:'item'+that.data.list[that.data.iNum].id,//锚点定位
      audioCtx:that.data.list[that.data.iNum].url,
    })
  },
  //播放
  audioPlay:function(){
    var that=this; 
   // console.log('第二次') 
   var mList=that.data.list;      
    backgroundAudio.play();
    that.setData({
      play1: false,//第一次点击播放按钮
      play2: false,//继续播放按钮
      pause: true,//点击暂停图片
      animation:true,//开始滚动
      storyIndex: that.data.storyIndex,
      toView:'item'+that.data.storyIndex,//锚点定位
    })
  },
  //暂停
  pause:function(){
    var that=this;
    backgroundAudio.pause();
    that.setData({
      play2: true,//继续播放按钮
      pause: false,//点击暂停图片
      animation: false,//开始滚动      
    })
  },

  //展示、隐藏
  isShow:function(e){
    console.log(e)
    //return;
    var that=this;
    var id=e.currentTarget.dataset.id;
    var is_show=e.currentTarget.dataset.is_show;
    var list=that.data.aList;
    if(is_show){
      for(var i=0;i<list.length;i++){
        list[i].isShow=false;
        if(id==list[i].packageid){
          list[i].isShow=false;
        }
      }
    }else{
      for(var i=0;i<list.length;i++){
        list[i].isShow=false;
        if(id==list[i].packageid){
          list[i].isShow=true;
        }
      }
    }
    that.setData({
      aList:list,
    })
  },
  //展示故事列表
  showList:function(){
    var that=this;
    console.log('item'+that.data.storyIndex)
    that.setData({
      listFlag: true,
      musicFlag:true,
      toView:'item'+that.data.storyIndex,//锚点定位
    })
   
  },
  //收起故事列表
  hideList:function(){
    var that=this;
    that.setData({
      listFlag:false,
      musicFlag:false,
    })
  },
  formatS2M(seconds) {
    var durationMinute = parseInt(seconds / 60);
    var durationSecond = parseInt(seconds % 60);
    if (durationSecond < 10) {
      durationSecond = '0' + durationSecond;
    }
    if (durationMinute < 10) {
      durationMinute = '0' + durationMinute;
    }
    return (durationMinute + ':' + durationSecond)
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
    
    var inShow=wx.getStorageSync('dati_inShow');
   
    console.log('dati_inShow', inShow)
    if(inShow){
      console.log('进入小程序')
     
   
      // if(that.data.play){
        
      // }else{
      //   that.AudioContext = wx.createAudioContext('audio');
      //   this.AudioContext.play();
      //   that.setData({
      //     play: false,
      //     pause: true,
      //     animation: true,//开始滚动滚动
      //   })
      // }
      
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   
    /*
    var that=this;
    that.AudioContext = wx.createAudioContext('audio');
    this.AudioContext.pause();
    that.setData({
      play: true,
      pause: false,
      animation: false,//开始滚动滚动
    })*/
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