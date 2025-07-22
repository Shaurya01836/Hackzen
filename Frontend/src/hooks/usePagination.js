import { useState, useEffect, useMemo } from 'react';

export function usePagination(items, itemsPerPage = 8) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = items.slice(startIndex, endIndex);

    return {
      currentItems,
      currentPage,
      totalPages,
      totalItems: items.length,
      startIndex,
      endIndex,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }, [items, currentPage, itemsPerPage]);

  return {
    ...paginationData,
    setCurrentPage
  };
}
