let interval = null;
let isRunning = false;
let isWorkSession = true;
let remainingTime = 25 * 60;
let hasStartedOnce = false;

const display = document.getElementById('timer-display');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const focusInput = document.getElementById('focus-duration');
const breakInput = document.getElementById('break-duration');
const applyBtn = document.getElementById('apply-settings');
const volumeSlider = document.getElementById('volume-control');
const blockToggle = document.getElementById('blocker-toggle');
const historyList = document.getElementById('session-log');
const toggleTheme = document.getElementById('toggle-theme');

const rainAudio = document.getElementById('rain');
const forestAudio = document.getElementById('forest');

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateDisplay() {
  display.textContent = formatTime(remainingTime);
}

function loadTheme() {
  chrome.storage.local.get('darkMode', ({ darkMode }) => {
    document.body.classList.toggle('dark', darkMode);
  });
}

function saveTheme() {
  const isDark = document.body.classList.toggle('dark');
  chrome.storage.local.set({ darkMode: isDark });
}

function saveSessionHistory(isWork) {
  const session = {
    type: isWork ? 'Work' : 'Break',
    time: new Date().toLocaleTimeString()
  };
  chrome.storage.local.get({ history: [] }, ({ history }) => {
    history.unshift(session);
    if (history.length > 10) history.pop();
    chrome.storage.local.set({ history });
    renderHistory(history);
  });
}

function renderHistory(history) {
  historyList.innerHTML = '';
  history.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.type} @ ${entry.time}`;
    historyList.appendChild(li);
  });
}

function loadHistory() {
  chrome.storage.local.get('history', ({ history }) => {
    if (history) renderHistory(history);
  });
}

function startTimer() {
  if (interval) return;
  isRunning = true;

  interval = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateDisplay();
    } else {
      clearInterval(interval);
      interval = null;
      isRunning = false;

      if (hasStartedOnce) {
        const htmlPage = isWorkSession ? "break.html" : "work.html";
        chrome.tabs.create({ url: chrome.runtime.getURL(htmlPage) });
      }

      saveSessionHistory(isWorkSession);
      isWorkSession = !isWorkSession;
      remainingTime = (isWorkSession ? parseInt(focusInput.value) : parseInt(breakInput.value)) * 60;
      updateDisplay();

      hasStartedOnce = true;
      startTimer();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
  isRunning = false;
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  isRunning = false;
  isWorkSession = true;
  remainingTime = parseInt(focusInput.value) * 60;
  hasStartedOnce = false;
  updateDisplay();
}

function applySettings() {
  if (!isRunning) {
    remainingTime = parseInt(focusInput.value) * 60;
    updateDisplay();
  }
}

startBtn.onclick = startTimer;
pauseBtn.onclick = pauseTimer;
resetBtn.onclick = resetTimer;
applyBtn.onclick = applySettings;
toggleTheme.onclick = saveTheme;

document.getElementById('rain-btn').onclick = () => {
  forestAudio.pause();
  rainAudio.volume = volumeSlider.value;
  rainAudio.currentTime = 0;
  rainAudio.play();
};

document.getElementById('forest-btn').onclick = () => {
  rainAudio.pause();
  forestAudio.volume = volumeSlider.value;
  forestAudio.currentTime = 0;
  forestAudio.play();
};

document.getElementById('stop-sound-btn').onclick = () => {
  rainAudio.pause();
  forestAudio.pause();
};

volumeSlider.oninput = () => {
  rainAudio.volume = volumeSlider.value;
  forestAudio.volume = volumeSlider.value;
};

blockToggle.onchange = () => {
  chrome.runtime.sendMessage({
    action: blockToggle.checked ? "startFocusTime" : "endFocusTime"
  });

  // Update the allowlist rules when toggled
  chrome.runtime.sendMessage({ action: "updateBlockList" });
};

updateDisplay();
loadTheme();
loadHistory();

const siteInput = document.getElementById("siteInput");
const addSiteBtn = document.getElementById("addSiteBtn");
const siteList = document.getElementById("siteList");

// Load allowed sites on startup
chrome.storage.local.get("allowedSites", (data) => {
  const sites = data.allowedSites || [];
  sites.forEach(site => addSiteToUI(site));
});

function addSiteToUI(site) {
  const li = document.createElement("li");
  li.textContent = site;
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "✕";
  removeBtn.onclick = () => removeSite(site, li);
  li.appendChild(removeBtn);
  siteList.appendChild(li);
}

function removeSite(site, liElement) {
  chrome.storage.local.get("allowedSites", (data) => {
    let sites = data.allowedSites || [];
    sites = sites.filter(s => s !== site);
    chrome.storage.local.set({ allowedSites: sites });
    liElement.remove();
    chrome.runtime.sendMessage({ action: "updateBlockList" });
  });
}

addSiteBtn.addEventListener("click", () => {
  const site = siteInput.value.trim();
  if (!site) return;
  chrome.storage.local.get("allowedSites", (data) => {
    const sites = data.allowedSites || [];
    if (!sites.includes(site)) {
      sites.push(site);
      chrome.storage.local.set({ allowedSites: sites });
      addSiteToUI(site);
      siteInput.value = "";
      chrome.runtime.sendMessage({ action: "updateBlockList" });
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("toggle-theme");
  const root = document.documentElement;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    root.classList.add("dark");
  }

  themeToggle.addEventListener("click", () => {
    root.classList.toggle("dark");
    const theme = root.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
  });
});
