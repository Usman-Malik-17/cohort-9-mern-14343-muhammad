import { Router } from "express";
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createNoteValidator,
  updateNoteValidator,
} from "../validators/index.js";

const router = Router();
router.route("/").get(verifyJwt, getAllNotes);
router.route("/").post(verifyJwt, createNoteValidator(), validate, createNote);
router.route("/:noteId").get(verifyJwt, getNoteById);
router
  .route("/:noteId")
  .patch(verifyJwt, updateNoteValidator(), validate, updateNote);
router.route("/:noteId").delete(verifyJwt, deleteNote);

export default router;
