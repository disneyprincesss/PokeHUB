import { Pencil, Plus } from "lucide-react";
import { isDarkTextType } from "../../lib/pokemon-colors";

interface Nickname {
  nickname: string | null;
  isEditing: boolean;
  inputValue: string;
  isLoading: boolean;
  error: string | null;
  isEditMode: boolean;
  pokemonType: string;
  onInputChange: (value: string) => void;
  onStartEditing: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditNickname({
  nickname,
  isEditing,
  inputValue,
  isLoading,
  error,
  isEditMode,
  pokemonType,
  onInputChange,
  onStartEditing,
  onSave,
  onCancel,
}: Nickname) {
  const isDark = isDarkTextType(pokemonType);

  if (isEditing) {
    return (
      <div className="flex items-center gap-4 w-full max-w-md">
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          maxLength={40}
          placeholder="Enter nickname (empty to clear)"
          className={`w-3/4 font-robotoslab px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 ${
            isDark
              ? "bg-zinc-800 border-zinc-600 text-zinc-200 focus:ring-zinc-400"
              : "bg-white border-zinc-300 text-zinc-800 focus:ring-blue-500"
          }`}
          disabled={isLoading}
        />
        <div className="flex gap-2 font-robotoslab">
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
        {error && (
          <span className="text-sm text-red-500 font-medium">{error}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1 font-robotoslab lg:flex-row lg:gap-3">
      {nickname && (
        <div
          className={`text-xl font-medium ${
            isDark ? "text-zinc-200" : "text-zinc-800"
          }`}
        >
          "{nickname}"
        </div>
      )}
      {isEditMode && (
        <button
          onClick={onStartEditing}
          className="cursor-pointer px-2 py-0.5 text-md rounded bg-[#0E9000] text-zinc-100 hover:bg-[#4cab39]"
        >
          {nickname ? (
            <Pencil className="inline-block w-5 h-5 mr-2" />
          ) : (
            <Plus className="inline-block w-5 h-5 mr-1" />
          )}
          {nickname ? "Edit Nickname" : "Add Nickname"}
        </button>
      )}
    </div>
  );
}
