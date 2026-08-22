const PROMETHEUS_URL = process.env.PROMETHEUS_URL || "http://localhost:9090";

async function queryPrometheus(promQl) {
  const url = `${PROMETHEUS_URL}/api/v1/query?query=${encodeURIComponent(promQl)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Prometheus respondió ${res.status}`);
  }
  const body = await res.json();
  if (body.status !== "success") {
    throw new Error(body.error || "Consulta Prometheus fallida");
  }
  return body.data;
}

async function queryRange(promQl, minutes = 15) {
  const end = Math.floor(Date.now() / 1000);
  const start = end - minutes * 60;
  const url =
    `${PROMETHEUS_URL}/api/v1/query_range?query=${encodeURIComponent(promQl)}` +
    `&start=${start}&end=${end}&step=30`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Prometheus range respondió ${res.status}`);
  }
  const body = await res.json();
  if (body.status !== "success") {
    throw new Error(body.error || "Consulta range fallida");
  }
  return body.data;
}

function firstValue(data) {
  const result = data?.result?.[0];
  if (!result) return 0;
  const v = result.value?.[1] ?? result.values?.at(-1)?.[1];
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

async function safeQuery(fn, fallback) {
  try {
    return await fn();
  } catch (err) {
    console.warn("Prometheus query failed:", err.message);
    return fallback;
  }
}

async function getOpsSnapshot() {
  const emptyRange = { result: [] };
  const [
    requestRate,
    latency,
    memory,
    incidents,
    testRuns,
    requestRateRange,
    latencyRange,
  ] = await Promise.all([
    safeQuery(() => queryPrometheus("sum(rate(vana_http_requests_total[1m]))"), { result: [] }),
    safeQuery(
      () =>
        queryPrometheus(
          "sum(rate(vana_http_request_duration_seconds_sum[1m])) / clamp_min(sum(rate(vana_http_request_duration_seconds_count[1m])), 0.0001)"
        ),
      { result: [] }
    ),
    safeQuery(
      () => queryPrometheus('vana_process_resident_memory_bytes{job="vana-ops-backend"}'),
      { result: [] }
    ),
    safeQuery(() => queryPrometheus("vana_incidents_total"), { result: [] }),
    safeQuery(() => queryPrometheus("sum(vana_test_runs_total)"), { result: [] }),
    safeQuery(() => queryRange("sum(rate(vana_http_requests_total[1m]))", 15), emptyRange),
    safeQuery(
      () =>
        queryRange(
          "sum(rate(vana_http_request_duration_seconds_sum[1m])) / clamp_min(sum(rate(vana_http_request_duration_seconds_count[1m])), 0.0001)",
          15
        ),
      emptyRange
    ),
  ]);

  const rate = firstValue(requestRate);
  const lat = firstValue(latency);
  const mem = firstValue(memory);

  let status = "healthy";
  if (lat > 0.5 || rate > 20) status = "degraded";
  if (lat > 1.5) status = "critical";

  return {
    source: "prometheus",
    prometheusUrl: PROMETHEUS_URL,
    grafanaUrl: process.env.GRAFANA_URL || "http://localhost:3000",
    grafanaDashboardUrl:
      process.env.GRAFANA_DASHBOARD_URL ||
      "http://localhost:3000/d/vana-ops/vana-ops-console",
    status,
    current: {
      requestRatePerSec: Number(rate.toFixed(3)),
      avgLatencyMs: Number((lat * 1000).toFixed(1)),
      memoryBytes: Math.round(mem),
      incidentsTotal: firstValue(incidents) ?? 0,
      testRunsTotal: firstValue(testRuns) ?? 0,
      at: new Date().toISOString(),
    },
    series: {
      requestRate: (requestRateRange.result?.[0]?.values || []).map(([t, v]) => ({
        at: new Date(t * 1000).toISOString(),
        value: Number(v),
      })),
      latencyMs: (latencyRange.result?.[0]?.values || []).map(([t, v]) => ({
        at: new Date(t * 1000).toISOString(),
        value: Number(v) * 1000,
      })),
    },
  };
}

module.exports = { getOpsSnapshot, queryPrometheus };
