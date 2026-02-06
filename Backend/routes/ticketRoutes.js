const express = require("express");
const Ticket = require("../models/Ticket");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/tickets - Protected route with role-based access
router.get("/tickets", verifyToken, async (req, res) => {
  try {
    let tickets;

    // Check user role
    if (req.user.role === "admin") {
      // Admin: return all tickets
      tickets = await Ticket.find().sort({ createdAt: -1 });
    } else {
      // Normal user: return only tickets matching their email
      tickets = await Ticket.find({ email: req.user.email }).sort({ createdAt: -1 });
    }

    res.status(200).json({
      success: true,
      tickets
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: "Server error fetching tickets" });
  }
});

module.exports = router;
