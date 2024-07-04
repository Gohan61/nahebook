const express = require("express");
const router = express.Router();
const passport = require("passport");

const user_controller = require("../controllers/UserController");

router.post("/signin", user_controller.signin);

router.post("/signup", user_controller.signup);

router.get(
  "/list/:userId",
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

router.post(
  "/follow/:userId",
  passport.authenticate("jwt", { session: false }),
  user_controller.follow_user,
);

module.exports = router;
