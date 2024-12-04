import React, { useEffect, useState } from "react";
import { ConnectButton } from "thirdweb/react";
import { client } from "../client";
import { useWeb3Context } from "../context/Web3Context";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useNavigate, NavLink } from "react-router";

const NavBar = () => {
  const { theme, toggleTheme, account } = useWeb3Context();
  const activePath = window.location.pathname;

  return (
    <div
      className={`dark:bg-gray-900 bg-slate-200 sticky top-0 z-20 flex items-center justify-between px-3 h-20`}
    >
      <div className="px-5 flex gap-5">
        <div>
          <a href="/" className="font-bold cursor-pointer text-3xl font-serif">CF</a>
        </div>
        <div className="flex">
          <a
            href="/"
            className={`mx-3 ${
              activePath == "/" ? "border-b-4 font-semibold" : ""
            } border-black dark:border-white pb-2 text-xl`}
          >
            Home
          </a>

          {account && (
            <a
              href={"/dashboard"}
              className={`mx-3 ${
                activePath == "/dashboard" ? "border-b-4 font-semibold" : ""
              } border-black dark:border-white pb-2 text-xl`}
            >
              Dashboard
            </a>
          )}
        </div>
      </div>
      <div className="flex justify-between w-1/6 gap-3 px-5">
        <ConnectButton
          theme={theme}
          client={client}
          autoConnect
          showAllWallets
        />
        <button className="text-3xl" onClick={toggleTheme}>
          {theme !== "light" ? (
            <MdDarkMode className="text-white" />
          ) : (
            <MdLightMode />
          )}
        </button>
      </div>
    </div>
  );
};

export default NavBar;
