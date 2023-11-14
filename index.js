require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT;
const url = process.env.MONGO_URL;
const httpStatusText = require("./utils/httpStatusText");
const coursesRouters = require("./Routes/courses.route");
const usersRouters = require("./Routes/users.route.js");
const mongoose = require("mongoose");

mongoose
   .connect(url)
   .then(() => {
      console.log("connected successfully");
   })
   .catch((err) => {
      console.log("error connecting", err);
   });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// middleware to handle CORS policy errors
app.use(cors());

// to add it for only one route ==> app.get("route path", cors())

// middleware to handle request body of JSON data
app.use(express.json());

// middleware to handle the request of the specifiec routes

app.use("/api/courses", coursesRouters);
app.use("/api/users", usersRouters);

//global middleware to handle all routes wich not available

app.all("*", (req, res, next) => {
   return res.status(404).json({
      status: "Error",
      data: null,
      message: "the Route not available",
   });
});

// global error handler
app.use((error, req, res, next) => {
   res.status(error.statusCode || 500).json({
      status: error.statusText || httpStatusText.ERROR,
      message: error.message,
      code: error.statusCode || 500,
      data: null,
   });
});

app.listen(port, () => {
   console.log("Listening on the Port ");
});
