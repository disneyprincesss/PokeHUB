import { PageData } from "../hooks/usePagination";
import { PokemonListItem } from "../types/pokemon";
import PokemonCard from "./card";

interface MobileViewProps {
  pageData: PageData | undefined;
  currentPage: number;
  totalPages: number;
  onPokemonClick: (pokemon: PokemonListItem) => void;
}

export default function MobileView({
  pageData,
  currentPage,
  totalPages,
  onPokemonClick,
}: MobileViewProps) {
  const allPokemon = pageData ? [...pageData.left, ...pageData.right] : [];

  return (
    <div className="lg:hidden bg-[#f9e5b7] rounded-2xl shadow-xl p-2 w-full justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 place-items-center">
        {allPokemon.map((pokemon) => (
          <button key={pokemon.name} onClick={() => onPokemonClick(pokemon)}>
            <PokemonCard pokemon={pokemon} />
          </button>
        ))}
      </div>

      <div className="text-center text-amber-800 font-jersey text-lg">
        {totalPages > 0 ? (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        ) : (
          <span>No Results</span>
        )}
      </div>
    </div>
  );
}