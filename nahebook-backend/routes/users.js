const express = require("express");
const router = express.Router();
const passport = require("passport");

const user_controller = require("../controllers/UserController");

router.post("/signin", user_controller.signin);

router.post("/signup", user_controller.signup);

router.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  user_controller.get_user_list,
);

router.get(
  "/profile/:userId",
  passport.authenticate("jwt", { session: false }),
  user_controller.get_profile,
);

router.put(
  "/profile/:userId",
  passport.authenticate("jwt", { session: false }),
  user_controller.update_profile,
);

module.exports = router;
