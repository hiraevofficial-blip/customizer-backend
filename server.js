const express = require("express");
const sharp = require("sharp");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.send("Backend calisiyor ✅");
});

// Shopify Order Webhook
app.post("/siparis-geldi", async (req, res) => {
  try {
    console.log("🔥 SIPARIS GELDI");

    const order = req.body;
    let designData = null;

    // 1️⃣ NOTE ATTRIBUTES'TEN OKU (ÖNCELİKLİ)
    if (order.note_attributes && Array.isArray(order.note_attributes)) {
      const found = order.note_attributes.find(n =>
        n.name?.toLowerCase().includes("custom")
      );
      if (found) {
        console.log("📝 Design note_attributes'ten alindi");
        designData = found.value;
      }
    }

    // 2️⃣ LINE ITEM PROPERTIES'TEN OKU (YEDEK)
    if (!designData && order.line_items) {
      for (const item of order.line_items) {
        if (Array.isArray(item.properties)) {
          const found = item.properties.find(p =>
            p.name?.toLowerCase().includes("custom")
          );
          if (found) {
            console.log("📦 Design line_items.properties'ten alindi");
            designData = found.value;
            break;
          }
        }
      }
    }

    // ❌ Design yoksa çık
    if (!designData) {
      console.log("⚠️ Design datası bulunamadi");
      return res.sendStatus(200);
    }

    // JSON parse dene
    let design;
    try {
      design = JSON.parse(designData);
    } catch {
      design = { text: designData };
    }

    // SVG OLUŞTUR
    const svg = `
      <svg width="3000" height="3000" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        <text
          x="1500"
          y="1500"
          font-size="160"
          text-anchor="middle"
          font-family="Arial"
          fill="black">
          ${design.text || "CUSTOM DESIGN"}
        </text>
      </svg>
    `;

    const output = `ORDER_${order.id}.png`;

    await sharp(Buffer.from(svg))
      .png({ quality: 100 })
      .toFile(output);

    console.log("🖼️ PNG OLUSTU:", output);

    res.sendStatus(200);

  } catch (err) {
    console.error("🔥 HATA:", err);
    res.sendStatus(500);
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server ayakta, port:", PORT);
});
