import { useRef, useState } from "react";
import DeleteBoardModal from "./DeleteBoardModal";
import EditBoardModal from "./EditBoardModal";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

export default function EditOrDeleteBoardModal({
  isEditDeletBoardModalVisible,
  setIsEditDeletBoardModalVisible,
}) {
  const [isEditBoardModalVisible, setIsEditBoardModalVisible] = useState();

  const [isDeleteBoardModalVisible, setIsDeleteBoardModalVisible] = useState();

  const ref = useRef();
  useOnClickOutside(ref, () => setIsEditDeletBoardModalVisible(false));

  function handleClick(e) {
    if (e.target.id === "editBoard") {
      setIsEditBoardModalVisible(true);
    } else {
      setIsDeleteBoardModalVisible(true);
    }
    setIsEditDeletBoardModalVisible(false);
  }

  return (
    <>
      {/* overlay */}
      <div
        className={`${
          isEditDeletBoardModalVisible
            ? "fixed top-0 left-0 w-screen h-screen bg-opacity-50 bg-gray-600  flex items-start justify-center dark:bg-gray-900 dark:bg-opacity-50"
            : ""
        }`}
      >
        <div
          className={`${
            isEditDeletBoardModalVisible
              ? "flex flex-col absolute right-7 top-20 w-fit py-5 pl-5 pr-10 text-lg bg-gray-50 shadow-md gap-1 rounded-lg text-gray-400 dark:bg-zinc-700"
              : "hidden"
          }`}
          ref={ref}
        >
          <button
            id="editBoard"
            onClick={(e) => handleClick(e)}
            className="text-left hover:text-gray-300"
          >
            Edit Board
          </button>

          <button
            id="deleteBoard"
            onClick={(e) => handleClick(e)}
            className="text-red-400 hover:text-red-300"
          >
            Delete Board
          </button>
        </div>
      </div>

      {isDeleteBoardModalVisible && (
        <DeleteBoardModal
          setIsDeleteBoardModalVisible={setIsDeleteBoardModalVisible}
          isDeleteBoardModalVisible={isDeleteBoardModalVisible}
        />
      )}

      {isEditBoardModalVisible && (
        <EditBoardModal
          setIsEditBoardModalVisible={setIsEditBoardModalVisible}
          isEditBoardModalVisible={isEditBoardModalVisible}
          isEditDeletBoardModalVisible={isEditDeletBoardModalVisible}
        />
      )}
    </>
  );
}
