"use strict";

let gl;
let points;

const NumPoints = 5000;

window.onload = function init()
{
    const canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    const vertices = [
        vec2(-1, -1),
        vec2(0, 1),
        vec2(1, -1)
    ];

    // Specify a starting point p for our iterations
    // p must lie inside any set of three vertices
    /*
    const u = add(vertices[0], vertices[1]);
    const v = add(vertices[0], vertices[2]);
    let p = scale(0.25, add(u, v));
    */
    
    //daemi 1 a)
    var p = vec2(100,100);

    // And, add our initial point into our array of points

    points = [ p ];

    // Compute new points
    // Each new point is located midway between
    // last point and a randomly chosen vertex

    for (let i = 0; points.length < NumPoints; ++i ) {
        const j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
        points.push( p );
    }


    //daemi 1 b)
    /*
    for (let i = 0; points.length < NumPoints; ++i ) {
        var c = chance();
        p = add( points[i], vertices[c]);
        p = scale( 0.5, p );
        points.push( p );
    }
    */

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    const program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram( program );

    // Load the data into the GPU

    const bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    const vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};

//fyrir daemi 1 b)
function chance() {
    const c = Math.random();
    let pos;
    if (c < 0.05) {
        pos = 2;
    } else if (c < 0.5) {
        pos = 1;
    }
    else {
        pos = 0;
    }
    return pos;
}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.POINTS, 0, points.length );
}
