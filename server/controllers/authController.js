const User = require("../models/users");
const bcrypt = require("bcryptjs");

module.exports.CreateAccount = async (req, res, next) => {
    try {
        const { email, username, passwordHash, createdAt, reputation, questions, answers, comments } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User account with this email already exists" });
        }
        const user = await User.create({
            email,
            username,
            passwordHash,
            createdAt,
            reputation,
            questions,
            answers,
            comments,
        });
        res.cookie("loggedInUser", user._id, {
            httpOnly: true,
            /* secure: true,*/
        });
        res.status(201).json({
            message: "User signed in successfully",
            success: true,
            user,
        });
        next();
    } catch (error) {
        console.error(error);
    }
};

module.exports.Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.json({ message: "Email is required", success: false });
        }
        if (!password) {
            return res.json({ message: "Password is required", success: false });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "There is no account registered with this email", success: false });
        }
        const auth = await bcrypt.compare(password, user.passwordHash);
        if (!auth) {
            return res.json({ message: "Incorrect password", success: false });
        }

        req.session.loggedInUser = user._id;

        res.cookie("loggedInUser", user._id, {
            httpOnly: true,
            /* secure: true, */
        });
        res.status(201).json({
            message: "User logged in successfully",
            success: true,
        });
        console.log(req.session.loggedInUser);
        next();
    } catch (error) {
        console.error(error);
    }
};

module.exports.Logout = async (req, res) => {
    try {
        res.clearCookie("loggedInUser");
        res.status(201).json({ message: "Logged out successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error during logout", success: false });
    }
};

module.exports.LoggedIn = async (req, res) => {
    try {
        const loggedInUserID = req.cookies.loggedInUser;

        console.log("loggedInUserID:", loggedInUserID);

        if (loggedInUserID) {
            return res.json({ status: true, message: "User is logged in" });
        } else {
            return res.json({ status: false, message: "User is not logged in" });
        }
    } catch (error) {
        console.error(error);
        // res.status(500).json({ message: "Error checking login status" });
        res.status(500).json({ message: error.message });
    }
};
