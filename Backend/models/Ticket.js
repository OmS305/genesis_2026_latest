const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  email: {
    type: String
  },
  user_name: {
    type: String
  },
  subject: {
    type: String
  },
  message: {
    type: String
  },
  category: {
    type: String,
    enum: ["null", "Software", "Hardware", "Network", "Access", "Other"],
  },
  priority: {
    type: String,
    enum: ["null","1", "2", "3", "4", "5"],
  },
  status: {
    type: String,
    enum: ["null", "TO DO", "IN PROGRESS", "PENDING", "DONE"],
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ["null", "Email", "WhatsApp", "Chatbot"],
  }
});

module.exports = mongoose.model("Ticket", ticketSchema);
