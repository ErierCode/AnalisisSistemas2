const jwt = require("jsonwebtoken");
const { updateStore } = require("../store");

const JWT_SECRET = process.env.JWT_SECRET || "vana-ops-demo-secret";

function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Token requerido" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

function logAccess(username, action, success) {
  updateStore((store) => {
    store.accessLog.unshift({
      id: `log-${Date.now()}`,
      username,
      action,
      success,
      at: new Date().toISOString(),
      ip: "local",
    });
    store.accessLog = store.accessLog.slice(0, 50);
  });
}

module.exports = { authRequired, logAccess, JWT_SECRET };