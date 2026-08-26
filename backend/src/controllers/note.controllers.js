import { Note } from "../models/note.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import logger from "../utils/logger.js";
import mongoose from "mongoose";

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ createdBy: req.user._id });
  logger.info({ userId: req.user._id }, "Notes Fetched sucessfully");
  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes has been fetched successfully"));
});

const getNoteById = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  if (!noteId) {
    throw new ApiError(400, "Note Id is missing");
  }

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new ApiError(400, "Invalid Note Id format");
  }

  const note = await Note.findOne({
    _id: noteId,
    createdBy: req.user._id,
  });
  if (!note) {
    throw new ApiError(404, "Note does not exist or invalid access");
  }
  logger.info(
    { noteId: note._id, userId: req.user._id },
    "Note has been fetched sucessfully",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note has been fetched successfully"));
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body || {};
  if (!title || !content) {
    throw new ApiError(400, "Title and content is required");
  }

  const note = await Note.create({
    title,
    content,
    tags,
    createdBy: req.user._id,
  });

  logger.info({ noteId: note._id, userId: req.user._id }, "Note created");
  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note has been created"));
});

const updateNote = asyncHandler(async (req, res) => {
  const { noteId } = req?.params;
  const { title, content, tags } = req.body || {};

  if (!noteId) {
    throw new ApiError(400, "Note Id is missing");
  }

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new ApiError(400, "Invalid Note Id format");
  }

  if (title === undefined && content === undefined && tags === undefined) {
    throw new ApiError(
      400,
      "At least one field (title, content, or tags) must be provided to update",
    );
  }

  const updatedNote = await Note.findOneAndUpdate(
    { _id: noteId, createdBy: req.user._id },
    { $set: { title, content, tags } },
    { new: true, runValidators: true },
  );

  if (!updatedNote) {
    throw new ApiError(404, "Note does not exist or invalid access");
  }

  logger.info({ noteId: noteId, userId: req.user._id }, "Note updated");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedNote, "Note has been updated successfully"),
    );
});

const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  if (!noteId) {
    throw new ApiError(400, "Note Id is missing");
  }

  if (!mongoose.Types.ObjectId.isValid(noteId)) {
    throw new ApiError(400, "Invalid Note Id format");
  }

  const deletedNote = await Note.findOneAndDelete({
    _id: noteId,
    createdBy: req.user._id,
  });

  if (!deletedNote) {
    throw new ApiError(404, "Note does not exist or invalid access");
  }

  logger.info({ noteId: noteId, userId: req.user._id }, "Note deleted");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note has been deleted successfully"));
});

export { getAllNotes, getNoteById, createNote, updateNote, deleteNote };
