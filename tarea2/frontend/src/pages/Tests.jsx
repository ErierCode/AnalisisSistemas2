import { useEffect, useState } from "react";
import { api } from "../api";

export default function Tests() {
  const [latest, setLatest] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const data = await api("/tests/latest");
    setLatest(data.results ? data : null);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function run() {
    setRunning(true);
    setError("");
    try {
      const result = await api("/tests/run", { method: "POST" });
      setLatest(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Tests</h1>
        <button className="btn primary" type="button" onClick={run} disabled={running}>
          {running ? "Ejecutando…" : "Ejecutar tests"}
        </button>
      </header>

      {error && <p className="error">{error}</p>}

      {!latest && <p className="muted">Sin ejecuciones</p>}

      {latest && (
        <section className="panel">
          <div className="test-summary">
            <div>
              <h2>Última ejecución</h2>
              <p className="muted">{new Date(latest.ranAt).toLocaleString()}</p>
            </div>
            <span className={`badge status-${latest.status === "passed" ? "healthy" : "critical"}`}>
              {latest.status === "passed" ? "PASSED" : "FAILED"}
            </span>
          </div>
          <div className="metrics-grid compact">
            <article className="metric-card">
              <h3>Total</h3>
              <p className="metric-value">{latest.total}</p>
            </article>
            <article className="metric-card">
              <h3>Passed</h3>
              <p className="metric-value">{latest.passed}</p>
            </article>
            <article className="metric-card">
              <h3>Failed</h3>
              <p className="metric-value">{latest.failed}</p>
            </article>
            <article className="metric-card">
              <h3>Cobertura</h3>
              <p className="metric-value">{latest.coverage}%</p>
            </article>
          </div>
          <ul className="test-list">
            {latest.results.map((r) => (
              <li key={r.name}>
                <span className="mono">{r.name}</span>
                <span className={r.status === "passed" ? "ok" : "bad"}>
                  {r.status} · {r.durationMs} ms
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
