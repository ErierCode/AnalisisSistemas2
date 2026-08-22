import { useEffect, useState } from "react";
import { api } from "../api";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("medium");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setIncidents(await api("/incidents"));
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api("/incidents", {
        method: "POST",
        body: JSON.stringify({ title, description, severity }),
      });
      setTitle("");
      setDescription("");
      setSeverity("medium");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Incidentes</h1>
      </header>

      <section className="panel">
        <h2>Reportar incidente</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Título
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              required
            />
          </label>
          <label>
            Severidad
            <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="critical">Crítica</option>
            </select>
          </label>
          <label className="full">
            Descripción
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Descripción"
            />
          </label>
          {error && <p className="error full">{error}</p>}
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Creando…" : "Crear incidente"}
          </button>
        </form>
      </section>

      <section className="panel">
        <h2>Lista de incidentes</h2>
        <div className="stack">
          {incidents.map((inc) => (
            <article key={inc.id} className="incident-card">
              <div className="incident-top">
                <h3>{inc.title}</h3>
                <span className={`badge severity-${inc.severity}`}>{inc.severity}</span>
              </div>
              {inc.description && <p>{inc.description}</p>}
              <div className="bot-box">
                <strong>Causa</strong>
                <p>{inc.suggestedCause}</p>
              </div>
              <p className="muted tiny">{new Date(inc.createdAt).toLocaleString()}</p>
            </article>
          ))}
          {incidents.length === 0 && <p className="muted">Sin incidentes</p>}
        </div>
      </section>
    </div>
  );
}
