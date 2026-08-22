import { useEffect, useState } from "react";
import { api } from "../api";

export default function Security() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/security/access-log")
      .then(setLogs)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Seguridad</h1>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="panel">
        <h2>Access log</h2>
        {logs.length === 0 ? (
          <p className="muted">Sin eventos</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Resultado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="mono">{log.username}</td>
                  <td>{log.action}</td>
                  <td>
                    <span className={log.success ? "ok" : "bad"}>
                      {log.success ? "OK" : "FAIL"}
                    </span>
                  </td>
                  <td>{new Date(log.at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
