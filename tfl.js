// ====================
// CONFIG
// ====================
const APP_KEY = "65771a8e00be4d1b9a3824becb9d718f";

const ILFORD_RAIL_ID = "910GILFORD";
const HAINAULT_STREET_STOP_W = "490007657W";
const HAINAULT_STREET_STOP_T = "490007657T";
const HAINAULT_STREET_STOP_V = "490007657V";
const HAINAULT_STREET_STOP_S = "490007657S";
const ILFORD_STATION_STOP_H = "490001157H";
const REFRESH_INTERVAL = 30000;

// ====================
// DOM
// ====================
const trainList = document.getElementById("train-times");
const busList = document.getElementById("bus-times");
const busListT = document.getElementById("bus-times-t");
const busListV = document.getElementById("bus-times-v");
const busListS = document.getElementById("bus-times-s");
const busListH = document.getElementById("bus-times-h");
const offlineBanner = document.getElementById("offline-banner");

// ====================
// PEAK / OFF-PEAK
// ====================
function isPeakTime() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;

  const weekday = day >= 1 && day <= 5;
  const morningPeak = hour >= 6.5 && hour <= 9.5;
  const eveningPeak = hour >= 16 && hour <= 19;

  return weekday && (morningPeak || eveningPeak);
}

// ====================
// HELPERS
// ====================
function minutes(seconds) {
  const mins = Math.round(seconds / 60);
  return mins <= 0 ? "Due" : `${mins} min`;
}

function setError(el, message) {
  el.className = "error";
  el.textContent = message;
}

