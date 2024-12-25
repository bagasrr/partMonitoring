import React from "react";

const highlightText = (text, query) => {
  if (!query) {
    return text;
  }
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-green-300">
        {part}
      </span>
    ) : (
      part
    )
  );
};

export default highlightText;
