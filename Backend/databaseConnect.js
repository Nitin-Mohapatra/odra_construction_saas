const mongoose = require('mongoose');

// Note: dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']) is called in index.js
// BEFORE this module is loaded, so all DNS lookups (incl. replica set members) use Google/Cloudflare DNS.

const connectionString = "mongodb+srv://nitin:1730804_26@cluster0.oslwrzq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDb = () => {
    mongoose.connect(connectionString, {
        serverSelectionTimeoutMS: 30000, // 30s to find/elect a primary
        socketTimeoutMS: 45000,          // 45s socket idle timeout
        connectTimeoutMS: 15000,         // 15s to establish connection
        heartbeatFrequencyMS: 10000,     // check server health every 10s
        retryWrites: true,
        retryReads: true,
        maxPoolSize: 10,
        minPoolSize: 2,
        family: 4,                       // force IPv4 — avoids ENOTFOUND on replica set members
    }).catch((err) => {
        console.error("Initial DB connection failed:", err.message);
    });

    const db = mongoose.connection;

    db.on("error", (err) => {
        console.error("Database connection error:", err.message);
    });

    db.once("open", () => {
        console.log("Connected succefully with db");
    });

    db.on("disconnected", () => {
        console.warn("MongoDB disconnected. Mongoose will auto-retry...");
    });

    db.on("reconnected", () => {
        console.log("MongoDB reconnected successfully.");
    });
};

// Prevent unhandled MongoDB promise rejections from crashing the server
process.on("unhandledRejection", (reason) => {
    if (reason && reason.name && reason.name.includes("Mongo")) {
        console.error("Unhandled MongoDB rejection (non-fatal):", reason.message);
    } else {
        throw reason;
    }
});

module.exports = connectDb;
