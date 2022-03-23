/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Forrit með tveimur mynstrum.  Sýnir vegg með
//     múrsteinsmynstri og gólf með viðarmynstri.  Það er hægt
//     að ganga um líkanið, en það er engin árekstarvörn.
//
//    Hjálmtýr Hafsteinsson, mars 2022
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var numVertices  = 6;

var program;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texture;
var texVegg;
var texGolf;
var texCeil;
var texDoor;

// Breytur fyrir hreyfingu áhorfanda
var userXPos = 0.0;
var userZPos = 1.0;
var userIncr = 0.1;                // Size of forward/backward step
var userAngle = 270.0;             // Direction of the user in degrees
var userXDir = 0.0;                // X-coordinate of heading
var userZDir = -1.0;               // Z-coordinate of heading
var nextXPos = userXPos;
var nextZPos = userZPos;


var movement = false;
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var zDist = -5.0;

var proLoc;
var mvLoc;

// Hnútar veggsins
var vertices = [
    // Hnútar fyrir vegg 1
    vec4( -50.0,  0.0, 0.0, 1.0 ),
    vec4(  50.0,  0.0, 0.0, 1.0 ),
    vec4(  50.0,  3.0, 0.0, 1.0 ),
    vec4(  50.0,  3.0, 0.0, 1.0 ),
    vec4( -50.0,  3.0, 0.0, 1.0 ),
    vec4( -50.0,  0.0, 0.0, 1.0 ),
    // Hnútar gólfsins (strax á eftir)
    vec4( -50.0,  0.0, 2.0, 1.0 ),
    vec4(  50.0,  0.0, 2.0, 1.0 ),
    vec4(  50.0,  0.0, 0.0, 1.0 ),
    vec4(  50.0,  0.0, 0.0, 1.0 ),
    vec4( -50.0,  0.0, 0.0, 1.0 ),
    vec4( -50.0,  0.0, 2.0, 1.0 ),
    // Hnútar fyrir vegg 2
    vec4( -50.0,  0.0, 2.0, 1.0 ),
    vec4(  50.0,  0.0, 2.0, 1.0 ),
    vec4(  50.0,  3.0, 2.0, 1.0 ),
    vec4(  50.0,  3.0, 2.0, 1.0 ),
    vec4( -50.0,  3.0, 2.0, 1.0 ),
    vec4( -50.0,  0.0, 2.0, 1.0 ),
    // Hnútar fyrir loft
    vec4( -50.0,  3.0, 2.0, 1.0 ),
    vec4(  50.0,  3.0, 2.0, 1.0 ),
    vec4(  50.0,  3.0, 0.0, 1.0 ),
    vec4(  50.0,  3.0, 0.0, 1.0 ),
    vec4( -50.0,  3.0, 0.0, 1.0 ),
    vec4( -50.0,  3.0, 2.0, 1.0 ),
    // Hnútar fyrir hurd 1
    vec4(  50.0,  0.0, 0.0, 1.0 ),
    vec4(  50.0,  0.0, 2.0, 1.0 ),
    vec4(  50.0,  3.0, 2.0, 1.0 ),
    vec4(  50.0,  3.0, 2.0, 1.0 ),
    vec4(  50.0,  3.0, 0.0, 1.0 ),
    vec4(  50.0,  0.0, 0.0, 1.0 ),
    // Hnútar fyrir hurd 2
    vec4( -50.0,  0.0, 0.0, 1.0 ),
    vec4( -50.0,  0.0, 2.0, 1.0 ),
    vec4( -50.0,  3.0, 2.0, 1.0 ),
    vec4( -50.0,  3.0, 2.0, 1.0 ),
    vec4( -50.0,  3.0, 0.0, 1.0 ),
    vec4( -50.0,  0.0, 0.0, 1.0 ),
];

