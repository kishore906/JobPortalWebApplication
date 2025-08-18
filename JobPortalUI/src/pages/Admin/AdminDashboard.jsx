import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useSelector } from "react-redux";
import { useLogout } from "../../customHooks/useLogout";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.authResult);
  const { logout } = useLogout();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navbar for Recruiter */}
      <div className="shadow py-4">
        <div className="flex justify-between items-center px-5">
          <img
            src={assets.logo}
            alt="logo_img"
            className="max-sm:w-32 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <div className="flex items-center gap-3">
            <p className="max-sm:hidden font-[700]">
              Welcome, {user?.fullName}
            </p>
            <div className="relative group">
              <img
                src={
                  user?.profileImage
                    ? `https://localhost:7091/${user?.profileImage}`
                    : assets.upload_area
                }
                alt="avatar_icon"
                className="w-8 border-2 border-emerald-100 rounded-full"
              />
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                <ul className="list-none m-0 p-2 bg-white rounded-md shadow text-sm">
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
        </div>
      </div>

      {/* Main section (Left Sidebar and Right Associated Page)*/}
      <div className="flex items-start">
        {/* Left Sidebar with option to AddJob, ManageJob, and Viewapplications */}
        <div className="inline-block min-h-screen border-r-2 border-gray-100">
          <ul className="flex flex-col items-start pt-5 text-gray-800">
            <NavLink
              to={"/adminDashboard/statistics"}
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive && "bg-blue-100 border-r-4 border-blue-500"
                }`
              }
            >
              <img src={assets.graph} alt="graph_icon" className="w-6" />
              <p className="max-sm:hidden">Statistics</p>
            </NavLink>

            <NavLink
              to={"/adminDashboard/all-companies"}
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive && "bg-blue-100 border-r-4 border-blue-500"
                }`
              }
            >
              <img
                src={assets.company_logo}
                alt="add_icon"
                className="min-w-4"
              />
              <p className="max-sm:hidden">All Companies</p>
            </NavLink>

            <NavLink
              to={"/adminDashboard/all-users"}
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive && "bg-blue-100 border-r-4 border-blue-500"
                }`
              }
            >
              <img
                src={assets.person_tick_icon}
                alt="home_icon"
                className="min-w-4"
              />
              <p className="max-sm:hidden">All Users</p>
            </NavLink>

            <NavLink
              to={"/adminDashboard/all-jobs"}
              className={({ isActive }) =>
                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                  isActive && "bg-blue-100 border-r-4 border-blue-500"
                }`
              }
            >
              <img
                src={assets.suitcase_icon}
                alt="person_tick_icon"
                className="min-w-4"
              />
              <p className="max-sm:hidden">All Jobs</p>
            </NavLink>
          </ul>
        </div>

        {/* Right Side which will render associated pages on clicked*/}
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
