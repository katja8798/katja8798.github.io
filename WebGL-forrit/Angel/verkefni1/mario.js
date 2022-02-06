let gl;

// Global variables (accessed in render)
let locPosition;
let locColor;

//other
const v = [//(x,y)
    //mario
    vec2(-0.9, -0.9),
    vec2(-0.9, -0.45),
    vec2(-0.75, -0.9),
    //platform
    vec2(-1, -1),
    vec2(-1, -0.9),
    vec2(1, -1),
    vec2(1, -0.9)];


const gold = {
    CURR_LP: [0,0,0],//current lifespan of all gold
    LIFESPAN: 500,//how long it is "alive"
    COUNT: 0,//number of gold active
    MAX: 3,//maximum 3 gold at a time
    COLOR: vec4(1.0, 1.0, 0.0, 1.0),
    WIDTH: 0.05,
    HEIGHT: 0.1
};

const Mario = {
    UP: false,
    DOWN: false,
    COUNT: 0,//Regarding jump
    MAX: 42,//Regarding jump
    GROUND: -0.9,
    FACING: true, //TRUE = right and FALSE = left
    COLOR: vec4(0.0, 0.0, 1.0, 1.0),
    GOLD_COUNT: 0
};

const platform = {
    COLOR: vec4(0.0, 1.0, 0.0, 1.0)
}


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
    let buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer);
    gl.bufferData( gl.ARRAY_BUFFER, 8*200, gl.DYNAMIC_DRAW);

    // Get location of shader variable vPosition
    locPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( locPosition );


    // Event listener for keyboard
    window.addEventListener("keydown", function(e){
        if (Mario.UP === false &&
            Mario.DOWN === false &&
            Mario.GOLD_COUNT < 10) {
            switch (e.keyCode) {
                case 37:	// vinstri ör
                    xmove = -0.03;
                    if (Mario.FACING) {
                        v[1][0] = v[2][0];
                        Mario.FACING = false;
                    }
                    break;
                case 39:	// hægri ör
                    xmove = 0.03;
                    if (!Mario.FACING) {
                        v[1][0] = v[0][0];
                        Mario.FACING = true;
                    }
                    break;
                case 32: //Space takki
                    Mario.UP = true;
                    break;
                default:
                    xmove = 0.0;
            }
            for (let i = 0; i < 3; i++) {
                v[i][0] += xmove;
            }

            if (Mario.colliding()) {
                Mario.GOLD_COUNT++;
                Mario.addScoreMark(Mario.GOLD_COUNT);
            }

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(v));
        }
    });

    locColor = gl.getUniformLocation( program, "rcolor" );

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    if (Mario.DOWN === true || Mario.UP === true) {
        Mario.JUMP();
    }

    //Randomly make gold if maximum hasn't been reached
    if (gold.COUNT < gold.MAX) {
        gold.maybeCreateGold();
    }

    //decrease lifespan of active gold
    if (gold.COUNT > 0) {
        for(let i = 0; i < gold.COUNT; i++){

            //decrease lifespan
            gold.CURR_LP[i]--;

            //check if "dead"
            if (gold.isDead(i)) {
                gold.destroy(i);
            }
        }
    }

    drawSpecific(gl.TRIANGLES, Mario.COLOR, 0,3);
    drawSpecific(gl.TRIANGLE_STRIP, platform.COLOR, 3,4);

    //Only render of there is any gold
    if(gold.COUNT > 0) {
        for (let i = 0; i < gold.COUNT; i++) {
            drawSpecific(gl.TRIANGLE_STRIP, gold.COLOR, 7+i*4,4);
        }
    }

    //Only do if caught gold is more than 0
    if (Mario.GOLD_COUNT > 0) {
        for (let i = 0; i < Mario.GOLD_COUNT; i++) {
            drawSpecific(gl.TRIANGLE_STRIP, platform.COLOR, 19+i*4, 4);
        }
    }

    window.requestAnimationFrame(render);
}

function drawSpecific(type, c, f,n) {
    gl.uniform4fv( locColor, flatten(c) );
    gl.drawArrays( type, f, n );
}

