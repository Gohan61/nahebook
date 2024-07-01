const express = require("express");
const router = express.Router();
const passport = require("passport");

const post_controller = require("../controllers/PostController");

router.post(
  "/new",
  passport.authenticate("jwt", { session: false }),
  post_controller.new_post,
);

router.delete(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  post_controller.delete_post,
);

router.put(
  "/:postId",
  passport.authenticate("jwt", { session: false }),
  post_controller.update_post,
);

router.post(
  "/comment/:postId",
  passport.authenticate("jwt", { session: false }),
  post_controller.new_comment,
);

router.delete(
  "/comment/:postId",
  passport.authenticate("jwt", { session: false }),
  post_controller.delete_comment,
);

router.post(
  "/like/:postId",
  passport.authenticate("jwt", { session: false }),
  post_controller.new_like,
);

module.exports = router;
