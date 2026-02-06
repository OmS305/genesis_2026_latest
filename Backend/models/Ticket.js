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
    enum: ["Software", "Hardware", "Network", "Access", "Other"],
  },
  priority: {
    type: String,
    enum: ["Lowest", "Low", "Medium", "High", "Highest"],
  },
  status: {
    type: String,
    enum: ["TO DO", "IN PROGRESS", "PENDING", "DONE"],
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ["Email", "WhatsApp", "Chatbot"],
  }
});

module.exports = mongoose.model("Ticket", ticketSchema);
