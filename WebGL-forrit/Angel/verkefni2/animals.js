function wrap(pos) {
    if (pos > gridStart+gridSpacing*(gridNum-1)+0.01) pos = gridStart;
    if (pos <= gridStart+0.01) pos = gridStart+gridSpacing*(gridNum-1);
    return pos;
}

// Check if there is another animal in the spot
function spotIsEmpty(pos, array) {
    for (let i = 0; i < array.length; i++) {
        if (pos.x.toFixed(2) === array[i].pos.x.toFixed(2) &&
            pos.y.toFixed(2) === array[i].pos.y.toFixed(2) &&
            pos.z.toFixed(2) === array[i].pos.z.toFixed(2) &&
            array[i] !== pos) {
            return false
        }
    }
    return true;
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSpotsInAllDirections(animal) {
    return {
        spot1 : { x: wrap(animal.pos.x+gridSpacing), y: animal.pos.y, z: animal.pos.z },
        spot2 : { x: wrap(animal.pos.x-gridSpacing), y: animal.pos.y, z: animal.pos.z },
        spot3 : { x: animal.pos.x, y: wrap(animal.pos.y+gridSpacing), z: animal.pos.z },
        spot4 : { x: animal.pos.x, y: wrap(animal.pos.y-gridSpacing), z: animal.pos.z },
        spot5 : { x: animal.pos.x, y: animal.pos.y, z: wrap(animal.pos.z+gridSpacing)},
        spot6 : { x: animal.pos.x, y: animal.pos.y, z: wrap(animal.pos.z-gridSpacing)},
    }
}

function getRandomSpot() {
    let x = worldGrid.xCol[generateRandomNumber(0, gridNum-1)];
    let y = worldGrid.yCol[generateRandomNumber(0, gridNum-1)];
    let z = worldGrid.zCol[generateRandomNumber(0, gridNum-1)];

    // Undefined prevention
    if (!x) x = -0.63;
    if (!y) y = -0.63;
    if (!z) z = -0.63;
    return { x, y, z }
}

//returns original spot if no space around
function getRandomNeighbouringSpot(animal) {
    //Assume all spots around are available

    // All "available" spots
    let newSpots = generateSpotsInAllDirections(animal);
    let originalSpot = { x: animal.pos.x, y: animal.pos.y, z: animal.pos.z};

    // Find a random empty spot
    let spotsAvailable = true;
    let emptySpotFound = false;
    let checkedSpots = [];
    let spot;

    while (emptySpotFound === false && spotsAvailable === true) {

        // Have all spots been checked?
        if (checkedSpots.length === 6) {
            spotsAvailable = false;//All spots have been checked
        }

        // Get spot number that hasn't been checked
        let num = generateRandomNumber(1,6);// generate spotNumber to check
        let isCheckedSpot = checkedSpots.includes(num);// has it been checked?
        while (isCheckedSpot === true) {
            //get new random number, 1 to 6
            num = generateRandomNumber(1,6);
            //check status again
            isCheckedSpot = checkedSpots.includes(num);
        }

        //check if spot is available
        switch (num) {
            case 1:
                if (spotIsEmpty(newSpots.spot1, sheep) &&
                    spotIsEmpty(newSpots.spot1, wolf)) {
                    spot = newSpots.spot1;
                    emptySpotFound = true;
                }
                break;
            case 2:
                if (spotIsEmpty(newSpots.spot2, sheep) &&
                    spotIsEmpty(newSpots.spot2, wolf)) {
                    spot = newSpots.spot2;
                    emptySpotFound = true;
                }
                break;
            case 3:
                if (spotIsEmpty(newSpots.spot3, sheep) &&
                    spotIsEmpty(newSpots.spot3, wolf)) {
                    spot = newSpots.spot3;
                    emptySpotFound = true;
                }
                break;
            case 4:
                if (spotIsEmpty(newSpots.spot4, sheep) &&
                    spotIsEmpty(newSpots.spot4, wolf)) {
                    spot = newSpots.spot4;
                    emptySpotFound = true;
                }
                break;
            case 5:
                if (spotIsEmpty(newSpots.spot5, sheep) &&
                    spotIsEmpty(newSpots.spot5, wolf)) {
                    spot = newSpots.spot5;
                    emptySpotFound = true;
                }
                break;
            case 6:
                if (spotIsEmpty(newSpots.spot6, sheep) &&
                    spotIsEmpty(newSpots.spot6, wolf)) {
                    spot = newSpots.spot6;
                    emptySpotFound = true;
                }break;
        }
        //Spot isn't available, remember spot has been checked
        checkedSpots.push(num);
    }

    return (spotsAvailable? spot : originalSpot)
}

function colorAnimals() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function quad(a, b, c, d) {
    const v = [
        vec3( -0.5, -0.5,  0.5),
        vec3( -0.5,  0.5,  0.5),
        vec3(  0.5,  0.5,  0.5),
        vec3(  0.5, -0.5,  0.5),
        vec3( -0.5, -0.5, -0.5),
        vec3( -0.5,  0.5, -0.5),
        vec3(  0.5,  0.5, -0.5),
        vec3(  0.5, -0.5, -0.5)
    ];

    const indices = [a, b, c, a, c, d];

    for (let i = 0; i < indices.length; ++i) {
        animal.push(v[indices[i]]);
    }
}

function drawAnimal(mv, animal) {
    mv = mult(mv, translate(animal.pos.x, animal.pos.y, animal.pos.z));
    mv = mult(mv, scalem(0.1, 0.1, 0.1));

    gl.uniform4fv(colorLoc, animal.COLOR);
    gl.uniformMatrix4fv(mvLoc, false, flatten(mv));
    gl.drawArrays(gl.TRIANGLES, lines.length, NumVertices);
}