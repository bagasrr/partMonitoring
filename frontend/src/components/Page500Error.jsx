const Error500 = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center border-4 border-green-500">
        <div className="text-9xl text-green-500 animate-bounce">💥</div>
        <h1 className="text-6xl font-bold text-green-700 mt-4">Oops!</h1>
        <p className="text-lg text-gray-700 mt-2">Something went wrong on our end. We’re working on it!</p>
        <a href="/" className="mt-6 inline-block px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default Error500;
