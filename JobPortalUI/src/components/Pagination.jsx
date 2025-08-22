import { assets } from "../assets/assets";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  return (
    <div className="flex items-center justify-center space-x-2 mt-auto">
      <img
        src={assets.left_arrow_icon}
        alt="left_arrow_icon"
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
      />

      {Array.from({ length: totalPages }).map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded ${
            currentPage === index + 1
              ? "bg-blue-100 text-blue-500"
              : "text-gray-500"
          }`}
        >
          {index + 1}
        </button>
      ))}

      <img
        src={assets.right_arrow_icon}
        alt="right_arrow_icon"
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
      />
    </div>
  );
};

export default Pagination;
