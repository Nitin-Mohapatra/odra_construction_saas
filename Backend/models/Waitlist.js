const mongoose = require('mongoose');
const { Schema } = mongoose;

const waitlistSchema = new Schema({
    companyName: { type: String, required: true, trim: true },
    ownerName:   { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true, lowercase: true },
    phone:       { type: String, required: true, trim: true },
}, { timestamps: true });

// Prevent duplicate emails
waitlistSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Waitlist', waitlistSchema);
