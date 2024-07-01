const request = require("supertest");
const express = require("express");
const app = express();
const user = require("../routes/users");
const initializeMongoServer = require("../config/databaseTest");
require("../config/passportTest");
const Usermodel = require("../models/user");
const bcrypt = require("bcryptjs");

beforeAll(async () => {
  await initializeMongoServer();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", user);

test("User can sign up", async () => {
  const payload = {
    first_name: "testing",
    last_name: "testing",
    username: "testing",
    password: "testing",
    age: 12,
    bio: "I am new here testing things out",
  };

  const res = await request(app)
    .post("/user/signup")
    .send(payload)
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("You are signed up");
    });
});

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
    });
});

test("User gets validation errors on sign in", async () => {
  const payload = {
    username: "",
    password: "",
  };

  const res = await request(app)
    .post("/user/signin")
    .send(payload)
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("Validation failed");
    });
});

test("User gets database errors on sign in", async () => {
  const payload = {
    username: "heroes",
    password: "heroes",
  };

  const res = await request(app)
    .post("/user/signin")
    .send(payload)
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(404);
      expect(res.error.text).toMatch(/User not found/);
    });
});

test("User gets validation errors on signup", async () => {
  const payload = {
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    age: "",
    bio: "",
  };

  const res = await request(app)
    .post("/user/signup")
    .send(payload)
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.errors.errors.length).toBe(6);
    });
});

test("User gets database errors on signup", async () => {
  const payload = {
    first_name: "testing",
    last_name: "testing",
    username: "testing",
    password: "testing",
    age: 12,
    bio: "I am new here testing things out",
  };

  const res = await request(app)
    .post("/user/signup")
    .send(payload)
    .set("Content-Type", "application/json")
    .then((res) => {
      expect(res.status).toBe(500);
      expect(res.body.message).toBe("Username already exists");
    });
});
