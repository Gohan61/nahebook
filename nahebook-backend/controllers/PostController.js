const User = require("../models/user");
const Post = require("../models/posts");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const uploadToCloudinary = require("../config/cloudinary");
const { formatRelative, subDays } = require("date-fns");

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
      date: formatRelative(subDays(new Date(), 3), new Date()),
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
