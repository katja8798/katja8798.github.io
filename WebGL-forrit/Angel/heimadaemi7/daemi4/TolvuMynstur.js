/////////////////////////////////////////////////////////////////
//    Sýnislausn á dæmi 3 í heimadæmum 4 í Tölvugrafík
//     Sýnir tölvuskjá búinn til úr þremur teningum.
//
//    Hjálmtýr Hafsteinsson, febrúar 2022
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var NumVertices  = 36;
var numScreenVertices = 6;

var points = [];
var colors = [];

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -2.0;

var modelViewLoc;
var projectionLoc;
var projectionMatrix;

var program;
var program2;
var screenBuffer;
var locPosition;
var locModelView;
var locProjection;
var locTexCoord;
var texture;
var vColor;
var vBuffer;
var vPosition;

// Tveir þríhyrningar sem mynda skja
var screenVertices = [
    vec4( -1.00,  0.0, 1.0, 1.0 ),
    vec4(  1.00,  0.0, 1.0, 1.0 ),
    vec4(  1.00,  1.0, 1.0, 1.0 ),
    vec4(  1.00,  1.0, 1.0, 1.0 ),
    vec4( -1.00,  1.0, 1.0, 1.0 ),
    vec4( -1.00,  0.0, 1.0, 1.0 )
];

// Mynsturhnit fyrir skja
var texCoords = [
    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 )
];

function configureTexture( image, prog ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    gl.useProgram(prog);
    gl.uniform1i(gl.getUniformLocation(prog, "texture"), 0);
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    program2 = initShaders( gl, "vertex-shader2", "fragment-shader2" );


    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );

    gl.enableVertexAttribArray( vColor );
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );

    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.enableVertexAttribArray( vPosition );
    modelViewLoc = gl.getUniformLocation( program, "modelView" );

    projectionLoc = gl.getUniformLocation( program, "projection" );

    // Fyrir screen mynstur

    screenBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, screenBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(screenVertices), gl.STATIC_DRAW );

    locPosition = gl.getAttribLocation( program2, "vPosition" );
    gl.enableVertexAttribArray( locPosition );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW );

    locTexCoord = gl.getAttribLocation( program2, "vTexCoord" );
    gl.vertexAttribPointer( locTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( locTexCoord );

    const image = document.getElementById("texImage");
    configureTexture( image, program2 );

    locProjection = gl.getUniformLocation( program2, "projection" );
    locModelView = gl.getUniformLocation( program2, "modelview" );


    projectionMatrix = perspective( 60.0, 1.0, 0.1, 100.0 );

    gl.useProgram(program);
    gl.uniformMatrix4fv(projectionLoc, false, flatten(projectionMatrix) );

    gl.useProgram(program2);
    gl.uniformMatrix4fv(locProjection, false, flatten(projectionMatrix));

    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
            spinY = ( spinY + (origX - e.offsetX) ) % 360;
            spinX = ( spinX + (e.offsetY - origY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );

    // Event listener for keyboard
    window.addEventListener("keydown", function(e){
        switch( e.keyCode ) {
            case 38:	// upp ör
                zDist += 0.1;
                break;
            case 40:	// niður ör
                zDist -= 0.1;
                break;
        }
    }  );

    // Event listener for mousewheel
    window.addEventListener("wheel", function(e){
        if( e.deltaY > 0.0 ) {
            zDist += 0.2;
        } else {
            zDist -= 0.2;
        }
    }  );

    render();
}

function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

function quad(a, b, c, d)
{
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
        [ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
        [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 1.0, 1.0, 1.0, 1.0 ]   // white
    ];

    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push(vertexColors[a]);
    }
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mv = lookAt( vec3(0.0, 0.0, zDist), vec3(0.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0) );
    mv = mult( mv, rotateX(spinX) );
    mv = mult( mv, rotateY(spinY) ) ;



    // Smíða tölvuskjá
    // Fyrst botnplatan..
    //gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER,  vBuffer);
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );

    gl.useProgram(program);
    let mv1 = mult( mv, translate( 0.0, -0.2, 0.0 ) );
    mv1 = mult( mv1, scalem( 0.4, 0.04, 0.25 ) );

    gl.uniformMatrix4fv(modelViewLoc, false, flatten(mv1));

   gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    // Svo stöngin...
    mv1 = mult( mv, translate( 0.0, 0., 0.0 ) );
    mv1 = mult( mv1, scalem( 0.1, 0.4, 0.05 ) );
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    // Loks skjárinn sjálfur...
    mv1 = mult( mv, translate( 0.0, 0.3, -0.02 ) );
    mv1 = mult( mv1, rotateX( 5 ));
    mv1 = mult( mv1, scalem( 0.7, 0.5, 0.02 ) );
    gl.uniformMatrix4fv(modelViewLoc, false, flatten(mv1));

    /*gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER,  vBuffer);
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
*/
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );

    let mv2 = mv1;
    // teikna fánann með liturum 2
    gl.useProgram(program2);
    mv2 = mult( mv1, translate( 0.0, -0.4, -1.0) );
    mv2 = mult( mv2, rotateX( 5 ));
    mv2 = mult( mv2, scalem( 0.4, 0.8, 0.02 ) );
    gl.uniformMatrix4fv(locModelView, false, flatten(mv2));

    gl.bindBuffer( gl.ARRAY_BUFFER, screenBuffer );
    gl.vertexAttribPointer( locPosition, 4, gl.FLOAT, false, 0, 0 );

    gl.drawArrays( gl.TRIANGLES, 0, numScreenVertices );

    requestAnimFrame( render );
}

