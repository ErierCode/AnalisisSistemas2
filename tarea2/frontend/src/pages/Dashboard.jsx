import { useEffect, useState } from "react";
import { api } from "../api";

function statusLabel(status) {
  if (status === "healthy") return "Saludable";
  if (status === "degraded") return "Degradado";
  if (status === "critical") return "Crítico";
  return status;
}

function formatBytes(n) {
  if (!n) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  return `${v.toFixed(1)} ${units[i]}`;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setData(await api("/metrics"));
    } catch (err) {
      setError(err.message);
      setData(null);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Monitoreo</h1>
        {data && <span className={`badge status-${data.status}`}>{statusLabel(data.status)}</span>}
      </header>

      <section className="panel links-row">
        <a className="btn primary" href="http://localhost:3000/d/vana-ops/vana-ops-console" target="_blank" rel="noreferrer">
          Abrir Grafana
        </a>
        <a className="btn" href="http://localhost:9090/targets" target="_blank" rel="noreferrer">
          Prometheus targets
        </a>
        <a className="btn" href="http://localhost:4000/metrics" target="_blank" rel="noreferrer">
          Ver /metrics
        </a>
      </section>

      {error && <p className="error">{error}</p>}

      {data && (
        <>
          <section className="metrics-grid">
            <article className="metric-card">
              <h3>Request rate</h3>
              <p className="metric-value">{data.current.requestRatePerSec}/s</p>
            </article>
            <article className="metric-card">
              <h3>Latencia avg</h3>
              <p className="metric-value">{data.current.avgLatencyMs} ms</p>
            </article>
            <article className="metric-card">
              <h3>Memoria RSS</h3>
              <p className="metric-value">{formatBytes(data.current.memoryBytes)}</p>
            </article>
            <article className="metric-card">
              <h3>Incidentes (counter)</h3>
              <p className="metric-value">{data.current.incidentsTotal}</p>
            </article>
          </section>

          <section className="panel">
            <h2>Últimos 15 min</h2>
            <div className="chart-row">
              <div>
                <h4>Requests / s</h4>
                <MiniBars
                  points={data.series.requestRate}
                  getValue={(p) => p.value}
                />
              </div>
              <div>
                <h4>Latencia ms</h4>
                <MiniBars
                  points={data.series.latencyMs}
                  getValue={(p) => p.value}
                  variant="latency"
                />
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Grafana</h2>
            <iframe
              className="grafana-frame"
              title="Grafana VANA Ops"
              src={`${data.grafanaUrl}/d/vana-ops/vana-ops-console?orgId=1&kiosk&theme=dark`}
            />
          </section>
        </>
      )}
    </div>
  );
}

function MiniBars({ points, getValue, variant }) {
  if (!points?.length) {
    return <p className="muted">Sin datos</p>;
  }
  const values = points.map(getValue);
  const max = Math.max(...values, 0.0001);
  return (
    <div className="bars">
      {points.map((point) => (
        <div
          key={point.at}
          className={`bar ${variant || ""}`}
          style={{ height: `${(getValue(point) / max) * 100}%` }}
          title={`${getValue(point).toFixed?.(3) ?? getValue(point)} @ ${point.at}`}
        />
      ))}
    </div>
  );
}
