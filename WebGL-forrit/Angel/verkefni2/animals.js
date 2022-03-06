function wrap(pos) {
    if (pos > gridStart+gridSpacing*(gridNum-1)+0.01) pos = gridStart;
    if (pos <= gridStart+0.01) pos = gridStart+gridSpacing*(gridNum-1);
    return pos;
}

// Check if there is another animal in the spot
function spotIsEmptyOf(spot, array) {
    for (let i = 0; i < array.length; i++) {
        if (spot.x.toFixed(2) === array[i].pos.x.toFixed(2) &&
            spot.y.toFixed(2) === array[i].pos.y.toFixed(2) &&
            spot.z.toFixed(2) === array[i].pos.z.toFixed(2) &&
            array[i] !== spot) {
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
    //generate random spot
    let randSpot = {
        x: worldGrid.xCol[generateRandomNumber(0, gridNum-1)],
        y: worldGrid.yCol[generateRandomNumber(0, gridNum-1)],
        z: worldGrid.zCol[generateRandomNumber(0, gridNum-1)]
    };

    // check if it is empty, if not get new co-ords and check again
    let isEmpty = spotIsEmptyOf(randSpot, wolf) && spotIsEmptyOf(randSpot, sheep);
    while (!isEmpty) {
        randSpot = {
            x: worldGrid.xCol[generateRandomNumber(0, gridNum-1)],
            y: worldGrid.yCol[generateRandomNumber(0, gridNum-1)],
            z: worldGrid.zCol[generateRandomNumber(0, gridNum-1)]
        };
        //check status again
        isEmpty = spotIsEmptyOf(randSpot, wolf) && spotIsEmptyOf(randSpot, sheep)
    }

    return randSpot;
}

//returns original spot if no space around
function getRandomNeighbouringSpot(animal, array) {
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
                if (spotIsEmptyOf(newSpots.spot1, array)) {
                    spot = newSpots.spot1;
                    emptySpotFound = true;
                }
                break;
            case 2:
                if (spotIsEmptyOf(newSpots.spot2, array)) {
                    spot = newSpots.spot2;
                    emptySpotFound = true;
                }
                break;
            case 3:
                if (spotIsEmptyOf(newSpots.spot3, array)) {
                    spot = newSpots.spot3;
                    emptySpotFound = true;
                }
                break;
            case 4:
                if (spotIsEmptyOf(newSpots.spot4, array)) {
                    spot = newSpots.spot4;
                    emptySpotFound = true;
                }
                break;
            case 5:
                if (spotIsEmptyOf(newSpots.spot5, array)) {
                    spot = newSpots.spot5;
                    emptySpotFound = true;
                }
                break;
            case 6:
                if (spotIsEmptyOf(newSpots.spot6, array)) {
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