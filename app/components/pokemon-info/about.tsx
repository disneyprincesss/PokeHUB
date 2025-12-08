import { Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { PokemonDetails } from "../../types/pokemon";
import { AboutInfo } from "../../services/api";
import { isDarkTextType, getAbilityColor } from "../../lib/pokemon-colors";

interface AboutProps {
  pokemon: PokemonDetails;
  pokemonType: string;
  aboutInfo: AboutInfo | null;
  isEditing: boolean;
  inputValue: AboutInfo;
  isLoading: boolean;
  error: string | null;
  isEditMode: boolean;
  hasNickname: boolean;
  onStartEditing: () => void;
  onSave: () => void;
  onCancel: () => void;
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export default function About({
  pokemon,
  pokemonType,
  aboutInfo,
  isEditing,
  inputValue,
  isLoading,
  error,
  isEditMode,
  hasNickname,
  onStartEditing,
  onSave,
  onCancel,
  onHeightChange,
  onWeightChange,
  onDescriptionChange,
}: AboutProps) {
  const isDark = isDarkTextType(pokemonType);

  const scrollHeight = isEditMode
    ? "h-70 sm:h-80 lg:h-105"
    : hasNickname
    ? "h-69 sm:h-78 lg:h-100"
    : "h-80 sm:h-84 lg:h-110";

  const inputClass = isDark
    ? "bg-zinc-800 border-zinc-600 text-zinc-200 focus:ring-zinc-400"
    : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500";

  return (
    <ScrollArea className={`${scrollHeight} w-full`}>
      <div className="flex flex-col gap-2">
        {/* Species */}
        <div className="flex">
          <h3>Species:</h3>
          <div className="ml-2 flex items-center">
            {pokemon.types.map((t, index) => (
              <Tooltip key={index}>
                <TooltipTrigger>
                  <img
                    src={`/image/pokemon-type/${t.type.name}.png`}
                    alt={`${t.type.name} type`}
                    className="h-9 sm:h-10 mr-1"
                  />
                </TooltipTrigger>
                <TooltipContent>{t.type.name}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Abilities */}
        <div className="flex items-center flex-wrap">
          <h3>Abilities:</h3>
          <div className="ml-2 flex flex-wrap items-center">
            {pokemon.abilities.map((a, index) => {
              const abilityName = a.ability.name
                .split(" ")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

              const abilityColor = getAbilityColor(pokemonType, a.is_hidden);

              return (
                <Tooltip key={index}>
                  <TooltipTrigger>
                    <span
                      className={`text-xl sm:text-2xl px-2 py-1 mr-2 rounded-lg shadow-md text-white ${abilityColor}`}
                    >
                      {abilityName}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {a.is_hidden ? "Hidden Ability" : "Normal Ability"}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>

        {/* Height/Weight/Description */}
        {isEditing ? (
          <AboutEditForm
            pokemon={pokemon}
            inputValue={inputValue}
            isLoading={isLoading}
            error={error}
            isDark={isDark}
            inputClass={inputClass}
            onHeightChange={onHeightChange}
            onWeightChange={onWeightChange}
            onDescriptionChange={onDescriptionChange}
            onSave={onSave}
            onCancel={onCancel}
          />
        ) : (
          <AboutDisplay
            pokemon={pokemon}
            aboutInfo={aboutInfo}
            isEditMode={isEditMode}
            onStartEditing={onStartEditing}
          />
        )}
      </div>
    </ScrollArea>
  );
}

// Sub-component for edit form
function AboutEditForm({
  pokemon,
  inputValue,
  isLoading,
  error,
  isDark,
  inputClass,
  onHeightChange,
  onWeightChange,
  onDescriptionChange,
  onSave,
  onCancel,
}: {
  pokemon: PokemonDetails;
  inputValue: AboutInfo;
  isLoading: boolean;
  error: string | null;
  isDark: boolean;
  inputClass: string;
  onHeightChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 items-center">
          <h3>Height:</h3>
          <input
            type="number"
            step="0.01"
            min="0"
            max="1000"
            value={inputValue.height ?? ""}
            onChange={(e) => onHeightChange(e.target.value)}
            placeholder={
              pokemon.height ? `${(pokemon.height / 10).toFixed(2)}` : "0.00"
            }
            className={`w-50 h-10 px-2 border rounded-md text-lg focus:outline-none focus:ring-2 ${inputClass}`}
          />
          <span className="text-sm">meters</span>
        </div>

        <div className="flex gap-2 items-center">
          <h3>Weight:</h3>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10000"
            value={inputValue.weight ?? ""}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder={
              pokemon.weight ? `${(pokemon.weight / 10).toFixed(2)}` : "0.00"
            }
            className={`w-50 h-10 px-2 border rounded-md text-lg focus:outline-none focus:ring-2 ${inputClass}`}
          />
          <span className="text-sm">kg</span>
        </div>
      </div>

      <div>
        <h3>Description</h3>
        <textarea
          value={inputValue.description ?? ""}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={pokemon.description}
          className={`w-100 lg:w-lg p-2 ml-1 border rounded-md text-lg focus:outline-none focus:ring-2 resize-none ${inputClass}`}
          rows={4}
          maxLength={500}
        />
        <p
          className={`text-xs my-1 ml-1 ${
            isDark ? "text-zinc-400" : "text-gray-800"
          }`}
        >
          {(inputValue.description ?? "").length}/500 characters
        </p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
      </div>

      <p className={`text-xs ${isDark ? "text-zinc-400" : "text-gray-800"}`}>
        Leave all fields empty to remove customized information
      </p>
    </div>
  );
}

// Sub-component for display
function AboutDisplay({
  pokemon,
  aboutInfo,
  isEditMode,
  onStartEditing,
}: {
  pokemon: PokemonDetails;
  aboutInfo: AboutInfo | null;
  isEditMode: boolean;
  onStartEditing: () => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <h3>Height:</h3>
          <span className="text-2xl ml-4">
            {aboutInfo?.height != null
              ? `${aboutInfo.height} m`
              : pokemon.height
              ? `${(pokemon.height / 10).toFixed(2)} m`
              : "Unknown"}
          </span>
        </div>
        <div className="flex items-center">
          <h3>Weight:</h3>
          <span className="text-2xl ml-4">
            {aboutInfo?.weight != null
              ? `${aboutInfo.weight} kg`
              : pokemon.weight
              ? `${(pokemon.weight / 10).toFixed(2)} kg`
              : "Unknown"}
          </span>
        </div>
      </div>

      {(aboutInfo?.description || pokemon.description) && (
        <div>
          <h3>Description: </h3>
          <p className="text-xl mt-1 pr-2">
            {aboutInfo?.description || pokemon.description}
          </p>
        </div>
      )}

      {isEditMode && (
        <button
          onClick={onStartEditing}
          className="flex items-center cursor-pointer px-2 py-0.5 text-md rounded bg-[#31971C] text-zinc-100 hover:bg-[#4cab39]"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Customize Info
        </button>
      )}
    </div>
  );
}
