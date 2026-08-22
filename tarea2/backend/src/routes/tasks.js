const express = require("express");
const { readStore, updateStore } = require("../store");

const router = express.Router();
const VALID_STATUS = new Set(["todo", "doing", "done"]);

router.get("/", (_req, res) => {
  res.json(readStore().tasks);
});

router.post("/", (req, res) => {
  const { title, status = "todo" } = req.body || {};

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "El título es requerido" });
  }

  if (!VALID_STATUS.has(status)) {
    return res.status(400).json({ error: "Status inválido" });
  }

  const task = {
    id: `task-${Date.now()}`,
    title: String(title).trim(),
    status,
    createdAt: new Date().toISOString(),
  };

  updateStore((store) => {
    store.tasks.push(task);
  });

  res.status(201).json(task);
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { status, title } = req.body || {};

  let updated = null;

  updateStore((store) => {
    const task = store.tasks.find((t) => t.id === id);
    if (!task) return;

    if (status !== undefined) {
      if (!VALID_STATUS.has(status)) return;
      task.status = status;
    }
    if (title !== undefined && String(title).trim()) {
      task.title = String(title).trim();
    }
    updated = task;
  });

  if (!updated) {
    return res.status(404).json({ error: "Tarea no encontrada o status inválido" });
  }

  res.json(updated);
});

module.exports = router;
