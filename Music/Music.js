(function () {
    var Music = window.Music = function () {
        var self = this;
        //播放器
        this.player = document.getElementsByClassName('musicPlayer')[0];
        this.audio = this.player.getElementsByClassName('myAudio')[0];
        this.name = this.player.getElementsByClassName('musicName')[0];
        this.img = this.player.getElementsByClassName('musicImg')[0];
        this.bgPic = this.player.getElementsByClassName('bgPic')[0];
        this.loading = this.player.getElementsByClassName('loading')[0];
        //进度条
        this.progress = this.player.getElementsByClassName('progressBar')[0];
        this.progressAll = this.progress.getElementsByClassName('progressAll')[0];
        this.progressPoint = this.progress.getElementsByClassName('progressPoint')[0];
        this.progressTime = this.progress.getElementsByClassName('progressTime')[0];
        this.progressAllTime = this.progress.getElementsByClassName('progressAllTime')[0];


        //按钮
        this.button = this.player.getElementsByClassName('button')[0];
        this.playButton = this.button.getElementsByClassName('playButton')[0];
        this.preButton = this.button.getElementsByClassName('preButton')[0];
        this.nextButton = this.button.getElementsByClassName('nextButton')[0];
        this.listButton = this.button.getElementsByClassName('listButton')[0];
        this.searchButton = this.button.getElementsByClassName('searchButton')[0];
        this.downloadButton = this.button.getElementsByClassName('downloadButton')[0];
        this.searchInput = this.button.getElementsByClassName('searchInput')[0];
        this.searchGroup = this.button.getElementsByClassName('searchGroup')[0];
        this.sButton = this.searchGroup.getElementsByClassName('sButton')[0];
        this.radioGroup = this.searchGroup.getElementsByClassName('radioGroup')[0];
        //歌词
        this.lyric = this.player.getElementsByClassName('lyric')[0];
        this.lyricList = this.lyric.getElementsByClassName('lyricList')[0];
        this.lyrica = this.lyric.getElementsByClassName('lyricli1')[0];
        this.lyricb = this.lyric.getElementsByClassName('lyricli2')[0];
        //列表
        this.mList = this.player.getElementsByClassName('mList')[0];
        this.musicList = this.mList.getElementsByClassName('musicList')[0];
        this.sList = this.player.getElementsByClassName('sList')[0];
        this.searchList = this.sList.getElementsByClassName('searchList')[0];
        this.navigation = this.mList.getElementsByClassName('navigation')[0];
        //音乐来源
        this.music = new GetMusic();
        this.list = [];          //播放列表
        this.srList = [];          //搜索列表
        this.listIndex;     //选择的列表下标
        this.preListIndex = 0;      //选择的列表上一个下标
        this.m;             //所选音乐的信息
        //初始化
        this.init();
        //设置大小
        this.setSize(400, 100);
        this.progressLen = this.progressAll.offsetWidth - 6;

    }
    Music.prototype.loadMusic = function (autoPlay) {
        if (autoPlay === undefined) {
            autoPlay = true;
        }
        var self = this;
        var timer = setTimeout(function () {
            self.loading.className = "loading";
        }, 500);
        //设置歌曲id
        self.music.musicId = self.list[self.listIndex].id;
        self.music.picId = self.list[self.listIndex].pic_id;
        self.music.lyricId = self.list[self.listIndex].lyric_id;
        self.music.source = self.list[self.listIndex].source;
        self.music.getMusic(function (m) {
            self.m = m;
            self.audio.oncanplay = function () {
                if (autoPlay) {
                    self.play();
                }
                self.loading.className = "loaded";
            }
            self.setMusic(m.music.url, self.list[self.listIndex].name + ' - ' + self.list[self.listIndex].artist, m.pic.url);
            self.getTimeLyric();
            clearInterval(timer);
        });
    }

    //获取歌单
    Music.prototype.getSheet = function (callback) {
        var self = this;
        var timer = setTimeout(function () {
            self.loading.className = "loading";
        }, 500);
        this.music.getSheet(function () {
            var list = self.music.back.playlist.tracks;
            //移除旧列表
            var len = self.list.length;
            for (var i = 0; i < len; i++) {
                self.list.pop();
            }
            for (i in list) {
                var artist = "";
                for (var j = 0; j < list[i].ar.length - 1; j++) {
                    artist += list[i].ar[j].name + ', ';
                }
                artist += list[i].ar[list[i].ar.length - 1].name
                self.list.push({
                    album: list[i].al.name,
                    artist: artist,
                    id: list[i].id,
                    lyric_id: list[i].id,
                    name: list[i].name,
                    pic_id: list[i].al.pic_str ? list[i].al.pic_str : list[i].al.pic,
                    source: "netease",
                    url_id: list[i].id,
                });
            }

            self.listIndex = parseInt(Math.random() * self.list.length);        //随机一首歌
            self.preListIndex = self.listIndex;
            //推入HTML中
            self.pushList();
            callback && callback();
            self.loading.className = "loaded";
            clearInterval(timer);
        });
    }
    //创建列表
    Music.prototype.pushList = function () {
        var self = this;
        var allLi = this.musicList.children;
        //移除旧列表
        for (var i = allLi.length - 1; i >= 0; i--) {
            this.musicList.removeChild(allLi[i]);
        }
        var len = this.list.length;
        //创建新列表
        for (var i = 0; i < len; i++) {
            var li = document.createElement('li');
            li.innerHTML = this.list[i].name + ' - ' + this.list[i].artist;
            this.musicList.appendChild(li);
            //给每个列表添加事件
            (function () {
                var index = i;
                li.onclick = function () {
                    if (self.listIndex == index && self.audio.src) {
                        return;
                    }
                    self.listIndex = index;
                    self.loadMusic();
                }
            }());
        }
    }
    //歌词显示
    Music.prototype.moveLyric = function () {
        var pre = 0;
        if (!this.m.lyric.y[0]) {
            this.lyrica.innerHTML = "没有歌词";
            this.lyricb.innerHTML = "没有歌词";
            return;
        }
        var that
        for (i in this.m.lyric.time) {
            if (this.audio.currentTime + 0.618 <= i) {        //多加1s提前显示歌词
                that = this.m.lyric.time[pre] == undefined ? "" : this.m.lyric.time[pre];
                if (this.lyrica.offsetTop < 0 && pre != this.m.lyric.preTime) {        //a在上时
                    //移动到上面
                    this.lyricb.style.top = -40 + 'px';     //b上去
                    //两个元素一起滑下
                    this.lyrica.innerHTML = that + "";      //显示歌词
                    this.m.lyric.preTime = pre;             //储存时间
                    this.lyrica.style.top = 0 + 'px';       //a下来
                }
                else if (this.lyricb.offsetTop < 0 && pre != this.m.lyric.preTime) {        //b在上时
                    //移动到上面
                    this.lyrica.style.top = -40 + 'px';     //a上去
                    //两个元素一起滑下
                    this.lyricb.innerHTML = that + "";
                    this.m.lyric.preTime = pre;
                    this.lyricb.style.top = 0 + 'px';       //b下来
                }
                return;
            }
            pre = i;
        }
    }
    //搜索音乐
    Music.prototype.smusic = function () {
        var self = this;
        self.sList.style.height = 0 + 'px';
        var timer = setTimeout(function () {
            self.loading.className = "loading";
        }, 500);
        this.music.searchMusic(function () {
            //推入HTML
            self.srList = self.music.back;

            var allLi = self.searchList.children;
            var len = allLi.length;
            //移除旧列表
            for (var i = len - 1; i >= 0; i--) {
                if (allLi[i]) {
                    self.searchList.removeChild(allLi[i]);
                }
            }
            if (self.srList.length == 0) {         //没有搜索结果
                var li = document.createElement('li');
                li.innerHTML = "没有找到音乐";
                self.searchList.appendChild(li);
            } else {
                //创建新列表
                for (var i = 0; i < self.srList.length; i++) {
                    var li = document.createElement('li');
                    li.innerHTML = self.srList[i].name + ' - ' + self.srList[i].artist;
                    self.searchList.appendChild(li);
                    //给每个列表添加事件
                    (function () {
                        var index = i;
                        li.onclick = function () {      //点击添加入播放列表
                            self.list.splice(self.listIndex + 1, 0, self.srList[index]);        //插入列表
                            self.pushList();            //刷新列表
                            self.listIndex++;           //切换下一首
                            self.loadMusic();           //播放
                        }
                    }());
                }
            }
            //显示列表
            if (self.searchList.offsetHeight > 500) {
                self.sList.style.height = 500 + 'px';
            }
            else {
                self.sList.style.height = self.searchList.offsetHeight + 30 + 'px';
            }
            clearInterval(timer);
            self.loading.className = "loaded";
        });
    }
    //初始化
    Music.prototype.init = function () {
        var self = this;
        this.refresh = function () {
            self.progressTime.innerHTML = addZero(new Date(self.audio.currentTime * 1000).getMinutes()) + ':' + addZero(new Date(self.audio.currentTime * 1000).getSeconds());
            //歌词滚动
            self.moveLyric();
        }
        //音频
        this.audio.onplay = function () {

        }
        //播放结束的动作
        this.audio.onended = function () {
            // self.pause();
            self.listIndex = (self.listIndex + 1) % self.list.length;
            self.loadMusic();
        }
        //进度条
        this.progress.onclick = function (e) {
            if (self.audio.src) {
                var x = e.offsetX - 6;
                self.audio.currentTime = x * self.audio.duration / self.progressLen;
                self.progressPoint.style.left = x + 'px';
                // self.refresh();
            }
        }
        this.progress.onmousedown = function () {
            self.progressPoint.style.transition = 'left 0.1s';
            this.onmousemove = function (e) {
                var x = e.offsetX - 6;
                if (self.audio.src) {
                    self.audio.currentTime = x * self.audio.duration / self.progressLen;
                    self.progressPoint.style.left = x + 6 + 'px';
                    self.refresh();
                }
            }
        }
        window.onmouseup = function () {
            self.progressPoint.style.transition = 'left 0.3s';
            self.progress.onmousemove = null;
        }
        //按钮
        this.playButton.onclick = function () {
            if (this.className == "playButton") {
                self.play();
            }
            else {
                self.pause();
            }
        }
        this.listButton.onclick = function () {
            if (self.mList.offsetHeight == 0) {
                if (self.musicList.offsetHeight < 500) {
                    self.mList.style.height = self.musicList.offsetHeight + 'px';
                }
                else {
                    self.mList.style.height = "500px";
                }
            }
            else {
                self.mList.style.height = '0px';
            }
        }
        this.downloadButton.onclick = function () {
            if (self.m.music.url) {
                window.open(self.m.music.url);
            }
        }
        this.searchButton.onclick = function () {
            self.searchInput.focus();
            if (self.searchGroup.offsetWidth < 10) {
                self.searchGroup.style.width = '310px';
            }
            else {
                self.searchGroup.style.width = '0px';
            }
            if (self.sList.offsetHeight != 0) {
                self.sList.style.height = 0 + 'px';
            }
        }
        this.sButton.onclick = function () {
            var source;
            for (var i = 0; i < self.radioGroup.children.length; i++) {
                if (self.radioGroup.children[i].children[0].checked) {
                    source = self.radioGroup.children[i].children[0].value;
                    break;
                }
            }
            self.music.source = source;
            self.music.name = self.searchInput.value;
            if (self.music.name == "") {
                return;
            }
            self.smusic();
        }
        this.searchInput.onkeydown = function (e) {
            if (e.key == "Enter") {
                self.music.name = this.value;
                if (this.value == "") {
                    return;
                }
                self.smusic();
            }
        }
        this.nextButton.onclick = function () {
            self.listIndex = (self.listIndex + 1) % self.list.length;
            self.loadMusic();
        }
        this.preButton.onclick = function () {
            self.listIndex = (self.listIndex + self.list.length - 1) % self.list.length;
            self.loadMusic();
        }
        //歌词处理
        this.lyricTime = function (time) {
            try {
                var minutes = time.match(/\d+/)[0];
                var seconds = time.match(/:\d*.\d*/)[0].match(/[^:]+/)[0];
                var returnTime = (parseFloat(minutes * 60) + parseFloat(seconds)).toFixed(2);
            } catch (e) {
                return 0;
            }
            return returnTime;
        }
        this.getTimeLyric = function () {
            self.m.lyric.time = [];
            while (true) {
                var timeLyric = undefined;
                var lyric = undefined;
                while (!lyric) {
                    if (self.m.lyric.n >= self.m.lyric.y.length) {
                        return;
                    }
                    timeLyric = self.m.lyric.y[self.m.lyric.n++];
                    lyric = timeLyric.replace(/\[.*\]/, '');
                }
                var time = self.lyricTime(timeLyric);
                self.m.lyric.time[time] = lyric;
            }
        }
        //列表
        for (i in self.navigation.children) {
            (function () {
                var index = i;
                self.navigation.children[i].onclick = function () {
                    for (var j = 0; j < self.navigation.children.length; j++) {
                        self.navigation.children[j].style.border = "1px solid rgba(255, 123, 0, 0)";
                    }
                    self.music.sheetId = self.navigation.children[index].value;
                    this.style.border = "1px solid rgb(255, 123, 145)";
                    self.getSheet();
                }
            }());
        }
        self.getSheet(function () {
            self.loadMusic(false);
            self.navigation.children[0].style.border = "1px solid rgb(255, 123, 145)";
        }); //获取一个歌单
    }


    Music.prototype.setMusic = function (src, name, img) {
        var self = this;
        if (src == "") {
            return;
        }
        src = src.replace(/m(\d)c/, 'm7');         //去掉c
        this.audio.src = src;
        this.name.innerHTML = name;
        this.img.style.backgroundImage = 'url(' + img + ')';
        this.bgPic.style.backgroundImage = 'url(' + img + ')';
    }
    Music.prototype.play = function () {
        var self = this;
        self.audio.play();
        this.playButton.className = "pauseButton";
        this.musicList.children[this.preListIndex].style.background = '#f1f1f1';
        this.musicList.children[this.listIndex].style.background = 'pink';
        this.preListIndex = this.listIndex;
        //设置进度条
        var minutes = new Date(self.audio.duration * 1000).getMinutes();
        var seconds = new Date(self.audio.duration * 1000).getSeconds();
        self.progressAllTime.innerHTML = addZero(minutes) + ':' + addZero(seconds);
        //提前显示
        self.refresh();
        self.progressPoint.style.left = self.progressLen * self.audio.currentTime / self.audio.duration + 'px';         //进度条

        this.timer1;
        this.timer2;
        clearInterval(this.timer1);
        clearInterval(this.timer2);
        this.timer1 = setInterval(function () { self.refresh(); }, 20);
        this.timer2 = setInterval(function () {
            self.progressPoint.style.left = self.progressLen * self.audio.currentTime / self.audio.duration + 'px';         //进度条
        }, 1000);
    }
    Music.prototype.pause = function () {
        this.audio.pause();
        this.playButton.className = "playButton";
    }

    function addZero(num) {
        return num = num < 10 ? '0' + num : num + "";
    }

    Music.prototype.setSize = function (width, height) {
        //播放器
        this.player.style.width = width + 'px';
        this.player.style.height = height + 'px';
        //图片
        this.img.style.width = height + 'px';
        this.img.style.height = height + 'px';
        this.img.style.backgroundSize = height + 'px ' + height + 'px';
        //加载背景
        this.loading.style.width = width + 'px';
        this.loading.style.height = height + 40 + 'px';
        //背景图片
        this.bgPic.style.width = width + 'px ';
        this.bgPic.style.height = height + 40 + 'px ';
        this.bgPic.style.backgroundSize = width + 'px ';
        //歌名
        this.name.style.left = height + height / 10 + 'px';
        //进度条
        this.progress.style.left = height + height / 10 + 'px';
        this.progress.style.top = height / 3 + 'px';
        this.progress.style.width = width - height - height / 10 - 30 + 'px';
        this.progressAll.style.width = width - height - height / 10 - 30 + 'px';
        //按钮
        this.button.style.left = height + height / 10 + 'px';
        this.button.style.top = height * 2 / 3 + 'px';
        this.button.style.width = width - height - height / 10 - 30 + 'px';
        //歌词
        this.lyric.style.width = width + 'px';
        this.lyrica.style.width = width + 'px';
        this.lyricb.style.width = width + 'px';
        this.lyric.style.top = height + 'px';
        //列表
        this.mList.style.top = height + 40 + 'px';
        this.mList.style.width = width + 'px';
        this.sList.style.top = height + 40 + 'px';
        this.sList.style.width = width + 'px';
    }
}());