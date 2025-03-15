let points = 0;
let numberAdd = 1;
let cubePrice = 10;
let priceGrowth = 1.4;
let cubes = 1;
let oneFiveMultiPrice = 100;
let globalMultiplier = 1.0; // New global multiplier
let cubeRarities = {}; // Store cube rarities

// Rarity Multipliers
const rarityMultipliers = {
    "Common": 1,
    "Rare": 10,
    "Legendary": 50
};

// Adds points on click
function addPoints() {
  let pointsElement = document.getElementById('points');
  points = Math.round(points + numberAdd); // Round after addition
  pointsElement.innerText = points;
  updateClickValueDisplay();
  saveGameData();
}



// Adds a cube
function addCube() {
  if (points < cubePrice) {
      alert("You need at least " + cubePrice + " points to create a cube!");
      return;
  }
  let cubeId = cubes; // Store current cube ID before incrementing
  let rarity = assignRarity();
  cubeRarities[cubeId] = rarity;

  // Update game state
  cubes += 1;
  points -= cubePrice;
  cubePrice = Math.ceil(cubePrice * priceGrowth);

  // Only recalculate the click value after the first cube
  if (cubes > 1) {
      recalculateClickValue();
  }

  updateUI();
  saveGameData();
  createCube(cubeId, rarity);
}

// Creates a cube with the given rarity
function createCube(id, rarity) {
  let newCube = document.createElement('div');
  newCube.classList.add('cube');

  let color = getRarityColor(rarity);
  newCube.style.backgroundColor = color;
  newCube.setAttribute("data-rarity", rarity);

  for (let i = 0; i < 6; i++) {
      let face = document.createElement('div');
      face.classList.add('face');
      face.style.backgroundColor = color;
      newCube.appendChild(face);
  }

  // Prevent cubes from overlapping too much
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;
  let safeMargin = 250;

  let randomX = Math.random() * (screenWidth - safeMargin);
  let randomY = Math.random() * (screenHeight - safeMargin);

  newCube.style.position = 'absolute';
  newCube.style.left = `${randomX}px`;
  newCube.style.top = `${randomY}px`;

  // Set z-index based on rarity (higher rarity = higher z-index)
  switch (rarity) {
      case "Legendary":
          newCube.style.zIndex = "3";
          break;
      case "Rare":
          newCube.style.zIndex = "2";
          break;
      default: // Common
          newCube.style.zIndex = "1";
  }

  document.body.appendChild(newCube);
}

// Assigns rarity based on probability
function assignRarity() {
    let roll = Math.random();
    if (roll < 0.01) return "Legendary"; // 1% chance
    if (roll < 0.15) return "Rare";       // 14% chance
    return "Common";                     // 85% chance
}

// Returns the color for a given rarity
function getRarityColor(rarity) {
    switch (rarity) {
        case "Legendary": return "yellow";
        case "Rare": return "blue";
        default: return "gray";
    }
}

// Updates the click value display and rounds to whole number
function updateClickValueDisplay() {
  let clickValEl = document.getElementById('clickValue');
  if (clickValEl) {
      clickValEl.innerText = "Click Value: " + Math.round(numberAdd);
  }
}



// Recalculates numberAdd based on cube rarities and applies globalMultiplier
function recalculateClickValue() {
    let baseValue = 1;
    for (let id in cubeRarities) {
        let rarity = cubeRarities[id];
        baseValue += rarityMultipliers[rarity] || 1;
    }
    numberAdd = baseValue * globalMultiplier;
    updateClickValueDisplay();
}

// Updates UI elements and rounds displayed numbers
function updateUI() {
  document.getElementById('points').innerText = Math.round(points);
  document.getElementsByClassName("newCube")[0].innerText = "Add Cube: " + Math.round(cubePrice);
}



// Saves game data to localStorage
function saveGameData() {
    localStorage.setItem("points", points);
    localStorage.setItem("numberAdd", numberAdd);
    localStorage.setItem("cubePrice", cubePrice);
    localStorage.setItem("cubes", cubes);
    localStorage.setItem("oneFiveMultiPrice", oneFiveMultiPrice);
    localStorage.setItem("globalMultiplier", globalMultiplier);
    localStorage.setItem("cubeRarities", JSON.stringify(cubeRarities));
}

// Loads game data from localStorage
function loadGameData() {
    points = parseInt(localStorage.getItem("points")) || 0;
    numberAdd = parseFloat(localStorage.getItem("numberAdd")) || 1;
    cubePrice = parseFloat(localStorage.getItem("cubePrice")) || 10;
    cubes = parseInt(localStorage.getItem("cubes")) || 1;
    oneFiveMultiPrice = parseFloat(localStorage.getItem("oneFiveMultiPrice")) || 100;
    globalMultiplier = parseFloat(localStorage.getItem("globalMultiplier")) || 1.0;

    let savedRarities = localStorage.getItem("cubeRarities");
    cubeRarities = savedRarities ? JSON.parse(savedRarities) : {};

    updateUI();

    let multiBtn = document.querySelector(".oneFiveMultiButton");
    if (multiBtn) multiBtn.innerText = "1.5x Multi: " + oneFiveMultiPrice;

    updateClickValueDisplay();

    // Recreate cubes with saved rarities
    for (let id in cubeRarities) {
        createCube(id, cubeRarities[id]);
    }

    recalculateClickValue();
}

window.onload = loadGameData;

// Resets game data
function reset() {
    let resetYN = prompt("Are you sure that you want to Hard Reset? Type 'yes' to confirm.");
    if (resetYN && resetYN.toLowerCase() === "yes") {
        points = 0;
        numberAdd = 1;
        cubePrice = 10;
        cubes = 1;
        oneFiveMultiPrice = 100;
        globalMultiplier = 1.0;
        cubeRarities = {};

        document.getElementById('points').innerText = points;
        document.getElementsByClassName("newCube")[0].innerText = "Add Cube: 10";

        document.querySelectorAll('.cube').forEach(cube => cube.remove());

        saveGameData();
        updateClickValueDisplay();
    }
}

// Handles the 1.5x multiplier upgrade
function oneFiveMulti() {
    if (points < oneFiveMultiPrice) {
        alert("You need at least " + oneFiveMultiPrice + " points to get a 1.5x multi upgrade!");
        return;
    }

    globalMultiplier *= 1.5;
    points -= oneFiveMultiPrice;
    oneFiveMultiPrice = Math.ceil(oneFiveMultiPrice * 1.75);

    let multiBtn = document.querySelector(".oneFiveMultiButton");
    if (multiBtn) multiBtn.innerText = "1.5x Multi: " + oneFiveMultiPrice;

    recalculateClickValue(); // Apply the multiplier correctly
    document.getElementById('points').innerText = points;
    updateClickValueDisplay();
    saveGameData();
}
