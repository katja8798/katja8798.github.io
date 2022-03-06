/*
Wolfs walk randomly in 6 directions(up, down, left, right, front, back)
IF it DOESN'T sense a sheep
IF a sheep is detected it will walk in that direction
IF it "catches" a sheep, it will eat the sheep
After a wolf has eaten an X amount of sheep then the wolf will give birth
*/

function createWolf(positions) {
    return {
        lifetime: starvationTime,
        timeForBaby: wolfBirthRate,
        pos: {
            x: positions.x,
            y: positions.y,
            z: positions.z,
        },
        COLOR: vec4(1.0, 0.0, 0.0, 1.0),//red
    };
}

function wolfBehaviour() {
    for (let i = 0; i < wolf.length; i++) {
        wolf[i].pos = moveToAnotherSpot(wolf[i], i);

        // baby time?
        if (wolf[i].timeForBaby === 0) {
            //check if space available to give birth
            let babyPos = getRandomNeighbouringSpot(wolf[i], wolf);
            if ( babyPos!== wolf[i].pos) {
                wolf.push(createWolf(babyPos));//give birth
                wolf[i].timeForBaby = wolfBirthRate;//Reset time
            }
        }

        wolf[i].lifetime -= 1;
        if (wolf[i].lifetime === 0){
            wolf.splice(i, 1);
        }
    }
}

function moveToAnotherSpot(w, i) {
    // if there are no sheep move randomly
    if (sheep.length === 0) {
        return getRandomNeighbouringSpot(w, wolf);
    }

    // if sheep nearby move to it, maybe eat it, else move randomly
    //check for nearby sheep, maximum distance spots away
    let currPos = { x: w.pos.x, y: w.pos.y, z: w.pos.z }// co-ords
    let nextPos;
    let dir;
    let closestIndex;
    let closestSheep;
    let maximumDetectionDistance = 4*gridSpacing;
    let smallestDistance = Infinity;

    //find nearest sheep
    for (let i = 0; i < sheep.length; i++) {
        const diffX = +(currPos.x - sheep[i].pos.x).toFixed(2);
        const diffY = +(currPos.y - sheep[i].pos.y).toFixed(2);
        const diffZ = +(currPos.z - sheep[i].pos.z).toFixed(2);

        // check if in same y and z plane and nearby in x plane
        if (maximumDetectionDistance > Math.abs(diffX) &&
            smallestDistance > Math.abs(diffX) &&
            Math.abs(diffY) === 0.00 && diffZ === 0.00) { // in same y and z plane
            smallestDistance = Math.abs(diffX);
            closestIndex = i;
            closestSheep = sheep[i];
            ((diffX < 0)? dir = -1 : dir = 1);
            nextPos = {x: wrap(w.pos.x+gridSpacing*dir), y: w.pos.y, z: w.pos.z };
        }

        // check if in same x and z plane and nearby in y plane
        if (maximumDetectionDistance > Math.abs(diffY) && // detection distance away from wolf
            smallestDistance > Math.abs(diffY) && //distance smaller than previously known smallest distance
            diffX === 0 && diffZ === 0) { // in same x and z plane
            smallestDistance = Math.abs(diffY);
            closestIndex = i;
            closestSheep = sheep[i];
            ((diffY < 0)? dir = -1 : dir = 1);
            nextPos = {x: w.pos.x, y: wrap(w.pos.y+gridSpacing*dir), z: w.pos.z };
        }

        // check if in same x and y plane and nearby in z plane
        if (maximumDetectionDistance > Math.abs(diffZ) && // detection distance away from wolf
            smallestDistance > Math.abs(diffZ) && //distance smaller than previously known smallest distance
            diffX === 0 && diffY === 0) { // in same x and y plane
            smallestDistance = Math.abs(diffZ);
            closestIndex = i;
            closestSheep = sheep[i];
            ((diffZ < 0)? dir = -1 : dir = 1);
            nextPos = {x: w.pos.x, y: w.pos.y, z: wrap(w.pos.z+gridSpacing*dir)};
        }
    }

    //check if sheep was found nearby
    if(smallestDistance < maximumDetectionDistance) {
        //eat sheep if nextPos is on "top" of them
        if (smallestDistance <= gridSpacing) {//sheep is a neighbour, so nextPos would be on "top" of sheep
            sheep.splice(closestIndex, 1);
            w.timeForBaby -= 1;
            w.lifetime = starvationTime;//restart hunger
        }
        return nextPos;
    } else {
        return getRandomNeighbouringSpot(w, wolf);
    }
}