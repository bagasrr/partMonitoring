import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TiHome } from "react-icons/ti";

const YoureNotAdmin = () => {
  const [windows, setWindows] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWindows((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          x: Math.random() * window.innerWidth - 200,
          y: Math.random() * window.innerHeight - 200,
        },
      ]);
    }, 400); // Pop-up muncul setiap 0.5 detik

    setTimeout(() => clearInterval(interval), 5000); // Stop setelah 5 detik
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-red-900 overflow-hidden">
      <Helmet>
        <title>🚨 ERROR 403! | Part Monitoring</title>
      </Helmet>

      {/* Fake Windows Pop-ups */}
      {windows.map((win) => (
        <motion.div
          key={win.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          drag
          className="absolute bg-white p-4 border border-black shadow-2xl w-52 rounded-md"
          style={{ left: win.x, top: win.y }}
        >
          <h2 className="text-lg font-bold text-red-600">🚨 ERROR!!!</h2>
          <p className="text-sm text-gray-700">Unauthorized Access</p>
        </motion.div>
      ))}

      {/* Pesan utama */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="bg-black text-white p-10 rounded-xl shadow-lg border-2 border-red-700 text-center">
        <motion.h1 className="text-5xl font-extrabold text-red-500 mb-6" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          🚨 SYSTEM ERROR 🚨
        </motion.h1>
        <p className="text-lg mb-4">You have been blocked from this page!</p>

        {/* Tombol Back */}
        <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
          <Link to="/dashboard" className="flex items-center justify-center px-6 py-3 bg-white text-red-600 font-bold text-lg rounded-md shadow-md border border-red-700 hover:bg-red-700 hover:text-white transition-all">
            <TiHome className="mr-2 text-2xl" />
            Go Back
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default YoureNotAdmin;
