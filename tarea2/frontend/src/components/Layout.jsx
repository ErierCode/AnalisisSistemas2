import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/incidents", label: "Incidentes" },
  { to: "/tests", label: "Tests" },
  { to: "/planning", label: "Planificación" },
  { to: "/security", label: "Seguridad" },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">V</span>
          <div>
            <strong>VANA Ops</strong>
          </div>
        </div>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <p>{user?.displayName || user?.username}</p>
          <button type="button" className="btn ghost" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
