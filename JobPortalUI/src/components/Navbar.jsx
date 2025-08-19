import { assets } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogout } from "../customHooks/useLogout";

const Navbar = ({ setShowRecruiterLogin, setShowUserLogin }) => {
  const { user, isAuthenticated } = useSelector((state) => state.authResult);
  const { logout } = useLogout();
  const navigate = useNavigate();

  return (
    <div className="shadow py-4">
      <div className="container mx-auto px-4 2xl:px-20 flex justify-between items-center">
        <img
          src={assets.logo}
          alt="logo_img"
          onClick={() => navigate("/")}
          className="cursor-pointer"
        />
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to={
                user?.role === "User"
                  ? "/applications"
                  : user?.role === "Admin"
                  ? "/adminDashboard"
                  : "/dashboard/manage-jobs"
              }
              className="font-bold"
            >
              {user?.role === "User"
                ? "Saved / Applied Jobs"
                : user?.role === "Admin"
                ? "Dashboard"
                : "Posted Jobs"}
            </Link>
            <p className="max-sm:hidden font-bold">|</p>
            <p className="max-sm:hidden font-bold">
              Hi,{" "}
              {user?.role === "User" || user?.role === "Admin"
                ? user.fullName
                : user?.companyName}
            </p>
            <div className="relative group">
              <img
                src={
                  user?.role === "User" ||
                  (user?.role === "Admin" && user?.profileImage)
                    ? `https://localhost:7091/${user?.profileImage}`
                    : user?.role === "Recruiter" && user?.companyImage
                    ? `https://localhost:7091/${user?.companyImage}`
                    : user?.role === "User"
                    ? assets.upload_area
                    : assets.company_logo
                }
                alt="company_icon"
                className="w-8 border-2 border-emerald-100 rounded-full"
              />
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12 w-40">
                <ul className="list-none m-0 p-2 bg-white rounded-md shadow text-sm">
                  <li
                    className="py-1 px-2 cursor-pointer"
                    onClick={() => navigate("/edit-profile")}
                  >
                    Edit Profile
                  </li>
                  <li
                    className="py-1 px-2 cursor-pointer"
                    onClick={() => navigate("/edit-password")}
                  >
                    Update Password
                  </li>
                  <li
                    className="py-1 px-2 cursor-pointer pr-10"
                    onClick={() => logout()}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 max-sm:text-xs">
            <button
              className="text-gray-600"
              onClick={() => setShowRecruiterLogin((prev) => !prev)}
            >
              Recruiter Login
            </button>
            <button
              className="bg-blue-600 text-white px-6 sm:px-9 py-2 rounded-full"
              onClick={() => setShowUserLogin((prev) => !prev)}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
