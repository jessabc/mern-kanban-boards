import { useContext } from "react";
import { Context } from "../Context";

export function useEditTask() {
  let { boards, setBoards, currentBoardName, currentBoardData } =
    useContext(Context);

  function editTask(task, updatedTaskData) {
    let updatedTaskArray;

    if (task && updatedTaskData) {
      //if task has NOT changed status/ moved columns, then update that column/status tasks array with updated task
      console.log(task, updatedTaskData);
      if (task.status === updatedTaskData?.status) {
        updatedTaskArray = currentBoardData.columns
          .find((column) => column.name === updatedTaskData.status)
          .tasks.map((task) =>
            task.id === updatedTaskData.id ? updatedTaskData : task
          );
        //if task HAS changed status/ moved columns, then update that column/status tasks array with updated task
      } else if (task.status != updatedTaskData?.status) {
        updatedTaskArray = currentBoardData.columns.find(
          (column) => column.name === updatedTaskData?.status
        )?.tasks;
        updatedTaskArray = [...updatedTaskArray, updatedTaskData];
      }
      console.log(updatedTaskArray);
      //  update column with updated tasks array
      let updatedColumn = currentBoardData.columns.find(
        (column) => column.name === updatedTaskData.status
      );
      updatedColumn = { ...updatedColumn, tasks: updatedTaskArray };
      console.log(updatedColumn);
      // update columns with updated column
      const updatedColumns = boards
        .find((board) => board.name === currentBoardName)
        .columns.map((column) =>
          column.name === updatedColumn.name ? updatedColumn : column
        );
      console.log(updatedColumns);
      //update board with updated columns
      let updatedBoard = boards.find(
        (board) => board.name === currentBoardName
      );
      updatedBoard = { ...updatedBoard, columns: updatedColumns };
      console.log(updatedBoard);
      // update boards with updated board
      setBoards((prev) =>
        prev.map((board) =>
          board.name === currentBoardData.name ? updatedBoard : board
        )
      );
    }
  }
  return [editTask];
}
