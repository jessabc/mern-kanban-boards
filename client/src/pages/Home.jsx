import Header from "../components/Header/Header";
import Main from "../components/Main/Main";
import { useEffect, useState, useContext } from "react";
import { Context } from "../Context";
import useAuthContext from "../hooks/useAuthContext";
import axios from "axios";
import React from "react";

function Home() {
  const [isMenuModalVisible, setIsMenuModalVisible] = useState(false);

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

  useEffect(() => {
    const getBoards = async () => {
      try {
        const response = await axios.get(
          `${process.env.BACKEND_URL}/api/boards`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setBoards(response.data);
        setCurrentBoardName(response.data[0].boardName);
        setCurrentBoardData(response.data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    getBoards();
  }, []);

  return (
    //sticky header credit to https://dev.to/cryptic022/sticky-header-and-footer-with-tailwind-2oik
    <div className="flex flex-col h-screen ">
      <Header
        isMenuModalVisible={isMenuModalVisible}
        setIsMenuModalVisible={setIsMenuModalVisible}
      />
      <Main
        isMenuModalVisible={isMenuModalVisible}
        setIsMenuModalVisible={setIsMenuModalVisible}
      />
    </div>
  );
}

export default Home;
