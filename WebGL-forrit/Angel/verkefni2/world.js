function world() {
    // the 8 vertices of the cube
    const v = [
        vec3(-0.7, -0.7,  0.7), //right lower behind 0
        vec3(-0.7,  0.7,  0.7), //right upper behind 1
        vec3( 0.7,  0.7,  0.7), //left  upper behind 2
        vec3( 0.7, -0.7,  0.7), //left  lower behind 3
        vec3(-0.7, -0.7, -0.7), //right lower front 4
        vec3(-0.7,  0.7, -0.7), //right upper front 5
        vec3( 0.7,  0.7, -0.7), //left  upper front 6
        vec3( 0.7, -0.7, -0.7)  //left  lower front 7
    ];

    lines = [
        v[0], v[1], v[1], v[2], v[2], v[3], v[3], v[0], //back square
        v[4], v[5], v[5], v[6], v[6], v[7], v[7], v[4], //front square
        //lines between front and back square
        v[0], v[4],
        v[1], v[5],
        v[2], v[6],
        v[3], v[7]
    ];

}

function grid(num) {
    let xCol = [];
    let yCol = [];
    let zCol = [];
    let loc = gridStart;

    for (let i = 0; i < num; i++) {
        xCol.push(loc);
        yCol.push(loc);
        zCol.push(loc);
        loc += gridSpacing;
    }

    return { xCol, yCol, zCol }
}

// Sheep sliders
function changeSheepCount(val) {
    sheepCount = val;
    document.querySelector('#numOfSheep').value = sheepCount;

    //add sheep to match slider change
    if (sheep.length < sheepCount) {
        for (let i = 0; i < sheepCount; i++) {
            sheep.push(createSheep(getRandomSpot()));
        }
    }

    //delete sheep to match slider change
    if (sheep.length > sheepCount) {
        sheep.splice(sheepCount, sheep.length);
    }
}

function changeSheepBirthrate(val) {
    sheepBirthrate = val;
    document.querySelector('#sheepBirthrate').value = sheepBirthrate;
}

// Wolf sliders
function changeWolfCount(val) {
    wolfCount = val;
    document.querySelector('#numOfWolves').value = wolfCount;

    //add sheep to match slider change
    if (wolf.length < wolfCount) {
        for (let i = 0; i < (wolfCount); i++) {
            wolf.push(createWolf(getRandomSpot()));
        }
    }

    //delete sheep to match slider change
    if (wolf.length > wolfCount) {
        wolf.splice(wolfCount, wolf.length);
    }
}

function changeWolfBirthrate(val) {
    wolfBirthrate = val;
    document.querySelector('#wolfBirthrate').value = wolfBirthrate;
}

function changeHungerTime(val) {
    hungerTime= val;
    document.querySelector('#hungerTime').value = hungerTime;
}

// Simulation slider
function changeSimulationSpeed(val) {
    //change simulation speed in world
    if (val === 170) {
        val = -Infinity
    }
    simulationSpeed = val;

    document.querySelector('#simulationSpeed').value = simulationSpeed;
}