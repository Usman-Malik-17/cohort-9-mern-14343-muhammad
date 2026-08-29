import mongoose from "mongoose";
import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import sinon from "sinon";
import {
  getNoteById,
  updateNote,
  deleteNote,
} from "../src/controllers/note.controllers.js";

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

describe("Note controllers - unit (missing noteId)", function () {
  it("getNoteById should reject when noteId param is missing", async function () {
    const req = { params: {}, user: { _id: "64f0000000000000000000aa" } };
    const res = {};
    const next = sinon.spy();

    await getNoteById(req, res, next);

    expect(next.calledOnce).to.be.true;
    const err = next.firstCall.args[0];
    expect(err.statusCode).to.equal(400);
    expect(err.message).to.equal("Note Id is missing");
  });

  it("updateNote should reject when noteId param is missing", async function () {
    const req = {
      params: {},
      body: { title: "x" },
      user: { _id: "64f0000000000000000000aa" },
    };
    const res = {};
    const next = sinon.spy();

    await updateNote(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0].statusCode).to.equal(400);
  });

  it("deleteNote should reject when noteId param is missing", async function () {
    const req = { params: {}, user: { _id: "64f0000000000000000000aa" } };
    const res = {};
    const next = sinon.spy();

    await deleteNote(req, res, next);

    expect(next.calledOnce).to.be.true;
    expect(next.firstCall.args[0].statusCode).to.equal(400);
  });
});
