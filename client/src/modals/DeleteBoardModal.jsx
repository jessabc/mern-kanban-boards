import { useContext, useRef } from "react";
import { Context } from "../Context";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import iconCross from "../assets/icon-cross.svg";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";

export default function DeleteBoardModal({
  isDeleteBoardModalVisible,
  setIsDeleteBoardModalVisible,
}) {
  const {
    boards,
    setBoards,
    currentBoardName,
    setCurrentBoardName,
    currentBoardData,
    setCurrentBoardData,
    theme,
    setTheme,
  } = useContext(Context);

  const { user } = useAuthContext();

  const ref = useRef();
  useOnClickOutside(ref, () => setIsDeleteBoardModalVisible(false));

  const deleteBoard = async () => {
    try {
      const response = await axios.delete(
        `https://backend-url/api/boards/${currentBoardData._id} `,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const boardsArrLength = boards.length - 1;
      const indexOfDeletedBoard = boards
        .map((board) => board.boardName)
        .indexOf(currentBoardName);
      setBoards((prev) =>
        prev.filter((board) => board.boardName != currentBoardName)
      );
      setCurrentBoardName(
        boards[
          boardsArrLength === indexOfDeletedBoard ? 0 : indexOfDeletedBoard + 1
        ].boardName
      );
      setCurrentBoardData(
        boards[
          boardsArrLength === indexOfDeletedBoard ? 0 : indexOfDeletedBoard + 1
        ]
      );
    } catch (error) {
      console.log(error);
    }

    setIsDeleteBoardModalVisible(false);
  };

  return (
    <>
      <div
        className={`${
          isDeleteBoardModalVisible
            ? "fixed top-0 left-0 w-screen h-screen bg-opacity-50 bg-gray-600  flex items-start justify-center dark:bg-gray-900 dark:bg-opacity-50"
            : ""
        }`}
      >
        <div
          className={`${
            isDeleteBoardModalVisible
              ? " w-3/4 sm:w-1/2 h-screen bg-gray-50 shadow-md rounded-lg text-sm text-gray-400"
              : "hidden"
          } flex flex-col  overflow-y-auto dark:bg-zinc-700`}
          ref={ref}
        >
          <button
            onClick={() => setIsDeleteBoardModalVisible(false)}
            className="ml-auto text-2xl bg-gray-200 p-2 rounded-md mt-1 mr-1"
          >
            <img src={iconCross} alt="cross icon to close modal" />
          </button>

          <div className=" m-5">
            <p className="font-semibold text-lg text-red-500 mb-5">
              Delete this board?
            </p>
            <p>
              Are you sure you want to delete the '{currentBoardName}' board?
              This action will remove all columns and tasks and cannot be
              reversed.
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={deleteBoard}
                className="bg-red-400 text-white rounded-full py-2 w-1/2"
              >
                Delete
              </button>

              <button
                onClick={() => setIsDeleteBoardModalVisible(false)}
                className="text-indigo-500 bg-gray-200 rounded-full py-2 font-semibold w-1/2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
