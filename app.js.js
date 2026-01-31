const express = require("express");
const sharp = require("sharp");

const app = express();
app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.send("Backend çalışıyor ✅");
});

app.post("/siparis-geldi", async (req, res) => {
  try {
    console.log("🟢 SIPARIS GELDI");

    const order = req.body;

    console.log("📦 Order ID:", order.id);
    console.log("📦 Line items:", order.line_items);

    if (!order.line_items || order.line_items.length === 0) {
      console.log("❌ line_items yok");
      return res.sendStatus(200);
    }

    const props = order.line_items[0].properties;
    console.log("🎯 Properties:", props);

    if (!props) {
      console.log("❌ properties yok");
      return res.sendStatus(200);
    }

    const designProp = props.find(p => p.name === "Design JSON");

    if (!designProp) {
      console.log("❌ Design JSON bulunamadı");
      return res.sendStatus(200);
    }

    const design = JSON.parse(designProp.value);
    console.log("🎨 Design:", design);

    const svg = `
      <svg width="3000" height="3000" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        <text x="1500" y="1500" font-size="150" text-anchor="middle" font-family="Arial" fill="black">
          ${design.text || ""}
        </text>
      </svg>
    `;

    const outputPath = `ORDER_${order.id}.png`;

    await sharp(Buffer.from(svg)).png().toFile(outputPath);

    console.log("🖼️ PNG oluştu:", outputPath);

    res.sendStatus(200);
  } catch (err) {
    console.error("🔥 HATA:", err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server ayakta:", PORT);
});
