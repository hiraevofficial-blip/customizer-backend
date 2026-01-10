const express = require("express");

const app = express();

// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Backend calisiyor ✅");
});

// TEST ENDPOINT
app.post("/test", (req, res) => {
  console.log("✅ /test HIT");
  res.send("OK");
});

// SHOPIFY WEBHOOK (MINIMAL)
app.post("/siparis-geldi", (req, res) => {
  console.log("🔥 WEBHOOK GELDI");

  if (!req.body || Object.keys(req.body).length === 0) {
    console.log("⚠️ BODY BOS");
    return res.sendStatus(200);
  }

  console.log("🧩 BODY KEYS:", Object.keys(req.body));

  if (req.body.line_items) {
    console.log("📦 LINE ITEMS COUNT:", req.body.line_items.length);
  }

  console.log("📝 NOTE ATTRIBUTES:", req.body.note_attributes);

  res.sendStatus(200);
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server ayakta, port:", PORT);
});
