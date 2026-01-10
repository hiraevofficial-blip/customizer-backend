const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend calisiyor ✅");
});

const sharp = require("sharp");

app.post("/siparis-geldi", async (req, res) => {
  try {
    const order = req.body;

    const designProp = order.line_items[0].properties
      ?.find(p => p.name === "Design JSON");

    if (!designProp) {
      console.log("Tasarim bulunamadi");
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

    await sharp(Buffer.from(svg))
      .png({ quality: 100 })
      .toFile(\`ORDER_${order.id}.png\`);

    console.log("PNG olustu:", order.id);
    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server ayakta, port:", PORT);
});
