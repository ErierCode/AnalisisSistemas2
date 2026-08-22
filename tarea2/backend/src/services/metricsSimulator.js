const { updateStore, readStore } = require("../store");

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function generatePoint() {
  const now = new Date().toISOString();
  const cpu = clamp(35 + Math.random() * 40 + (Math.random() > 0.85 ? 20 : 0), 5, 98);
  const latencyMs = clamp(80 + Math.random() * 180 + (Math.random() > 0.9 ? 400 : 0), 40, 900);
  const errorsPerMin = clamp(Math.random() * 3 + (Math.random() > 0.92 ? 8 : 0), 0, 15);
  const requestsPerMin = Math.round(120 + Math.random() * 80);

  return {
    at: now,
    cpu: Math.round(cpu * 10) / 10,
    latencyMs: Math.round(latencyMs),
    errorsPerMin: Math.round(errorsPerMin * 10) / 10,
    requestsPerMin,
  };
}

function pushMetricPoint() {
  const point = generatePoint();
  updateStore((store) => {
    store.metricsHistory.push(point);
    store.metricsHistory = store.metricsHistory.slice(-20);
  });
  return point;
}

function getMetrics() {
  let store = readStore();
  if (!store.metricsHistory || store.metricsHistory.length === 0) {
    for (let i = 0; i < 12; i++) {
      pushMetricPoint();
    }
    store = readStore();
  } else {
    pushMetricPoint();
    store = readStore();
  }

  const history = store.metricsHistory;
  const current = history[history.length - 1];

  let status = "healthy";
  if (current.cpu > 85 || current.latencyMs > 500 || current.errorsPerMin > 5) {
    status = "degraded";
  }
  if (current.cpu > 95 || current.errorsPerMin > 10) {
    status = "critical";
  }

  return { current, history, status };
}

module.exports = { getMetrics, generatePoint };