export const ErrorModalBox = ({ message, onClick }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClick}>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <p className="mb-4">{message}</p>
        <span>tap to close</span>
      </div>
    </div>
  );
};
