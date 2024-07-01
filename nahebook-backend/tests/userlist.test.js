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

    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      const user2 = new Usermodel({
        first_name: "hans",
        last_name: "peter",
        username: "hpeter",
        password: hashedPassword,
        age: 14,
        bio: "I am new here testing things out for second user",
        _id: "621ff30d2a3e781873fcb664",
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
    .get("/user/list")
    .set("Content-Type", "application/json")
    .set(authorization)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.users.length).toBe(2);
    });
});

test("Denies access to route with 401 code", async () => {
  const res = await request(app)
    .get("/user/list")
    .set("Content-Type", "application/json")
    .then((res) => {
      console.log(res);
      expect(res.status).toBe(401);
    });
});
