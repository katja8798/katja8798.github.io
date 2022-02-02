var canvas;
var gl;

var points = [];

var numCirclePoints = 4;
var rad = 0.8//size of circle

var bufferId;

function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.


    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, 8*Math.pow(3, 6), gl.STATIC_DRAW );


    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    document.getElementById("slider").onchange = function(event) {
        numCirclePoints = event.target.value;
        render();
    };


    render();
};

window.onload = init;


function Circle(k ) {
    var cent = vec2(0,0);
    points.push(cent);

    var dAngle = 2*Math.PI/k;
    var third = 1;
    var extraPoints = 0;
    for( i=k; i>=0; i-- ) {
        a = i*dAngle;
        var p = vec2( rad*Math.sin(a) + cent[0], rad*Math.cos(a) + cent[1] );
        points.push(p);
        if (third >= 2) {
            points.push(cent);
            points.push(p);
            third = 2;
            extraPoints += 2;
        }
        else {
            third += 1;
        }
    }
    numCirclePoints += extraPoints;
}

function render() {
    points = [];

    Circle(numCirclePoints);

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(points));
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    points = [];

}

