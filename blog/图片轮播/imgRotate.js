(function () {
    var img4 = [
        "http://ww2.sinaimg.cn/large/6834b4ddjw1f5yf4s5c3kj21jk1117wh.jpg", "http://ww3.sinaimg.cn/large/6834b4ddjw1f5yf5cjkcnj21jk2bce82.jpg", "http://ww3.sinaimg.cn/large/6834b4ddjw1f5yf29ywgzj21jk2bc4qq.jpg", "http://ww1.sinaimg.cn/large/6834b4ddjw1f5yf1jk9a6j21jk1nd1kx.jpg", "http://ww4.sinaimg.cn/large/6834b4ddjw1f5yf1ap491j21jk111kg9.jpg", "http://ww3.sinaimg.cn/large/6834b4ddjw1f5yf12bw82j21jk10m7te.jpg", "http://ww1.sinaimg.cn/large/6834b4ddjw1f5yf0uc0dsj21jk2bckjl.jpg", "http://ww1.sinaimg.cn/large/6834b4ddjw1f5yf0fs65vj21jk1gi7wh.jpg", "http://ww2.sinaimg.cn/large/6834b4ddjw1f5yeyqzzu3j21jk2bce81.jpg", "http://ww4.sinaimg.cn/large/679865b1gw1ehrlfhfw7hj20kd0ukaph.jpg", "http://ww3.sinaimg.cn/large/679865b1gw1ehrlfgckajj20kd0uk46i.jpg", "http://ww4.sinaimg.cn/large/679865b1gw1ehrlf95v9uj20kd0uk101.jpg", "http://ww4.sinaimg.cn/large/679865b1gw1ehrlf95v9uj20kd0uk101.jpg", "http://ww3.sinaimg.cn/large/679865b1gw1ehrlf55rx6j20kd0ukahs.jpg", "http://ww4.sinaimg.cn/large/679865b1gw1ehrlf46olyj20uk0kdtgh.jpg", "http://ww2.sinaimg.cn/large/679865b1gw1ehrlf3a784j20kd0ukdnq.jpg", "http://ww1.sinaimg.cn/large/679865b1gw1ehrlf2atjfj20kd0uktg6.jpg", "http://ww1.sinaimg.cn/large/679865b1gw1ehrlf1b3wxj20uk0kdgqb.jpg",  "http://ww3.sinaimg.cn/large/679865b1gw1ehrlezufszj20uk0kd7bh.jpg", "http://ww4.sinaimg.cn/large/679865b1gw1ehrleyz61dj20uk0kd794.jpg", "http://ww4.sinaimg.cn/large/679865b1gw1ehrleya5qaj20uk0kdgr1.jpg",

    ];

    var imgBox = document.getElementsByClassName('imgBox')[0];      //获取盒子
    var imgBoll = document.createElement('div');            //创建一个图片导航点
    var imgBoxWidth = imgBox.offsetWidth;   //盒子宽度
    var img = [];                //所有图片
    var imgIndex = 0;           //当前显示的图片下标
    var isRotate = false;       //防止多个定时器同时执行
    var timer;
    createLabel();      //创建标签
    init();             //初始化

    function createLabel() {
        for (var i = 0; i < img4.length; i++) {
            img.push({
                img: document.createElement('img'),
                boll: document.createElement('div'),
                src: img4[i],
                a: document.createElement('a'),
                herf: "javascript:void(0);"
            });
            img[img.length - 1].img.src = img[img.length - 1].src;          //设置图片来源
            img[img.length - 1].img.style.width = imgBoxWidth + 'px';       //图片大小和盒子一样大

            img[img.length - 1].a.style.top = '0px';                        //初始化位置      
            img[img.length - 1].a.style.left = imgBoxWidth * i + 'px';      //初始化位置

            img[img.length - 1].boll.className = "smallBoll"                //命名className
            img[img.length - 1].boll.style.bottom = '10%';              //下面间隔
            img[img.length - 1].boll.style.left = (imgBoxWidth - 20 * img4.length) / 2 + i * 20 + 'px';         //中间对齐
            img[img.length - 1].boll.onclick = function () {            //绑定点击
                if (isRotate) {
                    return;
                }
                img[imgIndex].boll.className = "smallBoll";
                this.className = "selectBoll";
                var thatIndex;
                //找到当前的下标
                for (var i = 0; i < img.length; i++) {
                    if (this == img[i].boll) {
                        thatIndex = i;
                        break;
                    }
                }
                if (thatIndex > imgIndex) {
                    var step = thatIndex - imgIndex;
                    var timer = setInterval(function () {
                        nextImg(step * 10);         //距离越远切换越快
                        if (thatIndex == imgIndex + 1) {
                            clearInterval(timer);
                            return;
                        }
                    }, 1);
                }
                else if (thatIndex < imgIndex) {
                    var step = imgIndex - thatIndex;
                    var timer = setInterval(function () {
                        preImg(step * 10);
                        if (thatIndex == imgIndex - 1) {
                            clearInterval(timer);
                            return;
                        }
                    }, 1);
                }
            }
            //插入
            imgBoll.appendChild(img[img.length - 1].boll);
            img[img.length - 1].a.appendChild(img[img.length - 1].img);     //图片插入到a标签中
            imgBox.appendChild(img[img.length - 1].a);                      //a标签插入到盒子中
        }
    }
    function init() {
        imgBoll.className = 'imgbollBox';
        imgBox.appendChild(imgBoll);
        img[imgIndex].boll.className = "selectBoll";
        img[0].img.onload = function () {       //第一张图片加载完成
            imgBox.style.height = img[0].img.offsetHeight + 'px';       //调整盒子大小为第一张图片的大小
            var preImgButton = document.getElementsByClassName('preImg')[0];
            var nextImgButton = document.getElementsByClassName('nextImg')[0];
            nextImgButton.style.height = img[0].img.offsetHeight + 'px';
            nextImgButton.onclick = function () { nextImg() };          //绑定点击
            document.getElementsByClassName('nextImgShell')[0].style.height = img[0].img.offsetHeight + 'px';
            preImgButton.style.height = img[0].img.offsetHeight + 'px';
            preImgButton.onclick = function () { preImg() };
            document.getElementsByClassName('preImgShell')[0].style.height = img[0].img.offsetHeight + 'px';
            timer = setInterval(function () {
                nextImg();
            }, 3000);
        }
        imgBox.onmouseover = function () {          //鼠标放在图片上不自动滑动图片
            clearInterval(timer);
        }
        imgBox.onmouseout = function () {           //离开图片重新开始滑动图片
            timer = setInterval(function () {
                nextImg();
            }, 3000);
        }
    }




    function nextImg(setStep) {
        if (isRotate) {
            return;
        }
        isRotate = true;
        var that = imgIndex % img.length;           //当前图片
        var next = (imgIndex + 1) % img.length;     //下一张图片
        img[that].boll.className = "smallBoll";
        img[next].boll.className = "selectBoll";
        //将下一张图片移动到当前图片后，并一起滑动
        img[next].a.style.left = imgBox.offsetWidth + 'px';
        //滑动动画
        (function () {
            var step = setStep || 10;
            var count = 0;
            var timer = setInterval(function () {
                if (++count * step >= imgBoxWidth) {
                    img[that].a.style.left = -imgBoxWidth + 'px';       //对齐盒子
                    img[next].a.style.left = '0px';
                    clearInterval(timer);
                    imgIndex = next;
                    isRotate = false;
                    return;
                }
                img[next].a.style.left = img[next].a.offsetLeft - step + 'px';
                img[that].a.style.left = img[that].a.offsetLeft - step + 'px';
            }, 1);
        }());
    }

    function preImg(setStep) {
        if (isRotate) {
            return;
        }
        isRotate = true;
        var that = imgIndex % img.length;           //当前图片
        var pre = (imgIndex + img.length - 1) % img.length;     //下一张图片
        img[that].boll.className = "smallBoll";
        img[pre].boll.className = "selectBoll";
        //将上一张图片移动到当前图片前，并一起滑动
        img[pre].a.style.left = -imgBox.offsetWidth + 'px';
        //滑动动画
        (function () {
            var step = setStep || 10;
            var count = 0;
            var timer = setInterval(function () {
                if (++count * step >= imgBoxWidth) {
                    img[that].a.style.left = imgBoxWidth + 'px';       //对齐盒子
                    img[pre].a.style.left = '0px';
                    clearInterval(timer);
                    imgIndex = pre;
                    isRotate = false;
                    return;
                }
                img[pre].a.style.left = img[pre].a.offsetLeft + step + 'px';
                img[that].a.style.left = img[that].a.offsetLeft + step + 'px';
            }, 1);
        }());
    }
}());