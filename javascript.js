let points = 0;
let numberAdd = 1;
let cubePrice = 10;
let priceGrowth = 1.4;
let cubes = 1;
let oneFiveMultiPrice = 100;

function addPoints() {
    let pointsElement = document.getElementById('points');
    points = parseInt(pointsElement.innerText);
    points += numberAdd;
    pointsElement.innerText = points;
}

function addCube() {
    if (points < cubePrice) {
        window.alert("You need at least " + cubePrice + " points to create a cube!");
        return;
    }

    // Update game values
    numberAdd += 1;
    cubes += 1;
    if (cubes >= 20) {
        priceGrowth += cubes / 90; 
    } else if (cubes >= 10) {
        priceGrowth += cubes / 95; 
    } else {
        priceGrowth += cubes / 100; 
    }

    points -= cubePrice;
    cubePrice *= priceGrowth;
    cubePrice = Math.ceil(cubePrice);

    // Update UI
    document.getElementById('points').innerText = points;
    document.getElementsByClassName("newCube")[0].innerText = "Add Cube: " + cubePrice;

    // Save game data before creating cubes
    saveGameData();

    // Create the cube
    createCube();
}

// Function to create and position a cube
function createCube() {
    let newCube = document.createElement('div');
    newCube.classList.add('cube');

    for (let i = 0; i < 6; i++) {
        let face = document.createElement('div');
        face.classList.add('face');
        face.style.backgroundColor = getRandomColor();
        newCube.appendChild(face);
    }

    // Random positioning
    let screenWidth = window.innerWidth;
    let randomX = Math.random() * (screenWidth - 200);
    let randomY = Math.random() * 950;

    newCube.style.position = 'absolute';
    newCube.style.left = `${randomX}px`;
    newCube.style.top = `${randomY}px`;

    document.body.appendChild(newCube);
}

// Helper function to get a random color
function getRandomColor() {
    const colors = ['#ff4136', '#2ecc40', '#0074d9', '#ffdc00', '#b10dc9', '#ff851b'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Save game data to localStorage
function saveGameData() {
    localStorage.setItem("points", points);
    localStorage.setItem("numberAdd", numberAdd);
    localStorage.setItem("cubePrice", cubePrice);
    localStorage.setItem("cubes", cubes);
}

// Load saved game data and recreate cubes
function loadGameData() {
    points = parseInt(localStorage.getItem("points")) || 0;
    numberAdd = parseInt(localStorage.getItem("numberAdd")) || 1;
    cubePrice = parseFloat(localStorage.getItem("cubePrice")) || 10;
    cubes = parseInt(localStorage.getItem("cubes")) || 1;

    document.getElementById('points').innerText = points;

    // **Recreate all cubes when loading the game**
    for (let i = 1; i < cubes; i++) {  // Start from 1 to avoid creating extra cubes
        createCube();
    }
}

window.onload = loadGameData; // Load the game on startup

function reset() {
    points = 0;
    numberAdd = 1;
    cubePrice = 10;
    priceGrowth = 1.4;
    cubes = 1;
    
    document.getElementById('points').innerText = points;
    document.getElementsByClassName("newCube")[0].innerText = "Add Cube: 10";

    // Select and remove all dynamically created cubes
    document.querySelectorAll('.cube').forEach(cube => cube.remove());

    // Save the reset state AFTER removing cubes
    saveGameData();
}

function oneFiveMulti() {
    if (points < cubePrice) {
        window.alert("You need at least " + oneFiveMultiPrice + " points to get a 1.5x multi upgrade!");
        return;
    }
    numberAdd *= 1.5;
    points -= oneFiveMultiPrice;
    oneFiveMultiPricePrice *= 1.75;
    oneFiveMultiPricePrice = Math.ceil(oneFiveMultiPrice);
    document.getElementById('points').innerText = points;
    document.getElementsByClassName("oneFiveMultiButton")[0].innerText = "1.5x Multi: " + oneFiveMultiPricePrice;
}