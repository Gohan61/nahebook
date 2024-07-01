const request = require("supertest");
const express = require("express");
const app = express();
const user = require("../routes/users");
const post = require("../routes/post");
const initializeMongoServer = require("../config/databaseTest");
require("../config/passportTest");
const Usermodel = require("../models/user");
const Postmodel = require("../models/posts");
const bcrypt = require("bcryptjs");
let token;
const userId = "621ff30d2a3e781873fcb663";

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
    _id: "621ff30d2a3e781873fcb669",
  });

  await post.save();
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
      expect(res.body.token).not.toBeNull();
      expect(res.body.userId).not.toBeNull();
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
    .post("/post/621ff30d2a3e781873fcb669/comment")
    .set(authorization)
    .set("Content-Type", "application/json")
    .send(payload)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Comment saved");
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
    .post("/post/621ff30d2a3e781873fcb669/comment")
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
    .post("/post/621ff30d2a3e781873fcb669/comment")
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(401);
    });
});
