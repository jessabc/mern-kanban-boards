import { useEffect, useState, useContext, useRef } from "react";
import { Context } from "../Context";
import { useForm, useFieldArray } from "react-hook-form";
import { useStatusOptions } from "../hooks/useStatusOptions";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { useWindowSize } from "../hooks/useWindowSize";
import iconCross from "../assets/icon-cross.svg";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";

export default function AddNewTaskModal({
  setIsNewTaskModalVisible,
  isNewTaskModalVisible,
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

  const [statusOptionElements] = useStatusOptions();

  const size = useWindowSize();

  const ref = useRef();
  useOnClickOutside(ref, () => setIsNewTaskModalVisible(false));

  useEffect(() => {
    if (size.width > 640) {
      setIsNewTaskModalVisible(false);
    }
  }, [size.width]);

  // react hook form
  // credit to https://react-hook-form.com/api/usefieldarray/
  // credit to https://codesandbox.io/s/react-hook-form-usefieldarray-rules-iyejbp?file=/src/index.js
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      subtasks: [{ subtaskName: "", isCompleted: false }],
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
        `https://backend-url/api/boards/tasks/add/${currentBoardData._id}`,
        {
          ...data,
          status: data.status
            ? data.status
            : currentBoardData.columns[0].columnName,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setCurrentBoardData(response.data);
      setBoards((prev) =>
        prev.map((board) =>
          board.boardName === response.data.boardName ? response.data : board
        )
      );
    } catch (error) {
      console.log(error);
    }

    setIsNewTaskModalVisible(false);
    reset();
  };

  return (
    <>
      {/* overlay  */}
      <div
        className={`${
          isNewTaskModalVisible
            ? "fixed top-0 left-0 w-screen h-screen bg-opacity-50 bg-gray-600 flex items-start justify-center dark:bg-gray-900 dark:bg-opacity-50"
            : ""
        }`}
      >
        <div
          className={`${
            isNewTaskModalVisible
              ? "w-3/4 sm:w-1/2  h-screen bg-gray-50 shadow-md rounded-lg text-sm text-gray-400"
              : "hidden"
          } flex flex-col overflow-y-auto dark:bg-zinc-700`}
          ref={ref}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <button
              type="reset"
              onClick={() => setIsNewTaskModalVisible(false)}
              className="ml-auto text-2xl bg-gray-200 p-2 rounded-md mt-1 mr-1"
            >
              <img src={iconCross} alt="cross icon to close modal" />
            </button>

            <div className="m-10 flex flex-col">
              <p className="font-semibold text-lg text-gray-900 mb-5 dark:text-zinc-100">
                Add new task
              </p>

              {/* title */}
              <label htmlFor="title">Title</label>
              <input
                id="title"
                {...register("taskName")}
                className="border-2 border-solid border-gray-300 rounded-sm py-1 my-1 text-gray-900 pl-2 outline-none focus:border-indigo-500 mb-2"
              />

              {/* description */}
              <label htmlFor="description">Description</label>
              <input
                id="description"
                {...register("taskDescription")}
                className="border-2 border-solid border-gray-300 rounded-sm py-1 my-1 text-gray-900 pl-2 outline-none focus:border-indigo-500 mb-2"
              />

              {/* subtasks */}
              <label htmlFor="subtasks">Subtasks</label>

              <div>
                <ul>
                  {fields.map((item, index) => {
                    return (
                      <li key={item.id} className="flex items-center">
                        <input
                          {...register(
                            `subtasks.${index}.subtaskName`,
                            { required: true },
                            `subtasks.${index}.isCompleted:false`
                          )}
                          className="border-2 border-solid border-gray-300 rounded-sm py-1 my-1 text-gray-900 pl-2 outline-none focus:border-indigo-500 w-full mr-1"
                        />

                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="cursor-pointer "
                        >
                          <img
                            src={iconCross}
                            alt="cross icon to close modal"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <section>
                  <button
                    type="button"
                    onClick={() =>
                      append({ subtaskName: "", isCompleted: false })
                    }
                    className="text-indigo-500 bg-gray-200 rounded-full py-2 my-2 mt-3 w-full font-semibold"
                  >
                    + Add New Subtask
                  </button>
                </section>
              </div>

              {/* status */}
              <section className="my-2 flex flex-col ">
                <label htmlFor="">Status</label>
                <select
                  id="status"
                  {...register("status")}
                  className="border-2 border-solid border-gray-300 rounded-sm py-1 my-1  pl-2 outline-none focus:border-indigo-500 mb-2"
                >
                  {statusOptionElements}
                </select>
              </section>

              <input
                type="submit"
                value="Create Task"
                className="text-gray-50 bg-indigo-500 hover:bg-indigo-400 rounded-full py-2 my-2 cursor-pointer"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
