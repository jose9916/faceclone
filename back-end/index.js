const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const { mongoURL } = require("./keys.js");
const { readdirSync } = require("fs");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
mongoose.connect(mongoURL);

const ACCEPTED_ORIGINS = [
  `http://localhost:5173`,
  `https://faceclone-production-6b91.up.railway.app`,
  `http://localhost:3000`,
  `https://faceclone-production-a0c4.up.railway.app`,
  `http://localhost:8080`,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
/* app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); */
app.use(express.json());

app.use(
  fileUpload({
    useTempFiles: true,
  })
);
mongoose.connection.on("error", () => {
  console.log("not connectedconnected to mongoDB");
});

mongoose.connection.on("connected", () => {
  console.log("succesfully connected to mongoDB");
});
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
