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
  res.sendStatus(200);
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server ayakta, port:", PORT);
});