Mario.JUMP = function (){
    const speed = 0.035;
    let angle;

    if (Mario.UP) {//upward "arc"
        if (Mario.COUNT <= Mario.MAX/3) {
            angle = Math.PI*17/36;//85
            Mario.COUNT++;
        } else if (Mario.COUNT <= 2*Mario.MAX/3) {
            angle = Math.PI*5/12;//75
            Mario.COUNT++;
        }
        else if (Mario.COUNT <= Mario.MAX) {
            angle = Math.PI/3;//60
            Mario.COUNT++;
        }
        else {
            Mario.UP = false;
            Mario.DOWN = true;
        }
    }
    if (Mario.DOWN) {//Downward "arc"
        if (Mario.COUNT >= 2*Mario.MAX/3){
            angle = Math.PI*5/3;//300
            Mario.COUNT--;
        }
        else if (Mario.COUNT >= Mario.MAX/3) {
            angle = Math.PI*19/12;//285
            Mario.COUNT--;
        }
        else if (Mario.COUNT > 0) {
            angle = Math.PI*55/36;//360-85=300-25=290-15=
            Mario.COUNT--;
        }
        else if (Mario.COUNT <= 0) {
            Mario.UP = false;
            Mario.DOWN = false;
            Mario.COUNT = 0;
        }
    }

    if (!Mario.FACING) {
        angle = Math.PI-angle;
    }

    if (Mario.COUNT === 0) {
        for (let i = 0; i < 3; i++){
            switch (i){
                case 0:
                case 2:
                    v[i][1] = Mario.GROUND;
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
        if (Mario.colliding()) {
            Mario.GOLD_COUNT++;
            Mario.addScoreMark(Mario.GOLD_COUNT);
        }
    }

    //update buffer
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(v));
}

Mario.colliding = function () {
    let m_loc = {//is a triangle put in collision acts like a rectangle
        x: v[0][0],
        y: v[0][1],
        w: Math.abs(v[0][0]-v[2][0]),//width
        h: Math.abs(v[0][1]-v[1][1]),//height
    };

    for (let i = 0; i < gold.COUNT; i++) {
        let g_loc = {//is a triangle put in collision acts like a rectangle
            x: v[7+i*4][0],
            y: v[7+i*4][1],
            w: gold.WIDTH,
            h: gold.HEIGHT
        }
        if(m_loc.x < g_loc.x + g_loc.w &&
            m_loc.x + m_loc.w > g_loc.x &&
            m_loc.y < g_loc.y + g_loc.h &&
            m_loc.y + m_loc.h > g_loc.y) {
            gold.CURR_LP[i] = 0;//"kill" gold
            return true;
        }
    }
    return false;
};

Mario.addScoreMark = function(s) {
    const yloc = 0.6
    const xloc = -0.9
    var w = 0.04;
    var h = 0.5;
    const offsetX = 0.05

    //put the coords in v according to its pseudo index
    v[19 + (s-1) * 4] = vec2(xloc+(s-1)*offsetX, yloc);
    v[20 + (s-1) * 4] = vec2(xloc+(s-1)*offsetX, yloc + h);
    v[21 + (s-1) * 4] = vec2(xloc + w +(s-1)*offsetX, yloc);
    v[22 + (s-1) * 4] = vec2(xloc + w +(s-1)*offsetX, yloc + h);

    //update buffer
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(v));
}

function getRandom (min, max) {
    return (min + Math.random() * (max - min));
}

gold.maybeCreateGold = function (){
    const r = getRandom(0, 1000);

    //create gold depending on random factor
    if (50 > r &&
        this.COUNT < this.MAX &&
        Mario.GOLD_COUNT < 10)
    {
        //update number of "alive" gold
        this.COUNT++;

        let goldID;

        //Create "new" gold by updating ONE lifespan where it can.
        for (let i = 0; i < this.MAX; i++) {
            if (this.CURR_LP[i] === 0) {
                this.CURR_LP[i] = this.LIFESPAN;
                goldID = i;//use the index as an pseudo id
                break;
            }
        }

        //randomly decide where on screen it is
        const LeftRight = Math.random() < 0.5 ? -1 : 1;
        const TopBottom = Math.random() < 0.5 ? -1 : 1;
        const yloc = Math.floor(getRandom(0, 90)) / 100 * TopBottom;
        const xloc = Math.floor(getRandom(0, 90)) / 100 * LeftRight;

        //put the coords in v according to its pseudo index

        v[7+goldID*4]=vec2(xloc, yloc);
        v[8+goldID*4]=vec2(xloc, yloc+gold.HEIGHT);
        v[9+goldID*4]=vec2(xloc+gold.WIDTH, yloc);
        v[10+goldID*4]=vec2(xloc+gold.WIDTH, yloc+gold.HEIGHT);

        //update buffer
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(v));
    }
}

gold.isDead = function(i) {
    return gold.CURR_LP[i] <= 0;
}

gold.destroy = function(i) {
    //gold "dead" so delete it
    gold.COUNT--;
    gold.CURR_LP[i] = 0;
    v[7+i*4]=[null, null];
    v[8+i*4]=[null, null];
    v[9+i*4]=[null, null];
    v[10+i*4]=[null, null];
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(v))
}


