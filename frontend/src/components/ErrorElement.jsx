import { Link, useRouteError, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { TiHome } from "react-icons/ti";

const ErrorElement = () => {
  const error = useRouteError();
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6"
    >
      <motion.h1 initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="text-6xl font-extrabold drop-shadow-lg">
        Oops!
      </motion.h1>

      <p className="text-lg mt-4 text-center">Terjadi kesalahan saat mengakses halaman:</p>

      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }} className="bg-white text-gray-800 px-6 py-2 rounded-lg mt-4 shadow-lg">
        {location.pathname}
      </motion.div>

      <p className="text-sm mt-2 italic opacity-80">{error.statusText || error.message}</p>

      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }} className="mt-6">
        <Link to="/dashboard" className="px-6 py-3 flex items-center gap-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition">
          <TiHome className="text-2xl" /> Kembali ke Beranda
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default ErrorElement;
