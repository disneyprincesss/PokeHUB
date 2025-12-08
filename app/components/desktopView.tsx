import { PageData } from "../hooks/usePagination";
import { PokemonListItem } from "../types/pokemon";
import PokemonCard from "./card";

interface DesktopViewProps {
  pages: PageData[];
  currentPage: number;
  totalPages: number;
  onPokemonClick: (pokemon: PokemonListItem) => void;
}

export default function DesktopView({
  pages,
  currentPage,
  totalPages,
  onPokemonClick,
}: DesktopViewProps) {
  const startIndex = Math.max(0, currentPage - 3);
  const endIndex = Math.min(totalPages, currentPage + 2);

  const windowPages: { pageData: PageData; pageNumber: number }[] = [];
  for (let i = startIndex; i < endIndex; i++) {
    windowPages.push({ pageData: pages[i], pageNumber: i + 1 });
  }

  return (
    <div className="hidden lg:block bg-[url('/image/book.png')] bg-cover bg-center w-215 h-full">
      <div className="w-120 h-143 flex justify-center items-center relative translate-x-107">
        {windowPages.map(({ pageData, pageNumber }) => {
          const isFlipped = currentPage >= pageNumber;
          let z: number;
          if (pageNumber === currentPage) {
            z = totalPages;
          } else if (pageNumber < currentPage) {
            z = pageNumber;
          } else {
            z = totalPages - (pageNumber - currentPage);
          }

          return (
            <div
              key={pageNumber}
              className={`pages absolute left-0 top-0 w-full h-full transition-transform duration-700 ${
                isFlipped ? "flip" : ""
              }`}
              style={{ zIndex: z }}
            >
              <div className="page-left w-100 h-full absolute left-0 top-0 text-zinc-900 bg-[#f9e5b7] border-l-7 border-[#e7d7a2] rounded-2xl">
                <div
                  className={`left-content w-full h-full flex flex-wrap justify-center items-center ${
                    currentPage === pageNumber || totalPages < 13
                      ? "opacity-100 translate-x-0"
                      : "opacity-50 -translate-x-5"
                  } transition-all duration-500`}
                >
                  {pageData.left.map((pokemon) => (
                    <button key={pokemon.name} onClick={() => onPokemonClick(pokemon)}>
                      <PokemonCard pokemon={pokemon} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="page-right w-100 h-full absolute left-0 top-0 text-zinc-900 bg-[#f9e5b7] rounded-2xl">
                <div
                  className={`w-full h-full flex flex-wrap justify-center items-center ${
                    currentPage === pageNumber || totalPages < 13
                      ? "opacity-100 translate-x-0"
                      : "opacity-50 -translate-x-5"
                  } transition-all duration-500`}
                >
                  {pageData.right.map((pokemon) => (
                    <button key={pokemon.name} onClick={() => onPokemonClick(pokemon)}>
                      <PokemonCard pokemon={pokemon} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}