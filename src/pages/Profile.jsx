import { useState, useEffect } from "react";
import { getUserById, updateUser } from "../utils/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "../features/notificationSlice";
import { Button, NormalInput, PasswordInput } from "../element/Input";
import BackPrev from "../element/BackPrev";
import { Helmet } from "react-helmet-async";
import { ReadOnlyForm } from "../components/FormField";
import LoadingAnimate from "../components/LoadingAnimate";

const Profile = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const User = await getUserById(user.uuid); // Mendapatkan detail User berdasarkan id
    setName(User.name);
    setRole(User.role);
    setEmail(User.email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name,
        role,
        password,
        confPassword: confirmPassword,
        email,
      };
      setIsLoading(true);
      await updateUser(user.uuid, data);
      dispatch(setNotification("User Edit Success"));
      setIsLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setIsLoading(false);
      setError(error.response.data.message);
    }
  };

  return (
    <>
      <LoadingAnimate isLoading={isLoading} />
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <Helmet>
          <title>Profile | Part Monitoring</title>
        </Helmet>
        <h1 className="text-2xl font-bold text-center mb-4">Profile</h1>
        <form onSubmit={handleSubmit}>
          <NormalInput value={name} type="text" id="name" onChange={(e) => setName(e.target.value)} label="User Name" autoComplete="userName" />

          <div>
            <ReadOnlyForm label="Role" name="role" value={role} />
          </div>
          {role === "admin" && <NormalInput value={email} type="email" id="email" onChange={(e) => setEmail(e.target.value)} label="Email" placeholder="Email" />}

          <PasswordInput value={password} type="password" id="password" onChange={(e) => setPassword(e.target.value)} label="New Password" placeholder={"*********"} />

          <PasswordInput value={confirmPassword} type="password" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} label="Confirm Password" placeholder={"*********"} />

          {error && <p className="text-red-500 font-bold text-center text-sm my-2">{error}</p>}
          <div className="flex flex-col gap-4">
            <Button type="submit">Save</Button>
            <BackPrev url="/dashboard" />
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
