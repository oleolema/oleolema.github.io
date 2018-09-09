(function () {
    var Lyric = window.Lyric = function () {
        this.audio = document.getElementsByClassName("myaudio")[0];
        this.lyricL = document.getElementsByClassName("myLyric")[0];
        this.bgPic = document.getElementsByClassName("lyricBgPic")[0];
        this.lyricList = document.getElementsByClassName("myLyricList")[0];
        this.wheel = {};
        this.m = [];
        //初始化
        this.init();
    }
    //歌词写入HTML
    Lyric.prototype.lyricToHtml = function () {
        var self = this;
        var list = "";
        // list += '<li class="lyricno" style="height:'+80+'px"></li>';
        for (var i in self.m.lyric.time) {
            // console.info(self.m.lyric.time[i]);
            list += '<li class="lyricno">' + self.m.lyric.time[i] + '</li>'
        }
        if (!self.m.lyric.y[0]) {
            //list = '<li class="lyricno" style="height:' + (self.lyricL.offsetHeight - 50) + 'px;line-height:' + (self.lyricL.offsetHeight - 50) + 'px;" >' + "没有歌词" + '</li>';
            list = '<li class="lyricno" style="margin-top:200px" >' + "没有歌词" + '</li>';
        }
        self.lyricList.innerHTML = list;

    }
    //歌词滚动
    Lyric.prototype.moveLyric = function () {
        var self = this;
        var list = Object.keys(self.m.lyric.time);
        for (var i = list.length - 1; i >= 0; i--) {        //歌词倒序比较
            if (music.audio.currentTime > list[i] - 0.4) {   //当前时间大于歌词时间就显示歌词
                if (self.m.lyric.index == i) {           //如果上次歌词时间与这次相同直接返回
                    return;
                }
                if (self.m.lyric.index != undefined) {
                    self.lyricList.children[self.m.lyric.index].className = "lyricno";        //还原
                }
                self.m.lyric.index = i;           //保存当前时间
                self.lyricList.children[i].className = "lyricyes";
                if (self.wheel.w) {                 //鼠标滚动时不自动滚动
                    return;
                }
                //滚动函数
                (function () {
                    clearInterval(self.timer);                                                   //清除前面还在滑动的定时器
                    var top = self.lyricList.children[i].offsetTop;                                  //当前歌词的距离顶部的实际位置
                    var end = top - self.lyricList.offsetHeight * (1 - 0.618);                       //滑动结束的位置   少滑动点使歌词在中间
                    var step = Math.round((end - self.lyricList.scrollTop) / 60);                    //滑动速度
                    var preTop = self.lyricList.scrollTop;                                           //初始化上次滑动的位置                  
                    if(Music.isMoblie){     //移动端高度调整
                        end -= 140;
                    }
                    self.timer = setInterval(function () {
                        self.lyricList.scrollTop += step;
                        if (self.lyricList.scrollTop == preTop) {       //没有效果的滑动直接停止
                            clearInterval(self.timer);
                            return;
                        }
                        else if (step > 0 && self.lyricList.scrollTop >= end) {     //下滑
                            clearInterval(self.timer);
                        }
                        else if (step < 0 && self.lyricList.scrollTop <= end) {     //上滑
                            clearInterval(self.timer);
                        }
                        preTop = self.lyricList.scrollTop;              //储存这次滑动结束的位置
                    }, 1);
                }());
                return;
            }
        }
    }
    //歌词解析
    Lyric.prototype.getLyric = function () {
        var self = this;
        var arrLyric = self.m.lyric.y;
        var lyricObj = {};
        var regexp = /\[\d*:\d*.?\d+\]/g;
        for (var i = 0; i < arrLyric.length; i++) {
            var lyric = arrLyric[i].replace(regexp, "");
            if (lyric == "") {
                continue;
            }
            try {
                var time = arrLyric[i].match(regexp);
                for (var j in time) {               //每句有多个时间的处理
                    var minute = parseFloat(time[j].match(/(?:\[)(\d*)/)[1]);
                    var seconds = parseFloat(time[j].match(/(?:\:)(\d*.?\d+)/)[1]);
                    lyricObj[(minute * 60 + seconds).toFixed(2)] = lyric;
                }
            }
            catch (e) {
                console.error(e);
                continue;
            }
        }
        //按时间顺序排序
        var sortTime = Object.keys(lyricObj).sort(function (a, b) {
            return a - b;
        });
        //复制到歌词对象中
        self.m.lyric.time= {};
        for (var i in sortTime) {
            self.m.lyric.time[sortTime[i]] = lyricObj[sortTime[i]];
        }
        return self.m.lyric.time;
    }
    //返回顶部
    Lyric.prototype.backTop = function () {
        var self = this;
        clearInterval(self.timer);
        var step = (0 - self.lyricList.scrollTop) / 60;
        self.timer = setInterval(function () {
            self.lyricList.scrollTop += step;
            if (self.lyricList.scrollTop <= 0) {
                clearInterval(self.timer);
            }
        }, 1);
    }
    //初始化
    Lyric.prototype.init = function () {
        var self = this;
        //添加监听器
        self.lyricList.onwheel = function () {            //滑动
            self.wheel.w = true;
            clearInterval(self.wheel.t);
            self.wheel.t = setTimeout(function () {       //3s后恢复滚动
                self.wheel.w = false;
            }, 3000);
        }
            
        self.setSize(window.innerWidth, window.innerHeight);
    }
    //设置歌词
    Lyric.prototype.setLyric = function () {
        var self = this;
        self.getLyric();
        self.lyricToHtml();
        self.moveLyric();
        self.bgPic.style.backgroundImage = 'url(' + self.m.pic.url + ')';
    }
    //设置大小
    Lyric.prototype.setSize = function (width, height) {
        var self = this;
        self.lyricL.style.height = height + 'px';
        self.lyricL.style.width = width + 'px';
        self.lyricList.style.height = height + 'px';
        self.lyricList.style.width = width + 'px';
        self.bgPic.style.height = height + 'px';
        self.bgPic.style.width = width + 'px';
        self.bgPic.style.backgroundSize = width + 'px ' + width + 'px';
        if(Music.isMoblie){
            self.lyricList.style.marginTop = 140 + 'px';
            self.lyricList.style.height = height - 140 + 'px';
            // self.lyricL.style.fontSize = "10px";
        }
        else{
            self.lyricList.style.height = "inherit";
            self.lyricList.style.marginTop = "inherit";
        }
    }
}());