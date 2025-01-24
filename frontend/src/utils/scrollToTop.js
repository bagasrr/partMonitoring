import React, { useEffect } from "react";

const scrollToTop = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
};

export default scrollToTop;
