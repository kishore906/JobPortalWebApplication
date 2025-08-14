import { useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import Footer from "../components/Footer";

const EditPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <Navbar />

      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="shadow p-5 rounded w-full max-w-md">
          <h3 className="text-center text-2xl font-medium">Update Password</h3>
          <form>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="email_icon" />
              <input
                type="eamil"
                className="outline-none text-sm"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Email.."
                required
              />
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="lock_icon" />
              <input
                type="password"
                className="outline-none text-sm"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="New Password.."
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
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
