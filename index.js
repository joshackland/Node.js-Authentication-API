const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

//Import Routes
const authRoute = require("./routes/auth");

dotenv.config();

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, () =>
  console.log("Connected to MongoDB")
);

//Middleware
app.use(express.json());

//Route Middleware
app.use("/api/authentication", authRoute);

app.listen(3000, () => console.log("Authentication server is running."));
