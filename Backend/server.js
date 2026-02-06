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
    console.log("📥 Incoming data:", req.body);

    const newTicket = new Ticket({
      email: req.body.email,
      user_name: req.body.user_name,
      subject: req.body.subject,
      message: req.body.message,
      category: req.body.category,
      priority: req.body.priority,
      status: req.body.status,
      source: req.body.source
    });

    const savedTicket = await newTicket.save();

    console.log("✅ Saved to Mongo:", savedTicket);

    // 🔥 SEND JSON BACK TO N8N
    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket: {
        id: savedTicket._id,
        email: savedTicket.email,
        user_name: savedTicket.user_name,
        subject: savedTicket.subject,
        category: savedTicket.category,
        priority: savedTicket.priority,
        status: savedTicket.status,
        source: savedTicket.source,
        createdAt: savedTicket.createdAt
      }
    });

  } catch (e) {
    console.log("❌ Mongo insert error:", e.message);

    res.status(500).json({
      success: false,
      message: "Ticket creation failed",
      error: e.message
    });
  }
});

// 🔵 Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
