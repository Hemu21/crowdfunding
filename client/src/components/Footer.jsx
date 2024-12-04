import React from 'react'
import { FaLinkedinIn } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="w-full dark:bg-gray-900 h-16 items-center flex justify-center bg-slate-200 text-center">
        <p className="text-wrap">
        Made with ❤️ by <a href="https://linkedin.com/in/hemu21" target="_blank" className="text-blue-500">Hemanth</a> and support 🌟 <a href="https://github.com/Hemu21/CF" target="_blank" className="text-blue-500">CF</a>
        </p>
    </div>
  )
}

export default Footer