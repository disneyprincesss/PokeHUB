import { ScrollArea } from "../ui/scroll-area";
import { PokemonDetails } from "../../types/pokemon";

interface EvolutionProps {
  pokemon: PokemonDetails;
  isEditMode: boolean;
  hasNickname: boolean;
}

export default function Evolution({ pokemon, isEditMode, hasNickname }: EvolutionProps) {
  const scrollHeight = isEditMode
    ? "h-58 sm:h-68 lg:h-98"
    : hasNickname
    ? "h-57 sm:h-66"
    : "h-68 sm:h-72 lg:h-100";

  const hasEvolution = pokemon.evolutionChain && pokemon.evolutionChain.length > 1;

  return (
    <div>
      <h3>Evolution Chain</h3>
      <ScrollArea className={`${scrollHeight} w-full`}>
        <div className="flex items-center gap-2 flex-wrap">
          {hasEvolution ? (
            pokemon.evolutionChain!.map((evolution, index) => (
              <div key={evolution.id} className="flex items-center">
                <div className="bg-white/20 rounded-lg p-2 flex flex-col items-center w-30 sm:min-w-35 sm:h-52">
                  <img
                    src={evolution.image}
                    alt={evolution.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                  />
                  <span className="text-sm sm:text-lg capitalize font-semibold mt-2">
                    {evolution.name}
                  </span>
                  <div className="flex gap-1 mt-2">
                    {evolution.types.map((type) => (
                      <img
                        key={type.slot}
                        src={`/image/pokemon-type/${type.type.name}.png`}
                        alt={type.type.name}
                        className="w-6 h-6 sm:w-7 sm:h-7"
                      />
                    ))}
                  </div>
                </div>
                {index < (pokemon.evolutionChain?.length || 0) - 1 && (
                  <span className="mx-2 text-lg sm:text-xl">→</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-base sm:text-lg">This Pokémon does not evolve.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}