const mongoose = require('mongoose');
const connectionString = "mongodb+srv://nitin:1730804_26@cluster0.oslwrzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDb = () => {
    mongoose.connect(connectionString, { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on("error", () => {
        console.log("An error occured");
    })
    db.once("open", () => {
        console.log("Connected succefully with db");
    })
}

module.exports = connectDb;