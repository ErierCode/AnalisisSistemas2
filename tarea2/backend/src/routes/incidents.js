const express = require("express");
const { readStore, updateStore } = require("../store");
const { suggestCause } = require("../services/errorCauseBot");
const { incidentsTotal } = require("../services/prometheusMetrics");

const router = express.Router();

router.get("/", (_req, res) => {
  const { incidents } = readStore();
  res.json(incidents);
});

router.post("/", (req, res) => {
  const { title, description, severity = "medium" } = req.body || {};

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "El título es requerido" });
  }

  const incident = {
    id: `inc-${Date.now()}`,
    title: String(title).trim(),
    description: String(description || "").trim(),
    severity,
    status: "open",
    suggestedCause: suggestCause(title, description, severity),
    createdAt: new Date().toISOString(),
  };

  updateStore((store) => {
    store.incidents.unshift(incident);
  });
  incidentsTotal.inc();

  res.status(201).json(incident);
});

module.exports = router;
