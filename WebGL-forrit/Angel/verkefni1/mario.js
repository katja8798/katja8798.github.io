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
var jump = false;

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
        if (jump === false) {
            switch (e.keyCode) {
                case 37:	// vinstri ör
                    xmove = -0.03;
                    if (v[1][0] !== v[0][0]) {
                        v[1][0] = v[0][0];
                    }
                    break;
                case 39:	// hægri ör
                    xmove = 0.03;
                    if (v[1][0] !== v[2][0]) {
                        v[1][0] = v[2][0];
                    }
                    break;
                case 32:
                    jump = true;
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

    drawSpecific(gl.TRIANGLES, cMario, 0,3);
    drawSpecific(gl.TRIANGLE_STRIP, cPlatform, 3,4);

    window.requestAnimationFrame(render);
}

function drawSpecific(type, c, f,n) {
    //gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
    //gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.uniform4fv( locColor, flatten(c) );
    gl.drawArrays( type, f, n );
}

function run(){

}

function jump(){

}
