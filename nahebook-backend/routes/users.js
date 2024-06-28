var express = require("express");
var router = express.Router();

const user_controller = require("../controllers/UserController");

router.post("/signin", user_controller.signin);

router.post("/signup", user_controller.signup);

module.exports = router;
