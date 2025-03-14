let points = 0;
let numberAdd = 1;
let cubePrice = 10;
let priceGrowth = 1.4;
let cubes = 1;
let oneFiveMultiPrice = 100;

function addPoints() {
    let pointsElement = document.getElementById('points');
    // Ensure points is treated as a number
    points = parseInt(pointsElement.innerText) || 0;
    numberAdd = Math.ceil(numberAdd)
    points += numberAdd;
    points = Math.ceil(points)
    pointsElement.innerText = points;
    
    // Update the click value display immediately
    let clickValEl = document.getElementById('clickValue');
    if (clickValEl) {
      clickValEl.innerText = "Click Value: " + numberAdd;
    }
    
    // Save the updated points so the upgrades page has the latest value
    saveGameData();
  }

function addCube() {
  if (points < cubePrice) {
    alert("You need at least " + cubePrice + " points to create a cube!");
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
  let screenHeight = window.innerHeight
  let randomX = Math.random() * (screenWidth - 250);
  let randomY = Math.random() * (screenHeight - 250);

  newCube.style.position = 'absolute';
  newCube.style.left = `${randomX}px`;
  newCube.style.top = `${randomY}px`;

  document.body.appendChild(newCube);
}

function getRandomColor() {
  const colors = ['#ff4136', '#2ecc40', '#0074d9', '#ffdc00', '#b10dc9', '#ff851b'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function saveGameData() {
  localStorage.setItem("points", points);
  localStorage.setItem("numberAdd", numberAdd);
  localStorage.setItem("cubePrice", cubePrice);
  localStorage.setItem("cubes", cubes);
  localStorage.setItem("oneFiveMultiPrice", oneFiveMultiPrice);
}

function loadGameData() {
  points = parseInt(localStorage.getItem("points")) || 0;
  numberAdd = parseFloat(localStorage.getItem("numberAdd")) || 1;
  cubePrice = parseFloat(localStorage.getItem("cubePrice")) || 10;
  cubes = parseInt(localStorage.getItem("cubes")) || 1;
  oneFiveMultiPrice = parseFloat(localStorage.getItem("oneFiveMultiPrice"));
  if (isNaN(oneFiveMultiPrice)) {
    oneFiveMultiPrice = 100;
  }
  
  console.log("Loaded oneFiveMultiPrice:", oneFiveMultiPrice);
  
  document.getElementById('points').innerText = points;
  document.getElementsByClassName("newCube")[0].innerText = "Add Cube: " + cubePrice;

  let multiBtn = document.getElementsByClassName("oneFiveMultiButton")[0];
  if (multiBtn) {
    multiBtn.innerText = "1.5x Multi: " + oneFiveMultiPrice;
  }

  let clickValEl = document.getElementById('clickValue');
  if (clickValEl) {
    clickValEl.innerText = "Click Value: " + numberAdd;
  }

  // Recreate cubes (starting from 1 to avoid duplicating the base cube)
  for (let i = 1; i < cubes; i++) {
    createCube();
  }
}

window.onload = loadGameData;

function reset() {
  let resetYN = prompt("Are you sure that you want to Hard Reset?");
  if (resetYN && resetYN.toLowerCase() === "yes") {
    points = 0;
    numberAdd = 1;
    cubePrice = 10;
    priceGrowth = 1.4;
    cubes = 1;
    oneFiveMultiPrice = 100;

    document.getElementById('points').innerText = points;
    document.getElementsByClassName("newCube")[0].innerText = "Add Cube: 10";

    // Remove all dynamically created cubes
    document.querySelectorAll('.cube').forEach(cube => cube.remove());

    saveGameData();

    let clickValEl = document.getElementById('clickValue');
    if (clickValEl) {
      clickValEl.innerText = "Click Value: " + numberAdd;
    }
  }
}

function oneFiveMulti() {
    // Update points from the DOM (in case the variable is stale)
    points = parseInt(document.getElementById('points').innerText) || 0;
    
    if (points < oneFiveMultiPrice) {
      alert("You need at least " + oneFiveMultiPrice + " points to get a 1.5x multi upgrade!");
      return;
    }
    
    // Apply the upgrade: multiply points-per-click and deduct the cost
    numberAdd *= 1.5;
    points -= oneFiveMultiPrice;
    
    // Increase cost for the next upgrade and round up
    oneFiveMultiPrice = Math.ceil(oneFiveMultiPrice * 1.75);
    
    // Update UI for points and click value
    document.getElementById('points').innerText = points;
    let multiBtn = document.querySelector(".oneFiveMultiButton");
    if (multiBtn) {
      multiBtn.innerText = "1.5x Multi: " + oneFiveMultiPrice;
    }
    let clickValEl = document.getElementById('clickValue');
    if (clickValEl) {
      clickValEl.innerText = "Click Value: " + numberAdd;
    }
    
    // Save the updated game state
    saveGameData();
  }
