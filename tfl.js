// ====================
// CONFIG
// ====================
const APP_KEY = "65771a8e00be4d1b9a3824becb9d718f";

const ILFORD_RAIL_ID = "910GILFORD";
const LAT = 51.559;
const LON = 0.0686;
const REFRESH_INTERVAL = 60000;

// ====================
// DOM
// ====================
const trainList = document.getElementById("train-times");
const busList = document.getElementById("bus-times");
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
    const stopsRes = await fetch(
      `https://api.tfl.gov.uk/StopPoint?lat=${LAT}&lon=${LON}&radius=300&stopTypes=NaptanPublicBusCoachTram&app_key=${APP_KEY}`,
    );

    const stopsData = await stopsRes.json();
    const stops = stopsData.stopPoints.slice(0, 3);

    const arrivals = await Promise.all(
      stops.map((stop) =>
        fetch(
          `https://api.tfl.gov.uk/StopPoint/${stop.id}/Arrivals?app_key=${APP_KEY}`,
        ).then((res) => res.json()),
      ),
    );

    const flatArrivals = arrivals.flat();
    saveCache("buses", flatArrivals);
    renderBuses(flatArrivals);
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
    .slice(0, 6)
    .forEach((bus) => {
      const stopLetter = bus.stopPointIndicator || "?";

      const li = document.createElement("li");
      li.classList.add("bus");

      li.innerHTML = `
        <div class="item-main">
          <div class="item-title">
            Bus ${bus.lineName} → ${bus.destinationName}
          </div>
          <div class="item-sub">
            <span class="stop-letter">${stopLetter}</span>
            ${bus.stationName}
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
// INIT + REFRESH
// ====================
function refreshAll() {
  document.body.className = isPeakTime() ? "peak" : "offpeak";
  loadTrains();
  loadBuses();
}

refreshAll();
setInterval(refreshAll, REFRESH_INTERVAL);
