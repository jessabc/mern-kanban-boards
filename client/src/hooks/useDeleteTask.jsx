import { useContext } from "react";
import { Context } from "../Context";

export function useDeleteTask() {
  const { boards, setBoards, currentBoardName, currentBoardData } =
    useContext(Context);

  function deleteTask(task) {
    let currentTask = task;

    const updatedThisTaskArray = currentBoardData.columns
      .find((column) => column.name === currentTask.status)
      ?.tasks.filter((task) => task.title != currentTask.title);

    // find column/status which want to delete task
    const thisColumn = currentBoardData.columns.find(
      (column) => column.name === currentTask.status
    );

    // update that column/status with new tasks array
    const thisUpdatedColumn = { ...thisColumn, tasks: updatedThisTaskArray };

    // replace old column with updated column in current board
    const updatedCurrentBoardData = currentBoardData.columns.map((column) =>
      column.name === currentTask.status ? thisUpdatedColumn : column
    );

    // update boards with updated current board data
    const updatedBoards = boards.map((board) =>
      board.name === currentBoardName
        ? { ...board, columns: updatedCurrentBoardData }
        : board
    );

    setBoards(updatedBoards);
  }

  return [deleteTask];
}
