var roof = null;
var roofPoints = [];
var lines = [];
var lineCounter = 0;
var drawingObject = {};
drawingObject.type = "";
drawingObject.background = "";
drawingObject.border = "";

function Point(x, y) {
    this.x = x;
    this.y = y;
}


$("#polyBtn").click(function() {
    if (drawingObject.type == "roof") {
        drawingObject.type = "";
        lines.forEach(function(value, index, ar) {
            canvas.remove(value);
        });
        //canvas.remove(lines[lineCounter - 1]);
        roof = makeRoof(roofPoints);
        canvas.add(roof);
        canvas.renderAll();
    } else {
        drawingObject.type = "roof"; // roof type
    }
});


// canvas Drawing
var canvas = new fabric.Canvas('canvas-tools');
var x = 0;
var y = 0;

fabric.util.addListener(window, 'dblclick', function() {
    drawingObject.type = "";
    lines.forEach(function(value, index, ar) {
        canvas.remove(value);
    });
    //canvas.remove(lines[lineCounter - 1]);
    roof = makeRoof(roofPoints);
    canvas.add(roof);
    canvas.renderAll();

    console.log("double click");
    //clear arrays
    roofPoints = [];
    lines = [];
    lineCounter = 0;

});



canvas.on('mouse:down', function(options) {
    if (drawingObject.type == "roof") {
        canvas.selection = false;
        setStartingPoint(options); // set x,y
        roofPoints.push(new Point(x, y));
        var points = [x, y, x, y];
        var lineToPush = new fabric.Line(points, {
            strokeWidth: 3,
            selectable: false,
            stroke: 'red',
            cornerSize: 50
        });
        lines.push(lineToPush);

        canvas.add(lines[lineCounter]);
        lineCounter++;


        if (roofPoints.length > 1) {
            //Calculate angle between two lijnes
            var lengthLines = lines.length;
            //getAngleBetweenLines(roofPoints[lengthRoof - 2], roofPoints[lengthRoof - 1]);
            getAngleBetweenLines2(lines[lengthLines - 3], lines[lengthLines - 2]);
            /*  
                - Close Polygon when clicked firs point
                - I take the smae point if the target point is upper or lesser 3 pixeles
            */
            if ((roofPoints[0].x + 3 >= x && roofPoints[0].x - 3 <= x) && (roofPoints[0].y + 3 >= y && roofPoints[0].y - 3 <= y)) {
                console.log("Punto final igual a inicial");
                drawingObject.type = "";
                lines.forEach(function(value, index, ar) {
                    canvas.remove(value);
                });
                roof = makeRoof(roofPoints);
                canvas.add(roof);
                canvas.renderAll();

                //clear arrays
                roofPoints = [];
                lines = [];
                lineCounter = 0;
            }

        }

        canvas.on('mouse:up', function(options) {
            canvas.selection = true;
        });
    }
});
canvas.on('mouse:move', function(options) {
    if (lines[0] !== null && lines[0] !== undefined && drawingObject.type == "roof") {
        setStartingPoint(options);
        lines[lineCounter - 1].set({
            x2: x,
            y2: y
        });
        canvas.renderAll();
    }
});

//Change color on selected any polygon
canvas.on('object:selected', function(o) {
    var activeObj = o.target;
    if (activeObj.get('type') == 'polyline') {
        activeObj.set({
            'fill': randomRGBA()
        });
    }
});


function setStartingPoint(options) {
    var offset = $('#canvas-tools').offset();
    x = options.e.pageX - offset.left;
    y = options.e.pageY - offset.top;
}

function makeRoof(roofPoints) {

    var left = findLeftPaddingForRoof(roofPoints);
    var top = findTopPaddingForRoof(roofPoints);
    roofPoints.push(new Point(roofPoints[0].x, roofPoints[0].y))
    var roof = new fabric.Polyline(roofPoints, {
        fill: 'rgba(0,0,0,0)',
        stroke: '#58c'
    });

    roof.set({

        left: left,
        top: top,

    });


    return roof;
}

function findTopPaddingForRoof(roofPoints) {
    var result = 999999;
    for (var f = 0; f < lineCounter; f++) {
        if (roofPoints[f].y < result) {
            result = roofPoints[f].y;
        }
    }
    return Math.abs(result);
}

function findLeftPaddingForRoof(roofPoints) {
    var result = 999999;
    for (var i = 0; i < lineCounter; i++) {
        if (roofPoints[i].x < result) {
            result = roofPoints[i].x;
        }
    }
    return Math.abs(result);
}

function randomRGBA() {
    var o = Math.round,
        r = Math.random,
        s = 255;
    return 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + r().toFixed(1) + ')';
}

function getAngleBetweenLines(pointOne, pointTwo) {

    //var v1 = {x: 0, y: 1}, v2 = {x: 1, y: 0},
    var v1 = {
            x: pointOne.x,
            y: pointOne.y
        },
        v2 = {
            x: pointTwo.x,
            y: pointTwo.y
        },
        angleRad = Math.acos((v1.x * v2.x + v1.y * v2.y) / (Math.sqrt(v1.x * v1.x + v1.y * v1.y) * Math.sqrt(v2.x * v2.x + v2.y * v2.y))),
        angleDeg = angleRad * 180 / Math.PI;
    console.log(angleDeg);
    return angleDeg;
}

function getAngleBetweenLines2(lineOne, lineTwo) {
    //find vector components
    var dAx = lineOne.x2 - lineOne.x1;
    var dAy = lineOne.y2 - lineOne.y1;
    var dBx = lineTwo.x2 - lineTwo.x1;
    var dBy = lineTwo.y2 - lineTwo.y1;
    var angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
    if (angle < 0) {
        angle = angle * -1;
    }
    var degree_angle = angle * (180 / Math.PI);
    console.log("El angulo es " + degree_angle);
}