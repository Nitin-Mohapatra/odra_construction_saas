const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Ongoing', 'Completed'] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  contractor: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  siteEngineer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  reports: [
    {
      type: Schema.Types.ObjectId,
      ref: "Report"
    }
  ], 
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  }
},
{ timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
