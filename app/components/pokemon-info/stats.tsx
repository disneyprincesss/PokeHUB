import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { PokemonDetails } from "../../types/pokemon";

interface StatsProps {
  pokemon: PokemonDetails;
  isEditMode: boolean;
  hasNickname: boolean;
}

export default function Stats({
  pokemon,
  isEditMode,
  hasNickname,
}: StatsProps) {
  const scrollHeight = isEditMode
    ? "h-58 sm:h-68 lg:h-98"
    : hasNickname
      ? "h-57 sm:h-66"
      : "h-68 sm:h-72 lg:h-98";

  return (
    <div className="stats">
      <h3>Stats</h3>
      <ScrollArea className={`${scrollHeight} w-full`}>
        <ul className="flex flex-col gap-4 w-full max-w-100 sm:max-w-125 h-62 sm:h-68 text-base sm:text-2xl mt-3">
          {pokemon.stats.map((s) => {
            const statName = s.stat.name
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join("-");

            return (
              <li key={s.stat.name} className="w-full flex items-center gap-2 sm:gap-4">
                <span className="w-24 sm:w-32 shrink-0 text-sm sm:text-xl">{statName}</span>
                <div className="flex-1 flex items-center gap-2">
                  <Progress value={s.base_stat} className="flex-1" />
                  <span className="w-10 text-right">{s.base_stat}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}
