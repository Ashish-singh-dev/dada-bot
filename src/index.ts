import "./bot";
import express from "express";

const app = express();

const port = process.env.PORT || 8080;

app.get("/", (_req, res) => {
  res.send("Bot is running.");
});

app.listen(port, () => {
  console.log("server started");
});
