const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, logAccess } = require("../middleware/auth");

const router = express.Router();

const DEMO_USER = {
  username: "admin",
  password: "vana2026",
  displayName: "Admin VANA",
};

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    const token = jwt.sign(
      { username: DEMO_USER.username, displayName: DEMO_USER.displayName },
      JWT_SECRET,
      { expiresIn: "8h" }
    );
    logAccess(username, "login", true);
    return res.json({
      token,
      user: { username: DEMO_USER.username, displayName: DEMO_USER.displayName },
    });
  }

  logAccess(username || "unknown", "login", false);
  return res.status(401).json({ error: "Credenciales inválidas" });
});

module.exports = router;
