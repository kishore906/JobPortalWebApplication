import { useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import Footer from "../components/Footer";

const EditProfile = () => {
  const [fullName, setfullName] = useState("");
  const [email, setEmail] = useState("");

  const [image, setImage] = useState(false);

  return (
    <>
      <Navbar />

      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="shadow p-5 rounded w-full max-w-md">
          <h3 className="text-center text-2xl font-medium">Edit Profile</h3>
          <form>
            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.person_icon} alt="person_icon" />
              <input
                type="text"
                className="outline-none text-sm"
                name="companyName"
                onChange={(e) => setfullName(e.target.value)}
                value={fullName}
                required
              />
            </div>

            <div className="border px-4 py-2 flex items-center gap-2 rounded-full mt-5">
              <img src={assets.email_icon} alt="email_icon" />
              <input
                type="email"
                className="outline-none text-sm"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            <div className="flex items-center gap-4 my-5">
              <label htmlFor="image">
                <img
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt="upload_img"
                  className="w-16 rounded-full"
                />
                <input
                  type="file"
                  id="image"
                  onChange={(e) => setImage(e.target.files[0])}
                  hidden
                />
              </label>
              <p>Profile Image</p>
            </div>

            <button
              type="submit"
              className="bg-blue-600 w-full text-white py-2 rounded-full"
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
