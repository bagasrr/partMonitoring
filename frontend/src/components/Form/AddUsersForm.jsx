import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormField from "../FormField";
import Button from "../../element/Button";
import { useDispatch } from "react-redux";
import { setNotification } from "../../features/notificationSlice";
import ErrorText from "../ErrorText";
import { createUser } from "../../utils/users";
import LoadingAnimate from "../LoadingAnimate";

const AddUsersForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      ...(name === "name" ? { name: value.toUpperCase() } : {}),
      ...(name === "role" && value === "user" ? { email: "" } : {}),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      await createUser(formData);
      setIsLoading(true);
      navigate("/users");
      dispatch(setNotification("User Added"));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setError(error.message);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      {isLoading && <LoadingAnimate isOpen={isLoading}>Adding Machine...</LoadingAnimate>}
      <FormField label="Username" name="name" type="text" value={formData.name} onChange={handleChange} placeholder={"Your Initial"} maxLength={3} />
      <FormField label="Role" name="role" type="select" value={formData.role} onChange={handleChange}>
        <option value="" disabled>
          Select Role
        </option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </FormField>
      {formData.role === "admin" && <FormField label="Email" name="email" type="text" value={formData.email} onChange={handleChange} placeholder={"youremail@example.whatever"} />}
      <FormField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder={"**********"} />
      <FormField label="Confirm Password" name="confPassword" type="password" value={formData.confPassword} onChange={handleChange} placeholder={"**********"} />
      {error && <ErrorText message={error} />}
      <Button type="submit" buttonName={"Submit"} />
    </form>
  );
};

export default AddUsersForm;
