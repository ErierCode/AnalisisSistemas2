# VANA Ops Console

Software Backend + Frontend de **VANA** (taller 2) con herramientas **reales**:

- **Prometheus** + **Grafana** (monitoreo)
- **Jira Software** (planificación)
- Bot de diagnóstico, tests y seguridad JWT (características del taller)

## Requisitos

- Node.js 18+
- Docker Desktop (con suficiente RAM; Jira pide ~3–4 GB)

## 1. Variables de entorno

```bash
copy .env.example .env
```

## 2. Levantar Prometheus + Grafana (+ Jira)

Solo monitoreo (recomendado primero):

```bash
docker compose up -d prometheus grafana
```

Con Jira (pesado; primera vez tarda varios minutos):

```bash
docker compose up -d
```

| Servicio    | URL                         | Credenciales        |
|-------------|-----------------------------|---------------------|
| Prometheus  | http://localhost:9090       | —                   |
| Grafana     | http://localhost:3000       | `admin` / `vana2026`|
| Jira        | http://localhost:8080       | las del wizard      |

### Setup de Jira

**Opción A — Jira Cloud (si ya tienes cuenta, recomendado):**

1. Crea un API token en https://id.atlassian.com/manage-profile/security/api-tokens
2. En `.env` pon:
   - `JIRA_BASE_URL=https://tu-sitio.atlassian.net`
   - `JIRA_USER=tu-email@ejemplo.com`
   - `JIRA_PASSWORD=` el API token (no la contraseña de Jira)
   - `JIRA_PROJECT_KEY=` la clave de tu proyecto (ej. `VANA`)
3. Reinicia el backend.

**Opción B — Jira local Docker:**

1. `docker compose up -d postgres-jira jira` y espera a `http://localhost:8080`.
2. Completa el wizard (licencia de evaluación).
3. Crea proyecto con clave `VANA` y ajusta `.env` si hace falta.

## 3. Backend y Frontend

```bash
cd backend
npm install
npm start
```

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173  
- Login app: `admin` / `vana2026`  
- Métricas scrape: http://localhost:4000/metrics  

Prometheus scrapea el backend vía `host.docker.internal:4000`. El backend debe estar corriendo para que Grafana muestre datos.

## Qué es real vs qué es de la app

| Pieza | Real |
|-------|------|
| Dashboard /metrics | **Prometheus** (consulta HTTP API) + iframe **Grafana** |
| Planificación | **Jira** REST API (crear issues + transiciones) |
| Incidentes + bot | Lógica de la app VANA (taller 2) |
| Tests | Suite simulada de la app (automatización del taller) |
| Seguridad | JWT + access log de la app |

## Guion corto para el video

1. **Jira**: abre Planificación → muestra issues reales → abre Jira en :8080 (nivel 1 del taller).
2. **Prometheus + Grafana**: abre Dashboard → `/metrics` → Prometheus targets → Grafana dashboard `VANA Ops Console` (área a reforzar, nivel 3).
3. **Automatización**: crea un incidente (bot de causa) y ejecuta tests; comenta que alimentan contadores en Prometheus (`vana_incidents_total`, `vana_test_runs_total`).

## Estructura

```
backend/                 Express + prom-client + cliente Jira
frontend/                Vite + React
monitoring/prometheus/   prometheus.yml
monitoring/grafana/      provisioning + dashboard
docker-compose.yml       Prometheus, Grafana, Postgres, Jira
```
