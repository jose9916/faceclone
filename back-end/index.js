const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const { mongoURL } = require("./keys.js");
const { readdirSync } = require("fs");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
mongoose.connect(mongoURL);

app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        `http://localhost:5173`,
        `https://faceclone-production-3270.up.railway.app`,
        `http://localhost:3000`,
        `https://triumphant-adaptation-production.up.railway.app`,
      ];
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      if (!origin) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
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
