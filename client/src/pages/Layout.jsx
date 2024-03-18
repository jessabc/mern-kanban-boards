import { Outlet } from "react-router-dom";
import React from "react";
import User from "../components/Header/User";

const Layout = () => {
  return (
    <div className=" text-slate-900 ">
      <div className="flex dark:bg-zinc-800 dark:text-zinc-100 ">
        <User />
      </div>

      <Outlet />
    </div>
  );
};

export default Layout;
