/////////////////////////////////////////////////////////////////
//    Verkefni 2 - T?lvugraf?k
//    Katja Nikole Vernhar?sd?ttir - knb2@hi.is
/////////////////////////////////////////////////////////////////

var canvas;
var gl;

var NumVertices = 36;

var points = [];

var vBuffer;
var vPosition;

var movement = false;// rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;
var lines = [];
var zDist = -3.0;
var eyesep = 0.2;

let proLoc;
let mvLoc;
let colorLoc;
let vertices = [];

//World grid
let gridNum = 10;//makes 10*10*10=1000 spots
let gridStart = -0.63;
let gridSpacing = 0.14;
let worldGrid;

//animals
const animal = [];
const sheep = [];
const wolf = [];

// Slider info
let sheepCount;
let wolfCount;
let sheepBirthrate = 3;
let wolfBirthrate = 1;
let hungerTime = 50;
let simulationSpeed = 155;
let time = 0;

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }
    worldGrid = grid(gridNum);

    world();
    colorAnimals();

    sheep.push(createSheep(getRandomSpot()));
    wolf.push(createWolf(getRandomSpot()));

    vertices.push(...lines);
    vertices.push(...animal);

    sheepCount = sheep.length;
    wolfCount = wolf.length;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    colorLoc = gl.getUniformLocation(program, "wireColor");

    proLoc = gl.getUniformLocation(program, "projection");
    mvLoc = gl.getUniformLocation(program, "modelview");

    var proj = perspective(50.0, 1.0, 0.2, 100.0);
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));

    //event listeners for mouse
    canvas.addEventListener("mousedown", function (e) {
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    });

    canvas.addEventListener("mouseup", function (e) {
        movement = false;
    });

    canvas.addEventListener("mousemove", function (e) {
        if (movement) {
            spinY = (spinY + (origX - e.offsetX)) % 360;
            spinX = (spinX + (e.offsetY - origY)) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    });

    // Event listener for keyboard
    window.addEventListener("keydown", function (e) {
        switch (e.keyCode) {
            case 38:	// upp ?r
                zDist += 0.1;
                break;
            case 40:	// ni?ur ?r
                zDist -= 0.1;
                break;
        }
    });

    // Event listener for mousewheel
    window.addEventListener("mousewheel", function (e) {
        if (e.wheelDelta > 0.0) {
            zDist += 0.1;
        } else {
            zDist -= 0.1;
        }
    });

    render();
}

function render() {
    time += 1;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    let mv = lookAt(
            vec3(0.0 - eyesep / 2.0, 0.0, zDist),
            vec3(0.0, 0.0, zDist + 2.0),
            vec3(0.0, 1.0, 0.0)
    );
    mv = mult(mv, mult(rotateX(spinX), rotateY(spinY)));

    // Draw Cube
    gl.uniform4fv(colorLoc, vec4(0.0, 0.0, 0.0, 1.0));
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.LINES, 0, lines.length);


    //Draw sheep
    for (let i = 0; i < sheep.length; i++) {
        drawAnimal(mv, sheep[i]);
    }

    //Draw wolves
    for (let i = 0; i < wolf.length; i++) {
        drawAnimal(mv, wolf[i]);
    }

    //Make animals live according to behaviours
    if(time % simulationSpeed === 0) {
        sheepBehaviour();
        wolfBehaviour();
    }

    requestAnimFrame(render);
}