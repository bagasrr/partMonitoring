import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser, reset, getMe, authSlice } from "../features/AuthSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { user, isError, isLoading, isSuccess, message } = useSelector((state) => state.auth);
  const { user, isError, isLoading, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [isSuccess, navigate, dispatch]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ username, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-3 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Login</h1>
        <form onSubmit={Auth} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200">
            {isLoading ? "Loading..." : "Login"}
          </button>
          {isError && <p className="text-red-500 text-center">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
