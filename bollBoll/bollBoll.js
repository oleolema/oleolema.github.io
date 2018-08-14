var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;
canvas.style.border = '1px solid black';
canvas.style.background = 'linear-gradient(90deg,#074d4d,#580087)';
document.body.appendChild(canvas);

var size = 2;       //地图视野

function Food() {
    this.x = rand(0, Map.w);
    this.y = rand(0, Map.h);
    this.r = 5;
    this.color = randColor(0x222222, 0xdddddd, rand(100, 255));
}

function Map() {
    Map.w = 5000;     //地图大小
    Map.h = 5000;
    this.x = 0;//屏幕显示地图的位置
    this.y = 0;
    this.boll = new Boll();
    this.food = [];
    for (var i = 0; i < 5000; i++) {
        this.food.push(new Food());
    }
    this.print = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //绘制参考线
        for (var i = this.x; i <= Map.w + this.x; i += 100) {
            ctx.beginPath();
            ctx.moveTo(i / size, this.y / size);
            ctx.lineTo(i / size, (Map.h + this.y) / size);
            ctx.stroke();
        }
        for (var i = this.y; i <= Map.h + this.y; i += 100) {
            ctx.beginPath();
            ctx.moveTo(this.x / size, i / size);
            ctx.lineTo((Map.w + this.x) / size, i / size);
            ctx.stroke();
        }
        //绘制食物
        for (i in this.food) {
            ctx.beginPath();
            ctx.arc((this.food[i].x + this.x) / size, (this.food[i].y + this.y) / size, this.food[i].r / size, 0, Math.PI * 2);       //球相对于地图是移动的，相对与屏幕是静止的
            ctx.fillStyle = this.food[i].color;
            ctx.fill();
        }
        //绘制球
        ctx.beginPath();
        ctx.arc((this.boll.x + this.x) / size, (this.boll.y + this.y) / size, this.boll.r / size, 0, Math.PI * 2);       //球相对于地图是移动的，相对与屏幕是静止的
        ctx.fillStyle = this.boll.color;
        ctx.fill();
        //绘制文字
        ctx.fillText((this.boll.x) + ',' + (this.boll.y), canvas.width - 100, 30);        //球在地图上的位置
        ctx.fillText(this.x + ',' + this.y, canvas.width - 100, 60);                  //地图右上角相对于屏幕右上角的位置
        ctx.fill();
    }
    this.move = function () {
        this.eatFood();
        var vx = Math.round(mouse.x - mouse.downx);             //x方向速度
        var vy = Math.round(mouse.y - mouse.downy);             //y方向速度
        var vr = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));     //合速度
        if (vr > mouse.r) {           //超出速度范围
            var sinx = vx / vr;
            var cosx = vy / vr;
            vx = sinx * mouse.r;
            vy = cosx * mouse.r;
        }
        // console.info(Math.round(Math.sqrt(Math.pow(vx,2) + Math.pow(vy,2))));
        // console.info(vx, vy);
        if (this.boll.x + Math.round(vx / this.boll.weight) >= 0 && this.boll.x + Math.round(vx / this.boll.weight) <= Map.w) {
            this.x -= Math.round(vx / this.boll.weight);            //地图随着鼠标反向移动
            this.boll.x += Math.round(vx / this.boll.weight);       //球在地图上的坐标跟着移动
        }

        if (this.boll.y + Math.round(vy / this.boll.weight) >= 0 && this.boll.y + Math.round(vy / this.boll.weight) <= Map.h) {
            this.y -= Math.round(vy / this.boll.weight);
            this.boll.y += Math.round(vy / this.boll.weight);
        }


    }
    this.eatFood = function () {
        for (i in this.food) {
            if (Math.abs(this.boll.x - this.food[i].x) < this.boll.r && Math.abs(this.boll.y - this.food[i].y) < this.boll.r) {
                this.food[i].x = rand(0, Map.w);
                this.food[i].y = rand(0, Map.h);
                this.boll.r += 0.05;
                //size += 0.0004;
            }
        }
    }
}

function Boll() {
    this.r = 50;
    this.x = (canvas.width / 2 - this.r)*size;
    this.y = (canvas.height / 2 - this.r)*size;
    this.dx = 0;
    this.dy = 0;
    this.weight = 13;
    this.color = 'orange';
    this.print = function () {
        ctx.fillText(this.x + ',' + this.y, window.innerWidth - 100, 30);
    }
    //操纵杆的移动
    this.move = function () {
        var vx = mouse.x - mouse.downx;             //x方向速度
        var vy = mouse.y - mouse.downy;             //y方向速度
        this.x += Math.round(vx / 10);
        this.y += Math.round(vy / 10);

    }
}

var map = new Map();
var mouse = {
    x: NaN,           //鼠标的位置
    y: NaN,
    r: 60,
    downx: canvas.width / 2 - map.boll.r,        //鼠标按下的位置
    downy: canvas.height / 2 - map.boll.r,
    key: false      //鼠标是否按下
};

setInterval(print, 20);
function print() {
    map.print();
    map.move();
    //printMouse();
}
//操纵杆
function printMouse() {
    if (mouse.key) {
        //绘制线条
        // ctx.beginPath();
        // ctx.moveTo(0, mouse.y);
        // ctx.lineTo(canvas.width, mouse.y);
        // ctx.moveTo(mouse.x, 0);
        // ctx.lineTo(mouse.x, canvas.height);
        // ctx.stroke();
        ctx.beginPath();
        ctx.arc(mouse.downx, mouse.downy, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'gray';
        ctx.fill();
        ctx.closePath();
        //
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = 'gray';
        ctx.fill();
        ctx.closePath();
        //绘制坐标
        ctx.font = '20px 黑体';
        ctx.fillText(parseInt(mouse.x) + ',' + parseInt(mouse.y), 20, 20);
        //绘制圆
        ctx.beginPath();
        ctx.arc(mouse.downx, mouse.downy, mouse.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
    }
}
// window.onmousedown = function (ed) {
//     mouse.x = ed.x;
//     mouse.y = ed.y;
//     // mouse.downx = ed.x;
//     // mouse.downy = ed.y;
//     mouse.key = true;
window.onmousemove = function (e) {
    var vx = Math.round(e.x - mouse.downx);             //x方向速度
    var vy = Math.round(e.y - mouse.downy);             //y方向速度
    var vr = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));     //合速度
    if (vr > mouse.r) {           //超出速度范围
        var sinx = vx / vr;
        var cosx = vy / vr;
        mouse.x = sinx * mouse.r + mouse.downx;
        mouse.y = cosx * mouse.r + mouse.downy;
    }
    else {
        mouse.x = e.x;
        mouse.y = e.y;
    }
}
// }
// window.onmouseup = function () {
//     window.onmousemove = null;
//     mouse.key = false;
// }

function rand(a, b) {
    return Math.random() * (b - a) + a;
}
function randColor(a, b, opacity) {
    a = a || 0x000000;
    b = b || 0xffffff;
    opacity = opacity || 255;
    opacity = parseInt(opacity).toString(16);
    var color = parseInt(rand(Number(a), Number(b))).toString(16);
    var colorLen = color.length;
    for (var i = 0; i < 6 - colorLen; i++) {
        color = '0' + color;
    }
    return '#' + color + opacity;
}