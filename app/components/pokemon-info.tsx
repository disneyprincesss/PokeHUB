"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SquareX } from "lucide-react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PokemonDetails } from "../types/pokemon";
import { useNickname } from "../hooks/useNickname";
import { useAboutInfo } from "../hooks/useAboutInfo";
import {
  getTypeGradient,
  getTypeBgPosition,
  isDarkTextType,
} from "../lib/pokemon-colors";
import Nickname from "./pokemon-info/nickname";
import About from "./pokemon-info/about";
import Stats from "./pokemon-info/stats";
import Evolution from "./pokemon-info/evolution";

interface PokemonInfoProps {
  pokemon: PokemonDetails | null;
  setIsCardOpen: (open: boolean) => void;
  setSelectedPokemon: (pokemon: PokemonDetails | null) => void;
}

export default function PokemonInfo({
  pokemon,
  setIsCardOpen,
  setSelectedPokemon,
}: PokemonInfoProps) {
  const pathname = usePathname();
  const isEditMode = pathname?.endsWith("/edit") ?? false;

  const pokemonType = pokemon?.types[0].type.name || "";
  const isDark = isDarkTextType(pokemonType);

  const nicknameHook = useNickname(pokemon?.id);
  const aboutHook = useAboutInfo(pokemon?.id);

  // Load data on mount
  useEffect(() => {
    if (!pokemon?.id) return;

    const loadData = async () => {
      await Promise.all([
        nicknameHook.loadNickname(),
        aboutHook.loadAboutInfo(),
      ]);
    };

    loadData();
  }, [pokemon?.id]);

  if (!pokemon) return null;

  const handleClose = () => {
    setIsCardOpen(false);
    setSelectedPokemon(null);
  };

  return (
    <Card
      className={`bg-linear-to-r ${getTypeGradient(
        pokemonType
      )} w-[95vw] max-w-6xl max-h-[90vh] sm:max-h-screen lg:max-h-[90vh] absolute inset-0 my-auto mx-auto flex flex-col lg:flex-row overflow-hidden rounded-2xl`}
    >
      {/* Background Image */}
      <div className="relative w-full">
        {pokemonType !== "normal" && (
          <img
            src={`/image/card-bg/${pokemonType}-bg.png`}
            alt={`${pokemonType} type`}
            className={`opacity-50 absolute h-50 left-0 right-20 mx-auto lg:right-0 lg:mx-0 sm:h-55 ${getTypeBgPosition(
              pokemonType
            )}`}
          />
        )}
        <img
          src={pokemon.image || ""}
          alt={pokemon.name}
          className={`z-10 mx-auto absolute right-0 h-40 sm:h-45 lg:h-100 ${
            pokemonType === "normal"
              ? "lg:inset-0 lg:my-auto inset-x-0 h-45 sm:h-55"
              : "left-10 sm:left-25 top-12 lg:top-55 lg:left-40"
          }`}
        />
      </div>

      {/* Content */}
      <div
        className={`w-full pb-5 lg:pb-0 flex flex-col justify-center items-center lg:items-start lg:justify-start px-0 absolute bottom-0 lg:static ${
          isDark ? "text-zinc-200" : "text-zinc-800"
        }`}
      >
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-jersey font-bold uppercase tracking-wider text-shadow-[5px_5px_6px_rgba(0,0,0,0.5)] sm:text-shadow-[8px_8px_10px_rgba(0,0,0,0.5)] text-center lg:text-left z-10">
          {pokemon.name}
        </h1>

        <Nickname
          nickname={nicknameHook.nickname}
          isEditing={nicknameHook.isEditing}
          inputValue={nicknameHook.inputValue}
          isLoading={nicknameHook.isLoading}
          error={nicknameHook.error}
          isEditMode={isEditMode}
          pokemonType={pokemonType}
          onInputChange={nicknameHook.setInputValue}
          onStartEditing={nicknameHook.startEditing}
          onSave={nicknameHook.save}
          onCancel={nicknameHook.cancelEditing}
        />

        <Tabs defaultValue="about">
          <TabsList>
            <TabsTrigger
              value="about"
              className={isDark ? "text-zinc-200 border-b-zinc-200" : ""}
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className={isDark ? "text-zinc-200 border-b-zinc-200" : ""}
            >
              Base Stats
            </TabsTrigger>
            <TabsTrigger
              value="evolution"
              className={isDark ? "text-zinc-200 border-b-zinc-200" : ""}
            >
              Evolution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <About
              pokemon={pokemon}
              pokemonType={pokemonType}
              aboutInfo={aboutHook.aboutInfo}
              isEditing={aboutHook.isEditing}
              inputValue={aboutHook.inputValue}
              isLoading={aboutHook.isLoading}
              error={aboutHook.error}
              isEditMode={isEditMode}
              hasNickname={!!nicknameHook.nickname}
              onStartEditing={aboutHook.startEditing}
              onSave={aboutHook.save}
              onCancel={aboutHook.cancelEditing}
              onHeightChange={aboutHook.handleHeightChange}
              onWeightChange={aboutHook.handleWeightChange}
              onDescriptionChange={aboutHook.handleDescriptionChange}
            />
          </TabsContent>

          <TabsContent
            value="stats"
            className="justify-center items-center px-3"
          >
            <Stats
              pokemon={pokemon}
              isEditMode={isEditMode}
              hasNickname={!!nicknameHook.nickname}
            />
          </TabsContent>

          <TabsContent value="evolution" className="px-3 max-h-[45vh]">
            <Evolution
              pokemon={pokemon}
              isEditMode={isEditMode}
              hasNickname={!!nicknameHook.nickname}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 lg:top-5 lg:right-5 cursor-pointer z-20"
      >
        <SquareX className="w-8 h-8 lg:w-10 lg:h-10 text-zinc-900 hover:text-red-400" />
      </button>
    </Card>
  );
}
