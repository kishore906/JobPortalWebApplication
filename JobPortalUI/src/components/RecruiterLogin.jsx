import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { useRegisterCompanyMutation } from "../features/api/authApi";

const RecruiterLogin = ({ setShowRecruiterLogin }) => {
  const [state, setState] = useState("Login");
  const [formFields, setFormFields] = useState({
    companyName: "",
    email: "",
    password: "",
    companyLocation: "",
    companyImage: null,
  });
  const [step, setStep] = useState(1);

  const [registerCompany, { isLoading, isSuccess, error, data }] =
    useRegisterCompanyMutation();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "companyImage") {
      setFormFields((prevState) => ({ ...prevState, companyImage: files[0] }));
    } else {
      setFormFields((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  // Step 1
  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // Step 2
  const onSubmitHandler = (e) => {
    e.preventDefault();

    // Create a FormData object to send the form including the image file
    const data = new FormData();
    data.append("companyName", formFields.companyName);
    data.append("email", formFields.email);
    data.append("password", formFields.password);
    data.append("companyLocation", formFields.companyLocation);
    data.append("companyImage", formFields.companyImage);
    data.append("role", "Recruiter");

    registerCompany(data);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (isSuccess) {
      toast.success(data.message);
      setShowRecruiterLogin(false);
    }
  }, [isSuccess, error, data, setShowRecruiterLogin]);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        className="relative bg-white p-10 rounded-xl text-slate-500"
        onSubmit={step === 1 ? handleNext : onSubmitHandler}
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        <p className="text-sm">Welcome back!! Please sign in to continue</p>
        {state === "Sign Up" && step == 2 ? (
          <>
            <div className="flex items-center gap-4 my-10">
              <label htmlFor="image">
                <img
                  src={
                    formFields.companyImage
                      ? URL.createObjectURL(formFields.companyImage)
                      : assets.upload_area
                  }
                  alt="upload_img"
                  className="w-16 rounded-full"
                />
                <input
                  type="file"
                  id="image"
                  name="companyImage"
                  onChange={handleChange}
                  hidden
                />
              </label>
              <p>
                Upload Company <br /> logo
              </p>
            </div>
          </>
        ) : (
          <>
            {state !== "Login" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.person_icon} alt="person_icon" />
                <input
                  type="text"
                  className="outline-none text-sm"
                  name="companyName"
                  onChange={handleChange}
                  value={formFields.companyName}
                  placeholder="Company Name.."
                  required
                />
              </div>
            )}
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="email_icon" />
              <input
                type="email"
                className="outline-none text-sm"
                name="email"
                onChange={handleChange}
                value={formFields.email}
                placeholder="Email Id.."
                required
              />
            </div>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="lock_icon" />
              <input
                type="password"
                className="outline-none text-sm"
                name="password"
                onChange={handleChange}
                value={formFields.password}
                placeholder="Password.."
                required
              />
            </div>
            {state === "Sign Up" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img src={assets.location_icon} alt="location_icon" />
                <input
                  type="text"
                  className="outline-none text-sm"
                  name="companyLocation"
                  onChange={handleChange}
                  value={formFields.companyLocation}
                  placeholder="Location.."
                  required
                />
              </div>
            )}
          </>
        )}

        {state === "Login" && (
          <p className="text-sm text-blue-600 underline mt-4 cursor-pointer">
            Forgot Password?
          </p>
        )}

        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
          disabled={isLoading}
        >
          {state === "Login" ? "Login" : step === 2 ? "Create Account" : "next"}
        </button>

        {state === "Login" ? (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer underline"
              onClick={() => setState("Sign Up")}
            >
              Sign Up
            </span>
          </p>
        ) : (
          <p className="mt-5 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer underline"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}

        {/* Close Icon */}
        <img
          className="absolute top-5 right-5 cursor-pointer"
          src={assets.cross_icon}
          alt="close_icon"
          onClick={() => setShowRecruiterLogin(false)}
        />
      </form>
    </div>
  );
};

export default RecruiterLogin;
