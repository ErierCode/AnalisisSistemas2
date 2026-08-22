require("dotenv").config({ path: require("path").join(__dirname, "..", "..", ".env") });

const express = require("express");
const cors = require("cors");
const { ensureStore } = require("./store");
const { authRequired } = require("./middleware/auth");
const {
  metricsMiddleware,
  metricsHandler,
} = require("./services/prometheusMetrics");

const authRoutes = require("./routes/auth");
const metricsRoutes = require("./routes/metrics");
const incidentsRoutes = require("./routes/incidents");
const testsRoutes = require("./routes/tests");
const securityRoutes = require("./routes/security");
const jiraRoutes = require("./routes/jira");

ensureStore();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

// Endpoint que scrapea Prometheus (sin JWT)
app.get("/metrics", metricsHandler);

app.get("/", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>VANA Ops API</title>
<style>body{font-family:sans-serif;background:#0f1a17;color:#e8f2ed;padding:2rem}
a{color:#3dcea0}</style></head>
<body>
<h1>VANA Ops Backend</h1>
<p>Esta es la API (puerto 4000), no la interfaz. Abre la app en:</p>
<p><a href="http://localhost:5173">http://localhost:5173</a></p>
<ul>
  <li><a href="/api/health">/api/health</a></li>
  <li><a href="/metrics">/metrics</a> (Prometheus scrape)</li>
  <li><a href="http://localhost:3000">Grafana :3000</a> — admin / vana2026</li>
  <li><a href="http://localhost:9090/targets">Prometheus targets :9090</a></li>
</ul>
</body></html>`);
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "vana-ops-backend",
    prometheus: process.env.PROMETHEUS_URL || "http://localhost:9090",
    grafana: process.env.GRAFANA_URL || "http://localhost:3000",
    jira: process.env.JIRA_BASE_URL || "http://localhost:8080",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/metrics", authRequired, metricsRoutes);
app.use("/api/incidents", authRequired, incidentsRoutes);
app.use("/api/tests", authRequired, testsRoutes);
app.use("/api/jira", authRequired, jiraRoutes);
app.use("/api/security", authRequired, securityRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`VANA Ops Backend en http://localhost:${PORT}`);
  console.log(`Prometheus scrape: http://localhost:${PORT}/metrics`);
});
