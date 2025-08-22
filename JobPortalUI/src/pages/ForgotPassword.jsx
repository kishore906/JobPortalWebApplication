import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../features/api/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrMsg("");

    try {
      const result = await forgotPassword({ email }).unwrap();
      toast.success(result.message);
      setEmail("");
      navigate("/");
    } catch (error) {
      setErrMsg(error.data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-6 shadow rounded border-1 border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded outline-none"
            placeholder="Enter your email"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
          {errMsg && <p className="text-red-500 text-md">Error: {errMsg}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
