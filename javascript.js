let points = 0;
let numberAdd = 1;
let cubePrice = 10;
let priceGrowth = 1.5;
let cubes = 1;
let oneFiveMultiPrice = 100;
let twoMultiPrice = 250;
let globalMultiplier = 1.0; // New global multiplier
let cubeRarities = {}; // Store cube rarities

// Rarity Multipliers
const rarityMultipliers = {
    "Common": 1,
    "Uncommon": 5,
    "Rare": 25,
    "Legendary": 100,
    "Mythical": 250,
    "Divine": 1500,
    "Secret": 100000
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
      
      // Apply glow effect for Divine rarity
      if (rarity === "Divine") {
          face.classList.add('glow-divine'); // Apply glow to each face
      }
      if (rarity === "Secret") {
        face.classList.add('glow-secret')
      }

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

  // Set z-index based on rarity
  let zIndexLevels = {
      "Secret": 7,
      "Divine": 6,
      "Mythical": 5,
      "Legendary": 4,
      "Rare": 3,
      "Uncommon": 2,
      "Common": 1
  };
  newCube.style.zIndex = zIndexLevels[rarity] || 1;

  document.body.appendChild(newCube);
}



function assignRarity() {
  let roll = Math.random() * 10000; // Roll between 0 and 10000
  console.log("Roll value: " + roll); // Log the roll value for debugging
  
  if (roll < 10) return "Secret";    // 0.1% chance for Secret
  if (roll < 60) return "Divine";   // 0.5% chance for Divine
  if (roll < 160) return "Mythical"; // 1% chance for Mythical
  if (roll < 460) return "Legendary"; // 3% chance for Legendary
  if (roll < 960) return "Rare";     // 5% chance for Rare
  if (roll < 2460) return "Uncommon"; // 15% chance for Uncommon
  return "Common";                  // 75.6% chance for Common
}




// Returns the color for a given rarity
function getRarityColor(rarity) {
  switch (rarity) {
      case "Secret": return "gray";
      case "Divine": return "gold";
      case "Mythical": return "red";
      case "Legendary": return "yellow";
      case "Rare": return "blue";
      case "Uncommon": return "darkgreen";
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

// Handles the 2x multiplier upgrade
function twoMulti() {
  if (points < twoMultiPrice) {
      alert("You need at least " + twoMultiPrice + " points to get a 2x multi upgrade!");
      return;
  }

  globalMultiplier *= 2;
  points -= twoMultiPrice;
  twoMultiPrice = Math.ceil(twoMultiPrice * 2.5);

  let multiBtn = document.querySelector(".twoMultiButton");
  if (multiBtn) multiBtn.innerText = "2x Multi: " + twoMultiPrice;

  recalculateClickValue(); // Apply the multiplier correctly
  document.getElementById('points').innerText = points;
  updateClickValueDisplay();
  saveGameData();
}
