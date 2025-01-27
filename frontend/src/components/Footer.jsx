import React from "react";
import { FaFire } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white text-center py-4 flex justify-center items-center gap-2">
      <p className="flex items-center gap-2">
        Made with <FaFire /> by
      </p>
      <div className="flex items-center gap-2">
        <a href="https://www.instagram.com/barra.adhan/" target="_blank" className="hover:underline">
          Bagas Ramadhan Rusnadi
        </a>
        <p>&copy; 2025</p>
      </div>
    </div>
  );
};

export default Footer;
