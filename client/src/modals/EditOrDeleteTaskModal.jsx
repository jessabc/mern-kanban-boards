import { useRef, useState } from "react";
import DeleteTaskModal from "./DeleteTaskModal";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

export default function EditOrDeleteTaskModal({
  task,
  isEditDeleteTaskModalVisible,
  setIsEditDeleteTaskModalVisible,
  setIsTaskModalVisible,
  setIsEditTaskModalVisible,
}) {
  const [isDeleteTaskModalVisible, setIsDeleteTaskModalVisible] =
    useState(false);

  const ref = useRef();
  useOnClickOutside(ref, () => {
    setIsEditDeleteTaskModalVisible(false);
  });

  function handleClick(e) {
    if (e.target.id === "editTask") {
      setIsEditTaskModalVisible(true);
    } else {
      setIsDeleteTaskModalVisible(true);
    }
    setIsEditDeleteTaskModalVisible(false);
  }

  return (
    <div className="relative">
      {/* overlay */}
      <div
        className={`${
          isEditDeleteTaskModalVisible
            ? "fixed top-0 left-0 w-screen h-screen bg-opacity-50 bg-gray-600  flex items-start justify-center dark:bg-gray-900 dark:bg-opacity-50"
            : ""
        }`}
      >
        <div
          className={`${
            isEditDeleteTaskModalVisible
              ? "flex flex-col absolute right-20 top-28 sm:right-60 md:right-70 lg:right-80  w-fit py-5 pl-5 pr-10  text-lg bg-gray-50 shadow-md gap-1 rounded-lg text-gray-400 dark:bg-zinc-700"
              : "hidden"
          }`}
          ref={ref}
        >
          <button
            type="button"
            id="editTask"
            onClick={(e) => handleClick(e)}
            className="text-left hover:text-gray-300"
          >
            Edit Task
          </button>

          <button
            type="button"
            id="deleteTask"
            onClick={(e) => handleClick(e)}
            className="text-red-400 hover:text-red-300"
          >
            Delete Task
          </button>
        </div>
      </div>

      {isDeleteTaskModalVisible && (
        <DeleteTaskModal
          task={task}
          isDeleteTaskModalVisible={isDeleteTaskModalVisible}
          setIsDeleteTaskModalVisible={setIsDeleteTaskModalVisible}
          setIsTaskModalVisible={setIsTaskModalVisible}
        />
      )}
    </div>
  );
}
