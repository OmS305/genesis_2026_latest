const mongoose = require("mongoose");

const problemSolutionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  solution: {
    type: String,
    default: ""
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

problemSolutionSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("ProblemSolution", problemSolutionSchema);


