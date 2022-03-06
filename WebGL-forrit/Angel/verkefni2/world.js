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
        for (let i = 0; i < (sheepCount); i++) {
            sheep.push(createSheep(getRandomSpot()));
        }
    }

    //delete sheep to match slider change
    if (sheep.length > sheepCount) {
        sheep.splice(sheepCount, sheep.length);
    }
}

function changeSheepBirthRate(val) {
    sheepBirthRate = val;
    document.querySelector('#sheepBirthrate').value = sheepBirthRate;

    //change for every sheep
    for(let i = 0; i < sheep.length; i++) {
        sheep[i].timeForBaby = sheepBirthRate;
    }
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

function changeWolfBirthRate(val) {
    wolfBirthRate = val;
    document.querySelector('#wolfBirthrate').value = wolfBirthRate;

    //change for every sheep
    for(let i = 0; i < wolf.length; i++) {
        wolf[i].timeForBaby = wolfBirthRate;
    }
}

function changeHungerTime(val) {
    starvationTime = val;
    document.querySelector('#hungerTime').value = starvationTime;

    //change for every wolf
    for(let i = 0; i < wolf.length; i++) {
        wolf[i].lifetime = starvationTime;
    }
}

function changeSimulationSpeed(val) {
    simulationSpeed = val;
    document.querySelector('#simulationSpeed')

    //change simulation speed in world
    let num = simulationSpeed;
    switch (num) {
        case 0:
            simulationSpeed = -Infinity;
            break;
        case 1:
            simulationSpeed = 150;
            break;
        case 2:
            simulationSpeed = 50;
            break;
        case 3:
            simulationSpeed = 35;
            break;
        case 4:
            simulationSpeed = 15;
            break;
        case 5:
            simulationSpeed = 5;
            break;

    };
}