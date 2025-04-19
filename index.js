const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes.js");
const memberRoutes = require("./routes/memberRoutes.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://app.clufo.ch",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies and auth headers
  })
);

// 🍪 Cookie parser before routes
app.use(cookieParser());

// 🔧 JSON body parser
app.use(express.json());

// 🛣️ Routes
app.use("/api/auth", authRoutes);
app.use("/api", memberRoutes);

// 🔌 Log important environment values
console.log(
  "MAILGUN_API_KEY:",
  process.env.MAILGUN_API_KEY ? "Loaded" : "Not Loaded"
);
console.log(
  "MAILGUN_DOMAIN:",
  process.env.MAILGUN_DOMAIN ? "Loaded" : "Not Loaded"
);

// 🔗 DB connection + Server start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
  });
