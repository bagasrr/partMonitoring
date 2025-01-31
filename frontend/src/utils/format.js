import { format } from "date-fns";

export const formatDate = (date) => {
  return format(new Date(date), "dd-MM-yyyy");
};

export const FormatStatusColor = (status, red, yellow, green, blue) => {
  switch (status) {
    case red:
      return "bg-red-100 text-red-700";
    case yellow:
      return "bg-yellow-100 text-yellow-700";
    case green:
      return "bg-green-100 text-green-700";
    case blue:
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-white text-gray-700";
  }
};
