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
const username = "testing";
const followerId = "621ff30d2a3e781873fcb664";
const followerUsername = "hpeter";

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

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    const user2 = new Usermodel({
      first_name: "hans",
      last_name: "peter",
      username: "hpeter",
      password: hashedPassword,
      age: 14,
      bio: "I am new here testing things out for second user",
      posts: ["621ff30d2a3e781873fcb690"],
      _id: "621ff30d2a3e781873fcb664",
    });

    await user2.save();
  });

  const post = new Postmodel({
    text: "Hello world",
    imgUrl: "http://test.io",
    date: "01-01-2022",
    userId: userId,
    username: username,
    _id: "621ff30d2a3e781873fcb669",
  });

  await post.save();

  const followerPost = new Postmodel({
    text: "Hello follower",
    imgUrl: "http://test.io",
    date: "01-01-2022",
    userId: followerId,
    username: followerUsername,
    _id: "621ff30d2a3e781873fcb690",
  });

  await followerPost.save();
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

test("User can get own and follow posts", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(app)
    .get("/post/621ff30d2a3e781873fcb663")
    .set(authorization)
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.ownPosts).not.toBeFalsy();
      expect(res.body.followerPosts).not.toBeFalsy();
    });
});

test("Returns no follower post if none followed", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(app)
    .get("/post/621ff30d2a3e781873fcb664")
    .set(authorization)
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.followerPosts.length).toBe(0);
    });
});

test("Denies access without token", async () => {
  const res = await request(app)
    .get("/post/621ff30d2a3e781873fcb663")
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(401);
    });
});
