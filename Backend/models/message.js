const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    message: {
        type: [
            {
                msg: {type:String,required:true},
                createdDate: { type: Date, default: Date.now }
            }
        ],
        required: true,
    },
    email: {
        type: String,
        require: true,
    }
})

module.exports = mongoose.model ("ConMessage" , messageSchema);