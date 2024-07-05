const User = require("../models/user");
const Post = require("../models/posts");
const Comment = require("../models/comments");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { uploadToCloudinary } = require("../config/cloudinary");
const { formatRelative, subDays, format } = require("date-fns");

exports.get_posts = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId, "following");
  let ownPosts = await User.findById(req.params.userId)
    .populate("posts")
    .exec();

  let followerPosts = await User.find({ _id: { $in: user.following } })
    .populate("posts")
    .exec();

  if (!ownPosts) {
    const err = { message: "Could not find own posts", status: 404 };
    return next(err);
  } else if (!followerPosts) {
    const err = { message: "Could not find follower's posts", status: 404 };
    return next(err);
  } else {
    ownPosts = ownPosts.posts;
    followerPosts = followerPosts.map((user) => user.posts);

    return res.status(200).json({ ownPosts, followerPosts });
  }
});

exports.new_post = [
  body("text", "Maximun post description is 50 characters")
    .trim()
    .isLength({ max: 50 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const user = await User.findById(req.body.userId);

    try {
      let imgData = {};

      if (req.body.imgUrl) {
        const result = await uploadToCloudinary(req.body.imgUrl, "nahebook");
        imgData = result;
      }

      const post = new Post({
        text: req.body.text,
        imgUrl: imgData,
        date: format(new Date(), "dd/MM/yyyy"),
        userId: user._id,
        username: user.username,
      });

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

      updatedUser.posts.push(post._id);

      if (!errors.isEmpty()) {
        return res.status(500).json({ errors, post });
      } else {
        await post.save();
        await User.findByIdAndUpdate(user._id, updatedUser);
        return res.status(200).json({ message: "Post saved" });
      }
    } catch (e) {
      return res
        .status(500)
        .json({ error: "An error occured uploading your image" });
    }
  }),
];

exports.delete_post = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).exec();

  if (!post) {
    const err = { message: "Post not found", status: 404 };
    return next(err);
  } else {
    await Post.findByIdAndDelete(req.params.postId);
    return res.status(200).json({ message: "Post deleted" });
  }
});

exports.update_post = [
  body("text", "Maximun post description is 50 characters")
    .trim()
    .isLength({ max: 50 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    let imgData;
    const post = await Post.findById(req.params.postId);

    if (req.body.imgUrl) {
      try {
        imgData = await uploadToCloudinary(req.body.imgUrl, "nahebook");
      } catch (e) {
        return res
          .status(500)
          .json({ error: "An error occured uploading your image" });
      }
    }

    const updatedPost = new Post({
      text: req.body.text,
      imgUrl: imgData || post.imgUrl,
      date: post.date,
      userId: req.body.userId,
      username: post.username,
      likes: post.likes,
      _id: post._id,
    });

    if (!errors.isEmpty()) {
      return res.status(500).json({ errors, post });
    } else {
      await Post.findByIdAndUpdate(post._id, updatedPost);
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

exports.delete_comment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.body.commentId).exec();

  if (!comment) {
    const err = { message: "Comment not found", status: 404 };
    return next(err);
  } else {
    await Comment.findByIdAndDelete(comment._id);
    return res.status(200).json({ message: "Comment deleted" });
  }
});

exports.new_like = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).exec();

  if (!post) {
    const err = { message: "No post found", status: 404 };
    return next(err);
  } else {
    const updatedPost = new Post({
      text: post.text,
      imgUrl: post.imgUrl,
      date: post.date,
      userId: post.userId,
      username: post.username,
      _id: post._id,
      likes: post.likes,
    });

    updatedPost.likes.push(req.body.username);
    await Post.findByIdAndUpdate(post._id, updatedPost).exec();
    return res.status(200).json({ message: "Like saved" });
  }
});

exports.unlike = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).exec();

  if (!post) {
    const err = { message: "No post found", status: 404 };
    return next(err);
  } else {
    const updatedPost = new Post({
      text: post.text,
      imgUrl: post.imgUrl,
      date: post.date,
      userId: post.userId,
      username: post.username,
      _id: post._id,
      likes: post.likes,
    });

    updatedPost.likes.splice(updatedPost.likes.indexOf(req.body.username), 1);
    await Post.findByIdAndUpdate(post._id, updatedPost).exec();
    return res.status(200).json({ message: "Like removed" });
  }
});
