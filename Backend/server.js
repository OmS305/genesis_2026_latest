const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Import models
const Ticket = require("./models/Ticket");
const User = require("./models/User");

// Import routes
const authRoutes = require("./routes/authRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();
app.use(express.json());
app.use(cors()); // allow requests from frontend

const MONGO_URI=process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Atlas connected successfully");
})
.catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api", ticketRoutes);

// 🔵 Test route
app.get("/", (req, res) => {
  res.send("Server running and Mongo connected");
});

// 🔵 Add ticket route
app.post("/addTicket", async (req, res) => {
  try {
    console.log("Incoming data:", req.body); // debug

    const t = await Ticket.create(req.body);

    console.log("Saved to Mongo:", t);

    res.json({
      success: true,
      message: "Ticket stored successfully",
      data: t
    });

  } catch (e) {
    console.log("❌ Error inserting:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// 🔵 Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
