const app=getApp();
const backgroundAudio = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicMask:true,//弹窗显示隐藏
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
    playList:[],//播放列表
    startTime:'00:00',//当前播放时间
    endTime:'00:00',//总时间
    longTime:'00:00',//音频总时长
    seekTime:'',//正在播放的时间
    play:true,//播放按钮
    pause:false,//暂停按钮
    storyName:'名称',//播放名称
    iNum:0,//播放索引
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var list=that.data.aList;
    var playArr=[];//
    for(var i=0;i<list.length;i++){
      for(var j=0;j<list[i].list.length;j++){
        playArr.push(list[i].list[j]);
      }
    }
    that.setData({
      playList:playArr,//播放列表
      storyName:playArr[0].name,//音频名称
    })
    //监听正在播放音频时获取音频时长
    backgroundAudio.onTimeUpdate(()=>{
      var that=this;
      var currentTime=backgroundAudio.currentTime;//当前播放时间
      var duration=backgroundAudio.duration;//音频总时长 
      that.setData({
        startTime:that.formatS2M(currentTime),//当前播放时间
        endTime:that.formatS2M(duration),//音频总时长
        longTime:duration,//总时长
        seekTime:currentTime,//当前播放进度
      })
    });
    //监听当前音频播放结束
    backgroundAudio.onEnded(()=>{
      var that=this;
      var num=that.data.iNum;
      var play_list=that.data.playList;
      num++;
      if(num==play_list.length-1){
        num=0;
      }
      that.setMusic(that.data.playList,num);
      that.setData({
        iNum:num,
      })
    })

  },
  
  //播放按钮点击
  audioPlay:function(){
    var that=this;
    that.setData({
      play:false,//播放按钮隐藏
      pause:true,//暂停按钮显示      
    })
    that.setMusic(that.data.playList,that.data.iNum);
  },
  //设置音频路径并播放
  setMusic:function(play_list,is_num){
    backgroundAudio.src = play_list[is_num].url;
    backgroundAudio.title = play_list[is_num].name;
    backgroundAudio.singer = play_list[is_num].author;
  },
  //暂停
  pause:function(){
    var that=this;
    backgroundAudio.pause();//音频暂停
    that.setData({
      play:true,//播放按钮显示
      pause:false,//暂停按钮隐藏
    })
  },
  //上一首
  prevClick:function(){
    var that=this;
    var num=that.data.iNum;
    var play_list=that.data.playList;
    num--;
    if(num<0){
      num=play_list.length-1;
    }
    that.setMusic(that.data.playList,num);
    that.setData({
      iNum:num,
      play:false,//播放按钮隐藏
      pause:true,//暂停按钮显示
      storyName:play_list[num].name,//音频名称
    })
  },
  //下一首
  nextClick:function(){
    var that=this;
    var num=that.data.iNum;
    var play_list=that.data.playList;
    num++;
    if(num>play_list.length-1){
      num=0;
    }
    that.setMusic(that.data.playList,num);
    that.setData({
      iNum:num,
      play:false,//播放按钮隐藏
      pause:true,//暂停按钮显示
      storyName:play_list[num].name,//音频名称
    })
  },
  //显示故事列表
  showList:function(){
    var that=this;
    that.setData({
      musicMask:true,
    })
  },
  hideList:function(){
    var that=this;
    that.setData({
      musicMask:false,
    })
  },
  //展示、隐藏
  isShow:function(e){
    //console.log(e)
    var that=this;
    var id=e.currentTarget.dataset.id;
    var is_show=e.currentTarget.dataset.is_show;
    var list=that.data.aList;
    if(is_show){
      for(var i=0;i<list.length;i++){
        list[i].isShow=false;
        if(id==list[i].id){
          list[i].isShow=false;
        }
      }
    }else{
      for(var i=0;i<list.length;i++){
        list[i].isShow=false;
        if(id==list[i].id){
          list[i].isShow=true;
        }
      }
    }
    that.setData({
      aList:list,
    })
  },
//获取音频列表
getMusicList:function(){

},

  //时间格式化
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

  }
})