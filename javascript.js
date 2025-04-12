// Helper function to abbreviate large BigInt numbers
function abbreviateBigInt(value) {
  const suffixes = ["", " K", " M", " B", " T", " Qa", " Qi", " Sx", " Sp", " Oc", " No", " Dc", " Ud", " Dd", " Td", " Qd", " Qn", " Sxd", " Spd", " Ocd", " Nod", " Dcd"];
  let str = value.toString();
  const len = str.length;
  if (len <= 3) return str;
  let tier = Math.floor((len - 1) / 3);
  if (tier >= suffixes.length) tier = suffixes.length - 1;
  const digitsBeforeDecimal = len - tier * 3;
  const mainPart = str.slice(0, digitsBeforeDecimal);
  let decimalPart = "";
  if (digitsBeforeDecimal < 3) {
    decimalPart = "." + str.slice(digitsBeforeDecimal, digitsBeforeDecimal + 1);
  }
  return mainPart + decimalPart + suffixes[tier];
}

// Updates the visual styling on buttons based on affordability.
// Buttons will remain red if you cannot afford them and green if you can.
function updateAffordabilityStyles() {
  let cubeBtn = document.querySelector(".newCube");
  if (cubeBtn) {
    cubeBtn.style.boxShadow = (points < cubePrice)
      ? '0 0 10px 5px red'
      : '0 0 10px 5px green';
  }
  let multiOneBtn = document.querySelector(".multiOneButton");
  if (multiOneBtn) {
    multiOneBtn.style.boxShadow = (points < multiOnePrice)
      ? '0 0 10px 5px red'
      : '0 0 10px 5px green';
  }
  let multiTwoBtn = document.querySelector(".multiTwoButton");
  if (multiTwoBtn) {
    multiTwoBtn.style.boxShadow = (points < multiTwoPrice)
      ? '0 0 10px 5px red'
      : '0 0 10px 5px green';
  }
}

// Game variables with adjusted progression
let points = 0n;
let numberAdd = 1n;        // Click value stored as BigInt
let cubePrice = 10n;       // Cube price as BigInt
let priceGrowth = 1.6;     // Increased growth factor for higher cube costs
let cubes = 1;
let multiOnePrice = 500n;  // Increased initial cost for 1.5x upgrade
let multiTwoPrice = 1000n; // Increased initial cost for 2x upgrade
let globalMultiplier = 1.0;  // Global multiplier (affects click value)
let cubeRarities = {};       // Store cube rarities
let luckMulti = 1;

// Rarity Multipliers remain unchanged
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
  points += numberAdd;
  pointsElement.innerText = abbreviateBigInt(points);
  updateClickValueDisplay();
  updateAffordabilityStyles();
  saveGameData();
}

// Adds a cube
function addCube() {
  let btn = document.querySelector(".newCube");
  if (points < cubePrice) {
    // Update button style to show red; do nothing else.
    updateAffordabilityStyles();
    return;
  }
  let cubeId = cubes;
  let rarity = assignRarity();
  cubeRarities[cubeId] = rarity;
  
  cubes += 1;
  points -= cubePrice;
  // Increase cube price using the new growth factor:
  cubePrice = BigInt(Math.ceil(Number(cubePrice) * priceGrowth));
  
  if (cubes > 1) {
    recalculateClickValue();
  }
  
  updateUI();
  updateAffordabilityStyles();
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
    if (rarity === "Divine") {
      face.classList.add('glow-divine');
    }
    if (rarity === "Secret") {
      face.classList.add('glow-secret');
    }
    newCube.appendChild(face);
  }
  
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;
  let safeMargin = 275;
  let randomX = Math.random() * (screenWidth - safeMargin);
  let randomY = Math.random() * (screenHeight - safeMargin);
  newCube.style.position = 'absolute';
  newCube.style.left = `${randomX}px`;
  newCube.style.top = `${randomY}px`;
  
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
  let roll = Math.random() * 10000;
  console.log("Roll value: " + roll);
  if (roll < 10 * luckMulti) return "Secret";
  if (roll < 60 * luckMulti) return "Divine";
  if (roll < 160 * luckMulti) return "Mythical";
  if (roll < 460 * luckMulti) return "Legendary";
  if (roll < 960 * luckMulti) return "Rare";
  if (roll < 2460 * luckMulti) return "Uncommon";
  return "Common";
}

// Returns the color for a given rarity
function getRarityColor(rarity) {
  switch (rarity) {
    case "Secret": return "gray";
    case "Divine": return "gold";
    case "Mythical": return "red";
    case "Legendary": return "yellow";
    case "Rare": return "blue";
    case "Uncommon": return "green";
    default: return "gray";
  }
}

// Updates the click value display
function updateClickValueDisplay() {
  let clickValEl = document.getElementById('clickValue');
  if (clickValEl) {
    clickValEl.innerText = "Click Value: " + numberAdd.toString();
  }
}

// Recalculates numberAdd based on cube rarities and applies globalMultiplier
function recalculateClickValue() {
  let baseValue = 1;
  for (let id in cubeRarities) {
    let rarity = cubeRarities[id];
    baseValue += rarityMultipliers[rarity] || 1;
  }
  numberAdd = BigInt(Math.floor(baseValue * globalMultiplier));
  updateClickValueDisplay();
}

// Updates UI elements with abbreviated numbers
function updateUI() {
  document.getElementById('points').innerText = abbreviateBigInt(points);
  document.getElementsByClassName("newCube")[0].innerText = "Add Cube: " + abbreviateBigInt(cubePrice);
}

