import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearDeleted, clearNotification } from "../features/notificationSlice";

const useNotification = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification.message); // Use Redux selector
  const someDeleted = useSelector((state) => state.notification.deleted);

  useEffect(() => {
    // Clear notification after a few seconds
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
        dispatch(clearDeleted());
      }, 6000); // Adjust the time as needed
      return () => clearTimeout(timer); // Cleanup the timer on unmount or when notification changes
    }
  }, [notification, dispatch]);

  return { notification, someDeleted }; // Return as object
};

export default useNotification;
