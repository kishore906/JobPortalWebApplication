import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { useRegisterMutation, useLoginMutation } from "../features/api/authApi";
import { setLoginUser } from "../features/slice/userSlice";

const UserLogin = ({ setShowUserLogin }) => {
  const [state, setState] = useState("Login");
  const [formFields, setFormFields] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
    profileImage: null,
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

  const [register, { isLoading, isSuccess, error, data }] =
    useRegisterMutation();
  const [login, { isSuccess: success, error: err, data: resData }] =
    useLoginMutation();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormFields((prevState) => ({ ...prevState, profileImage: files[0] }));
    } else {
      setFormFields((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  // form fields validation function
  const validateStep1 = () => {
    let errors = {};

    if (
      !/^[A-Za-z ]+$/.test(formFields.fullName) ||
      formFields.fullName === "null"
    )
      errors.fullName = "FullName should be upper, lower case and space only";
    if (
      !/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formFields.email) &&
      step === "Sign Up"
    ) {
      errors.email = "Enter a valid email Id";
    }

    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{6,}$/.test(
        formFields.password
      )
    )
      errors.password =
        "Minimum length of 6 with 1 upper, 1 lower, digit and special char atleast";
    if (
      formFields.mobileNumber === "null" ||
      !/^\+[1-9]\d{1,14}$/.test(formFields.mobileNumber.trim())
    )
      errors.mobileNumber = "Not a valid format or cannot be empty or null";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step 1 → Step 2
  const handleNext = (e) => {
    e.preventDefault();

    // if validateStep1() is true allow for step 2
    if (validateStep1()) {
      setStep(2);
    }
    return;
  };

  // Step 2
  const onSubmitHandler = (e) => {
    e.preventDefault();

    setErrors({});

    if (state === "Sign Up") {
      // Create a FormData object to send the form including the image file
      const data = new FormData();
      data.append("fullName", formFields.fullName);
      data.append("email", formFields.email);
      data.append("password", formFields.password);
      data.append("mobileNumber", formFields.mobileNumber);
      data.append("profileImage", formFields.profileImage);
      data.append("role", "User");

      // OR (above 'append' can be done simply like below step)
      // Object.entries(formFields).forEach(([key, value]) =>
      //   data.append(key, value)
      // );

      // To print the entire FormData content to the console in a readable way (key-value pairs), you can loop through the FormData entries.
      // data.forEach((value, key) => {
      //   console.log(`${key}:`, value);
      // });

      register(data);
    } else if (state === "Login") {
      const userLogin = {
        email: formFields.email,
        password: formFields.password,
      };
      login(userLogin);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    if (error) {
      console.log(error.data);
    }

    if (isSuccess) {
      toast.success(data.message);
      setShowUserLogin(false); // closing the modal
    }
  }, [error, isSuccess, data, setShowUserLogin]);

  useEffect(() => {
    if (err) {
      setErrors({ errMsg: err.data.message });
    }

    if (success && resData) {
      toast.success(resData.message);
      setShowUserLogin(false);
      // set user in store
      dispatch(setLoginUser(resData.user));
    }
  }, [err, success, resData, setShowUserLogin, dispatch, login]);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <form
        className="relative bg-white p-10 rounded-xl text-slate-500"
        onSubmit={
          step === 1 && state === "Sign Up" ? handleNext : onSubmitHandler
        }
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          User {state}
        </h1>
        {state === "Login" ? (
          <p className="text-sm">🤗 Welcoma back!! Please login to continue</p>
        ) : (
          <p className="text-sm">👋 Hello!! Please sign up to continue</p>
        )}
        {state === "Sign Up" && step === 2 ? (
          <>
            <div className="flex items-center gap-4 my-10">
              <label htmlFor="image">
                <img
                  src={
                    formFields.profileImage
                      ? URL.createObjectURL(formFields.profileImage)
                      : assets.upload_area
                  }
                  alt="upload_img"
                  className="w-16 rounded-full"
                />
                <input
                  type="file"
                  id="image"
                  name="profileImage"
                  onChange={handleChange}
                  hidden
                />
              </label>
              <p>
                Upload Profile <br /> Image
              </p>
            </div>
          </>
        ) : (
          <>
            {state !== "Login" && (
              <>
                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                  <img src={assets.person_icon} alt="person_icon" />
                  <input
                    type="text"
                    className="outline-none text-sm"
                    name="fullName"
                    onChange={handleChange}
                    value={formFields.fullName}
                    placeholder="FullName.."
                    required
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-red-600 mt-1">{errors.fullName}</p>
                )}
              </>
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
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}

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
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}

            {state === "Sign Up" && (
              <>
                <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                  <img
                    src={assets.mobile_logo}
                    alt="location_icon"
                    className="w-4"
                  />
                  <input
                    type="tel"
                    className="outline-none text-sm"
                    name="mobileNumber"
                    onChange={handleChange}
                    value={formFields.mobileNumber}
                    placeholder="+14155552671"
                    required
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.mobileNumber}
                  </p>
                )}
              </>
            )}
          </>
        )}

        {/* email & password error for login*/}
        {errors.errMsg && (
          <p className="text-sm mt-2 text-red-600">{errors.errMsg}</p>
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
          onClick={() => setShowUserLogin(false)}
        />
      </form>
    </div>
  );
};

export default UserLogin;
