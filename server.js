const express = require("express");
const sharp = require("sharp");

const app = express();
app.use(express.json());

/**
 * Sağlık kontrolü
 */
app.get("/", (req, res) => {
  res.send("Backend calisiyor ✅");
});

/**
 * Shopify sipariş webhook'u
 * SVG -> PNG (300 DPI baskı)
 */
app.post("/siparis-geldi", async (req, res) => {
  try {
    const order = req.body;

    // Güvenli line item kontrolü
    const item = order?.line_items?.[0];
    if (!item || !item.properties) {
      console.log("Line item veya properties yok");
      return res.sendStatus(200);
    }

    // Kişiselleştirme datası
    const designProp = item.properties.find(
      p => p.name === "Design JSON"
    );

    if (!designProp) {
      console.log("Tasarim bulunamadi");
      return res.sendStatus(200);
    }

    const design = JSON.parse(designProp.value);

    // SVG (3000x3000 px = 300 DPI)
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

    // PNG üretimi
    await sharp(Buffer.from(svg))
      .png({ quality: 100 })
      .toFile(`ORDER_${order.id}.png`);

    console.log("PNG olustu:", order.id);
    res.sendStatus(200);

  } catch (error) {
    console.error("Hata:", error);
    res.sendStatus(500);
  }
});

/**
 * Server başlat
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server ayakta, port:", PORT);
});
