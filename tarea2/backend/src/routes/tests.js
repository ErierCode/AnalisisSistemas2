const express = require("express");
const { runTests, getLatestTestRun } = require("../services/testRunnerMock");
const { testRunsTotal } = require("../services/prometheusMetrics");

const router = express.Router();

router.get("/latest", (_req, res) => {
  const latest = getLatestTestRun();
  res.json(latest || { message: "Aún no hay ejecuciones de tests" });
});

router.post("/run", (_req, res) => {
  const result = runTests();
  testRunsTotal.inc({ status: result.status });
  res.json(result);
});

module.exports = router;
