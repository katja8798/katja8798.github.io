/*
Wolfs walk randomly in 6 directions(up, down, left, right, front, back)
IF it DOESN'T sense a sheep
IF a sheep is detected it will walk in that direction
IF it "catches" a sheep, it will eat the sheep
After a wolf has eaten an X amount of sheep then the wolf will give birth
*/

function createWolf(positions) {
    return {
        type: "wolf",
        COLOR: vec4(1.0, 0.0, 0.0, 1.0),//red
        lifetime: starvationTime,
        timeForBaby: wolfBirth,
        pos: {
            x: positions.x,
            y: positions.y,
            z: positions.z,
        },
    };
}

function movementWolf() {
    for (let i = 0; i < wolf.length; i++) {
        wolf[i].pos = moveToAnotherSpot(wolf[i], i);

        // baby time?
        if (wolf[i].timeForBaby === 0) {
            //check if space available to give birth
            let babyPos = getRandomNeighbouringSpot(wolf[i], i);
            if ( babyPos!== wolf[i].pos) {
                wolf.push(createWolf(babyPos));//give birth
                wolf[i].timeForBaby = wolfBirth;//Reset time
            }
        }

        wolf[i].lifetime -= 1;
        if (wolf[i].lifetime === 0){
            wolf.splice(i, 1);
        }
    }
}

function moveToAnotherSpot(wolf, i) {
    // if there are no sheep move randomly
    if (sheep.length === 0) {
        return getRandomNeighbouringSpot(wolf, i);
    }
    return getRandomNeighbouringSpot(wolf, i);

    /*// if sheep nearby move to it, maybe eat it, else move randomly
    //check for nearby sheep, maximum distance spots away
    let xyzIWolf = getGridIndex(wolf);//index location in world grid
    let nextPos = { x: wolf.pos.x, y: wolf.pos.y, z: wolf.pos.z }// co-ords
    let closestIndex;
    let closestSheep;
    let maximumDetectionDistance = 4;
    let smallestDistance = Infinity;

    //find nearest sheep
    for (let i = 0; i < sheep.length; i++) {
        const xyzISheep = getGridIndex(sheep[i]);
        const diffX = xyzIWolf.xI - xyzISheep.xI;
        const diffY = xyzIWolf.xI - xyzISheep.xI;
        const diffZ = xyzIWolf.xI - xyzISheep.xI;
        // check if in same x and y plane and nearby in z plane
        if (maximumDetectionDistance > Math.abs(diffZ) && // detection distance away from wolf
            smallestDistance > Math.abs(diffZ) && //distance smaller than previously known smallest distance
            diffX === 0 && // in same x plane
            diffY === 0) { // in same y plane
            smallestDistance = Math.abs(diffZ);
            closestIndex = i;
            closestSheep = sheep[i];
            if (diffZ > 0) {
                nextPos.z = worldGrid.zCol[wrapWorldGrid(xyzIWolf.zI + 1)]
            }
            else {
                nextPos.z = worldGrid.zCol[wrapWorldGrid(xyzIWolf.zI - 1)]
            }
        }

        // check if in same x and z plane and nearby in y plane
        if (maximumDetectionDistance > Math.abs(diffY) && // detection distance away from wolf
            smallestDistance > Math.abs(diffY) && //distance smaller than previously known smallest distance
            diffX === 0 && // in same x plane
            diffZ === 0) { // in same z plane
            smallestDistance = Math.abs(diffY);
            closestIndex = i;
            closestSheep = sheep[i];
            if (diffY > 0) {
                nextPos.y = worldGrid.yCol[wrapWorldGrid(xyzIWolf.yI + 1)]
            }
            else {
                nextPos.y = worldGrid.yCol[wrapWorldGrid(xyzIWolf.yI - 1)]
            }
        }
        // check if in same y and z plane and nearby in x plane
        if (maximumDetectionDistance > Math.abs(diffX) && // detection distance away from wolf
            smallestDistance > Math.abs(diffX) && //distance smaller than previously known smallest distance
            diffY === 0 && // in same y plane
            diffZ === 0) { // in same z plane
            smallestDistance = Math.abs(diffX);
            closestIndex = i;
            closestSheep = sheep[i];
            if (diffX > 0) {
                nextPos.x = worldGrid.xCol[wrapWorldGrid(xyzIWolf.xI + 1)]
            }
            else {
                nextPos.x = worldGrid.xCol[wrapWorldGrid(xyzIWolf.xI - 1)]
            }
        }
    }

    //check if sheep was found nearby
    if(smallestDistance < maximumDetectionDistance) {
        //eat sheep if nextPos is on "top" of them
        if (smallestDistance <= 1) {//sheep is a neighbour, so nextPos would be on "top" of sheep
            sheep.splice(closestIndex, 1);
            wolf.timeForBaby -= 1;
            wolf.lifetime = starvationTime;//restart hunger
        }
        return nextPos;
    } else {
        return getRandomNeighbouringSpot(wolf, i);
    }*/
}