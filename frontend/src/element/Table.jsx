export const TRow = ({ children, onClick }) => {
  return (
    <tr className="bg-white border-b hover:bg-gray-100 cursor-pointer" onClick={onClick}>
      {children}
    </tr>
  );
};
export const TableField = ({ children }) => <table className="min-w-full bg-white">{children}</table>;

export const ThData = ({ children, onClick, className }) => {
  return (
    <th onClick={onClick} className={`${className} cursor-pointer px-6 py-3 border-b border-gray-200 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider text-center sticky top-0 z-10 whitespace-nowrap`}>
      {children}
    </th>
  );
};

export const TData = ({ children, className }) => {
  return <td className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center ${className}`}>{children}</td>;
};

export const TableContainer = ({ children }) => {
  return <div className="overflow-auto max-h-[65vh] lg:max-h-[calc(100vh-150px)] ">{children}</div>;
};
