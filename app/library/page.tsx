"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { PokemonDetails, PokemonListItem } from "../types/pokemon";
import { POKEMON_TYPES } from "../lib/constants";
import { fetchPokemonDetails } from "../lib/pokeapi";
import { usePokemonLibrary } from "../hooks/usePokemonLibrary";
import { usePagination } from "../hooks/usePagination";
import Navbar from "../components/navbar";
import DesktopView from "../components/libraryDesktopView";
import MobileView from "../components/libraryMobileView"
import PokemonInfo from "../components/pokemon-info";

export default function LibraryPage() {
  const {
    filteredList,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    loading,
  } = usePokemonLibrary();

  const { pages, currentPage, totalPages, prevPage, nextPage, resetPage } =
    usePagination(filteredList);

  const [isCardOpen, setIsCardOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(null);

  const handlePokemonClick = async (pokemon: PokemonListItem) => {
    setIsCardOpen(true);
    const details = await fetchPokemonDetails(pokemon.url);
    setSelectedPokemon(details);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    resetPage();
  };

  return (
    <main className="relative w-full h-screen">
      <Navbar />
      <div className="bg-[url('/image/library-bg.gif')] relative bg-cover bg-center min-h-screen flex flex-col gap-5 lg:gap-0 justify-center items-center overflow-y-auto pt-16 pb-5 sm:pt-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-lg text-center flex flex-col gap-4 sm:gap-6 justify-center items-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-revalia text-amber-600 text-shadow-[0_0_10px_rgba(225,162,55,1)]">
            Pokémon Library
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full items-stretch sm:items-center">
            {/* Search Bar */}
            <div className="relative w-full mx-auto bg-[#f1e2b2] rounded-lg">
              <input
                type="text"
                placeholder="Search Pokémon..."
                className="w-full h-8 sm:h-8 p-2 sm:p-1.5 pr-12 sm:pr-10 rounded-lg text-black outline-3 outline-amber-700 font-jersey text-lg sm:text-xl lg:text-2xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="h-8 w-10 absolute top-0 right-0 bg-amber-700 text-white flex items-center justify-center rounded-r-lg hover:bg-[#914007] transition-colors">
                <Search size={20} />
              </div>
            </div>

            {/* Type Filter Dropdown */}
            <div className="flex justify-center w-full sm:w-auto">
              <select
                value={selectedType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full sm:w-auto bg-[#f1e2b2] text-amber-800 font-jersey text-lg sm:text-xl px-4 py-2.5 sm:py-2 rounded-lg shadow-lg outline-none border-2 border-amber-700 hover:bg-amber-200 transition-colors cursor-pointer"
              >
                <option value="">All Types</option>
                {POKEMON_TYPES.map((type) => (
                  <option key={type} value={type} className="capitalize">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <p className="text-amber-200 font-jersey text-xl">Loading Pokémons…</p>
          )}
        </div>

        {/* Book Layout */}
        <div
          className={`w-full flex justify-center items-center ${
            loading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500`}
        >
          {/* Prev Button */}
          <div className="mx-2 sm:mx-4">
            <button
              className="cursor-pointer bg-[#bb4d00] hover:bg-[#914007] disabled:bg-gray-600 disabled:cursor-not-allowed text-zinc-200 font-pixelify text-lg sm:text-xl py-2 px-3 sm:px-4 rounded-xl shadow-md transition-all duration-100"
              disabled={currentPage === 1}
              onClick={prevPage}
            >
              ◀
            </button>
          </div>

          {/* Desktop Book */}
          <DesktopView
            pages={pages}
            currentPage={currentPage}
            totalPages={totalPages}
            onPokemonClick={handlePokemonClick}
          />

          {/* Mobile Grid */}
          <MobileView
            pageData={pages[currentPage - 1]}
            currentPage={currentPage}
            totalPages={totalPages}
            onPokemonClick={handlePokemonClick}
          />

          {/* Next Button */}
          <div className="mx-2 sm:mx-4">
            <button
              className="cursor-pointer bg-[#bb4d00] hover:bg-[#914007] disabled:bg-gray-600 disabled:cursor-not-allowed text-zinc-200 font-pixelify text-lg sm:text-xl py-2 px-3 sm:px-4 rounded-xl shadow-md transition-all duration-100"
              disabled={currentPage === totalPages}
              onClick={nextPage}
            >
              ▶
            </button>
          </div>
        </div>

        {/* Pokémon Info Overlay */}
        <div
          className={`bg-zinc-900/50 w-full h-full absolute top-0 z-10 ${
            isCardOpen ? "block" : "hidden"
          }`}
        >
          {selectedPokemon && (
            <PokemonInfo
              pokemon={selectedPokemon}
              setIsCardOpen={setIsCardOpen}
              setSelectedPokemon={setSelectedPokemon}
            />
          )}
        </div>
      </div>
    </main>
  );
}