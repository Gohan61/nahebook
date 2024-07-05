const express = require("express");
const router = express.Router();
const passport = require("passport");

const post_controller = require("../controllers/PostController");

router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  post_controller.get_posts,
);

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

router.post(
  "/unlike/:postId",
  passport.authenticate("jwt", { session: false }),
  post_controller.unlike,
);

module.exports = router;
