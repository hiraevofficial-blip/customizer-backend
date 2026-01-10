const express = require("express");
const sharp = require("sharp");
const fs = require("fs");

const app = express();
app.use(express.json({
  limit: "20mb",
  type: "*/*"
}));


// Test endpoint
app.get("/", (req, res) => {
  res.send("Backend calisiyor ✅");
});

// Shopify Order Webhook
app.post("/siparis-geldi", async (req, res) => {
  console.log("🔥 /siparis-geldi HIT");
  console.log("BODY KEYS:", Object.keys(req.body || {}));

console.log("🧾 LINE ITEMS COUNT:", order.line_items.length);

order.line_items.forEach((item, index) => {
  console.log(`--- LINE ITEM ${index} ---`);
  console.log("keys:", Object.keys(item));
  console.log("properties:", item.properties);
});

console.log("📝 note_attributes:", order.note_attributes);

    console.log(JSON.stringify(req.body, null, 2));

    const order = req.body;

    if (!order.line_items || order.line_items.length === 0) {
      console.log("❌ Line item yok");
      return res.sendStatus(200);
    }
console.log("🧩 LINE ITEM PROPERTIES:");
console.log(
  JSON.stringify(order.line_items[0].properties, null, 2)
);

    const designProp = order.line_items[0].properties?.find(
      (p) => p.name === "Design JSON"
    );

    if (!designProp) {
      console.log("⚠️ Design JSON bulunamadi");
      return res.sendStatus(200);
    }

    const design = JSON.parse(designProp.value);

    const svg = `
      <svg width="3000" height="3000" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        <text
          x="1500"
          y="2700"
          font-size="140"
          text-anchor="middle"
          font-family="Arial"
          fill="black">
          ${design.text || ""}
        </text>
      </svg>
    `;

    const outputPath = `ORDER_${order.id}.png`;

    await sharp(Buffer.from(svg))
      .png({ quality: 100 })
      .toFile(outputPath);

    console.log("🖼️ PNG olustu:", outputPath);

    res.sendStatus(200);
  } catch (err) {
    console.error("🔥 HATA:", err);
    res.sendStatus(500);
  }
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server ayakta, port:", PORT);
});
