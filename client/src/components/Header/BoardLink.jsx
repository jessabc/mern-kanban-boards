import { useContext, useEffect } from "react";
import { Context } from "../../Context";
import { useWindowSize } from "../../hooks/useWindowSize";
import iconBoard from "../../assets/icon-board.svg";

export default function BoardLink({ board, setIsMenuModalVisible }) {
  const { boards, currentBoardName, setCurrentBoardName, setCurrentBoardData } =
    useContext(Context);

  const size = useWindowSize();

  // updates board name on display, and closes menu modal
  function handleClick() {
    setCurrentBoardName(board.boardName);
    if (size.width < 640) {
      setIsMenuModalVisible(false);
    }

    setCurrentBoardData(board);
  }

  return (
    <div
      className={`${
        currentBoardName === board.boardName
          ? "bg-indigo-500 text-gray-50 rounded-tr-full rounded-br-full hover:bg-indigo-500 hover:text-gray-50 hover:rounded-tr-full hover:rounded-br-full py-3 w-full"
          : "hover:text-gray-50 hover:bg-indigo-400  hover:rounded-tr-full py-3  hover:rounded-br-full "
      } flex items-center gap-2  my-1 cursor-pointer`}
      onClick={handleClick}
    >
      <img
        src={iconBoard}
        alt="icon"
        className={`w-4 h-4 ml-5 ${
          currentBoardName === board.boardName ? "ml-0  " : " "
        } `}
      />
      <p className=" ">{board.boardName}</p>
    </div>
  );
}
