import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Current page neighborhood
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    // Always show last page if there are more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // Add ellipsis indicators
    const result = [];
    let prevPage = 0;
    
    for (const page of pages) {
      if (prevPage && page - prevPage > 1) {
        result.push(-prevPage); // Negative value indicates ellipsis after this page
      }
      result.push(page);
      prevPage = page;
    }
    
    return result;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center">
      <ul className="flex">
        {/* Previous button */}
        <li>
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-l-md border border-gray-300 bg-white text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
        </li>
        
        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber < 0) {
            // This is an ellipsis indicator
            return (
              <li key={`ellipsis-${index}`}>
                <span className="flex h-10 w-10 items-center justify-center border border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  ...
                </span>
              </li>
            );
          }
          
          const isCurrentPage = pageNumber === currentPage;
          
          return (
            <li key={pageNumber}>
              <button
                onClick={() => onPageChange(pageNumber)}
                className={`flex h-10 w-10 items-center justify-center border border-gray-300 ${
                  isCurrentPage 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-white text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                } dark:border-gray-600`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            </li>
          );
        })}
        
        {/* Next button */}
        <li>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-r-md border border-gray-300 bg-white text-gray-500 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;