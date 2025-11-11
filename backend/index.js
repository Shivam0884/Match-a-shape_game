const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // ✅ only once
const AuthRouter = require("./Routes/AuthRouter");
const gameRoutes = require("./Routes/gameRoutes");
require("dotenv").config();
require("./Models/db");

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ configure cors only once
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use("/auth", AuthRouter);
app.use("/api/game", gameRoutes);

app.listen(PORT, () => {
  console.log("Server Connected");
});
