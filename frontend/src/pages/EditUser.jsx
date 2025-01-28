import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getUserById } from "../utils/users";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setNotification } from "../features/notificationSlice";
import { Button, NormalInput, PasswordInput } from "../element/Input";
import { adminArea } from "../utils/adminArea";
import BackPrev from "../element/BackPrev";

const EditUser = () => {
  adminArea();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const User = await getUserById(id); // Mendapatkan detail User berdasarkan id
    setName(User.name);
    setRole(User.role);
    setEmail(User.email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:4000/api/users/${id}`, {
        name: name,
        role: role,
        password: password,
        confPassword: confirmPassword,
        email,
      });
      dispatch(setNotification("User Edit Success"));
      navigate("/users");
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">Edit User</h1>
        <form onSubmit={handleSubmit}>
          <NormalInput value={name} type="text" id="name" onChange={(e) => setName(e.target.value)} label="User Name" autoComplete="userName" />

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>

            <select
              name="role"
              id="role"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {name && role === "admin" ? (
                <>
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </>
              ) : (
                <>
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </>
              )}
            </select>
          </div>
          <NormalInput value={email} type="email" id="email" onChange={(e) => setEmail(e.target.value)} label="Email" placeholder="Email" />

          <PasswordInput value={password} type="password" id="password" onChange={(e) => setPassword(e.target.value)} label="New Password" placeholder={"*********"} />

          <PasswordInput value={confirmPassword} type="password" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} label="Confirm Password" placeholder={"*********"} />

          {error && <p className="text-red-500 font-bold text-center text-sm my-2">{error}</p>}
          <div className="flex flex-col gap-4">
            <Button type="submit">Save</Button>
            <BackPrev url="/users" />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditUser;
