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
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:8080",
  "https://faceclone-production-b0ec.up.railway.app", // backend
  "https://earnest-healing-production-bb56.up.railway.app", // frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || ACCEPTED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // <--- añade esto si usas cookies/sesiones
  })
);

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

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
