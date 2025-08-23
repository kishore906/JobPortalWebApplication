import { assets } from "../../assets/assets";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import {
  useGetAllCompanyUsersQuery,
  useDeleteCompanyUserMutation,
} from "../../features/api/adminApi";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";

const AllCompanies = () => {
  const [errMsg, setErrMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoading, error, data } = useGetAllCompanyUsersQuery({
    pageNumber: currentPage,
  });
  const [
    deleteCompanyUser,
    { isSuccess: deleteSuccess, error: deleteErr, data: deleteRes },
  ] = useDeleteCompanyUserMutation();

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
    <div className="container max-w-6xl min-h-[90vh] mt-5 ml-3 flex flex-col">
      {errMsg ? (
        <h2 className="text-2xl font-semibold">{errMsg}</h2>
      ) : (
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="border border-gray-200">
              <th className="py-3 px-4 text-left">CompanyName</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left max-sm:hidden">Location</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((user, index) => (
              <tr className="border border-gray-200" key={index}>
                <td className="py-3 px-4 flex items-center gap-2">
                  <img
                    src={
                      user?.companyImagePath
                        ? `https://localhost:7091/${user?.companyImagePath}`
                        : assets.company_logo
                    }
                    alt="profile_img"
                    className="w-8 h-8 rounded-full"
                  />
                  {user?.companyName}
                </td>
                <td className="py-2 px-4">{user?.companyEmail}</td>
                <td className="py-2 px-4 max-sm:hidden">
                  {user?.companyLocation}
                </td>
                <td className="py-2 px-4">
                  <button
                    className="bg-red-600 px-4 py-1 text-white rounded"
                    onClick={() => deleteCompanyUser(user?.id)}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {data?.items?.length > 0 && (
        <Pagination
          totalPages={data?.totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AllCompanies;
