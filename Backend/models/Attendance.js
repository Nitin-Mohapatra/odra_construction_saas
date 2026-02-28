const mongoose = require("mongoose");
const {Schema} = mongoose;

const attendanceSchema = new Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    date:{
        type:String,
        required:true
    },
    markedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    records:[
        {
            workerId:{type:mongoose.Schema.Types.ObjectId,ref:"Worker"},
            status:{
                type:String,
                enum:["absent","present"],
                default:"absent"
            }
        }
    ]
})
attendanceSchema.index({ projectId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance",attendanceSchema);