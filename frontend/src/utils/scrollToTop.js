import React, { useEffect } from "react";

const ScrollToTop = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100); // 1000 ms = 1 detik

    // Bersihkan timer ketika komponen di-unmount
    return () => clearTimeout(timer);
  }, []);

  return null; // Komponen ini tidak perlu mengembalikan elemen DOM apa pun
};

export default ScrollToTop;
