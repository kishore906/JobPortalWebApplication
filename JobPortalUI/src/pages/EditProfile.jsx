import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import Footer from "../components/Footer";
import {
  useGetProfileQuery,
  useUpdateUserProfileMutation,
  useUpdateCompanyProfileMutation,
} from "../features/api/authApi";
import { toast } from "react-toastify";

const EditProfile = () => {
  const { user } = useSelector((state) => state.authResult);

  const [fields, setFields] = useState({
    name: "",
    email: "",
    location: "",
    image: null,
  });
  const [mobileNumber, setMobileNumber] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [existingResumeUrl, setExistingResumeUrl] = useState(null);
  const fileRef = useRef(null);

  const { isSuccess, error, data } = useGetProfileQuery();
  const [
    updateUserProfile,
    {
      isSuccess: userSuccess,
      isLoading: userLoading,
      error: userErr,
      data: userUpdateRes,
    },
  ] = useUpdateUserProfileMutation();
  const [
    updateCompanyProfile,
    {
      isLoading: cmpnyLoading,
      isSuccess: cmpnySuccess,
      error: cmpnyErr,
      data: cmpnyRes,
    },
  ] = useUpdateCompanyProfileMutation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      // Create a temporary preview
      const previewUrl = URL.createObjectURL(files[0]);

      // Update state to show preview
      setFields((prev) => ({
        ...prev,
        image: previewUrl,
      }));

      fileRef.current = files[0]; // store file
    } else {
      setFields((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user?.role === "User") {
      const userFormData = new FormData();

      userFormData.append("fullName", fields.name);
      userFormData.append("email", fields.email);
      userFormData.append("location", fields.location);
      userFormData.append("mobileNumber", mobileNumber);

      if (fileRef.current instanceof File) {
        // New file uploaded
        userFormData.append("profileImage", fileRef.current);
      } else if (fields.image !== null) {
        // No change, send old image path as string
        userFormData.append(
          "oldProfileImage",
          fields.image.substring(fields.image.indexOf("Uploads"))
        );
      }

      if (resumeFile instanceof File) {
        // New resume file uploaded
        userFormData.append("resume", resumeFile);
      } else if (existingResumeUrl !== null) {
        // No change, send old resume path as string
        userFormData.append(
          "oldResume",
          existingResumeUrl.substring(existingResumeUrl.indexOf("Uploads"))
        );
      }

      //console.log(Object.entries(formFields));
      // for (let [key, value] of userFormData.entries()) {
      //   console.log(key, value);
      // }

      updateUserProfile(userFormData);
    } else if (user?.role === "Recruiter") {
      const companyData = new FormData();

      companyData.append("companyName", fields.name);
      companyData.append("email", fields.email);
      companyData.append("companyLocation", fields.location);

      if (fileRef.current instanceof File) {
        // New file uploaded
        companyData.append("companyImage", fileRef.current);
      } else if (fields.image !== null) {
        // No change, send old image path as string
        companyData.append(
          "oldCompanyImage",
          fields.image.substring(fields.image.indexOf("Uploads"))
        );
      }

      // for (let [key, value] of companyData.entries()) {
      //   console.log(key, value);
      // }

      updateCompanyProfile(companyData);
    }
  };

  // useEffect for initial request to get user profile
  useEffect(() => {
    if (error) {
      console.log(error);
    }

    if (isSuccess && data) {
      setFields({
        name: user?.role === "User" ? data.fullName : data.companyName,
        email: user?.role === "User" ? data.email : data.companyEmail,
        location:
          user?.role === "User"
            ? data?.location
              ? data?.location
              : ""
            : data.companyLocation,
        image:
          user?.role === "User"
            ? data?.profileImagePath
              ? `https://localhost:7091/${data?.profileImagePath}`
              : null
            : data?.companyImagePath
            ? `https://localhost:7091/${data?.companyImagePath}`
            : null,
      });
      user?.role === "User" && setMobileNumber(data?.mobileNumber);
      user?.role === "User" &&
        setExistingResumeUrl(
          data?.resumePath ? `https://localhost:7091/${data?.resumePath}` : null
        );
    }
  }, [error, isSuccess, data, user?.role]);

  // useEffect for updating user profile
  useEffect(() => {
    if (userErr) {
      console.log(userErr);
    }

    if (userSuccess && userUpdateRes) {
      toast.success(userUpdateRes.message);
      navigate("/");
    }
  }, [userErr, userSuccess, navigate, userUpdateRes]);

  // useEffect for updating company profile
  useEffect(() => {
    if (cmpnyErr) {
      console.log(cmpnyErr);
    }

    if (cmpnySuccess && cmpnyRes) {
      toast.success(cmpnyRes.message);
      navigate("/");
    }
  }, [cmpnyErr, cmpnyRes, cmpnySuccess, navigate]);

  return (
    <>
      <Navbar />

      <div className="min-h-[70vh] flex justify-center items-center mt-5">
        <div className="shadow p-5 rounded w-full max-w-md">
          <h3 className="text-center text-2xl font-medium">Edit Profile</h3>
          <form onSubmit={handleSubmit}>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.person_icon} alt="person_icon" />
              <input
                type="text"
                className="outline-none text-sm w-100"
                name="name"
                onChange={handleChange}
                value={fields?.name}
                required
              />
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="email_icon" />
              <input
                type="email"
                className="outline-none text-sm w-100"
                name="email"
                onChange={handleChange}
                value={fields?.email}
                required
              />
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.location_icon} alt="location_icon" />
              <input
                type="text"
                className="outline-none text-sm w-100"
                name="location"
                onChange={handleChange}
                value={fields?.location}
                required
              />
            </div>

            {user?.role === "User" && (
              <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
                <img
                  src={assets.mobile_logo}
                  alt="mobile_logo"
                  className="w-5"
                />
                <input
                  type="tel"
                  className="outline-none text-sm"
                  name="mobileNumber"
                  onChange={(e) => setMobileNumber(e.target.value)}
                  value={mobileNumber}
                  required
                />
              </div>
            )}

            <div className="flex items-center gap-4 my-5">
              <img
                src={fields.image ? fields.image : assets.upload_area}
                alt="upload_img"
                className="w-16 rounded-full"
              />
              <input
                type="file"
                name="image"
                allow=".jpg,.jpeg,.png"
                onChange={handleChange}
                className="underline"
              />
            </div>

            {user?.role === "User" && (
              <>
                <div className="flex items-center gap-4 mt-5">
                  <label htmlFor="currresume" className="font-semibold">
                    Current Resume:
                  </label>
                  {existingResumeUrl ? (
                    <a href={existingResumeUrl} id="currresume" target="_blank">
                      <img
                        src={assets.resume_icon}
                        className="w-8 inline-flex items-center"
                        alt="resume_icon"
                      />
                      View Resume
                    </a>
                  ) : (
                    <p>No resume uploaded</p>
                  )}
                </div>

                <div className="mt-5">
                  <label htmlFor="newResume" className="font-semibold">
                    Upload Resume (PDF):
                  </label>
                  <input
                    type="file"
                    id="newResume"
                    name="newResume"
                    className="underline"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    accept=".pdf"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="bg-blue-600 w-full text-white py-2 rounded-full mt-5"
              disabled={userLoading || cmpnyLoading}
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

export default EditProfile;
