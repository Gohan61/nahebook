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

router.post(
  "/:postId/comment",
  passport.authenticate("jwt", { session: false }),
  post_controller.new_comment,
);

module.exports = router;
