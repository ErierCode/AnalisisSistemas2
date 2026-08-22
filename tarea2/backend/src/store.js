const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");

const defaultStore = () => ({
  incidents: [
    {
      id: "inc-1",
      title: "Latencia alta en API de pagos",
      description: "Respuestas > 2s en /payments",
      severity: "high",
      status: "open",
      suggestedCause:
        "Posible saturación de CPU o consultas lentas a la base de datos. Revisar métricas de CPU y queries lentas.",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  tasks: [
    {
      id: "task-1",
      title: "Configurar alertas de monitoreo",
      status: "todo",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "task-2",
      title: "Automatizar suite de tests en CI",
      status: "doing",
      createdAt: new Date(Date.now() - 72000000).toISOString(),
    },
    {
      id: "task-3",
      title: "Revisar política de acceso JWT",
      status: "done",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ],
  accessLog: [],
  latestTestRun: null,
  metricsHistory: [],
});

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_FILE)) {
    fs.writeFileSync(STORE_FILE, JSON.stringify(defaultStore(), null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
}

function writeStore(data) {
  ensureStore();
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
}

function updateStore(mutator) {
  const store = readStore();
  mutator(store);
  writeStore(store);
  return store;
}

module.exports = { readStore, writeStore, updateStore, ensureStore };