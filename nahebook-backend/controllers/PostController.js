const User = require("../models/user");
const Post = require("../models/posts");
const Comment = require("../models/comments");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const uploadToCloudinary = require("../config/cloudinary");
const { formatRelative, subDays, format } = require("date-fns");

exports.new_post = [
  body("text", "Maximun post description is 50 characters")
    .trim()
    .isLength({ max: 50 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    let imgData;

    if (req.body.imgUrl) {
      try {
        imgData = await uploadToCloudinary(req.body.imgUrl, "nahebook");
      } catch (e) {
        return res
          .status(500)
          .json({ error: "An error occured uploading your image" });
      }
    }

    const post = new Post({
      text: req.body.text,
      imgUrl: imgData,
      date: format(new Date(), "dd/MM/yyyy"),
      userId: req.body.userId,
    });

    if (!errors.isEmpty()) {
      return res.status(500).json({ errors, post });
    } else {
      await post.save();
      return res.status(200).json({ message: "Post saved" });
    }
  }),
];

exports.new_comment = [
  body("text", "Comment must be between 1 and 30 characters")
    .trim()
    .isLength({ min: 1, max: 30 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const comment = new Comment({
      userId: req.body.userId,
      username: req.body.username,
      timestamp: formatRelative(subDays(new Date(), 0), new Date()),
      text: req.body.text,
      postId: req.params.postId,
    });

    if (!errors.isEmpty()) {
      return res.status(500).json({ errors, comment });
    } else {
      await comment.save();
      return res.status(200).json({ message: "Comment saved" });
    }
  }),
];
