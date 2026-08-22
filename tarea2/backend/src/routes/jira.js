const express = require("express");
const {
  getServerInfo,
  listIssues,
  createIssue,
  transitionIssue,
  getConfigPublic,
  JIRA_BASE_URL,
} = require("../services/jiraClient");

const router = express.Router();

router.get("/status", async (_req, res) => {
  try {
    const info = await getServerInfo();
    res.json({
      ok: true,
      ...getConfigPublic(),
      version: info.version,
      serverTitle: info.serverTitle,
    });
  } catch (err) {
    res.json({
      ok: false,
      ...getConfigPublic(),
      error: err.message,
      hint:
        "Levanta Jira con docker compose up -d jira postgres-jira, completa el wizard en http://localhost:8080 y crea el proyecto con clave VANA. Luego ajusta JIRA_USER/JIRA_PASSWORD en .env",
    });
  }
});

router.get("/issues", async (_req, res) => {
  try {
    const issues = await listIssues();
    res.json(issues);
  } catch (err) {
    res.status(err.status || 502).json({
      error: err.message,
      jiraUrl: JIRA_BASE_URL,
    });
  }
});

router.post("/issues", async (req, res) => {
  try {
    const { title, description } = req.body || {};
    if (!title || !String(title).trim()) {
      return res.status(400).json({ error: "El título es requerido" });
    }
    const issue = await createIssue({
      title: String(title).trim(),
      description: String(description || "").trim(),
    });
    res.status(201).json(issue);
  } catch (err) {
    res.status(err.status || 502).json({ error: err.message, details: err.data });
  }
});

router.post("/issues/:key/transition", async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!["todo", "doing", "done"].includes(status)) {
      return res.status(400).json({ error: "status debe ser todo | doing | done" });
    }
    const result = await transitionIssue(req.params.key, status);
    res.json(result);
  } catch (err) {
    res.status(err.status || 502).json({ error: err.message });
  }
});

module.exports = router;
