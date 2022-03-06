/*
Sheep walk randomly in 6 directions(up, down, left, right, front, back)
Sheep give birth after set amount of time living
Sheep back away from wolf if they find themselves beside them in any direction
 */
function createSheep(positions) {
    return {
        timeToGiveBirth: sheepBirthrate,
        pos: {
            x: positions.x,
            y: positions.y,
            z: positions.z,
        },
        COLOR: vec4(0.0, 1.0, 0.0, 1.0),//green
    };
}

function sheepBehaviour() {
    for (let i = 0; i < sheep.length; i++) {
        sheep[i].timeToGiveBirth -= 1;

        //walk away if beside wolf - else walk in a random direction
        let wolfDir =  besideWolf(sheep[i])
        if (wolfDir === 0) {
            sheep[i].pos = getRandomNeighbouringSpot(sheep[i], sheep);
        }
        else {
            sheep[i].pos = runAway(sheep[i], wolfDir);
        }

        //check if baby time
        if (sheep[i].timeToGiveBirth <= 0) {
            //check if space available to give birth, if not postpone birthing
            let babyPos = getRandomNeighbouringSpot(sheep[i], sheep);
            if (babyPos!== sheep[i].pos) {
                sheep.push(createSheep(babyPos));//give birth
                sheep[i].timeToGiveBirth = sheepBirthrate;//Reset time
            }
        }
    }
}

function besideWolf(s) {
    let spots = generateSpotsInAllDirections(s);
    for (let i = 0; i < wolf.length; i++) {
        //if spot nr. x contains wolf return the direction
        if (!spotIsEmptyOf(spots.spot1, wolf)) return 1
        if (!spotIsEmptyOf(spots.spot2, wolf)) return 2
        if (!spotIsEmptyOf(spots.spot3, wolf)) return 3
        if (!spotIsEmptyOf(spots.spot4, wolf)) return 4
        if (!spotIsEmptyOf(spots.spot5, wolf)) return 5
        if (!spotIsEmptyOf(spots.spot6, wolf)) return 6

    }
    return 0;
}

function runAway(s, dir) {
    let pos;
    if (dir === 1) pos = {x: wrap(s.pos.x-gridSpacing), y: s.pos.y, z: s.pos.z};
    if (dir === 2) pos = {x: wrap(s.pos.x+gridSpacing), y: s.pos.y, z: s.pos.z};
    if (dir === 3) pos = {x: s.pos.x, y: wrap(s.pos.y-gridSpacing), z: s.pos.z};
    if (dir === 4) pos = {x: s.pos.x, y: wrap(s.pos.y+gridSpacing), z: s.pos.z};
    if (dir === 5) pos = {x: s.pos.x, y: s.pos.y, z: wrap(s.pos.z-gridSpacing)};
    if (dir === 6) pos = {x: s.pos.x, y: s.pos.y, z: wrap(s.pos.z+gridSpacing)};
    //check if that spot is empty
    //if empty run - else freeze in terror
    if (spotIsEmptyOf(s.pos, sheep) && spotIsEmptyOf(s.pos, wolf)) {
        return pos;
    }
    else {
        return {x: s.pos.x, y: s.pos.y, z: s.pos.z};
    }
}
