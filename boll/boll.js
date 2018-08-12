var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight - 30;
canvas.style.border = '1px solid black'
var ctx = canvas.getContext('2d');;
var bollArr = [];
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
function Boll(x, y, r, spendX, spendY, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.spendX = spendX;
    this.spendY = spendY;
    this.color = color;
    this.print = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }
    this.move = function () {
        this.x += this.spendX;
        this.y += this.spendY;
        if (this.x + this.r > canvas.width || this.x - this.r < 0) {
            this.spendX = -this.spendX;
        }
        if (this.y + this.r > canvas.height || this.y - this.r < 0) {
            this.spendY = -this.spendY;
        }
        // for (i in bollArr) {
        //     if (bollArr[i] != this) {
        //         if (Math.sqrt(Math.pow(this.x - bollArr[i].x, 2) + Math.pow(this.y - bollArr[i].y, 2)) <= this.r + bollArr[i].r) {
        //             this.spendX = -this.spendX;
        //             this.spendY = -this.spendY;
        //             while (Math.sqrt(Math.pow(this.x - bollArr[i].x, 2) + Math.pow(this.y - bollArr[i].y, 2)) <= this.r + bollArr[i].r) {
        //                 this.x += this.spendX;
        //                 this.y += this.spendY;
        //             }
        //         }
        //     }
        // }
    }
    bollArr.push(this);
}
for (var i = 0; i < 3; i++) {
    new Boll(rand(100, 500), rand(100, 500), rand(10, 90), rand(2, 8), rand(2, 8), randColor(0x222222, 0xdddddd, rand(100, 255)));
}
setInterval(function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (i in bollArr) {
        bollArr[i].print();
        bollArr[i].move();
    }
}, 20);

canvas.onclick = function (e) {
    new Boll(e.x, e.y, rand(10, 90), rand(2, 8), rand(2, 8), randColor(0x222222, 0xdddddd, rand(100, 255)));
}
