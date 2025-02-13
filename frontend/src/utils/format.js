import { format } from "date-fns";

export const formatDate = (date) => {
  return format(new Date(date), "dd-MM-yyyy");
};

export const FormatStatusColor = (status, red, yellow, green, blue) => {
  return status.includes(red)
    ? "bg-red-100 text-red-700"
    : [yellow].flat().some((y) => status.includes(y))
    ? "bg-yellow-100 text-yellow-700"
    : status.includes(green)
    ? "bg-green-100 text-green-700"
    : status.includes(blue)
    ? "bg-blue-100 text-blue-700"
    : "bg-white text-gray-700"; // default
};
