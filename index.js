const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes.js");
const memberRoutes = require("./routes/memberRoutes.js");
const cors = require("cors");

dotenv.config();
const app = express();

// Use CORS to allow all origins
app.use(cors());

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api", memberRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully"); // Log for DB connection
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(error.message));
