import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import Footer from "../components/Footer";
import { useUpdatePasswordMutation } from "../features/api/authApi";
import { setLogoutUser } from "../features/slice/userSlice";

const EditPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState(null);

  const [updatePassword, { isLoading, isSuccess, error, data }] =
    useUpdatePasswordMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validatePassword = () => {
    let error = {};
    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{6,}$/.test(
        newPassword
      )
    )
      error.password =
        "Minimum length of 6 with 1 upper, 1 lower, digit and special char atleast";
    setErrors(error);
    return Object.keys(error).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    // submit data
    updatePassword({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
  };

  useEffect(() => {
    if (error) {
      setErrors(error.data.errors);
    }

    if (isSuccess && data) {
      toast.success(data?.message);
      dispatch(setLogoutUser(null));
      navigate("/");
    }
  }, [error, isSuccess, data, navigate, dispatch]);

  return (
    <>
      <Navbar />

      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="shadow p-5 rounded w-full max-w-md">
          <h3 className="text-center text-2xl font-medium">Update Password</h3>
          <form onSubmit={handleSubmit}>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="email_icon" />
              <input
                type="password"
                className="outline-none text-sm"
                name="currentPassword"
                onChange={(e) => setCurrentPassword(e.target.value)}
                value={currentPassword}
                placeholder="Current Password.."
                required
              />
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="lock_icon" />
              <input
                type="password"
                className="outline-none text-sm"
                name="password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                placeholder="New Password.."
                required
              />
            </div>

            {/* error display for fronend validation */}
            {errors !== null &&
              typeof errors === "object" &&
              errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}

            {/* errors display for backend validation */}
            {errors !== null &&
              Array.isArray(errors) &&
              errors?.length > 0 &&
              errors?.map((err, i) => (
                <p key={i} className="text-sm text-red-600 mt-1 mb-1">
                  {err}
                </p>
              ))}
            <button
              type="submit"
              className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
              disabled={isLoading}
            >
              Update
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default EditPassword;
