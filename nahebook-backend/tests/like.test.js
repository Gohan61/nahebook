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
      expect(res.body.token).not.toBeFalsy();
      expect(res.body.userId).not.toBeFalsy();
      token = res.body.token;
    });
});

test("User can like a post", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const payload = {
    userId: userId,
  };

  let likes;

  const res = await request(app)
    .post("/post/like/621ff30d2a3e781873fcb669")
    .set(authorization)
    .set("Content-Type", "application/json")
    .send(payload)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).not.toBeFalsy();
    })
    .then(async () => {
      likes = await Postmodel.findById("621ff30d2a3e781873fcb669", "likes");
      expect(likes.likes.length).toBe(1);
    });
});

test("Returns 404 for non-existing post", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const payload = {
    userId: userId,
  };

  const res = await request(app)
    .post("/post/like/621ff30d2a3e781873fcb689")
    .set(authorization)
    .set("Content-Type", "application/json")
    .send(payload)
    .then((res) => {
      expect(res.status).toBe(404);
    });
});
