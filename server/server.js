// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = 8000;
const answersRoutes = require("./routes/answersRoutes");
const tagsRoutes = require("./routes/tagsRoutes");
const questionsRoutes = require("./routes/questionsRoutes");
const authRoutes = require("./routes/authRoutes");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        allowedHeaders: [
            "set-cookie",
            "Content-Type",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
        ],
    })
);
app.use(express.json());
app.use(cookieParser());

// Command line arguments
const args = process.argv.slice(2);

// Check if the secret key argument is provided
const secretKeyIndex = args.indexOf("--secretKey");
const secretKey = secretKeyIndex !== -1 ? args[secretKeyIndex + 1] : "default_secret_key";

app.use(
    cookieSession({
        name: "session",
        keys: secretKey,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
    })
);

const mongoDB = "mongodb://127.0.0.1:27017/fake_so";
mongoose.connect(mongoDB);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Command to start server: "node server.js --secretKey your_actual_secret_key" -> add this to the readme

// Routes
app.use("/api", answersRoutes);
app.use("/api", tagsRoutes);
app.use("/api", questionsRoutes);
app.use("/api", authRoutes);

// When the server is terminated using CTRL + C, disconnect the database
process.on("SIGINT", () => {
    db.close(() => {
        server.close(() => {
            console.log("Server closed. Database instance disconnected");
            process.exit(0);
        });
    });
});

// Start server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
