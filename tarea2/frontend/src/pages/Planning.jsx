import { useEffect, useState } from "react";
import { api } from "../api";

const COLUMNS = [
  { id: "todo", label: "To Do" },
  { id: "doing", label: "Doing" },
  { id: "done", label: "Done" },
];

export default function Planning() {
  const [issues, setIssues] = useState([]);
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setError("");
    const jiraStatus = await api("/jira/status").catch((err) => ({
      ok: false,
      error: err.message,
    }));
    setStatus(jiraStatus);
    if (!jiraStatus.ok) {
      setIssues([]);
      return;
    }
    try {
      const list = await api("/jira/issues");
      setIssues(Array.isArray(list) ? list : []);
    } catch (err) {
      setIssues([]);
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addIssue(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api("/jira/issues", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      setTitle("");
      setDescription("");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function moveIssue(key, nextStatus) {
    setError("");
    try {
      await api(`/jira/issues/${key}/transition`, {
        method: "POST",
        body: JSON.stringify({ status: nextStatus }),
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Planificación</h1>
        </div>
        <div className="links-row">
          <button type="button" className="btn" onClick={load}>
            Actualizar
          </button>
          {status?.baseUrl && (
            <a
              className="btn primary"
              href={`${status.baseUrl}/jira/software/projects/${status.projectKey}/boards/1/backlog`}
              target="_blank"
              rel="noreferrer"
            >
              Abrir Jira
            </a>
          )}
        </div>
      </header>

      {status && !status.ok && (
        <section className="panel">
          <p className="error">{status.error}</p>
        </section>
      )}

      {status?.ok && (
        <>
          <form className="panel form-grid" onSubmit={addIssue}>
            <label>
              Resumen (Jira)
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título"
                required
              />
            </label>
            <label className="full">
              Descripción
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </label>
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Creando…" : "Crear"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          <div className="kanban">
            {COLUMNS.map((col) => (
              <section key={col.id} className="kanban-col">
                <h2>
                  {col.label}{" "}
                  <span className="muted tiny">
                    ({issues.filter((i) => i.status === col.id).length})
                  </span>
                </h2>
                <div className="stack">
                  {issues
                    .filter((i) => i.status === col.id)
                    .map((issue) => (
                      <article key={issue.key} className="task-card">
                        <a href={issue.url} target="_blank" rel="noreferrer" className="mono">
                          {issue.key}
                        </a>
                        <p>{issue.title}</p>
                        <p className="muted tiny">{issue.statusName}</p>
                        <div className="task-actions">
                          {COLUMNS.filter((c) => c.id !== issue.status).map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              className="btn ghost tiny-btn"
                              onClick={() => moveIssue(issue.key, c.id)}
                            >
                              → {c.label}
                            </button>
                          ))}
                        </div>
                      </article>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
