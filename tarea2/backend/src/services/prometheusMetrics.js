const client = require("prom-client");

const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: "vana_" });

const httpRequestsTotal = new client.Counter({
  name: "vana_http_requests_total",
  help: "Total de requests HTTP al backend VANA Ops",
  labelNames: ["method", "route", "status"],
  registers: [register],
});

const httpRequestDuration = new client.Histogram({
  name: "vana_http_request_duration_seconds",
  help: "Duración de requests HTTP en segundos",
  labelNames: ["method", "route", "status"],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers: [register],
});

const incidentsTotal = new client.Counter({
  name: "vana_incidents_total",
  help: "Incidentes creados en VANA Ops",
  registers: [register],
});

const testRunsTotal = new client.Counter({
  name: "vana_test_runs_total",
  help: "Ejecuciones de la suite de tests",
  labelNames: ["status"],
  registers: [register],
});

function metricsMiddleware(req, res, next) {
  if (req.path === "/metrics") return next();

  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const duration = Number(process.hrtime.bigint() - start) / 1e9;
    const route = req.route?.path
      ? `${req.baseUrl || ""}${req.route.path}`
      : req.path;
    const labels = {
      method: req.method,
      route,
      status: String(res.statusCode),
    };
    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, duration);
  });
  next();
}

async function metricsHandler(_req, res) {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
}

module.exports = {
  register,
  metricsMiddleware,
  metricsHandler,
  incidentsTotal,
  testRunsTotal,
};
