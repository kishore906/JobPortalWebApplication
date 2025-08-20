import { assets } from "../../assets/assets";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "../../features/api/adminApi";
import { toast } from "react-toastify";

const AllUsers = () => {
  //const [users, setUsers] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const { isLoading, error, data: users } = useGetAllUsersQuery();
  const [
    deleteUser,
    { isSuccess: deleteSuccess, error: deleteErr, data: deleteRes },
  ] = useDeleteUserMutation();

  useEffect(() => {
    if (error) {
      //console.log(error);
      setErrMsg(error?.data?.message);
    }
  }, [error]);

  useEffect(() => {
    if (deleteErr) {
      console.log(deleteErr);
    }

    if (deleteSuccess && deleteRes) {
      toast.success(deleteRes.message);
    }
  }, [deleteErr, deleteSuccess, deleteRes]);

  if (isLoading) return <Loading />;

  return (
    <div className="container max-w-5xl mt-5 ml-3">
      {errMsg ? (
        <h2 className="text-2xl font-semibold">{errMsg}</h2>
      ) : (
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="border border-gray-200">
              <th className="py-3 px-4 text-left">FullName</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-3 px-4 text-left max-sm:hidden">
                MobileNumber
              </th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr className="border border-gray-200" key={index}>
                <td className="py-3 px-4 flex items-center gap-2">
                  <img
                    src={
                      user?.profileImagePath
                        ? `https://localhost:7091/${user?.profileImagePath}`
                        : assets.upload_area
                    }
                    alt="profile_img"
                    className="w-8 h-8 rounded-full"
                  />
                  {user?.fullName}
                </td>
                <td className="py-2 px-4">{user?.email}</td>
                <td className="py-2 px-4 max-sm:hidden">{user?.location}</td>
                <td className="py-2 px-4 max-sm:hidden">
                  {user?.mobileNumber}
                </td>
                <td className="py-2 px-4">
                  {user?.fullName !== "Admin" && (
                    <button
                      className="bg-red-600 px-4 py-1 text-white rounded"
                      onClick={() => deleteUser(user?.id)}
                      disabled={user?.fullName === "Admin"}
                    >
                      delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllUsers;
