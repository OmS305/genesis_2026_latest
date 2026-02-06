const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  email: {
    type: String
  },
  subject: {
    type: String
  },
  message: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Ticket", ticketSchema);
