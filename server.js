const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend calisiyor ✅");
});

app.post("/siparis-geldi", (req, res) => {
  try {
    const order = req.body;

    console.log("Siparis alindi:", order.id);

    fs.writeFileSync(
      `ORDER_${order.id}.txt`,
      JSON.stringify(order, null, 2)
    );

    console.log("Siparis dosyasi olusturuldu");
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
