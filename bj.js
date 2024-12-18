    var colorArr = ['#1cf3ff','skyblue','orange'];
    var screenW = window.innerWidth;
    var screenH = window.innerHeight;
    window.onload = function(){
        //在屏幕上绘制 800 个随机的点
        for( var i = 0; i < 800; i++ ){
            var span = document.createElement('span');
            var width = Math.random() * 3;  // 产生 0-3 之间的宽度值
            var colorIndex = parseInt(Math.random() * 3);
            var x = parseInt(Math.random() * screenW);
            var y = parseInt(Math.random() * screenH);
            span.style.width = parseInt(width) + 'px';
            span.style.height = parseInt(width) + 'px';
            span.style.background = colorArr[colorIndex];
            span.style.left = x + 'px';
            span.style.top = y + 'px';
            document.body.appendChild(span);
        }
    }

    var POINT_NUM = 150;    //随机点的数量
    var LINE_LENGTH = 10000;    //点与点之间的连线长度的平方（便于计算）

    var csv = document.createElement('canvas');
    csv.width = screenW;
    csv.height = screenH;
    document.body.appendChild(csv);

    var ctx = csv.getContext('2d');

    //随机函数
    function randomInt(min,max) {
        return Math.floor((max - min + 1) * Math.random() + min);
    }
    
    function randomFloat(min,max) {
        return (max - min) * Math.random() + min;
    }

    //构造点类
    function Point(){
        this.x = randomInt(0,csv.width);
        this.y = randomInt(0,csv.height);
        this.r = 1.5;   //半径

        var speed  = randomFloat(0.3,1.2);  //点的移动速度
        var angle = randomFloat(0,2 * Math.PI);  //点的移动方向角度

        //点的水平与竖直移动速度
        this.dx = Math.sin(angle) * speed;
        this.dy = Math.cos(angle) * speed;

        var i = randomInt(0,2);
        this.color = colorArr[i];
    }

    //点移动方法，若点超出屏幕边界，则向相反方向移动
    Point.prototype.move = function () {
        this.x += this.dx;
        this.y += this.dy;
        if(this.x < 0){
            this.x = 0;
            this.dx = -this.dx;
        }else if(this.x > csv.width){
            this.x = csv.width;
            this.dx = - this.dx;
        }
        if(this.y < 0){
            this.y = 0;
            this.dy = -this.dy;
        }else if(this.y > csv.height){
            this.y = csv.height;
            this.dy = -this.dy;
        }
    }

    //绘点
    Point.prototype.draw = function () {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }

    var points = [];

    //初始化点集
    function initPoints(num) {
        for(var i = 0; i < num; i++){
            points.push(new Point());
        }
    }

    var p0 = new Point();   //鼠标所在点
    p0.dx = p0.dy = 0;

    //获取鼠标当前坐标
    //当鼠标移动时
    document.onmousemove = function (ev) {
        p0.x = ev.clientX;
        p0.y = ev.clientY;
    }
    // document.onmousedown = function (ev) {
    //     p0.x = ev.clientX;
    //     p0.y = ev.clientY;
    //     for(var i = 0; i < 3; i++){
    //        var p = new Point();
    //        p.draw();
    //        p.move();
    //     }
    // }
    // document.onmouseup = function (ev) {
    //     p0.x = ev.clientX;
    //     p0.y = ev.clientY;
    // }
    //当鼠标移除窗口时
    window.onmouseout = function () {
        p0.x = null;
        p0.y = null;
    }

    //两点之间连线
    function drawLine(p1,p2) {
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        var dis = dx * dx + dy * dy;    //两点之间的距离公式,三角形的斜边(平方)
        if(dis < 2 * LINE_LENGTH){  //当两点之间的距离小于给定的长度，绘制两点之间的连线且连线透明度根据距离而变化
            if(dis > LINE_LENGTH){  //吸引 length ~ 2 * length 范围内的点,对于小于 length 的点，使其自由移动
                if(p1 === p0){
                    p2.x += dx * 0.03;
                    p2.y += dy * 0.03;
                }
            }
            // 设置线段的透明度 t， t 取值为 (0, 0.2)，透明度随两点之间的距离改变而改变
            var t = (1.0 - dis / LINE_LENGTH) * 0.2;
            ctx.strokeStyle = 'rgba(255,255,255,' + t + ')';
            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.moveTo(p1.x,p1.y);
            ctx.lineTo(p2.x,p2.y);
            ctx.closePath();
            ctx.stroke();
        }
    }

    //绘制每一帧
    function drawFrame() {
        csv.width = screenW;
        csv.height = screenH;

        var arr = (p0.x === null ? points : [p0].concat(points));
        for(var i = 0; i < arr.length; i++){
            for(var j = i + 1; j < arr.length; j++){
                drawLine(arr[i],arr[j]);
            }
            arr[i].draw();
            arr[i].move();
        }
        window.requestAnimationFrame(drawFrame);
    }
    initPoints(POINT_NUM);
    drawFrame();
