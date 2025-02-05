import React from "react";
import useNotification from "../hooks/UseNotification";

const NotificationBar = () => {
  const { notification, someDeleted } = useNotification();
  return (
    <>
      {notification && (
        <div className={`${someDeleted ? "bg-rose-100 border border-rose-400 text-rose-700" : "bg-green-100 border border-green-400 text-green-700"} px-4 py-3 rounded relative mb-4`} role="alert">
          <strong className="font-bold">{someDeleted ? "" : "Success! "}</strong>
          <span className={`block sm:inline ${someDeleted ? "text-rose-700" : ""}`}>{notification}</span>
        </div>
      )}
    </>
  );
};

export default NotificationBar;
