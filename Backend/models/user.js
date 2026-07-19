const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },

    assignedProjects: [
        { type: Schema.Types.ObjectId, ref: "Project" }
    ],

    createdProjects: [
        { type: Schema.Types.ObjectId, ref: "Project" }
    ],
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
    }, totalProjects: {
        type: Number,
        default: 0
    },
    fcmToken: {
        type: String,
        default: null
    }

},
    { timestamps: true });

module.exports = mongoose.model("User", userSchema);
