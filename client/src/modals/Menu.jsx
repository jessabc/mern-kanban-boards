import { useState, useContext, useEffect, useRef } from "react";
import { Context } from "../Context";
import BoardLink from "../components/Header/BoardLink";
import CreateNewBoardModal from "./CreateNewBoardModal";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { useWindowSize } from "../hooks/useWindowSize";
import iconBoard from "../assets/icon-board.svg";
import iconDarkTheme from "../assets/icon-dark-theme.svg";
import iconLightTheme from "../assets/icon-light-theme.svg";
import iconHideSidbar from "../assets/icon-hide-sidebar.svg";
import iconShowSidbar from "../assets/icon-show-sidebar.svg";

export default function Menu({ isMenuModalVisible, setIsMenuModalVisible }) {
  const [isCreateNewBoardModalVisible, setIsCreateNewBoardModalVisible] =
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

  const ref = useRef();
  useOnClickOutside(ref, () => {
    if (size.width < 640) {
      setIsMenuModalVisible(false);
    }
  });

  const boardLinks = boards?.map((board, index) => (
    <BoardLink
      key={board._id}
      board={board}
      setIsMenuModalVisible={setIsMenuModalVisible}
    />
  ));

  function handleClick() {
    setIsCreateNewBoardModalVisible(true);
    setIsMenuModalVisible(false);
  }

  // light/dark theme
  // credit to https://www.youtube.com/watch?v=VylXkPy-MIc
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  function handleThemeSwitch() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <>
      {/* sliding menu, credit to https://dev.to/fayaz/making-a-navigation-drawer-sliding-sidebar-with-tailwindcss-blueprint-581l */}
      <nav className="sm:flex sm:fixed sm:w-full sm:items-center sm:justify-between  sm:z-10">
        <aside
          className={`sm:transform sm:top-28 sm:left-0 sm:w-60 sm:bg-gray-50
                    sm:dark:bg-zinc-800 sm:fixed sm:h-screen sm:ease-in-out sm:transition-all sm:duration-300 sm:z-30 ${
                      isMenuModalVisible
                        ? "sm:translate-x-0"
                        : "sm:-translate-x-full"
                    }`}
        >
          {/* menu */}
          <div className={`flex flex-col`}>
            {/* over lay credit to https://stackoverflow.com/questions/45607982/how-to-disable-background-when-modal-window-pops-up */}
            <div
              className={`${
                isMenuModalVisible && size.width < 640
                  ? "fixed top-0 left-0 w-screen h-screen bg-opacity-50 flex bg-gray-600 dark:bg-gray-900 dark:bg-opacity-50  items-start justify-center "
                  : ""
              }`}
            >
              {/* menu dropdown modal*/}
              <div
                className={`${
                  isMenuModalVisible
                    ? "mt-24  w-3/4  fixed h-content bg-gray-50 shadow-md  pt-5 pb-5 pr-5 rounded-lg  font-semibold text-gray-400 dark:bg-zinc-700 sm:dark:bg-zinc-800 sm:flex sm:flex-col"
                    : "hidden"
                }  sm:w-60 sm:top-0 sm:left-0 sm:absolute sm:h-[calc(100vh-7rem)] sm:rounded-none sm:mt-0 sm:pt-0 sm:pb-0`}
                ref={ref}
              >
                {/* nubmer of boards */}
                <p
                  className={`pl-5 text-xs tracking-widest mb-4 sm:pt-5 sm:pb-3`}
                >
                  {`ALL BOARDS (${boards?.length})`}
                </p>

                {/* board links */}
                {boardLinks}

                {/* create new board link */}
                <div className="flex items-center">
                  <img
                    src={iconBoard}
                    alt="icon"
                    className="w-4 h-4 mr-2 ml-5"
                  />
                  <button
                    onClick={handleClick}
                    className="hover:text-gray-300 text-indigo-500"
                  >
                    +Create New Board
                  </button>
                </div>

                {/* darkmode switch */}
                {/*credit to https://www.w3schools.com/howto/howto_css_switch.asp */}
                <div
                  className={`flex bg-gray-200 dark:bg-zinc-800 sm:dark:bg-zinc-900 mt-4 justify-center items-center gap-2 ml-7 mr-2 rounded-lg py-2 sm:mt-auto`}
                >
                  <img
                    src={iconLightTheme}
                    alt="icon light theme"
                    className="h-4"
                  />
                  {/* <!-- Rounded switch --> */}
                  <div>
                    <label className="switch">
                      <input type="checkbox" onClick={handleThemeSwitch} />
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <img
                    src={iconDarkTheme}
                    alt="icon dark theme"
                    className="h-4"
                  />
                </div>

                {/* hide sidebar */}

                <div
                  className="sm:flex sm:items-center sm:gap-2  sm:my-5 sm:ml-5 sm:cursor-pointer sm:text-gray-500 sm:text-sm hidden"
                  onClick={() => setIsMenuModalVisible(false)}
                >
                  <img
                    src={iconHideSidbar}
                    alt="hide sidebar icon"
                    className="w-4 h-4"
                  />
                  <p className="">Hide Sidebar</p>
                </div>

                {/* end menu dropdown modal */}
              </div>

              {/* end overlay */}
            </div>

            {/* end menu  */}
          </div>
        </aside>
      </nav>

      {/* show sidebar */}
      {!isMenuModalVisible && (
        <div
          onClick={() => setIsMenuModalVisible(true)}
          className="sm:bg-indigo-500 sm:p-2 sm:pr-3 sm:pl-3 sm:rounded-tr-full sm:rounded-br-full sm:cursor-pointer  sm:flex sm:justify-center sm:items-center sm:min-w-max sm:absolute sm:bottom-5 "
        >
          <img src={iconShowSidbar} alt="show sidebar icon" className="w-5" />
        </div>
      )}

      {/* create new board modal */}
      <div className={`${isCreateNewBoardModalVisible ? "block" : "hidden"}`}>
        <CreateNewBoardModal
          setIsCreateNewBoardModalVisible={setIsCreateNewBoardModalVisible}
          isCreateNewBoardModalVisible={isCreateNewBoardModalVisible}
          setIsMenuModalVisible={setIsMenuModalVisible}
        />
      </div>
    </>
  );
}
