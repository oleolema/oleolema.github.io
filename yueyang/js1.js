var amin = 0,amax = 10;
var p1 = document.getElementById('p1');
var p2 = document.getElementById('p2');
var num = document.getElementById('table1');
var qu, an;
var right = 0, wrong = 0, sum = -1, presum = -2;
next();
/*
console.info(num);
num.addEventListener("mouseover",function(event){
    var a = event.fromElement;
    console.log(event);
    a.bgcolor ='#ff0000';
},false);
num.addEventListener("mouseout",function(event){
    console.log(event.fromElement.getElementsByClassName('num').length);
},false);

*/
function info() {
    p2.style.color = randcolor('#333333', '#ffffff');
    p2.innerHTML = '做了 ' + sum + ' 个题, 答对 ' + right + '个, 答错 ' + wrong + '个, 正确率为 ' + parseInt(right / sum * 100) + '% ,用时：';
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
        if(eval(qu.replace(/ = /, '')) < 0){
            qu ='';
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