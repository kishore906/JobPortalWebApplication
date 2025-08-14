import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { jobsApplied } from "../assets/assets";
import moment from "moment";

const Applications = () => {
  const [showTable, setShowTable] = useState("Applied Jobs");

  return (
    <>
      <Navbar />

      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <div className="flex gap-3 mb-4">
          <div
            className={`px-4 py-2 border border-gray-300 rounded-full ${
              showTable === "Applied Jobs" && "bg-blue-600 text-white"
            }`}
          >
            <h2
              className="text-lg font-semibold"
              onClick={() =>
                setShowTable(
                  showTable === "Applied Jobs" ? "Saved Jobs" : "Applied Jobs"
                )
              }
            >
              Applied Jobs
            </h2>
          </div>
          <div
            className={`px-4 py-2 border border-gray-300 rounded-full ${
              showTable === "Saved Jobs" && "bg-blue-600 text-white"
            }`}
          >
            <h2
              className="text-lg font-semibold"
              onClick={() =>
                setShowTable(
                  showTable === "Saved Jobs" ? "Applied Jobs" : "Saved Jobs"
                )
              }
            >
              Saved Jobs
            </h2>
          </div>
        </div>

        {showTable === "Applied Jobs" ? (
          <>
            {/* <input type="file" accept="application/pdf" onChange={(e) => e.target.files[0]} /> */}
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="border border-gray-200">
                  <th className="py-3 px-4 text-left">Company</th>
                  <th className="py-3 px-4 text-left">Job Title</th>
                  <th className="py-3 px-4 text-left max-sm:hidden">
                    Location
                  </th>
                  <th className="py-3 px-4 text-left max-sm:hidden">Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobsApplied.map((job, index) =>
                  true ? (
                    <tr key={index} className="border border-gray-200">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <img
                          src={job.logo}
                          alt="company_logo"
                          className="w-8 h-8"
                        />
                        {job.company}
                      </td>
                      <td className="py-2 px-4">{job.title}</td>
                      <td className="py-2 px-4 max-sm:hidden">
                        {job.location}
                      </td>
                      <td className="py-2 px-4 max-sm:hidden">
                        {moment(job.date).format("ll")}
                      </td>
                      <td className="py-2 px-4">
                        <span
                          className={`${
                            job.status === "Accepted"
                              ? "bg-green-100"
                              : job.status === "Rejected"
                              ? "bg-red-100"
                              : "bg-blue-100"
                          } px-4 py-1.5 rounded`}
                        >
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </>
        ) : (
          <>
            {/* <input type="file" accept="application/pdf" onChange={(e) => e.target.files[0]} /> */}
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="border border-gray-200">
                  <th className="py-3 px-4 text-left">Company</th>
                  <th className="py-3 px-4 text-left">Job Title</th>
                  <th className="py-3 px-4 text-left max-sm:hidden">
                    Location
                  </th>
                  <th className="py-3 px-4 text-left max-sm:hidden">Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobsApplied.map((job, index) =>
                  true ? (
                    <tr key={index} className="border border-gray-200">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <img
                          src={job.logo}
                          alt="company_logo"
                          className="w-8 h-8"
                        />
                        {job.company}
                      </td>
                      <td className="py-2 px-4">{job.title}</td>
                      <td className="py-2 px-4 max-sm:hidden">
                        {job.location}
                      </td>
                      <td className="py-2 px-4 max-sm:hidden">
                        {moment(job.date).format("ll")}
                      </td>
                      <td className="py-2 px-4">
                        <span
                          className={`${
                            job.status === "Accepted"
                              ? "bg-green-100"
                              : job.status === "Rejected"
                              ? "bg-red-100"
                              : "bg-blue-100"
                          } px-4 py-1.5 rounded`}
                        >
                          {job.status}
                        </span>
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Applications;
