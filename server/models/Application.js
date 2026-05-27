const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  // For manually added applications (not from job portal)
  role: String,
  company: String,
  salary: String,
  status: {
    type: String,
    enum: ['applied', 'interview', 'offer', 'rejected'],
    default: 'applied',
  },
  notes: String,
  interviewDate: Date,
  offerExpiry: Date,
  appliedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

applicationSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

module.exports = mongoose.model('Application', applicationSchema)
