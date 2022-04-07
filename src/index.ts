import { config } from "dotenv";
import express, { json, urlencoded } from "express";
import errorHandler from "./middleware/errorMiddleware";
import "./bot";

// load env variables
config();
const PORT = process.env.PORT || 8080;
const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));

// routes
app.use("/api/users", require("./routes/userRoute"));
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
