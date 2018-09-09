(function () {
    var GetMusic = window.GetMusic = function () {
        var self = this;
        this.back = [];
        this.count = 20;
        this.source;
        this.pages = 1;
        this.name = '再也不会遇见第二个她';
        this.picId;
        this.lyricId;
        this.musicId;
        this.sheetId = 3778678;
        //全局函数
        window.yue107 = function (e) {
            self.back = e;
        }
    }
    GetMusic.prototype.http = function (src, callback) {
        //移除其他script
        if (this.script) {
            document.head.removeChild(this.script);
        }
        //重新加载script
        this.script = document.createElement('script');
        this.script.type = 'text/javascript';
        this.script.src = src;
        document.head.appendChild(this.script);
        this.script.onload = function () {
            callback();
        }
    }
    GetMusic.prototype.getSheet = function (callback) {
        var self = this;
        this.http('https://y.xuelg.com/api.php?callback=yue107&types=playlist&id=' + this.sheetId, callback);
    }
    GetMusic.prototype.searchMusic = function (callback) {
        var self = this;
        this.http('https://y.xuelg.com/api.php?callback=yue107&types=search&count=' + this.count + '&source=' + this.source + '&pages=' + this.pages + '&name=' + this.name, callback);
    }
    GetMusic.prototype.getLyric = function (callback) {
        this.http("https://y.xuelg.com/api.php?callback=yue107&types=lyric&id=" + this.lyricId + "&source=" + this.source, callback);
    }
    GetMusic.prototype.getPic = function (callback) {
        this.http("https://y.xuelg.com/api.php?callback=yue107&types=pic&id=" + this.picId + "&source=" + this.source, callback);
    }
    GetMusic.prototype.getMusic = function (callback) {
        var self = this;
        var music = {};
        this.http("https://y.xuelg.com/api.php?callback=yue107&types=url&id=" + this.musicId + "&source=" + this.source, function () {
            music.music = self.back;
            self.getLyric(function () {
                music.lyric = {
                    y: self.back.lyric.split('\n'),
                    t: self.back.tlyric.split('\n'),
                    n: 0
                }
                self.getPic(function () {
                    music.pic = self.back;
                    callback(music);
                });
            });
        });

    }



}());