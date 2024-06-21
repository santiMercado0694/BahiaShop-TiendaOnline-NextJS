import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center mt-8">
      <nav>
        <ul className="inline-flex space-x-2">
          {[...Array(totalPages).keys()].map((number: number) => (
            <li key={number + 1}>
              <button
                onClick={() => onPageChange(number + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === number + 1
                    ? "bg-cyan-700 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {number + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