function saveCache(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadCache(key) {
  const cached = localStorage.getItem(key);
  return cached ? JSON.parse(cached) : null;
}

// ====================
// ELIZABETH LINE
// ====================
async function loadTrains() {
  trainList.className = "loading";
  trainList.textContent = "Loading train times…";

  if (!navigator.onLine) {
    const cached = loadCache("trains");
    if (cached) return renderTrains(cached, true);
  }

  try {
    const res = await fetch(
      `https://api.tfl.gov.uk/StopPoint/${ILFORD_RAIL_ID}/Arrivals?app_key=${APP_KEY}`,
    );

    const data = await res.json();
    saveCache("trains", data);
    renderTrains(data);
  } catch {
    const cached = loadCache("trains");
    cached
      ? renderTrains(cached, true)
      : setError(trainList, "Unable to load train times.");
  }
}

function renderTrains(data, cached = false) {
  trainList.innerHTML = "";
  trainList.className = "";

  data
    .sort((a, b) => a.timeToStation - b.timeToStation)
    .slice(0, 6)
    .forEach((train) => {
      const platform = train.platformName
        ? `Platform ${train.platformName}`
        : "Platform TBC";

      const li = document.createElement("li");
      li.classList.add("train");

      li.innerHTML = `
        <div class="item-main">
          <div class="item-title">
            ${train.destinationName}
            <span class="badge">${platform}</span>
          </div>
          <div class="item-sub">Elizabeth line</div>
        </div>
        <div class="item-time">
          ${minutes(train.timeToStation)}
        </div>
      `;

      trainList.appendChild(li);
    });

  if (!data.length) trainList.textContent = "No train data available.";
  offlineBanner.style.display = cached ? "block" : "none";
}

// ====================
// BUSES
// ====================
async function loadBuses() {
  busList.className = "loading";
  busList.textContent = "Loading bus times…";

  if (!navigator.onLine) {
    const cached = loadCache("buses");
    if (cached) return renderBuses(cached, true);
  }

  try {
    const arrivalsRes = await fetch(
      `https://api.tfl.gov.uk/StopPoint/${HAINAULT_STREET_STOP_W}/Arrivals?app_key=${APP_KEY}`,
    );

    const arrivals = await arrivalsRes.json();
    saveCache("buses", arrivals);
    renderBuses(arrivals);
  } catch {
    const cached = loadCache("buses");
    cached
      ? renderBuses(cached, true)
      : setError(busList, "Unable to load bus times.");
  }
}

function renderBuses(data, cached = false) {
  busList.innerHTML = "";
  busList.className = "";

  data
    .sort((a, b) => a.timeToStation - b.timeToStation)
    .slice(0, 3)
    .forEach((bus) => {
      const stopLetter = bus.stopPointIndicator || "W";

      const li = document.createElement("li");
      li.classList.add("bus");

      li.innerHTML = `
        <div class="item-main">
          <div class="item-title">
            Bus ${bus.lineName} → ${bus.destinationName}
          </div>
          <div class="item-sub">
            <span class="stop-letter">${stopLetter}</span>
            Hainault Street
          </div>
        </div>
        <div class="item-time">
          ${minutes(bus.timeToStation)}
        </div>
      `;

      busList.appendChild(li);
    });

  if (!data.length) busList.textContent = "No bus data available.";
  offlineBanner.style.display = cached ? "block" : "none";
}

// ====================
// BUSES STOP T
// ====================
async function loadBusesT() {
  busListT.className = "loading";
  busListT.textContent = "Loading bus times…";

  if (!navigator.onLine) {
    const cached = loadCache("buses-t");
    if (cached) return renderBusesT(cached, true);
  }

  try {
    const arrivalsRes = await fetch(
      `https://api.tfl.gov.uk/StopPoint/${HAINAULT_STREET_STOP_T}/Arrivals?app_key=${APP_KEY}`,
    );

    const arrivals = await arrivalsRes.json();
    saveCache("buses-t", arrivals);
    renderBusesT(arrivals);
  } catch {
    const cached = loadCache("buses-t");
    cached
      ? renderBusesT(cached, true)
      : setError(busListT, "Unable to load bus times.");
  }
}

function renderBusesT(data, cached = false) {
  busListT.innerHTML = "";
  busListT.className = "";

  data
    .sort((a, b) => a.timeToStation - b.timeToStation)
    .slice(0, 3)
    .forEach((bus) => {
      const stopLetter = bus.stopPointIndicator || "T";

      const li = document.createElement("li");
      li.classList.add("bus");

      li.innerHTML = `
        <div class="item-main">
          <div class="item-title">
            Bus ${bus.lineName} → ${bus.destinationName}
          </div>
          <div class="item-sub">
            <span class="stop-letter">${stopLetter}</span>
            Hainault Street
          </div>
        </div>
        <div class="item-time">
          ${minutes(bus.timeToStation)}
        </div>
      `;

      busListT.appendChild(li);
    });

  if (!data.length) busListT.textContent = "No bus data available.";
  offlineBanner.style.display = cached ? "block" : "none";
}

// ====================
// BUSES STOP V
// ====================
async function loadBusesV() {
  busListV.className = "loading";
  busListV.textContent = "Loading bus times…";

  if (!navigator.onLine) {
    const cached = loadCache("buses-v");
    if (cached) return renderBusesV(cached, true);
  }

  try {
    const arrivalsRes = await fetch(
      `https://api.tfl.gov.uk/StopPoint/${HAINAULT_STREET_STOP_V}/Arrivals?app_key=${APP_KEY}`,
    );

    const arrivals = await arrivalsRes.json();
    saveCache("buses-v", arrivals);
    renderBusesV(arrivals);
  } catch {
    const cached = loadCache("buses-v");
    cached
      ? renderBusesV(cached, true)
      : setError(busListV, "Unable to load bus times.");
  }
}

function renderBusesV(data, cached = false) {
  busListV.innerHTML = "";
  busListV.className = "";

  data
    .sort((a, b) => a.timeToStation - b.timeToStation)
    .slice(0, 3)
    .forEach((bus) => {
      const stopLetter = bus.stopPointIndicator || "V";

      const li = document.createElement("li");
      li.classList.add("bus");

      li.innerHTML = `
        <div class="item-main">
          <div class="item-title">
            Bus ${bus.lineName} → ${bus.destinationName}
          </div>
          <div class="item-sub">
            <span class="stop-letter">${stopLetter}</span>
            Hainault Street
          </div>
        </div>
        <div class="item-time">
          ${minutes(bus.timeToStation)}
        </div>
      `;

      busListV.appendChild(li);
    });

  if (!data.length) busListV.textContent = "No bus data available.";
  offlineBanner.style.display = cached ? "block" : "none";
}

// ====================
// BUSES STOP S
// ====================
async function loadBusesS() {
  busListS.className = "loading";
  busListS.textContent = "Loading bus times…";

  if (!navigator.onLine) {
    const cached = loadCache("buses-s");
    if (cached) return renderBusesS(cached, true);
  }

  try {
    const arrivalsRes = await fetch(
      `https://api.tfl.gov.uk/StopPoint/${HAINAULT_STREET_STOP_S}/Arrivals?app_key=${APP_KEY}`,
    );

    const arrivals = await arrivalsRes.json();
    saveCache("buses-s", arrivals);
    renderBusesS(arrivals);
  } catch {
    const cached = loadCache("buses-s");
    cached
      ? renderBusesS(cached, true)
      : setError(busListS, "Unable to load bus times.");
  }
}

function renderBusesS(data, cached = false) {
  busListS.innerHTML = "";
  busListS.className = "";

  data
    .sort((a, b) => a.timeToStation - b.timeToStation)
    .slice(0, 3)
    .forEach((bus) => {
      const stopLetter = bus.stopPointIndicator || "S";

      const li = document.createElement("li");
      li.classList.add("bus");

      li.innerHTML = `
        <div class="item-main">
          <div class="item-title">
            Bus ${bus.lineName} → ${bus.destinationName}
          </div>
          <div class="item-sub">
            <span class="stop-letter">${stopLetter}</span>
            Hainault Street
          </div>
        </div>
        <div class="item-time">
          ${minutes(bus.timeToStation)}
        </div>
      `;

      busListS.appendChild(li);
    });

  if (!data.length) busListS.textContent = "No bus data available.";
  offlineBanner.style.display = cached ? "block" : "none";
}

// ====================
// BUSES ILFORD STATION H
// ====================
async function loadBusesH() {
  busListH.className = "loading";
  busListH.textContent = "Loading bus times…";

  if (!navigator.onLine) {
    const cached = loadCache("buses-h");
    if (cached) return renderBusesH(cached, true);
  }

  try {
    const arrivalsRes = await fetch(
      `https://api.tfl.gov.uk/StopPoint/${ILFORD_STATION_STOP_H}/Arrivals?app_key=${APP_KEY}`,
    );

    const arrivals = await arrivalsRes.json();
    saveCache("buses-h", arrivals);
    renderBusesH(arrivals);
  } catch {
    const cached = loadCache("buses-h");
    cached
      ? renderBusesH(cached, true)
      : setError(busListH, "Unable to load bus times.");
  }
}

function renderBusesH(data, cached = false) {
  busListH.innerHTML = "";
  busListH.className = "";

  data
    .sort((a, b) => a.timeToStation - b.timeToStation)
    .slice(0, 3)
    .forEach((bus) => {
      const stopLetter = bus.stopPointIndicator || "H";

      const li = document.createElement("li");
      li.classList.add("bus");

      li.innerHTML = `
        <div class="item-main">
          <div class="item-title">
            Bus ${bus.lineName} → ${bus.destinationName}
          </div>
          <div class="item-sub">
            <span class="stop-letter">${stopLetter}</span>
            Ilford Station
          </div>
        </div>
        <div class="item-time">
          ${minutes(bus.timeToStation)}
        </div>
      `;

      busListH.appendChild(li);
    });

  if (!data.length) busListH.textContent = "No bus data available.";
  offlineBanner.style.display = cached ? "block" : "none";
}

// ====================
// INIT + REFRESH
// ====================
function refreshAll() {
  document.body.className = isPeakTime() ? "peak" : "offpeak";
  loadTrains();
  loadBuses();
  loadBusesT();
  loadBusesV();
  loadBusesS();
  loadBusesH();
}

refreshAll();
setInterval(refreshAll, REFRESH_INTERVAL);
