import useAuthContext from "./useAuthContext";
import { Context } from "../Context";
import { useContext } from "react";

const useLogout = () => {
  const { dispatch: authDispatch } = useAuthContext();

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

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    setBoards(null);
    setCurrentBoardName("");
    setCurrentBoardData({});
    localStorage.removeItem("user");
  };

  return logout;
};

export default useLogout;
