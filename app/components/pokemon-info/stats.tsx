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
        <ul className="flex flex-col gap-4 w-100 h-62 sm:h-68 text-xl sm:text-2xl sm:w-125 mt-3">
          {pokemon.stats.map((s) => {
            const statName = s.stat.name
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join("-");

            return (
              <li key={s.stat.name} className="w-full flex items-center gap-4">
                <span className="w-2/3">{statName}</span>
                <div className="w-full flex items-center justify-between">
                  <Progress value={s.base_stat} className="w-5/6" />
                  <span>{s.base_stat}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>
  );
}
