const request = require("supertest");
const express = require("express");
const app = express();
const user = require("../routes/users");
const post = require("../routes/post");
const initializeMongoServer = require("../config/databaseTest");
require("../config/passportTest");
const Usermodel = require("../models/user");
const Postmodel = require("../models/posts");
const CommentModel = require("../models/comments");
const bcrypt = require("bcryptjs");
const { set } = require("mongoose");
let token;
const userId = "621ff30d2a3e781873fcb663";
const username = "testing";

beforeAll(async () => {
  await initializeMongoServer();

  const password = "testing";
  try {
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      const user1 = new Usermodel({
        first_name: "Test",
        last_name: "test",
        username: "testing",
        password: hashedPassword,
        age: 14,
        bio: "Testing out a new profile, let's go",
        _id: "621ff30d2a3e781873fcb663",
        profile_picture: "http://test.io",
        posts: ["621ff30d2a3e781873fcb669"],
        following: "621ff30d2a3e781873fcb664",
      });
      await user1.save();
    });
  } catch (err) {
    console.log(err);
  }

  const post = new Postmodel({
    text: "Hello world",
    imgUrl: "http://test.io",
    date: "01-01-2022",
    userId: userId,
    username: username,
    _id: "621ff30d2a3e781873fcb669",
  });

  await post.save();

  const comment = new CommentModel({
    userId: userId,
    username: "testing",
    timestamp: "01-01-2022",
    text: "This comment",
    postId: "621ff30d2a3e781873fcb669",
    _id: "621ff30d2a3e781873fcb670",
  });

  await comment.save();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));
app.use("/user", user);
app.use("/post", post);

test("User can sign in", async () => {
  const payload = {
    username: "testing",
    password: "testing",
  };

  const res = await request(app)
    .post("/user/signin")
    .send(payload)
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.username).toBe("testing");
      expect(res.body.token).not.toBeFalsy();
      expect(res.body.userId).not.toBeFalsy();
      token = res.body.token;
    });
});

test("User can post new comment", async () => {
  const payload = {
    userId: userId,
    username: "testing",
    postId: "621ff30d2a3e781873fcb669",
    text: "This is a comment",
  };

  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(app)
    .post("/post/comment/621ff30d2a3e781873fcb669")
    .set(authorization)
    .set("Content-Type", "application/json")
    .send(payload)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Comment saved");
    });
});

test("Returns list of comments", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(app)
    .get("/post/comment/621ff30d2a3e781873fcb669")
    .set(authorization)
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.comments).not.toBeFalsy();
    });
});

test("Throws validation error", async () => {
  const payload = {
    userId: userId,
    username: "testing",
    postId: "621ff30d2a3e781873fcb669",
    text: "",
  };

  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(app)
    .post("/post/comment/621ff30d2a3e781873fcb669")
    .set(authorization)
    .set("Content-Type", "application/json")
    .send(payload)
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.errors.errors[0].msg).toBe(
        "Comment must be between 1 and 30 characters",
      );
    });
});

test("Returns authorization error", async () => {
  const res = await request(app)
    .post("/post/comment/621ff30d2a3e781873fcb669")
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(401);
    });
});

test("Deletes comment", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const payload = {
    commentId: "621ff30d2a3e781873fcb670",
  };

  const res = await request(app)
    .delete("/post/comment/621ff30d2a3e781873fcb669")
    .set(authorization)
    .set("Content-Type", "application/json")
    .send(payload)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).not.toBeFalsy();
    });
});
