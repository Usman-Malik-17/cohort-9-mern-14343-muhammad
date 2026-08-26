import mongoose from "mongoose";
import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("Auth - Register", function () {
  after(async function () {
    await mongoose.connection.collection("users").deleteMany({});
  });

  it("should register a new user successfully", async function () {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "testuser@example.com",
      password: "Test@12345678",
      fullName: "Test User",
    });

    expect(response.status).to.equal(201);
    expect(response.body.success).to.equal(true);
  });

  it("should not register a user with an existing email", async function () {
    const user = {
      email: "duplicate@example.com",
      password: "Test@12345678",
      fullName: "Duplicate User",
    };

    await request(app).post("/api/v1/auth/register").send(user);

    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(user);

    expect(response.status).to.equal(409);
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal("User with email already exists");
  });

  it("should login an existing user successfully", async function () {
    const user = {
      email: "login@example.com",
      password: "Test@12345678",
      fullName: "Login User",
    };

    await request(app).post("/api/v1/auth/register").send(user);

    const response = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
    expect(response.body.message).to.equal("User logged in successfully");

    expect(response.headers["set-cookie"]).to.exist;
  });

  it("should reject login with an invalid password", async function () {
    const user = {
      email: "invalid-password@example.com",
      password: "Test@12345678",
      fullName: "Invalid Password User",
    };

    await request(app).post("/api/v1/auth/register").send(user);

    const response = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: "WrongPassword123",
    });

    expect(response.status).to.equal(400);
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal("Invalid credentials");
  });

  it("should get current user with valid access token", async function () {
    const user = {
      email: "currentuser@example.com",
      password: "Test@12345678",
      fullName: "Current User",
    };

    await request(app).post("/api/v1/auth/register").send(user);

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/api/v1/auth/current-user")
      .set("Cookie", cookies);

    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
    expect(response.body.message).to.equal("Current user fetched succesfully");

    expect(response.body.data.email).to.equal(user.email);
    expect(response.body.data.fullName).to.equal(user.fullName);
  });

  it("should logout the current user successfully", async function () {
    const user = {
      email: "logout@example.com",
      password: "Test@12345678",
      fullName: "Logout User",
    };

    await request(app).post("/api/v1/auth/register").send(user);

    const agent = request.agent(app);

    await agent.post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });

    const response = await agent.post("/api/v1/auth/logout");

    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
  });

  it("should reject current user request without authentication", async function () {
    const response = await request(app).post("/api/v1/auth/current-user");

    expect(response.status).to.equal(401);
    expect(response.body.success).to.equal(false);
  });

  it("should refresh access token successfully", async function () {
    const user = {
      email: "refresh@example.com",
      password: "Test@12345678",
      fullName: "Refresh User",
    };

    await request(app).post("/api/v1/auth/register").send(user);

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });

    const cookies = loginResponse.headers["set-cookie"];

    const response = await request(app)
      .post("/api/v1/auth/refresh-token")
      .set("Cookie", cookies);

    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
  });

  it("should reject registration with non-string email or password", async function () {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email: { $gt: "" },
        password: "Test@12345678",
        fullName: "Injection Test",
      });

    expect(response.status).to.equal(422);
    expect(response.body.success).to.equal(false);
  });

  it("should reject login with non-string email or password", async function () {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: { $ne: null },
        password: "anything",
      });

    expect(response.status).to.equal(422);
    expect(response.body.success).to.equal(false);
  });
});
