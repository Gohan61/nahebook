const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const getGravatarUrl = require("../config/generate-gravatar");

exports.signup = [
  body("first_name", "First name must be between 2 and 50 characters")
    .trim()
    .isLength({ min: 2, max: 50 })
    .escape(),
  body("last_name", "Last name must be between 2 and 50 characters")
    .trim()
    .isLength({ min: 2, max: 50 })
    .escape(),
  body("username", "Username must be between 5 and 20 characters")
    .trim()
    .isLength({ min: 5, max: 20 })
    .escape(),
  body("password", "Password must be between 5 and 80 characters")
    .trim()
    .isLength({ min: 5, max: 100 })
    .escape(),
  body("age", "Age must be a number").trim().isInt().optional().escape(),
  body("bio", "Bio must be between one and 200 characters")
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    try {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
          age: req.body.age,
          bio: req.body.bio,
          profile_picture: getGravatarUrl(req.body.username),
        });
        if (!errors.isEmpty()) {
          return res.status(500).json({ errors, user });
        } else if (await User.exists({ username: req.body.username })) {
          return res
            .status(500)
            .json({ message: "Username already exists", user });
        } else {
          await user.save();
          return res.status(200).json({ message: "You are signed up" });
        }
      });
    } catch (err) {
      return next(err);
    }
  }),
];

exports.signin = [
  body("username").trim().isLength({ min: 5 }).escape(),
  body("password").trim().escape({ min: 5 }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(404).json({ message: "Validation failed", errors });
    }
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(404).json({ error: "User not found", user });
      } else {
        req.login(user, { session: false });
        jwt.sign(
          { user: user },
          process.env.secret,
          { expiresIn: "10d" },
          (err, token) => {
            if (err) {
              console.log(err);
            }

            res.status(200).json({
              token: token,
              userId: user._id,
              username: user.username,
            });
          },
        );
      }
    })(req, res, next);
  }),
];

exports.get_profile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(
    req.params.userId,
    "first_name last_name username age bio profile_picture posts following",
  )
    .populate("posts")
    .exec();

  if (!user) {
    const err = { message: "User not found", status: 404 };
    return next(err);
  } else {
    return res.status(200).json({ user });
  }
});

exports.update_profile = [
  body("first_name", "First name must be between 2 and 50 characters")
    .trim()
    .isLength({ min: 2, max: 50 })
    .escape(),
  body("last_name", "Last name must be between 2 and 50 characters")
    .trim()
    .isLength({ min: 2, max: 50 })
    .escape(),
  body("username", "Username must be between 5 and 20 characters")
    .trim()
    .isLength({ min: 5, max: 20 })
    .escape(),
  body("password", "Password must be between 5 and 80 characters")
    .trim()
    .isLength({ min: 5, max: 100 })
    .escape(),
  body("age", "Age must be a number").trim().isInt().optional().escape(),
  body("bio", "Bio must be between one and 200 characters")
    .trim()
    .isLength({ min: 1, max: 200 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const currentUser = await User.findById(req.params.userId).exec();

    try {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        const user = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username,
          password: hashedPassword,
          age: req.body.age,
          bio: req.body.bio,
          profile_picture: currentUser.profile_picture,
          posts: currentUser.posts,
          following: currentUser.following,
          pendingFollow: currentUser.pendingFollow,
          receivedRequestFollow: currentUser.receivedRequestFollow,
          _id: currentUser._id,
        });

        if (
          currentUser.username !== req.body.username &&
          (await User.exists({ username: req.body.username }))
        ) {
          return res
            .status(500)
            .json({ message: "Username already exists", user });
        } else if (!errors.isEmpty()) {
          return res.status(500).json({ errors, user });
        } else if (err) {
          throw err;
        } else {
          await User.findByIdAndUpdate(currentUser._id, user).exec();
          return res.status(200).json({ message: "Your profile is updated" });
        }
      });
    } catch (err) {
      return next(err);
    }
  }),
];

exports.get_user_list = asyncHandler(async (req, res, next) => {
  const users = await User.find(
    {},
    "first_name last_name username age profile_picture following pendingFollow receivedRequestFollow",
  ).exec();

  if (!users) {
    const err = { message: "No users found", status: 404 };
    return next(err);
  } else {
    return res.status(200).json({ users });
  }
});

exports.follow_user = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  const followUser = await User.findById(req.body.followUserId);

  if (!user) {
    const err = { message: "No user found", status: 404 };
    return next(err);
  } else if (!followUser) {
    const err = { message: "No user found to follow", status: 404 };
    return next(err);
  }

  const updatedUser = new User({
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    password: user.password,
    age: user.age,
    bio: user.bio,
    profile_picture: user.profile_picture,
    posts: user.posts,
    following: user.following,
    pendingFollow: user.pendingFollow,
    receivedRequestFollow: user.receivedRequestFollow,
    _id: user._id,
  });

  const updatedFollowUser = new User({
    first_name: followUser.first_name,
    last_name: followUser.last_name,
    username: followUser.username,
    password: followUser.password,
    age: followUser.age,
    bio: followUser.bio,
    profile_picture: followUser.profile_picture,
    posts: followUser.posts,
    following: followUser.following,
    pendingFollow: followUser.pendingFollow,
    receivedRequestFollow: followUser.receivedRequestFollow,
    _id: followUser._id,
  });
  if (user.pendingFollow.includes(followUser._id)) {
    updatedUser.pendingFollow.splice(
      updatedUser.pendingFollow.indexOf(followUser._id),
      1,
    );
    updatedFollowUser.pendingFollow.splice(
      updatedFollowUser.pendingFollow.indexOf(user._id),
      1,
    );
    updatedFollowUser.receivedRequestFollow.splice(
      updatedFollowUser.receivedRequestFollow.indexOf(user._id),
      1,
    );
    if (req.body.answer === "accept") {
      updatedUser.following.push(followUser._id);
      updatedFollowUser.following.push(user._id);

      await User.findByIdAndUpdate(user._id, updatedUser).exec();
      await User.findByIdAndUpdate(followUser._id, updatedFollowUser).exec();
      return res.status(200).json({ message: "Following succesful" });
    } else if (req.body.answer === "deny") {
      await User.findByIdAndUpdate(user._id, updatedUser).exec();
      await User.findByIdAndUpdate(followUser._id, updatedFollowUser).exec();
      return res.status(200).json({ message: "Denied follow request" });
    }
  } else {
    updatedUser.pendingFollow.push(followUser._id);

    updatedFollowUser.pendingFollow.push(user._id);
    updatedFollowUser.receivedRequestFollow.push(user._id);

    await User.findByIdAndUpdate(user._id, updatedUser).exec();
    await User.findByIdAndUpdate(followUser._id, updatedFollowUser).exec();
    return res.status(200).json({ message: "Follow request send" });
  }
});
