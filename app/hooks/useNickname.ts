import { useState } from "react";
import { apiService } from "../services/api";

export function useNickname(pokemonId: number | undefined) {
  const [nickname, setNickname] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setInputValue(nickname || "");
    setIsEditing(true);
    setError(null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError(null);
  };

  const save = async () => {
    if (!pokemonId) return;

    try {
      setIsLoading(true);
      setError(null);

      const trimmed = inputValue.trim();

      if (trimmed.length === 0) {
        await apiService.deleteNickname(pokemonId);
        setNickname(null);
      } else {
        const res = await apiService.setNickname(pokemonId, trimmed);
        setNickname(res.data.nickname);
      }

      setIsEditing(false);
    } catch (e: any) {
      setError(e?.message || "Failed to save nickname");
    } finally {
      setIsLoading(false);
    }
  };

  const loadNickname = async () => {
    if (!pokemonId) return;
    try {
      const res = await apiService.getNickname(pokemonId);
      setNickname(res.data.nickname);
    } catch (error) {
      console.error("Failed to load nickname:", error);
    }
  };

  return {
    nickname,
    setNickname,
    isEditing,
    inputValue,
    setInputValue,
    isLoading,
    error,
    startEditing,
    cancelEditing,
    save,
    loadNickname,
  };
}