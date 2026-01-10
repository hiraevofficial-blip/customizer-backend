const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Backend calisiyor");
});

app.listen(process.env.PORT || 3000);
import express from "express";
import fs from "fs";
import { createCanvas } from "canvas";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Baski motoru calisiyor ✅");
});

app.post("/siparis-geldi", (req, res) => {
  try {
    const order = req.body;

    const designProp = order.line_items[0].properties
      ?.find(p => p.name === "Design JSON");

    if (!designProp) {
      console.log("Tasarim yok");
      return res.sendStatus(200);
    }

    const fileName = `ORDER_${order.id}.png`;
    const canvas = createCanvas(2000, 2000);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 2000, 2000);

    ctx.fillStyle = "#000";
    ctx.font = "80px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Kişisel Tasarım", 1000, 1000);

    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync(`./${fileName}`, buffer);

    console.log("Baski dosyasi olustu:", fileName);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
