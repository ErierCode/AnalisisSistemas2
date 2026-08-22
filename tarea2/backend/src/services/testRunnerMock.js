const { updateStore, readStore } = require("../store");

function runTests() {
  const suites = [
    { name: "auth.login", weight: 0.95 },
    { name: "metrics.endpoint", weight: 0.97 },
    { name: "incidents.bot", weight: 0.92 },
    { name: "tasks.kanban", weight: 0.96 },
    { name: "security.access-log", weight: 0.94 },
  ];

  const results = suites.map((suite) => {
    const passed = Math.random() < suite.weight;
    return {
      name: suite.name,
      status: passed ? "passed" : "failed",
      durationMs: Math.round(40 + Math.random() * 200),
    };
  });

  const passed = results.filter((r) => r.status === "passed").length;
  const failed = results.length - passed;
  const coverage = Math.round(72 + Math.random() * 20);

  const run = {
    id: `run-${Date.now()}`,
    ranAt: new Date().toISOString(),
    total: results.length,
    passed,
    failed,
    coverage,
    status: failed === 0 ? "passed" : "failed",
    results,
  };

  updateStore((store) => {
    store.latestTestRun = run;
  });

  return run;
}

function getLatestTestRun() {
  return readStore().latestTestRun;
}

module.exports = { runTests, getLatestTestRun };