const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const app = express();
const gameRoutes = require("./Routes/gameRoutes");
require("dotenv").config();
require("./Models/db");

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use("/auth", AuthRouter);

app.use("/api/game", gameRoutes);

app.listen(PORT, () => {
  console.log("Server Connected");
});
