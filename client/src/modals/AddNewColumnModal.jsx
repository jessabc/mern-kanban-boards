import { useContext, useRef } from "react";
import { Context } from "../Context";
import { useForm, useFieldArray } from "react-hook-form";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import iconCross from "../assets/icon-cross.svg";
import axios from "axios";
import useAuthContext from "../hooks/useAuthContext";

export default function AddNewColumnModal({
  isAddNewColumnModalVisible,
  setIsAddNewColumnModalVisible,
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
  useOnClickOutside(ref, () => setIsAddNewColumnModalVisible(false));

  const columnsArray = currentBoardData?.columns;

  // react hook form
  // credit to https://react-hook-form.com/api/usefieldarray/
  // credit to https://codesandbox.io/s/react-hook-form-usefieldarray-rules-iyejbp?file=/src/index.js
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      name: currentBoardName,
      columns: columnsArray,
    },
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `${process.env.BACKEND_URL}/api/boards/${currentBoardData._id}`,
        data,
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

    setIsAddNewColumnModalVisible(false);
  };

  return (
    <>
      {/* overlay */}
      <div
        className={`${
          isAddNewColumnModalVisible
            ? "fixed top-0 left-0 w-screen h-screen bg-opacity-50 bg-gray-600   flex items-start justify-center dark:bg-gray-900 dark:bg-opacity-50"
            : ""
        }`}
      >
        <div
          className={`${
            isAddNewColumnModalVisible
              ? "w-3/4 sm:w-1/2  h-screen bg-gray-50 shadow-md    rounded-lg text-sm text-gray-400"
              : "hidden"
          } flex flex-col overflow-y-auto dark:bg-zinc-700`}
          ref={ref}
        >
          <button
            onClick={() => setIsAddNewColumnModalVisible(false)}
            className="ml-auto text-2xl bg-gray-200 p-2 rounded-md mt-1 mr-1"
          >
            <img src={iconCross} alt="cross icon to close modal" />
          </button>

          <div className=" m-5">
            <p className="font-semibold text-lg text-gray-900 mb-5 dark:text-zinc-100">
              Add New Column
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col ">
              <label htmlFor="name">Name</label>
              <input
                defaultValue={currentBoardName}
                {...register("name")}
                className="border-2 border-solid border-gray-300 rounded-sm py-1 my-1 text-gray-900 pl-2 outline-none focus:border-indigo-500 mb-2"
                disabled
              />

              <p>Columns</p>
              <ul>
                {fields.map((item, index) => {
                  return (
                    <li key={item.id} className="flex items-center">
                      <input
                        {...register(`columns.${index}.columnName`, {
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
                onClick={() => append({ columnName: "" })}
                className="text-indigo-500 bg-gray-200 rounded-full py-2 my-2 mt-3 w-full font-semibold "
              >
                +Add New Column
              </button>

              <input
                type="submit"
                value="Save Changes"
                className="text-gray-50 bg-indigo-500 hover:bg-indigo-400 rounded-full py-2 my-2 cursor-pointer"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
