import { useState } from "react";
import { toast } from "react-toastify";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../features/api/authApi";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [errMsg, setErrMsg] = useState(null);
  const [apiErrors, setApiErrors] = useState([]);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
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
    setErrMsg(error);
    return Object.keys(error).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      const result = await resetPassword({
        email,
        token,
        newPassword,
      }).unwrap();
      toast.success(result.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      setApiErrors(error.data.errors);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-6 shadow rounded border-1 border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded outline-none"
            placeholder="Enter your new password.."
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
          {errMsg?.password && (
            <p className="text-red-500 text-md">{errMsg?.password}</p>
          )}
          {apiErrors?.length > 0 &&
            apiErrors?.map((err, index) => (
              <p key={index + 1} className="text-red-500">
                {err}
              </p>
            ))}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
