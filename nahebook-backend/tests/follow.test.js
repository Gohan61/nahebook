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
const otherFollowerId = "621ff30d2a3e781873fcb665";

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
        pendingFollow: ["621ff30d2a3e781873fcb665"],
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

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    const user3 = new Usermodel({
      first_name: "forever",
      last_name: "forever",
      username: "forever",
      password: hashedPassword,
      age: 14,
      bio: "I am new here testing things out for second user",
      _id: "621ff30d2a3e781873fcb665",
      pendingFollow: ["621ff30d2a3e781873fcb663"],
      receivedRequestFollow: ["621ff30d2a3e781873fcb665"],
    });

    await user3.save();
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

test("User can send follow request", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const payload = {
    followUserId: followerId,
  };

  let user;
  let followedUser;

  const res = await request(app)
    .post(`/user/follow/${userId}`)
    .set(authorization)
    .set("Content-Type", "application/json")
    .send(payload)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).not.toBeFalsy();
    })
    .then(async () => {
      user = await Usermodel.findById(
        userId,
        "pendingFollow receivedRequestFollow",
      ).exec();
      followedUser = await Usermodel.findById(
        followerId,
        "pendingFollow receivedRequestFollow",
      );

      expect(user.pendingFollow.length).toBe(2);
      expect(user.receivedRequestFollow.length).toBe(0);
      expect(followedUser.receivedRequestFollow.length).toBe(1);
      expect(followedUser.pendingFollow.length).toBe(1);
    });
});

test("User can accept request", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const payload = {
    answer: "accept",
    followUserId: followerId,
  };

  let user;
  let followedUser;

  const res = await request(app)
    .post(`/user/follow/${userId}`)
    .set(authorization)
    .set("Content-Type", "application/json")
    .send(payload)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).not.toBeFalsy();
    })
    .then(async () => {
      user = await Usermodel.findById(
        userId,
        "following pendingFollow receivedRequestFollow",
      ).exec();
      followedUser = await Usermodel.findById(
        followerId,
        "following pendingFollow",
      );
      expect(user.following.length).toBe(1);
      expect(followedUser.following.length).toBe(1);
      expect(user.receivedRequestFollow.length).toBe(0);
      expect(user.pendingFollow.length).toBe(1);
      expect(followedUser.pendingFollow.length).toBe(0);
    });
});

test("User can deny request", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const payload = {
    answer: "deny",
    followUserId: otherFollowerId,
  };

  let user;
  let followedUser;

  const res = await request(app)
    .post(`/user/follow/${userId}`)
    .set(authorization)
    .set("Content-Type", "application/json")
    .send(payload)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).not.toBeFalsy();
    })
    .then(async () => {
      user = await Usermodel.findById(
        userId,
        "following pendingFollow receivedRequestFollow",
      ).exec();
      followedUser = await Usermodel.findById(
        otherFollowerId,
        "following pendingFollow receivedRequestFollow",
      );
      console.log(user.receivedRequestFollow);
      expect(user.following.length).toBe(1);
      expect(followedUser.following.length).toBe(0);
      expect(user.receivedRequestFollow.length).toBe(0);
      expect(followedUser.receivedRequestFollow.length).toBe(0);
      expect(user.pendingFollow.length).toBe(0);
      expect(followedUser.pendingFollow.length).toBe(0);
    });
});

test("Returns error if no following user found", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const payload = {
    followUserId: "621ff30d2a3e781873fcb666",
  };

  const res = await request(app)
    .post(`/user/follow/${userId}`)
    .set(authorization)
    .set("Content-Type", "application/json")
    .send(payload)
    .then((res) => {
      expect(res.status).toBe(404);
    });
});

test("Denies access without token", async () => {
  const payload = {
    followUserId: "621ff30d2a3e781873fcb666",
  };

  const res = await request(app)
    .post(`/user/follow/${userId}`)
    .set("Content-Type", "application/json")
    .send(payload)
    .then((res) => {
      expect(res.status).toBe(401);
    });
});
