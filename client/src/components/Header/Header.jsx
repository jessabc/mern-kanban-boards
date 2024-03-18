import { useContext, useState } from "react";
import { Context } from "../../Context";
import EditOrDeleteBoardModal from "../../modals/EditOrDeleteBoardModal";
import AddNewTaskModal from "../../modals/AddNewTaskModal";
import { useWindowSize } from "../../hooks/useWindowSize";
import logoMobile from "../../assets/logo-mobile.svg";
import iconVerticalEllipsis from "../../assets/icon-vertical-ellipsis.svg";
import iconAddTaskMobile from "../../assets/icon-add-task-mobile.svg";
import iconChevronDown from "../../assets/icon-chevron-down.svg";
import iconChevronUp from "../../assets/icon-chevron-up.svg";
import logoLight from "../../assets/logo-dark.svg";
import logoDark from "../../assets/logo-light.svg";
import User from "./User";

export default function Header({ isMenuModalVisible, setIsMenuModalVisible }) {
  const [isNewTaskModalVisible, setIsNewTaskModalVisible] = useState();
  const [isEditDeletBoardModalVisible, setIsEditDeletBoardModalVisible] =
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

  const size = useWindowSize();

  return (
    <div className="flex">
      {/* desktop logo */}

      <div className="sm:flex sm:items-center sm:w-80  sm:h-full sm:pl-5 sm:dark:bg-zinc-800 hidden">
        {theme === "dark" ? (
          <img src={logoDark} alt="logo dark theme icon" className="" />
        ) : (
          <img src={logoLight} alt="logo light theme icon" className="" />
        )}
      </div>

      <div className="flex w-full px-10 py-10 items-center dark:bg-zinc-800 sm:pl-0">
        {/* mobile logo */}
        <img
          src={logoMobile}
          alt="mobile logo icon"
          className="mr-3 sm:hidden"
        />

        {/* menu */}
        <div
          onClick={() => setIsMenuModalVisible((prev) => !prev)}
          className="flex gap-1 cursor-pointer sm:cursor-default"
        >
          {/* current board name on display */}
          <p className="font-bold text-xl -mb-1 dark:text-zinc-100 sm:font-semibold sm:text-xl sm:-mb-1 sm:dark:text-zinc-100 sm:block">
            {currentBoardName}
          </p>
          {/* chevron */}
          <div
            className={`${
              isMenuModalVisible ? "ml-1 mt-auto mb-auto" : "mt-auto ml-1"
            } sm:hidden`}
          >
            <div>
              <img
                src={iconChevronDown}
                alt="down chevron icon"
                className={`${isMenuModalVisible ? "hidden" : "block"} `}
              />
            </div>
            <div>
              <img
                src={iconChevronUp}
                alt="up chevron icon"
                className={`${isMenuModalVisible ? "block" : "hidden"}`}
              />
            </div>
          </div>
        </div>

        {/* add new task */}
        <div className="ml-auto mt-auto mr-3">
          {/*button for add new task modal */}
          <button
            onClick={() => setIsNewTaskModalVisible(true)}
            className={`bg-indigo-500 py-1 px-3 rounded-full
                        sm:w-content sm:py-1 sm:px-3 sm:text-md sm:bg-indigo-500 sm:font-bold sm:text-indigo-50 sm:rounded-full sm:cursor-pointer sm:pb-1 hover:bg-indigo-400`}
          >
            {size.width < 640 ? (
              <img
                src={iconAddTaskMobile}
                alt="plus icon to add task"
                className="w-4 h-4"
              />
            ) : (
              "+ Add New Task"
            )}
          </button>

          {/* add new task modal */}
          <div className={`${isNewTaskModalVisible ? "block" : "hidden"}`}>
            <AddNewTaskModal
              boards={boards}
              currentBoardName={currentBoardName}
              isNewTaskModalVisible={isNewTaskModalVisible}
              setIsNewTaskModalVisible={setIsNewTaskModalVisible}
            />
          </div>
        </div>

        {/* edit or delete board */}
        <div className="flex flex-col">
          {/* button for edit or delete board */}
          <button
            onClick={setIsEditDeletBoardModalVisible}
            className="mt-auto hover:bg-indigo-100 dark:hover:bg-gray-700 hover:p-2 hover:pb-1 hover:rounded-full p-2 pb-1 cursor-pointer"
          >
            <img
              src={iconVerticalEllipsis}
              alt="vertical ellipsis icon"
              className="cursor-pointer"
            />
          </button>

          {/* add/delete board modal*/}
          <div>
            <EditOrDeleteBoardModal
              isEditDeletBoardModalVisible={isEditDeletBoardModalVisible}
              setIsEditDeletBoardModalVisible={setIsEditDeletBoardModalVisible}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
