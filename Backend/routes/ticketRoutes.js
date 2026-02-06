const express = require("express");
const Ticket = require("../models/Ticket");
const ProblemSolution = require("../models/ProblemSolution");
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

// GET /api/tickets/analytics - ticket analytics for admin and users
router.get("/tickets/analytics", verifyToken, async (req, res) => {
  try {
    const match = {};

    // For normal users, restrict analytics to their own tickets
    if (req.user.role !== "admin") {
      match.email = req.user.email;
    }

    const pipelineMatch = Object.keys(match).length ? [{ $match: match }] : [];

    const [bySourceAgg, byStatusAgg, byPriorityAgg, totalAgg] = await Promise.all([
      Ticket.aggregate([
        ...pipelineMatch,
        {
          $group: {
            _id: "$source",
            count: { $sum: 1 }
          }
        }
      ]),
      Ticket.aggregate([
        ...pipelineMatch,
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),
      Ticket.aggregate([
        ...pipelineMatch,
        {
          $group: {
            _id: "$priority",
            count: { $sum: 1 }
          }
        }
      ]),
      Ticket.aggregate([
        ...pipelineMatch,
        {
          $count: "total"
        }
      ])
    ]);

    const bySource = bySourceAgg
      .filter((item) => item._id)
      .map((item) => ({
        source: item._id,
        count: item.count
      }));

    const byStatus = byStatusAgg
      .filter((item) => item._id)
      .map((item) => ({
        status: item._id,
        count: item.count
      }));

    const byPriority = byPriorityAgg
      .filter((item) => item._id)
      .map((item) => ({
        priority: item._id,
        count: item.count
      }));

    const totalTickets = totalAgg[0]?.total || 0;

    res.status(200).json({
      success: true,
      analytics: {
        totalTickets,
        bySource,
        byStatus,
        byPriority
      }
    });
  } catch (error) {
    console.error("Error fetching ticket analytics:", error);
    res.status(500).json({ error: "Server error fetching ticket analytics" });
  }
});

// GET /api/tickets/frequent-problems - table of most frequent problems by subject
router.get("/tickets/frequent-problems", verifyToken, async (req, res) => {
  try {
    // Aggregate across all tickets to identify global frequent problems
    const problemsAgg = await Ticket.aggregate([
      {
        $group: {
          _id: "$subject",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const subjects = problemsAgg.map((p) => p._id).filter(Boolean);

    const solutions = await ProblemSolution.find({
      subject: { $in: subjects }
    }).lean();

    const solutionMap = new Map();
    solutions.forEach((s) => {
      solutionMap.set(s.subject, s.solution || "");
    });

    const problems = problemsAgg
      .filter((p) => p._id)
      .map((p) => ({
        subject: p._id,
        count: p.count,
        solution: solutionMap.get(p._id) || ""
      }));

    res.status(200).json({
      success: true,
      problems
    });
  } catch (error) {
    console.error("Error fetching frequent problems:", error);
    res.status(500).json({ error: "Server error fetching frequent problems" });
  }
});

// PUT /api/tickets/problems/solution - admin-only update/create solution for a subject
router.put("/tickets/problems/solution", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can update solutions" });
    }

    const { subject, solution } = req.body;

    if (!subject) {
      return res.status(400).json({ error: "Subject is required" });
    }

    const updated = await ProblemSolution.findOneAndUpdate(
      { subject },
      { solution: solution || "" },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      success: true,
      problem: {
        subject: updated.subject,
        solution: updated.solution
      }
    });
  } catch (error) {
    console.error("Error updating problem solution:", error);
    res.status(500).json({ error: "Server error updating problem solution" });
  }
});

module.exports = router;
