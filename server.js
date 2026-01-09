import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Baski motoru calisiyor ✅");
});

app.post("/siparis-geldi", (req, res) => {
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
