import { Boards } from "../models/boardModel.js";

// get boards
// post
// api/boards
export const getBoards = async (req, res) => {
  const user_id = req.user._id;

  try {
    const boards = await Boards.find({ user_id });
    res.status(200).json(boards);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// create a board
// post
// api/boards/
export const createBoard = async (req, res) => {
  const user_id = req.user._id;

  try {
    const board = await Boards.create({ ...req.body, user_id });
    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a board
// delete
// api/boards/:id
export const deleteBoard = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedBoard = await Boards.findByIdAndDelete(id);
    res.status(200).json(deletedBoard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// edit a board
// put
// api/boards/:id
export const editBoard = async (req, res) => {
  const id = req.params.id;

  try {
    let editedBoard = await Boards.findById(id);
    editedBoard.boardName = req.body.boardName;
    editedBoard.columns = req.body.columns;
    editedBoard.save();
    res.status(200).json(editedBoard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// -------------------------------------------------
// TASKS

// add a new task
// put
// api/boards/tasks/add/:id -- board id
export const addTask = async (req, res) => {
  const id = req.params.id;
  const { taskName, taskDescription, subtasks, status } = req.body;

  try {
    // https://stackoverflow.com/questions/39522455/updating-nested-array-mongoose

    const addTaskToBoard = await Boards.findOneAndUpdate(
      { _id: id, "columns.columnName": status },
      {
        $push: {
          "columns.$.tasks": { taskName, taskDescription, subtasks, status },
        },
      },
      { returnDocument: "after" }
    );

    res.status(200).json(addTaskToBoard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// edit a task
// api/boards/tasks/edit/:id  -- the board's id

// https://forum.freecodecamp.org/t/how-to-update-deeply-nested-array-in-mongodb-mongoose/466565/2
export const editTask = async (req, res) => {
  const id = req.params.id;

  if (req.body.status === req.body.originalStatus) {
    try {
      let editedTask = await Boards.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: { "columns.$[e1].tasks.$[e2]": req.body },
        },
        {
          arrayFilters: [
            { "e1.columnName": req.body.status },
            { "e2._id": req.body._id },
          ],
        }
      );

      const editedBoard = await Boards.findById(id);
      res.status(200).json(editedBoard);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // different status/column
  if (req.body.status != req.body.originalStatus) {
    try {
      // delete orginal task
      const deletedTask = await Boards.findOneAndUpdate(
        { _id: id, "columns.columnName": req.body.originalStatus },
        { $pull: { "columns.$.tasks": { _id: req.body._id } } },
        { returnDocument: "after" }
      );

      // add edited task to new column
      const addTaskToBoard = await Boards.findOneAndUpdate(
        { _id: id, "columns.columnName": req.body.status },
        { $push: { "columns.$.tasks": { ...req.body } } },
        { returnDocument: "after" }
      );

      const editedBoard = await Boards.findById(id);
      res.status(200).json(editedBoard);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// delete a task
// put
// api/boards/tasks/delete/:id -- board id
export const deleteTask = async (req, res) => {
  const id = req.params.id;
  const colName = req.body.colName;
  const taskId = req.body.taskId;

  try {
    const deletedTask = await Boards.findOneAndUpdate(
      { _id: id, "columns.columnName": colName },
      { $pull: { "columns.$.tasks": { _id: taskId } } },
      { returnDocument: "after" }
    );
    res.status(200).json(deletedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ------------------------------------
// SUBTASK

// edit subtask
// put
// api/boards/tasks/subtasks/:id -- board id
export const editSubtask = async (req, res) => {
  const id = req.params.id;

  if (req.body.status === req.body.originalStatus) {
    try {
      let editedSubtask = await Boards.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: {
            "columns.$[e1].tasks.$[e2].subtasks": [...req.body.subtasks],
          },
        },
        {
          arrayFilters: [
            { "e1.columnName": req.body.status },
            { "e2._id": req.body._id },
          ],
        }
      );

      const editedBoard = await Boards.findById(id);
      res.status(200).json(editedBoard);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // different status/column
  if (req.body.status != req.body.originalStatus) {
    try {
      // delete orginal task
      const deletedTask = await Boards.findOneAndUpdate(
        { _id: id, "columns.columnName": req.body.originalStatus },
        { $pull: { "columns.$.tasks": { _id: req.body._id } } },
        { returnDocument: "after" }
      );

      // add edited task to new column
      const addTaskToBoard = await Boards.findOneAndUpdate(
        { _id: id, "columns.columnName": req.body.status },
        {
          $push: {
            "columns.$.tasks": {
              ...req.body.task,
              subtasks: [...req.body.subtasks],
            },
          },
        },
        { returnDocument: "after" }
      );

      const editedBoard = await Boards.findById(id);
      res.status(200).json(editedBoard);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
