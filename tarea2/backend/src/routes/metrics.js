const { getOpsSnapshot } = require("../services/prometheusQuery");

const router = require("express").Router();

router.get("/", async (_req, res) => {
  try {
    const snapshot = await getOpsSnapshot();
    res.json(snapshot);
  } catch (err) {
    res.status(503).json({
      error:
        err.message ||
        "No se pudo consultar Prometheus. ¿Está Docker levantado (puerto 9090) y el backend scrapeado?",
      hint: "Ejecuta: docker compose up -d prometheus grafana",
    });
  }
});

module.exports = router;
