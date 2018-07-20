var amin = 0, amax = 20;
var p1 = document.getElementById('p1');
var p2 = document.getElementById('p2');
var num = document.getElementById('table1');
var qu, an;
var right = 0, wrong = 0, sum = -1, presum = -2, starttime = new Date();
localStorage.clear();
next();
getStorage();
info();

function save() {
    localStorage.setItem("right", right + '/' + wrong + '/' + sum);
}
function getStorage() {
    if (!localStorage.getItem('right')) {
        return;
    }
    var arr = localStorage.getItem('right').split('/');
    right = parseInt(arr[0]);
    wrong = parseInt(arr[1]);
    sum = parseInt(arr[2]);
}
function info() {
    p2.style.color = randcolor('#333333', '#ffffff');
    save();
    p2.innerHTML = '做了 ' + sum + ' 个题, 答对 ' + right + '个, 答错 ' + wrong + '个, 正确率为 ' + parseInt(right / sum * 100) + '% ,开始时间：' + starttime.getHours() + ':' + starttime.getMinutes() + ':' + starttime.getSeconds();
}
function randcolor(a, b) {
    var a = Number("0x" + a.substr(1));
    var b = Number("0x" + b.substr(1));
    icolor = parseInt(Math.random() * (a - b) + b);
    var color = icolor.toString(16);
    while (color.length < 6) {
        color = "0" + color;
    }
    color = "#" + color;
    return color;
}

function bgcolor(a) {
    a.style.background = randcolor('#222222', '#dddddd');
}
function resetcolor(a) {
    a.style.background = '#ffffff';
}
function next() {
    var sign = [' + ', ' - '], n = rand(1, 2);
    qu = '', an = '';
    while (qu == '') {
        for (i = 0; i < n; i++) {
            qu += rand(amin, amax) + sign[rand(0, 1)];
        }
        qu += rand(amin, amax) + ' = ';
        var exp = '\\d+.{3}\\d+';
        while (true) {
            var temp = new RegExp(exp).exec(qu);
            if(temp == null){       //寻找完算式退出
                break;
            }
            if (eval(temp[0]) < 0) {        //负数重新生成算式
                qu = '';
                break;
            }
            exp += '.{3}\\d+';
        }
    }
    p1.innerHTML = qu;
    p1.style.color = randcolor('#333333', '#ffffff');
    sum++;
}
function show1(n) {
    an += n;
    p1.innerHTML = qu + an;
}
function ok() {
    var temp = qu.replace(/ = /, '');
    if (eval(temp) == Number(an)) {
        if (presum != sum) {
            presum = sum;
            right++;
        }
        next();
        info();
        return;
    }
    if (presum != sum) {
        presum = sum;
        wrong++;
    }
    info();
    p1.innerHTML += '   ❌';
    an = '';
}
function delete1() {
    an = an.substr(0, an.length - 1);
    p1.innerHTML = qu + an;
}
function reset() {
    an = '';
    p1.innerHTML = qu + an;
}
function rand(a, b) {
    return parseInt(Math.random() * (b - a + 1) + a);
}