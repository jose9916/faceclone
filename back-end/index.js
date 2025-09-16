const express = require("express");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const { readdirSync } = require("fs");
const { mongoURL } = require("./keys.js");

const PORT = process.env.PORT || 3000;

const ACCEPTED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
  "https://faceclone-production-3270.up.railway.app",
  "https://triumphant-adaptation-production.up.railway.app",
];

// 🔥 middleware CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 manejar preflight
app.options("*", cors());

// JSON parser
app.use(express.json());

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Conexión a Mongo
mongoose.connect(mongoURL);
mongoose.connection.on("connected", () => {
  console.log("✅ succesfully connected to mongoDB");
});
mongoose.connection.on("error", () => {
  console.log("❌ not connected to mongoDB");
});

// Rutas
readdirSync("./routes").map((r) => app.use("/", require("./routes/" + r)));

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
