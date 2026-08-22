const express = require("express");
const { readStore } = require("../store");

const router = express.Router();

router.get("/access-log", (_req, res) => {
  res.json(readStore().accessLog || []);
});

module.exports = router;
