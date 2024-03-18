import React from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../../hooks/useAuthContext";
import useLogout from "../../hooks/useLogout";
import Dropdown from "./Dropdown";

const User = () => {
  const { user } = useAuthContext();

  const logout = useLogout();

  const handleClick = () => {
    logout();
  };

  return (
    <div className=" flex justify-end items-center   mt-5 pr-10 sm:pr-12  dark:bg-zinc-800 dark:text-zinc-100 fixed  w-full">
      {user ? (
        <div className="  text-sm items-end gap-1 hidden sm:flex ">
          <p className="font-bold  text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 ">
            {user.email}{" "}
          </p>
          <p className="font-bold  text-zinc-00  ">|</p>
          <button
            onClick={handleClick}
            className="font-bold  text-zinc-900  hover:text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
          >
            Logout
          </button>
        </div>
      ) : (
        <nav className=" gap-4 text-sm hidden sm:flex ">
          <Link
            to="/login"
            className="font-bold  text-zinc-900 rounded-lg p-3 hover:text-zinc-600"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="font-bold bg-zinc-800 text-zinc-100 rounded-lg p-3 hover:bg-zinc-700"
          >
            Sign up
          </Link>
        </nav>
      )}

      <div className="sm:hidden">
        <Dropdown handleClick={handleClick} />
      </div>
    </div>
  );
};

export default User;
