import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const subtasksSchema = new Schema({
  subtaskName: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
  },
});

export const tasksSchema = new Schema({
  taskName: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  subtasks: [
    {
      type: subtasksSchema,
    },
  ],
});

export const columnSchema = new Schema({
  columnName: {
    type: String,
    required: true,
  },
  tasks: [
    {
      type: tasksSchema,
    },
  ],
});

export const boardSchema = new Schema({
  boardName: {
    type: String,
  },
  columns: [
    {
      type: columnSchema,
    },
  ],
  user_id: {
    type: String,
    required: true,
  },
});

export const Boards = mongoose.model("Boards", boardSchema);
