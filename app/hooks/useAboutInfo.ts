import { useState } from "react";
import { apiService, AboutInfo } from "../services/api";

export function useAboutInfo(pokemonId: number | undefined) {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState<AboutInfo>({
    height: null,
    weight: null,
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEditing = () => {
    setInputValue({
      height: aboutInfo?.height || null,
      weight: aboutInfo?.weight || null,
      description: aboutInfo?.description || "",
    });
    setIsEditing(true);
    setError(null);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleHeightChange = (value: string) => {
    if (value === "") {
      setInputValue((prev) => ({ ...prev, height: null }));
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        const rounded = Math.round(numValue * 100) / 100;
        setInputValue((prev) => ({ ...prev, height: rounded }));
      }
    }
  };

  const handleWeightChange = (value: string) => {
    if (value === "") {
      setInputValue((prev) => ({ ...prev, weight: null }));
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        const rounded = Math.round(numValue * 100) / 100;
        setInputValue((prev) => ({ ...prev, weight: rounded }));
      }
    }
  };

  const handleDescriptionChange = (value: string) => {
    setInputValue((prev) => ({ ...prev, description: value }));
  };

  const save = async () => {
    if (!pokemonId) {
      setError("No Pokémon selected.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const submissionData = {
        height: inputValue.height,
        weight: inputValue.weight,
        description: inputValue.description?.trim() || null,
      };

      const isEmpty =
        submissionData.height === null &&
        submissionData.weight === null &&
        !submissionData.description;

      if (isEmpty) {
        await apiService.deleteAboutInfo(pokemonId);
        setAboutInfo(null);
      } else {
        const response = await apiService.setAboutInfo(pokemonId, submissionData);
        setAboutInfo(response.data.aboutInfo);
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save about info:", error);
      setError("Failed to save about information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadAboutInfo = async () => {
    if (!pokemonId) return;
    try {
      const res = await apiService.getAboutInfo(pokemonId);
      setAboutInfo(res.data.aboutInfo);
    } catch (error) {
      console.error("Failed to load about info:", error);
    }
  };

  return {
    aboutInfo,
    setAboutInfo,
    isEditing,
    inputValue,
    isLoading,
    error,
    startEditing,
    cancelEditing,
    handleHeightChange,
    handleWeightChange,
    handleDescriptionChange,
    save,
    loadAboutInfo,
  };
}