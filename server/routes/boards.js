import express from "express";
import {
  getBoards,
  createBoard,
  deleteBoard,
  addTask,
  editBoard,
  editTask,
  deleteTask,
  editSubtask,
} from "../controllers/boardsControllers.js";

import { requireAuth } from "../middleware/requireAuth.js";

export const router = express.Router();

// protects the below routes unless user has correct auth
router.use(requireAuth);

// get boards
// api/boards
router.get("/", getBoards);

// create a board
// api/boards/
router.post("/", createBoard);

// delete a board
// api/boards/:id
router.delete("/:id", deleteBoard);

// edit a board
// api/boards/:id
router.put("/:id", editBoard);

// add a new task
// api/boards/tasks/add/:id  --this is the boards id
router.put("/tasks/add/:id", addTask);

// edit a task
// api/boards/tasks/edit/:id  --this is the boards id
router.put("/tasks/edit/:id", editTask);

// delete a  task
// api/boards/tasks/delete/:id -- this is the boards id
router.put("/tasks/delete/:id", deleteTask);

// edit subtasks
// api/boards/tasks/subtasks/:id --this is the boards id
router.put("/tasks/subtasks/:id", editSubtask);
