let gl;

// Global variables (accessed in render)
let locPosition;
let locColor;

//colors
const cMario = vec4(0.0, 0.0, 1.0, 1.0);
const cPlatform = vec4(0.0, 1.0, 0.0, 1.0);
const cGold = vec4(1.0, 1.0, 0.0, 1.0);

//other
const v = [
    vec2(-0.9, -0.95), vec2(-0.9, -0.45), vec2(-0.75, -0.95),//mario
    vec2(-1, -1), vec2(-1, -0.95), vec2(1, -1), vec2(1, -0.95)];//platform

let buffer;

const gold = {
    INDEXINV: [],
    CURR_LP: [0,0,0],//current lifespan
    LIFESPAN: 10,//how long it "alive"
    COUNT: 0,//number of gold active
    MAX: 3,//maximum 3 gold at a time
};

const jump = {
    UP: false,
    DOWN: false,
    COUNT: 0,
    MAX: 42,
    GROUND: -0.95
};

let facingRight = true;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //  Configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 0.9, 0.9, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Define Buffer and load the data into the GPU
    buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
    gl.bufferData( gl.ARRAY_BUFFER, 8*200, gl.DYNAMIC_DRAW);

    // Get location of shader variable vPosition
    locPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( locPosition );

    // Event listener for keyboard
    window.addEventListener("keydown", function(e){
        if (jump.UP === false && jump.DOWN === false) {
            switch (e.keyCode) {
                case 37:	// vinstri ör
                    xmove = -0.03;
                    if (facingRight === true) {
                        v[1][0] = v[2][0];
                        facingRight = false;
                    }
                    break;
                case 39:	// hægri ör
                    xmove = 0.03;
                    if (facingRight === false) {
                        v[1][0] = v[0][0];
                        facingRight = true;
                    }
                    break;
                case 32: //Space takki
                    jump.UP = true;
                    break;
                default:
                    xmove = 0.0;
            }
            for (let i = 0; i < 3; i++) {
                v[i][0] += xmove;
            }

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(v));
        }
    });



    locColor = gl.getUniformLocation( program, "rcolor" );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    if (jump.DOWN === true || jump.UP === true) {
        JUMP();
    }

    //Randomly make gold if maximum hasn't been reached
    if (gold.COUNT < gold.MAX) {
        chanceGold(10);
    }

    //decrease lifespan of active gold
    if (gold.COUNT > 0) {
        for(let i = gold.COUNT-1; i >= 0; i--){
            gold.CURR_LP[i]--;
            if (gold.CURR_LP[i] === 0) {
                gold.CURR_LP.splice(i, 1);
                v.splice(7+i*4, 4);
            }
        }
    }

    drawSpecific(gl.TRIANGLES, cMario, 0,3);
    drawSpecific(gl.TRIANGLE_STRIP, cPlatform, 3,4);

    //Only render of there is any gold
    if(gold.COUNT > 0) {
        for (let i = 0; i < gold.COUNT; i++) {
            drawSpecific(gl.TRIANGLE_STRIP, cGold, 7+i*4,4);
        }//
    }

    window.requestAnimationFrame(render);
}

function drawSpecific(type, c, f,n) {
    gl.uniform4fv( locColor, flatten(c) );
    gl.drawArrays( type, f, n );
}

function JUMP(){
    const speed = 0.035;
    let angle;

    if (jump.UP) {//upward "arc"
        if (jump.COUNT <= jump.MAX/3) {
            angle = Math.PI*17/36;//85
            jump.COUNT++;
        } else if (jump.COUNT <= 2*jump.MAX/3) {
            angle = Math.PI*5/12;//75
            jump.COUNT++;
        }
        else if (jump.COUNT <= jump.MAX) {
            angle = Math.PI/3;//60
            jump.COUNT++;
        }
        else {
            jump.UP = false;
            jump.DOWN = true;
        }
    }
    if (jump.DOWN) {//Downward "arc"
        if (jump.COUNT >= 2*jump.MAX/3){
            angle = Math.PI*5/3;//300
            jump.COUNT--;
        }
        else if (jump.COUNT >= jump.MAX/3) {
            angle = Math.PI*19/12;//285
            jump.COUNT--;
        }
        else if (jump.COUNT > 0) {
            angle = Math.PI*55/36;//360-85=300-25=290-15=
            jump.COUNT--;
        }
        else if (jump.COUNT <= 0) {
            jump.UP = false;
            jump.DOWN = false;
            jump.COUNT = 0;
        }
    }

    if (!facingRight) {
        angle = Math.PI-angle;
    }

    if (jump.COUNT === 0) {
        for (let i = 0; i < 3; i++){
            switch (i){
                case 0:
                case 2:
                    v[i][1] = jump.GROUND;
                    break;
                case 1:
                    v[i][1] = -0.45;
                    break;
            }
        }
    } else {
        for (let i = 0; i < 3; i++) {
            v[i][0] += speed * Math.cos(angle);
            v[i][1] += speed * Math.sin(angle);
        }
    }

    //update buffer
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(v));
}

function getRandom (min, max) {
    return (min + Math.random() * (max - min));
}

function chanceGold(num){
    const r = getRandom(0, 1000);

    if (num > r && gold.COUNT < gold.MAX) {
        //update number of gold "active"
        gold.COUNT++;

        //Use count as a pseudo index and assign LifeSpan to that place
        gold.CURR_LP[gold.COUNT-1] = gold.LIFESPAN;

        //randomly decide where on screen it is
        const LeftRight = Math.random() < 0.5 ? -1 : 1;
        const TopBottom = Math.random() < 0.5 ? -1 : 1;
        const yloc = Math.floor(getRandom(0, 90)) / 100 * TopBottom;
        const xloc = Math.floor(getRandom(0, 90)) / 100 * LeftRight;

        //put the coords in v
        v.push(vec2(xloc, yloc));
        v.push(vec2(xloc, yloc-0.10));
        v.push(vec2(xloc-0.05, yloc));
        v.push(vec2(xloc-0.05, yloc-0.10));

        //update buffer
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(v));
    }
}