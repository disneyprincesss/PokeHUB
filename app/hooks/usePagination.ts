import { useMemo, useState } from "react";
import { PokemonListItem } from "../types/pokemon";

export interface PageData {
  left: PokemonListItem[];
  right: PokemonListItem[];
}

export function usePagination(items: PokemonListItem[], itemsPerPage = 12) {
  const [currentPage, setCurrentPage] = useState(1);

  const pages: PageData[] = useMemo(() => {
    const spreads: PageData[] = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      spreads.push({
        left: items.slice(i, i + itemsPerPage / 2),
        right: items.slice(i + itemsPerPage / 2, i + itemsPerPage),
      });
    }
    return spreads;
  }, [items, itemsPerPage]);

  const totalPages = pages.length;

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const resetPage = () => setCurrentPage(1);

  return {
    pages,
    currentPage,
    totalPages,
    prevPage,
    nextPage,
    resetPage,
  };
}