// Saves game data to localStorage
function saveGameData() {
  localStorage.setItem("points", points.toString());
  localStorage.setItem("numberAdd", numberAdd.toString());
  localStorage.setItem("cubePrice", cubePrice.toString());
  localStorage.setItem("cubes", cubes);
  localStorage.setItem("multiOnePrice", multiOnePrice.toString());
  localStorage.setItem("multiTwoPrice", multiTwoPrice.toString());
  localStorage.setItem("globalMultiplier", globalMultiplier);
  localStorage.setItem("cubeRarities", JSON.stringify(cubeRarities));
}

// Loads game data from localStorage
function loadGameData() {
  const storedPoints = localStorage.getItem("points");
  points = storedPoints ? BigInt(storedPoints) : 0n;
  numberAdd = BigInt(parseFloat(localStorage.getItem("numberAdd")) || 1);
  cubePrice = localStorage.getItem("cubePrice") ? BigInt(localStorage.getItem("cubePrice")) : 10n;
  cubes = parseInt(localStorage.getItem("cubes")) || 1;
  multiOnePrice = localStorage.getItem("multiOnePrice") ? BigInt(localStorage.getItem("multiOnePrice")) : 500n;
  multiTwoPrice = localStorage.getItem("multiTwoPrice") ? BigInt(localStorage.getItem("multiTwoPrice")) : 1000n;
  globalMultiplier = parseFloat(localStorage.getItem("globalMultiplier")) || 1.0;
  document.getElementById('points').innerText = abbreviateBigInt(points);
  
  let savedRarities = localStorage.getItem("cubeRarities");
  cubeRarities = savedRarities ? JSON.parse(savedRarities) : {};
  
  updateUI();
  
  let multiBtn = document.querySelector(".multiOneButton");
  if (multiBtn) multiBtn.innerText = "1.5x Multi: " + abbreviateBigInt(multiOnePrice);
  
  let twoMultiBtn = document.querySelector(".multiTwoButton");
  if (twoMultiBtn) twoMultiBtn.innerText = "2x Multi: " + abbreviateBigInt(multiTwoPrice);
  
  updateClickValueDisplay();
  
  for (let id in cubeRarities) {
    createCube(id, cubeRarities[id]);
  }
  
  recalculateClickValue();
  updateAffordabilityStyles();
}

window.onload = loadGameData;

// Resets game data
function reset() {
  let resetYN = prompt("Are you sure you want to Hard Reset? Type 'yes' to confirm.");
  if (resetYN && resetYN.toLowerCase() === "yes") {
    points = 0n;
    numberAdd = 1n;
    cubePrice = 10n;
    cubes = 1;
    multiOnePrice = 500n;
    multiTwoPrice = 1000n;
    globalMultiplier = 1.0;
    cubeRarities = {};
    
    document.getElementById('points').innerText = abbreviateBigInt(points);
    document.getElementsByClassName("newCube")[0].innerText = "Add Cube: " + abbreviateBigInt(cubePrice);
    const btn1 = document.querySelector(".multiOneButton");
    const btn2 = document.querySelector(".multiTwoButton");
    if (btn1) btn1.innerText = `1.5x Multi: ${abbreviateBigInt(multiOnePrice)}`;
    if (btn2) btn2.innerText = `2x Multi: ${abbreviateBigInt(multiTwoPrice)}`;
    
    document.querySelectorAll('.cube').forEach(c => c.remove());
    
    saveGameData();
    updateClickValueDisplay();
    updateAffordabilityStyles();
  }
  if (resetYN === "test") {
    points += BigInt("9999999999999999999999999999999999999999999999999999999999999999999999999");
  }
}

// Handles the 1.5x multiplier upgrade
function oneFiveMulti() {
  let btn = document.querySelector(".multiOneButton");
  if (points < multiOnePrice) {
    updateAffordabilityStyles();
    return;
  }
  globalMultiplier *= 1.2;
  points -= multiOnePrice;
  multiOnePrice = multiOnePrice * 4n;
  
  if (btn) btn.innerText = "1.5x Multi: " + abbreviateBigInt(multiOnePrice);
  
  recalculateClickValue();
  document.getElementById('points').innerText = abbreviateBigInt(points);
  updateClickValueDisplay();
  saveGameData();
  updateAffordabilityStyles();
}

// Handles the 2x multiplier upgrade
function twoMulti() {
  let btn = document.querySelector(".multiTwoButton");
  if (points < multiTwoPrice) {
    updateAffordabilityStyles();
    return;
  }
  globalMultiplier *= 1.3;
  points -= multiTwoPrice;
  multiTwoPrice = multiTwoPrice * 6n;
  
  if (btn) btn.innerText = "2x Multi: " + abbreviateBigInt(multiTwoPrice);
  
  recalculateClickValue();
  document.getElementById('points').innerText = abbreviateBigInt(points);
  updateClickValueDisplay();
  saveGameData();
  updateAffordabilityStyles();
}

// Sidebar toggle logic
const toggleBtn = document.getElementById('upgradesToggle');
const sidebar  = document.getElementById('upgradesSidebar');
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  toggleBtn.classList.toggle('open');
  if (sidebar.classList.contains('open')) {
    toggleBtn.innerText = 'Upgrades ◂';
  } else {
    toggleBtn.innerText = 'Upgrades ▸';
  }
});
