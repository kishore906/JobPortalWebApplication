import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import {
  useRegisterCompanyMutation,
  useLoginMutation,
} from "../features/api/authApi";
import { setLoginUser } from "../features/slice/userSlice";
import { Link } from "react-router-dom";

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
  const [errors, setErrors] = useState({});

  const [registerCompany, { isLoading }] = useRegisterCompanyMutation();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "companyImage") {
      setFormFields((prevState) => ({ ...prevState, companyImage: files[0] }));
    } else {
      setFormFields((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const validateStep1 = () => {
    let errors = {};

    if (
      !/^[A-Za-z0-9\s&.,\-/'@]+$/.test(formFields.companyName) ||
      formFields.companyName === "null"
    )
      errors.companyName = "CompanyName cannot be null or have (! # $ % *)";
    if (!/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formFields.email))
      errors.email = "Enter a valid email Id";
    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{6,}$/.test(
        formFields.password
      )
    )
      errors.password =
        "Minimum length of 6 with 1 upper, 1 lower, digit and special char atleast";
    if (
      formFields.companyLocation === "null" ||
      !/^[A-Za-z0-9\s,.\-/#&]+$/.test(formFields.companyLocation.trim())
    )
      errors.companyLocation = "Location cannot be empty or null";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    let error = {};
    if (!formFields.companyImage)
      error.companyImage = "Image is required, please upload";
    setErrors(error);
    return Object.keys(error).length === 0;
  };

  // Step 1
  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
    return;
  };

  // Step 2
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setErrors({});

    if (state === "Sign Up") {
      if (!validateStep2()) return;

      // Create a FormData object to send the form including the image file
      const data = new FormData();
      data.append("companyName", formFields.companyName);
      data.append("email", formFields.email);
      data.append("password", formFields.password);
      data.append("companyLocation", formFields.companyLocation);
      data.append("companyImage", formFields.companyImage);
      data.append("role", "Recruiter");

      try {
        const result = await registerCompany(data).unwrap();
        toast.success(result.message);
        setShowRecruiterLogin(false);
      } catch (error) {
        console.log(error);
        console.log(error.data);
      }
    } else if (state === "Login") {
      const recruiterLogin = {
        email: formFields.email,
        password: formFields.password,
      };

      try {
        const result = await login(recruiterLogin).unwrap();
        toast.success(result.message);
        setShowRecruiterLogin(false);
        dispatch(setLoginUser(result.user));
      } catch (error) {
        console.log(error);
        setErrors({ errMsg: error.data.message });
      }
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  /*
  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (isSuccess) {
      toast.success(data.message);
      setShowRecruiterLogin(false);
    }
  }, [isSuccess, error, data, setShowRecruiterLogin]);

  useEffect(() => {
    if (err) {
      setErrors({ errMsg: err.data.message });
    }

    if (success && resData) {
      toast.success(resData.message);
      setShowRecruiterLogin(false);
      dispatch(setLoginUser(resData.user));
    }
  }, [err, success, resData, dispatch, setShowRecruiterLogin]);
*/

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        className="relative bg-white p-10 rounded-xl text-slate-500"
        onSubmit={
          step === 1 && state === "Sign Up" ? handleNext : onSubmitHandler
        }
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Recruiter {state}
        </h1>
        {state === "Login" ? (
          <p className="text-sm text-center">
            🤗 Welcoma back!! Please login to continue
          </p>
        ) : (
          <p className="text-sm text-center">
            👋 Hello!! Please sign up to continue
          </p>
        )}
        {state === "Sign Up" && step == 2 ? (
          <>
            <div className="flex items-center gap-4 my-10 w-80">
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
            {errors.companyImage && (
              <p className="text-sm text-red-600">{errors.companyImage}</p>
            )}
          </>
        ) : (
          <>
            {state !== "Login" && (
              <>
                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                  <img src={assets.person_icon} alt="person_icon" />
                  <input
                    type="text"
                    className="outline-none text-sm w-80"
                    name="companyName"
                    onChange={handleChange}
                    value={formFields.companyName}
                    placeholder="Company Name.."
                    required
                  />
                </div>
                {errors.companyName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.companyName}
                  </p>
                )}
              </>
            )}
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="email_icon" />
              <input
                type="email"
                className="outline-none text-sm w-80"
                name="email"
                onChange={handleChange}
                value={formFields.email}
                placeholder="Email Id.."
                required
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.lock_icon} alt="lock_icon" />
              <input
                type="password"
                className="outline-none text-sm w-80"
                name="password"
                onChange={handleChange}
                value={formFields.password}
                placeholder="Password.."
                required
              />
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}

            {state === "Sign Up" && (
              <>
                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                  <img src={assets.location_icon} alt="location_icon" />
                  <input
                    type="text"
                    className="outline-none text-sm w-80"
                    name="companyLocation"
                    onChange={handleChange}
                    value={formFields.companyLocation}
                    placeholder="Location.."
                    required
                  />
                </div>
                {errors.companyLocation && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.companyLocation}
                  </p>
                )}
              </>
            )}
          </>
        )}

        {errors.errMsg && (
          <p className="text-sm mt-2 text-red-600">{errors.errMsg}</p>
        )}

        {state === "Login" && (
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 underline mt-4 cursor-pointer"
            onClick={() => setShowRecruiterLogin(false)}
          >
            Forgot Password?
          </Link>
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
