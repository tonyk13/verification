const { CreateAccount, Login, Logout, LoggedIn } = require("../controllers/authController");
const { userVerification } = require("../authMiddleware");
const router = require("express").Router();

router.post("/createaccount", CreateAccount);
router.post("/login", Login);
router.post("/", userVerification);
router.post("/logout", Logout);
router.get("/loggedIn", LoggedIn);

module.exports = router;
