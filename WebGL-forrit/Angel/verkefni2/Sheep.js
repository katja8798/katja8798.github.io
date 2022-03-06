/*
Sheep walk randomly in 6 directions(up, down, left, right, front, back)
Sheep give birth after set amount of time living
Sheep back away from wolf if they find themselves beside them in any direction
 */
function createSheep(positions) {
    return {
        type: "sheep",
        COLOR: vec4(0.0, 1.0, 0.0, 1.0),//green
        timeForBaby: sheepBirth,
        pos: {
            x: positions.x,
            y: positions.y,
            z: positions.z,
        },
    };
}

function sheepBehaviour() {
    for (let i = 0; i < sheep.length; i++) {
        sheep[i].timeForBaby -= 1;

        //check if beside wolf
        if (besideWolf(sheep[i], i)) {
            sheep[i].pos = runAway(sheep[i],i);
        }

        //get random available movement spot if possible
        sheep[i].pos = getRandomNeighbouringSpot(sheep[i], i);

        //check if baby time
        if (sheep[i].timeForBaby <= 0) {
            //check if space available to give birth, if not postpone birthing
            let babyPos = getRandomNeighbouringSpot(sheep[i], i);
            if (babyPos!== sheep[i].pos) {
                sheep.push(createSheep(babyPos));//give birth
                sheep[i].timeForBaby = sheepBirth;//Reset time
            }
            else {

            }
        }
    }
}

function besideWolf() {
    return false;
}

function runAway(s) {
    return s.pos;
}