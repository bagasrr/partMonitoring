import React, { useState } from "react";
import { Button, Label, NormalInput } from "../element/Input";
import Layout from "./layout";
import { useNavigate } from "react-router-dom";
import { adminArea } from "../utils/adminArea";
import { createUser } from "../utils/users";
import { useDispatch } from "react-redux";
import BackPrev from "../element/BackPrev";

const AddUser = () => {
  adminArea();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: userName,
      role,
      password,
      confPassword,
      email,
    };
    console.log(data);
    try {
      await createUser(data);
      navigate("/users");
      dispatch(setNotification("User Added"));
    } catch (error) {
      setError(error.response.data.message);
    }
  };
  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Add User</h1>
        <form onSubmit={handleSubmit}>
          <NormalInput label="Username" id="username" type="text" onChange={(e) => setUserName(e.target.value)} maxLength={3} placeholder="Masukkan Inisial" />
          <div className="mb-4 flex flex-col">
            <Label htmlFor="role">Role</Label>
            <select
              name="role"
              id="role"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(e) => setRole(e.target.value)}
              required
              defaultValue={""}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          {role === "admin" && <NormalInput label="Email" id="email" type="email" onChange={(e) => console.log(e.target.value)} placeholder="Masukkan Email" />}
          <NormalInput label="Password" id="password" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="***********" />
          <NormalInput label="Confirm Password" id="confPassword" type="password" onChange={(e) => setConfPassword(e.target.value)} placeholder="***********" isError={error} />
          {error && <p className="text-red-500 mt-4 text-sm font-bold text-center mb-4">{error}</p>}
          <div className="flex flex-col gap-4 ">
            <Button type="submit">Add User</Button>
            <BackPrev url="/users" />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddUser;
