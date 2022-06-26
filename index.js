const express = require("express");
const app = express();

const authRoute = require("./routes/auth");

app.use("/api/authentication", authRoute);

app.listen(3000, () => console.log("Authentication server is running."));
