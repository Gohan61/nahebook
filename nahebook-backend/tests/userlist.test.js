const request = require("supertest");
const express = require("express");
const app = express();
const user = require("../routes/users");
const initializeMongoServer = require("../config/databaseTest");
require("../config/passportTest");
const Usermodel = require("../models/user");
const bcrypt = require("bcryptjs");
let token;
const userId = "621ff30d2a3e781873fcb663";
const followerId = "621ff30d2a3e781873fcb664";

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
        following: ["621ff30d2a3e781873fcb664"],
      });
      await user1.save();
    });

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      const user2 = new Usermodel({
        first_name: "hans",
        last_name: "peter",
        username: "hpeter",
        password: hashedPassword,
        age: 14,
        bio: "I am new here testing things out for second user",
        _id: "621ff30d2a3e781873fcb664",
        following: ["621ff30d2a3e781873fcb663"],
      });

      await user2.save();
    });
  } catch (err) {
    console.log(err);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", user);

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

test("Returns list of users", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(app)
    .get(`/user/list/${userId}`)
    .set("Content-Type", "application/json")
    .set(authorization)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.user.following.length).toBe(1);
      expect(res.body.users.length).toBe(0);
    });
});

test("Denies access to route with 401 code", async () => {
  const res = await request(app)
    .get(`/user/list/${userId}`)
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(401);
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
      ).exec();

      expect(user.pendingFollow.length).toBe(1);
      expect(user.receivedRequestFollow.length).toBe(0);
      expect(followedUser.receivedRequestFollow.length).toBe(1);
      expect(followedUser.pendingFollow.length).toBe(1);
    });
});

test("Returns pendingFollow user in user object and not in users", async () => {
  const authorization = {
    Authorization: `Bearer ${token}`,
  };

  const res = await request(app)
    .get(`/user/list/${userId}`)
    .set("Content-Type", "application/json")
    .set(authorization)
    .then((res) => {
      console.log(res.body);
      expect(res.status).toBe(200);
      expect(res.body.users.length).toBe(0);
      expect(res.body.user.following.length).toBe(1);
    });
});
