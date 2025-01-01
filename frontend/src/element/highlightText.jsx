// import React from "react";

// const highlightText = (text, query) => {
//   console.log("expected string but got:", text);
//   if (!query) {
//     return text;
//   }
//   const regex = new RegExp(`(${query})`, "gi");
//   const parts = text.split(regex);
//   return parts.map((part, index) =>
//     regex.test(part) ? (
//       <span key={index} className="bg-green-300">
//         {part}
//       </span>
//     ) : (
//       part
//     )
//   );
// };

const highlightText = (text, query) => {
  // Konversi nilai text menjadi string jika bukan string
  if (typeof text !== "string") {
    console.log("expected string but got:", text);
    text = text.toString();
  }
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
