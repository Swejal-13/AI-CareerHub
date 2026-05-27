const mongoose = require('mongoose')

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true },
  originalText: String,
  atsScore: { type: Number, min: 0, max: 100 },
  skills: { technical: [String], soft: [String] },
  sections: {
    skills: { score: Number, found: Number },
    experience: { score: Number, years: Number },
    keywords: { score: Number, matched: Number, total: Number },
    format: { score: Number, issues: Number },
  },
  suggestions: [String],
  active: { type: Boolean, default: false },
  fileSize: String,
  uploadedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Resume', resumeSchema)
