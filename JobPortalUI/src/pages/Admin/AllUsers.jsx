import { assets } from "../../assets/assets";

const AllUsers = () => {
  return (
    <div className="container max-w-5xl mt-5 ml-3">
      <table className="min-w-full bg-white border rounded-lg">
        <thead>
          <tr className="border border-gray-200">
            <th className="py-3 px-4 text-left">UserName</th>
            <th className="py-3 px-4 text-left max-sm:hidden">Location</th>
            <th className="py-3 px-4 text-left max-sm:hidden">Joined Date</th>
            <th className="py-3 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border border-gray-200">
            <td className="py-3 px-4 flex items-center gap-2">
              <img
                src={assets.company_icon}
                alt="company_logo"
                className="w-8 h-8"
              />
              company
            </td>
            <td className="py-2 px-4">title</td>
            <td className="py-2 px-4 max-sm:hidden">location</td>
            <td className="py-2 px-4">
              <button className="bg-red-600 px-4 py-1 text-white rounded">
                delete
              </button>
            </td>
          </tr>

          <tr className="border border-gray-200">
            <td className="py-3 px-4 flex items-center gap-2">
              <img
                src={assets.company_icon}
                alt="company_logo"
                className="w-8 h-8"
              />
              company
            </td>
            <td className="py-2 px-4">title</td>
            <td className="py-2 px-4 max-sm:hidden">location</td>
            <td className="py-2 px-4">
              <button className="bg-red-600 px-4 py-1 text-white rounded">
                delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
