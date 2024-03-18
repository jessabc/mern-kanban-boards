import { createContext, useState, useEffect } from "react";

export const Context = createContext();

export function ContextProvider({ children }) {
  const [boards, setBoards] = useState();

  const [currentBoardName, setCurrentBoardName] = useState("");

  const [currentBoardData, setCurrentBoardData] = useState({});

  const [theme, setTheme] = useState("light");

  return (
    <Context.Provider
      value={{
        boards,
        setBoards,
        currentBoardName,
        setCurrentBoardName,
        currentBoardData,
        setCurrentBoardData,
        theme,
        setTheme,
      }}
    >
      {children}
    </Context.Provider>
  );
}
