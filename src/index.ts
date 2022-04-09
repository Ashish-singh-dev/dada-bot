import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import errorHandler from "./middleware/errorMiddleware";
import { client } from "./bot";
import cors from "cors";

// load env variables
config();

client.once("ready", () => {
  console.log("🤖 Discord bot ready!");
});

const PORT = process.env.PORT || 8080;
const app = express();

const whitelist = ["https://dada-bot.vercel.app", "http://localhost:3000"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin!) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by cors"));
      }
    },
  })
);
app.use(json());
app.use(urlencoded({ extended: false }));

// routes
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/thread", require("./routes/discordThreadRoute"));
app.get("/", (_req, res) => {
  res.status(200).json({
    message: "server running.",
  });
});

// error handler
app.use(errorHandler);
// start server
app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
