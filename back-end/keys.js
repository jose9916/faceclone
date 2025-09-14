require("dotenv").config();

const mongoURL = `mongodb+srv://josedavidvalenciasanchez:${process.env.MONGODB}@cluster0.pzbxw1u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

module.exports = {
  mongoURL,
};
