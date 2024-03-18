import React, { useState, useContext, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Context } from "../Context";
import EditOrDeleteTaskModal from "./EditOrDeleteTaskModal";
import EditTaskModal from "./EditTaskModal";
import { useStatusOptions } from "../hooks/useStatusOptions";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import iconCross from "../assets/icon-cross.svg";
import iconCheck from "../assets/icon-check.svg";
import iconVerticalEllipsis from "../assets/icon-vertical-ellipsis.svg";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";

export default function TaskModal({
  setIsTaskModalVisible,
  isTaskModalVisible,
  task,
  numCompletedSubtasks,
}) {
  const [count, setCount] = useState(numCompletedSubtasks);

  const [isEditTaskModalVisible, setIsEditTaskModalVisible] = useState(false);

  const [isEditDeleteTaskModalVisible, setIsEditDeleteTaskModalVisible] =
    useState();

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

  const [statusOptionElements] = useStatusOptions();

  const ref = useRef();
  useOnClickOutside(ref, () => setIsTaskModalVisible(false));

  let subtasksArray = task.subtasks;

  // react hook form
  // credit to https://react-hook-form.com/api/usefieldarray/
  // credit to https://codesandbox.io/s/react-hook-form-usefieldarray-rules-iyejbp?file=/src/index.js
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      subtasks: subtasksArray,
    },
    mode: "onChange",
  });
  const { fields } = useFieldArray({
    control,
    name: "subtasks",
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `${process.env.BACKEND_URL}/api/boards/tasks/subtasks/${currentBoardData._id}`,
        { ...data, _id: task._id, originalStatus: task.status, task },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCurrentBoardData(response.data);
      setBoards((prev) =>
        prev.map((board) =>
          board.boardName === currentBoardName ? response.data : board
        )
      );
    } catch (error) {
      console.log(error);
    }
    setIsTaskModalVisible(false);
  };

  function handleChange(e) {
    e.target.nextSibling.classList.toggle("line-through");

    // update count ie keep track of subtasks completed
    setCount((prev) => (e.target.checked ? prev + 1 : prev - 1));
  }

  function handleClick() {
    setIsTaskModalVisible(false);
    setCount(numCompletedSubtasks);
  }

  return (
    <>
      {/* // overlay */}
      <div
        className={`${
          isTaskModalVisible
            ? "fixed top-0 left-0 w-screen h-screen bg-opacity-50 bg-gray-600  flex items-start justify-center dark:bg-gray-900 dark:bg-opacity-50"
            : ""
        }`}
      >
        <div
          className={`${
            isTaskModalVisible
              ? "w-3/4 sm:w-1/2  h-screen bg-gray-50 shadow-md rounded-lg text-sm text-gray-400"
              : "hidden"
          } flex flex-col  overflow-y-auto dark:bg-zinc-700`}
          ref={ref}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {/* credit to https://codesandbox.io/s/react-hook-form-reset-v7-r7m5s to reset checkboxes if close modal without submitting form */}
            <button
              type="reset"
              onClick={handleClick}
              className="ml-auto text-2xl bg-gray-200 p-2 rounded-md mt-1 mr-1"
            >
              {" "}
              <img src={iconCross} alt="cross to close modal" />
            </button>

            <div className="m-10">
              <div className="flex">
                <p className="font-semibold text-lg text-gray-900 mb-5 dark:text-zinc-100">
                  {task.taskName}
                </p>

                {/* edit/delete task button -*/}
                <div className="ml-auto">
                  <div
                    onClick={() =>
                      setIsEditDeleteTaskModalVisible((prev) => !prev)
                    }
                  >
                    <img
                      src={iconVerticalEllipsis}
                      alt="vertical ellipsis"
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                {/* edit/delete task modal */}
                <div>
                  <EditOrDeleteTaskModal
                    task={task}
                    isEditDeleteTaskModalVisible={isEditDeleteTaskModalVisible}
                    setIsEditDeleteTaskModalVisible={
                      setIsEditDeleteTaskModalVisible
                    }
                    setIsTaskModalVisible={setIsTaskModalVisible}
                    isTaskModalVisible={isTaskModalVisible}
                    setIsEditTaskModalVisible={setIsEditTaskModalVisible}
                  />
                </div>
              </div>

              <p className="mb-3">
                {task.description ? task.description : "No description"}
              </p>

              <p className="text-gray-600 font-semibold mb-3">
                Subtasks ({count} of {task.subtasks.length})
              </p>

              {/* subtasks */}
              <ul>
                {fields.map((subtask, index) => {
                  return (
                    <li
                      key={subtask.id}
                      className="flex items-center my-3 bg-gray-200 py-2 rounded-lg pl-2"
                    >
                      <input
                        style={{ backgroundImage: `url(${iconCheck})` }}
                        {...register(`subtasks.${index}.isCompleted`)}
                        type="checkbox"
                        defaultChecked={subtask.isCompleted}
                        onChange={(e) => handleChange(e, subtask)}
                        className={`appearance-none border border-slate-400  h-5 w-5  bg-no-repeat bg-center rounded-sm bg-white checked:bg-indigo-500`}
                      />

                      <label
                        htmlFor={subtask.subtaskName}
                        id={subtask.subtaskName}
                        className={`text-gray-900 font-semibold text-xs ml-3 ${
                          subtask.isCompleted ? "line-through" : ""
                        }`}
                      >
                        {subtask.subtaskName}
                      </label>
                    </li>
                  );
                })}
              </ul>

              {/* status */}
              <section className="my-2 flex flex-col mt-5">
                <p>Status</p>
                <select
                  id="status"
                  {...register("status")}
                  className="border-2 border-solid border-gray-300 rounded-sm py-1 my-1  pl-2 outline-none focus:border-indigo-500 mb-2"
                  // defaultValue={task.status}
                >
                  {statusOptionElements}
                </select>
              </section>

              <input
                type="submit"
                value="Save Changes"
                className="text-gray-50 bg-indigo-500 hover:bg-indigo-400 rounded-full py-2 my-2 w-full cursor-pointer"
              />
            </div>
          </form>

          {isEditTaskModalVisible && (
            <EditTaskModal
              task={task}
              isEditTaskModalVisible={isEditTaskModalVisible}
              setIsEditTaskModalVisible={setIsEditTaskModalVisible}
              setIsTaskModalVisible={setIsTaskModalVisible}
            />
          )}
        </div>
      </div>
    </>
  );
}