var texCoords = [
    // Mynsturhnit fyrir vegg 1
    vec2(   0.0, 0.0 ),
    vec2( 100.0, 0.0 ),
    vec2( 100.0, 4.0 ),
    vec2( 100.0, 4.0 ),
    vec2(   0.0, 4.0 ),
    vec2(   0.0, 0.0 ),
    // Mynsturhnit fyrir gólf
    vec2(   0.0, 0.0 ),
    vec2( 50.0, 0.0 ),
    vec2( 50.0, 1.0 ),
    vec2( 50.0, 1.0 ),
    vec2(   0.0, 1.0 ),
    vec2(   0.0, 0.0 ),
    // Mynsturhnit fyrir vegg 2
    vec2(   0.0, 0.0 ),
    vec2( 100.0, 0.0 ),
    vec2( 100.0, 4.0 ),
    vec2( 100.0, 4.0 ),
    vec2(   0.0, 4.0 ),
    vec2(   0.0, 0.0 ),
    // Mynsturhnit fyrir loft
    vec2(   0.0,  0.0 ),
    vec2( 200.0,  0.0 ),
    vec2( 200.0, 10.0 ),
    vec2( 200.0, 10.0 ),
    vec2(   0.0, 10.0 ),
    vec2(   0.0,  0.0 ),
    // Mynsturhnit fyrir hurd 1
    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),
    // Mynsturhnit fyrir hurd 2
    vec2( 0.0, 0.0 ),
    vec2( 1.0, 0.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 1.0, 1.0 ),
    vec2( 0.0, 1.0 ),
    vec2( 0.0, 0.0 ),
];


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.9, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    // Lesa inn og skilgreina mynstur fyrir vegg
    var veggImage = document.getElementById("VeggImage");
    texVegg = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texVegg );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, veggImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    // Lesa inn og skilgreina mynstur fyrir gólf
    var golfImage = document.getElementById("GolfImage");
    texGolf = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texGolf );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, golfImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    // Lesa inn og skilgreina mynstur fyrir loft
    var ceilImage = document.getElementById("CeilingImage");
    texCeil = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texCeil );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, ceilImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

    // Lesa inn og skilgreina mynstur fyrir loft
    var doorImage = document.getElementById("DoorImage");
    texDoor = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texDoor );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, doorImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);


    proLoc = gl.getUniformLocation( program, "projection" );
    mvLoc = gl.getUniformLocation( program, "modelview" );

    var proj = perspective( 50.0, 1.0, 0.2, 100.0 );
    gl.uniformMatrix4fv(proLoc, false, flatten(proj));
    

    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.clientX;
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
            userAngle += 0.4*(origX - e.clientX);
            userAngle %= 360.0;
            userXDir = Math.cos( radians(userAngle) );
            userZDir = Math.sin( radians(userAngle) );
            origX = e.clientX;
        }
    } );
    
    // Event listener for keyboard
     window.addEventListener("keydown", function(e){
         switch( e.keyCode ) {
            case 87:	// w
                nextXPos = userXPos + userIncr * userXDir;
                nextZPos = userZPos + userIncr * userZDir;
                break;
            case 83:	// s

                nextXPos = userXPos - userIncr * userXDir;
                nextZPos = userZPos - userIncr * userZDir;
                break;
            case 65:	// a

                nextXPos = userXPos + userIncr * userZDir;
                nextZPos = userZPos - userIncr * userXDir;
                break;
            case 68:	// d
                nextXPos = userXPos - userIncr * userZDir;
                nextZPos = userZPos + userIncr * userXDir;
                break;
         }
         if (nextXPos > -49.8 && nextXPos < 49.7) userXPos = nextXPos;
         if (nextZPos > 0.8 && nextZPos < 1.8) userZPos = nextZPos;
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

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // staðsetja áhorfanda og meðhöndla músarhreyfingu
    var mv = lookAt(vec3(userXPos, 1.5, userZPos),
                    vec3(userXPos+userXDir, 1.5, userZPos+userZDir),
                    vec3(0.0, 1.0, 0.0 )
    );
    
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));

    // Teikna vegg 1 með mynstri
    gl.bindTexture( gl.TEXTURE_2D, texVegg );
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // Teikna gólf með mynstri
    gl.bindTexture( gl.TEXTURE_2D, texGolf );
    gl.drawArrays( gl.TRIANGLES, numVertices, numVertices );

    // Teikna vegg 2 með mynstri
    gl.bindTexture( gl.TEXTURE_2D, texVegg );
    gl.drawArrays( gl.TRIANGLES, numVertices*2, numVertices );

    // Teikna loft með mynstri
    gl.bindTexture( gl.TEXTURE_2D, texCeil );
    gl.drawArrays( gl.TRIANGLES, numVertices*3, numVertices );

    // Teikna hurd 1 með mynstri
    gl.bindTexture( gl.TEXTURE_2D, texDoor );
    gl.drawArrays( gl.TRIANGLES, numVertices*4, numVertices );

    // Teikna hurd 2 með mynstri
    gl.bindTexture( gl.TEXTURE_2D, texDoor );
    gl.drawArrays( gl.TRIANGLES, numVertices*5, numVertices );

    requestAnimFrame(render);
}
