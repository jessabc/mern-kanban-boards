import { useContext, useRef } from "react";
import { Context } from "../Context";
import { useForm, useFieldArray } from "react-hook-form";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import iconCross from "../assets/icon-cross.svg";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";

export default function EditTaskModal({
  isEditTaskModalVisible,
  setIsEditTaskModalVisible,
  task,
  setIsTaskModalVisible,
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
  useOnClickOutside(ref, () => {
    setIsEditTaskModalVisible(false);
    setIsTaskModalVisible(false);
  });

  const subtasksArray = task.subtasks;

  const statusOptionElements = currentBoardData?.columns.map(
    (option, index) => (
      <option key={index} value={option.columnName}>
        {option.columnName}
      </option>
    )
  );

  // react hook form
  // credit to https://react-hook-form.com/api/usefieldarray/
  // credit to https://codesandbox.io/s/react-hook-form-usefieldarray-rules-iyejbp?file=/src/index.js
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subtasks: subtasksArray,
    },
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtasks",
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `https://backend-url/api/boards/tasks/edit/${currentBoardData._id}`,
        { ...data, _id: task._id, originalStatus: task.status },
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

    setIsEditTaskModalVisible(false);
    setIsTaskModalVisible(false);
  };

  function handleClick() {
    setIsEditTaskModalVisible(false);
    setIsTaskModalVisible(false);
  }

  return (
    // overlay
    <div
      className={`${
        isEditTaskModalVisible
          ? "fixed top-0 left-0 w-screen h-screen bg-opacity-50 bg-gray-600  flex items-start justify-center dark:bg-gray-900 dark:bg-opacity-50"
          : ""
      }`}
    >
      <div
        className={`${
          isEditTaskModalVisible
            ? "w-3/4 sm:w-1/2 h-screen bg-gray-50 shadow-md rounded-lg text-sm text-gray-400"
            : "hidden"
        } flex flex-col  overflow-y-auto dark:bg-zinc-700}`}
        ref={ref}
      >
        <button
          onClick={handleClick}
          className="ml-auto text-2xl bg-gray-200 p-2 rounded-md mt-1 mr-1"
        >
          <img src={iconCross} alt="cross icon to close modal" />
        </button>

        <div className=" m-5">
          <p className="font-semibold text-lg text-gray-900 mb-5 dark:text-zinc-100">
            Edit Tasks
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <label htmlFor="title">Title</label>
            <input
              defaultValue={task.taskName}
              {...register("taskName")}
              className="border-2 border-solid border-gray-300 rounded-sm py-1 my-1 text-gray-900 pl-2 outline-none focus:border-indigo-500 mb-2"
            />

            <label htmlFor="description">Description</label>
            <input
              defaultValue={task.taskDescription}
              {...register("taskDescription")}
              className="border-2 border-solid border-gray-300 rounded-sm py-1 my-1 text-gray-900 pl-2 outline-none focus:border-indigo-500 mb-2"
            />

            <p>Subtasks</p>
            <ul>
              {fields.map((item, index) => {
                return (
                  <li key={item.id} className="flex items-center">
                    <input
                      {...register(`subtasks.${index}.subtaskName`, {
                        required: true,
                      })}
                      className="border-2 border-solid border-gray-300 rounded-sm py-1 my-1 text-gray-900 pl-2 outline-none focus:border-indigo-500 w-full mr-1"
                    />
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="cursor-pointer"
                    >
                      <img src={iconCross} alt="cross icon to close modal" />
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => {
                append({ subtaskName: "", isCompleted: false });
              }}
              className="text-indigo-500 bg-gray-200 rounded-full py-2 my-2 mt-3 w-full font-semibold"
            >
              +Add New Subtask
            </button>

            <section className="my-2 flex flex-col">
              <p>Status</p>
              <select
                id="status"
                {...register("status")}
                className="border-2 border-solid border-gray-300 rounded-sm py-1 my-1 pl-2 outline-none focus:border-indigo-500 mb-2"
                // defaultValue={task.status}
              >
                {statusOptionElements}
              </select>
            </section>

            <input
              type="submit"
              className="text-gray-50 bg-indigo-500 hover:bg-indigo-400 rounded-full py-2 my-2 cursor-pointer"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
