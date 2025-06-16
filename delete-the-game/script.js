import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Firebase config (unchanged)
const firebaseConfig = { /* your config here */ };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const button = document.getElementById('delete_button');
const btnStateRef = ref(db, 'buttonState');
const lockRef = ref(db, 'siteLocked');

let countdownInterval = null;
let firebaseSyncInterval = null;
let endTimestamp = null;
let siteLocked = false;

// Utility UI functions
function clearCountdown() {
  clearInterval(countdownInterval); countdownInterval = null;
  clearInterval(firebaseSyncInterval); firebaseSyncInterval = null;
}

function showLockedOverlay() {
  if (document.getElementById('locked-overlay')) return; // Already shown

  const overlay = document.createElement('div');
  overlay.id = 'locked-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(128,128,128,0.85)', // grey translucent
    color: 'white',
    fontSize: '2rem',
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    textAlign: 'center',
    userSelect: 'none',
  });
  overlay.innerHTML = `
    <div>
      🚫 The game has been deleted.<br>
      Access is permanently disabled.
    </div>
  `;
  document.body.appendChild(overlay);
}

// Start countdown with local ticking & remote sync
function startCountdown(endTime) {
  clearCountdown();
  endTimestamp = endTime;

  function tick() {
    const msLeft = endTimestamp - Date.now();
    if (msLeft <= 0) {
      // 1. Lock site
      set(lockRef, true);
      // 2. Reset button state
      set(btnStateRef, { isDeleting: false, endTimestamp: null });
      clearCountdown();
      return;
    }
    // Update local UI
    const totalSeconds = Math.ceil(msLeft / 1000);
    const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    button.textContent = `Deleting the game in: ${m}:${s}\n(Click to cancel)`;
  }

  tick(); // immediate update
  countdownInterval = setInterval(tick, 1000);
  firebaseSyncInterval = setInterval(() => {
    if (endTimestamp > Date.now()) {
      set(btnStateRef, { isDeleting: true, endTimestamp });
    }
  }, 5000);
}

// Listen for the lock flag in Firebase
onValue(lockRef, snap => {
  if (snap.val() === true) {
    siteLocked = true;
    clearCountdown();
    showLockedOverlay();
  }
});

// Sync button state and listen for cancel/start events
onValue(btnStateRef, snap => {
  if (siteLocked) return; 
  const state = snap.val();
  if (state && state.isDeleting && state.endTimestamp) {
    startCountdown(state.endTimestamp);
  } else {
    clearCountdown();
    button.textContent = 'Delete the Game';
    button.disabled = false;
  }
});

// Handle button clicks (toggle logic)
button.addEventListener('click', () => {
  if (siteLocked) return;
  if (endTimestamp && Date.now() < endTimestamp) {
    set(btnStateRef, { isDeleting: false, endTimestamp: null });
    clearCountdown();
    button.textContent = 'Delete the Game';
  } else {
    const newEnd = Date.now() + 60 * 1000;
    set(btnStateRef, { isDeleting: true, endTimestamp: newEnd });
  }
});
