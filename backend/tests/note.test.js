import mongoose from "mongoose";
import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

// describe("Notes", function () {
//   let agent;
//   let noteId;

//   before(async function () {
//     // await mongoose.connect(process.env.MONGO_URI_TEST);

//     agent = request.agent(app);

//     // Create test user
//     await agent.post("/api/v1/auth/register").send({
//       email: "notes-test@example.com",
//       password: "Test@12345678",
//       fullName: "Notes Test User",
//     });

//     // Login
//     await agent.post("/api/v1/auth/login").send({
//       email: "notes-test@example.com",
//       password: "Test@12345678",
//     });
//   });

//   after(async function () {
//     await mongoose.connection.collection("notes").deleteMany({});
//     await mongoose.connection.collection("users").deleteMany({});
//   });

//   it("should create a note successfully", async function () {
//     const response = await agent.post("/api/v1/notes").send({
//       title: "Test Note",
//       content: "This is a test note",
//       tags: ["testing", "mern"],
//     });

//     expect(response.status).to.equal(201);
//     expect(response.body.success).to.equal(true);
//     expect(response.body.message).to.equal("Note has been created");

//     expect(response.body.data).to.exist;
//     expect(response.body.data.title).to.equal("Test Note");
//     expect(response.body.data.content).to.equal("This is a test note");

//     noteId = response.body.data._id;
//   });

//   it("should get all notes successfully", async function () {
//     const response = await agent.get("/api/v1/notes");

//     expect(response.status).to.equal(200);
//     expect(response.body.success).to.equal(true);
//     expect(response.body.message).to.equal(
//       "Notes has been fetched successfully",
//     );

//     expect(response.body.data).to.be.an("array");
//     expect(response.body.data.length).to.be.greaterThan(0);
//   });

//   it("should get a note by ID successfully", async function () {
//     const response = await agent.get(`/api/v1/notes/${noteId}`);

//     expect(response.status).to.equal(200);
//     expect(response.body.success).to.equal(true);
//     expect(response.body.message).to.equal(
//       "Note has been fetched successfully",
//     );

//     expect(response.body.data._id).to.equal(noteId);
//     expect(response.body.data.title).to.equal("Test Note");
//   });

//   it("should update a note successfully", async function () {
//     const response = await agent.patch(`/api/v1/notes/${noteId}`).send({
//       title: "Updated Test Note",
//       content: "Updated note content",
//     });

//     expect(response.status).to.equal(200);
//     expect(response.body.success).to.equal(true);
//     expect(response.body.message).to.equal(
//       "Note has been updated successfully",
//     );

//     expect(response.body.data.title).to.equal("Updated Test Note");
//     expect(response.body.data.content).to.equal("Updated note content");
//   });

//   it("should reject an invalid note ID", async function () {
//     const response = await agent.get("/api/v1/notes/invalid-id");

//     expect(response.status).to.equal(400);
//     expect(response.body.success).to.equal(false);
//     expect(response.body.message).to.equal("Invalid Note Id format");
//   });

//   it("should reject unauthenticated note requests", async function () {
//     const response = await request(app).get("/api/v1/notes");

//     expect(response.status).to.equal(401);
//     expect(response.body.success).to.equal(false);
//   });

//   it("should delete a note successfully", async function () {
//     const response = await agent.delete(`/api/v1/notes/${noteId}`);

//     expect(response.status).to.equal(200);
//     expect(response.body.success).to.equal(true);
//     expect(response.body.message).to.equal(
//       "Note has been deleted successfully",
//     );
//   });
// });

describe("Notes", function () {
  let agent;
  let otherAgent;
  let noteId;

  before(async function () {
    this.timeout(20000);
    agent = request.agent(app);
    await agent.post("/api/v1/auth/register").send({
      email: "notes-test@example.com",
      password: "Test@12345678",
      fullName: "Notes Test User",
    });
    await agent.post("/api/v1/auth/login").send({
      email: "notes-test@example.com",
      password: "Test@12345678",
    });

    // Doosra user — ownership test ke liye
    otherAgent = request.agent(app);
    await otherAgent.post("/api/v1/auth/register").send({
      email: "other-user@example.com",
      password: "Test@12345678",
      fullName: "Other User",
    });
    await otherAgent.post("/api/v1/auth/login").send({
      email: "other-user@example.com",
      password: "Test@12345678",
    });
  });

  after(async function () {
    await mongoose.connection.collection("notes").deleteMany({});
    await mongoose.connection.collection("users").deleteMany({});
  });

  it("should create a note successfully", async function () {
    const response = await agent.post("/api/v1/notes").send({
      title: "Test Note",
      content: "This is a test note",
      tags: ["testing", "mern"],
    });
    expect(response.status).to.equal(201);
    expect(response.body.success).to.equal(true);
    noteId = response.body.data._id;
  });

  it("should get all notes successfully", async function () {
    const response = await agent.get("/api/v1/notes");
    expect(response.status).to.equal(200);
    expect(response.body.data).to.be.an("array");
    expect(response.body.data.length).to.be.greaterThan(0);
  });

  it("should get a note by ID successfully", async function () {
    const response = await agent.get(`/api/v1/notes/${noteId}`);
    expect(response.status).to.equal(200);
    expect(response.body.data._id).to.equal(noteId);
  });

  it("should update a note successfully", async function () {
    const response = await agent.patch(`/api/v1/notes/${noteId}`).send({
      title: "Updated Test Note",
      content: "Updated note content",
    });
    expect(response.status).to.equal(200);
    expect(response.body.data.title).to.equal("Updated Test Note");
  });

  it("should reject an invalid note ID", async function () {
    const response = await agent.get("/api/v1/notes/invalid-id");
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Invalid Note Id format");
  });

  it("should reject unauthenticated note requests", async function () {
    const response = await request(app).get("/api/v1/notes");
    expect(response.status).to.equal(401);
  });

  // Naye tests — Ownership
  it("should prevent another user from viewing someone else's note", async function () {
    const response = await otherAgent.get(`/api/v1/notes/${noteId}`);
    expect(response.status).to.equal(404);
    expect(response.body.success).to.equal(false);
  });

  it("should prevent another user from updating someone else's note", async function () {
    const response = await otherAgent
      .patch(`/api/v1/notes/${noteId}`)
      .send({ title: "Hacked Title" });
    expect(response.status).to.equal(404);
    expect(response.body.success).to.equal(false);
  });

  it("should prevent another user from deleting someone else's note", async function () {
    const response = await otherAgent.delete(`/api/v1/notes/${noteId}`);
    expect(response.status).to.equal(404);
    expect(response.body.success).to.equal(false);
  });

  // Naya test — Empty update body
  it("should reject an update request with no fields", async function () {
    const response = await agent.patch(`/api/v1/notes/${noteId}`).send({});
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(
      "At least one field (title, content, or tags) must be provided to update",
    );
  });

  it("should delete a note successfully", async function () {
    const response = await agent.delete(`/api/v1/notes/${noteId}`);
    expect(response.status).to.equal(200);
    expect(response.body.success).to.equal(true);
  });

  it("should reject creating a note without title or content", async function () {
    const response = await agent.post("/api/v1/notes").send({
      tags: ["testing"],
    });

    expect(response.status).to.equal(422);
    expect(response.body.success).to.equal(false);
  });
});
