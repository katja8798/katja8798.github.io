var gl;

// Global variables (accessed in render)
var locPosition;
var locColor;

//colors
var cMario = vec4(0.0, 0.0, 1.0, 1.0);
var cPlatform = vec4(0.0, 1.0, 0.0, 1.0);

//other
var v = [ vec2( -0.9, -0.95 ), vec2( -0.75,  -0.6 ), vec2( -0.75, -0.95 ),//mario
    vec2(  -1, -1 ), vec2(  -1,  -0.95 ), vec2(  1, -1 ), vec2(  1, -0.95 )]; //platform
var buffer;

var jump = {UP: false,
            DOWN: false,
            COUNT: 0,
            MAX: 30,
            GROUND: -0.95};

var facingRight = true;

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

    // Define two VBOs and load the data into the GPU
    buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(v), gl.DYNAMIC_DRAW);

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
                        v[1][0] = v[0][0];
                        facingRight = false;
                    }
                    break;
                case 39:	// hægri ör
                    xmove = 0.03;
                    if (facingRight === false) {
                        v[1][0] = v[2][0];
                        facingRight = true;
                    }
                    break;
                case 32: //Space takki
                    jump.UP = true;
                    break;
                default:
                    xmove = 0.0;
            }
            for (i = 0; i < 3; i++) {
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

    drawSpecific(gl.TRIANGLES, cMario, 0,3);
    drawSpecific(gl.TRIANGLE_STRIP, cPlatform, 3,4);

    window.requestAnimationFrame(render);
}

function drawSpecific(type, c, f,n) {
    gl.uniform4fv( locColor, flatten(c) );
    gl.drawArrays( type, f, n );
}

function JUMP(){
    var speed = 0.0225;
    var dirn;

    if (jump.UP) {
        if (jump.COUNT <= jump.MAX / 2) {
            dirn = Math.PI/3;
            jump.COUNT++;
        } else if (jump.COUNT <= jump.MAX) {
            dirn = Math.PI/4;
            jump.COUNT++;
        } else {
            jump.UP = false;
            jump.DOWN = true;
        }
    }
    if (jump.DOWN) {
        if (jump.COUNT >= jump.MAX/2){
            dirn = Math.PI*7/4;
            jump.COUNT--;
        }
        else if (jump.COUNT > 0) {
            dirn = Math.PI*5/3 ;
            jump.COUNT--;
        }
        else if (jump.COUNT <= 0) {
            jump.UP = false;
            jump.DOWN = false;
            jump.COUNT = 0;
        }
    }

    if (!facingRight) {
        if (jump.COUNT <= jump.MAX/2) {
            dirn *= 2;
        }
        else if (jump.COUNT <= jump.MAX) {
            dirn *= 3;
        }
    }

    if (jump.COUNT === 0) {
        for (let i = 0; i < 3; i++){
            switch (i){
                case 0:
                case 2:
                    v[i][1] = jump.GROUND;
                    break;

                case 1:
                    v[i][1] = -0.6;
                    break;
            }
        }
    } else {
        for (let i = 0; i < 3; i++) {
            v[i][0] += speed * Math.cos(dirn);
            v[i][1] += speed * Math.sin(dirn);
        }
    }

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(v));
}

function chance() {

}
