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
/*

function sliders(simSpeed) {
    // Fj�ldi kinda
    document.getElementById("noSheeps").onchange = function (event) {
        noOfSheep = event.target.value;
        document.getElementById("noOfSheep").innerHTML = "�� hefur vali� " + noOfSheep + " kindur";

        for (let i = 0; i < noOfSheep - 1; i++) {
            if (sheep.length < noOfSheep) sheep.push(createSheep(getRandomNeighbouringSpot(sheep)));
        }

        if (sheep.length > noOfSheep) {
            sheep.splice(noOfSheep, sheep.length);
        }
    };

    // Fj�ldi �lfa
    document.getElementById("noWolves").onchange = function (event) {
        noOfWolves = event.target.value;
        document.getElementById("noOfWolves").innerHTML = "�� hefur vali� " + noOfWolves + " �lfa";

        for (let i = 0; i < noOfWolves - 1; i++) {
            if (wolf.length < noOfWolves) wolf.push(createWolf(getRandomPos(sheep)));
        }
        if(wolf.length===0)wolf.push(createWolf(getRandomPos(sheep)));

        if (wolf.length > noOfWolves) {
            wolf.splice(noOfWolves, wolf.length);
        }
    };

    // T�malengd � milli f��inga lamba
    document.getElementById("sheepBirth").onchange = function (event) {
        sheepBirth = event.target.value;
    };

    // Fj�ldi �tinna lamba �ar til yr�lingar f��ast
    document.getElementById("wolfBirth").onchange = function (event) {
        wolfBirth = event.target.value;
        for(let i=0; i< wolf.length; i++)wolf[i].timeForBaby =wolfBirth;
    };
    // T�mi �ar til �lfar svelta
    document.getElementById("starvationTime").onchange = function (event) {
        starvationTime = event.target.value;
        for(let i=0; i< wolf.length; i++)wolf[i].lifetime =starvationTime;
    };

    // Hra�i hermunar
    document.getElementById("simulationSpeed").onchange = function (event) {
        let s = event.target.value;
        switch (s) {
            case '0':
                simSpeed = -Infinity;
                break;
            case '1':
                simSpeed = 150;
                break;
            case '2':
                simSpeed = 50;
                break;
            case '3':
                simSpeed = 35;
                break;
            case '4':
                simSpeed = 15;
                break;
            case '5':
                simSpeed = 5;
                break;
        }
    };

}*/