import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { PokemonListItem } from "../types/pokemon";
import { fetchPokemonList, fetchPokemonByType } from "../lib/pokeapi";
import { useDebouncedValue } from "./useDebouncedValue";

export function usePokemonLibrary() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read from URL
  const searchTerm = searchParams.get("search") || "";
  const selectedType = searchParams.get("type") || "";

  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [filteredList, setFilteredList] = useState<PokemonListItem[]>([]);
  const [typeCache, setTypeCache] = useState<Record<string, Set<string>>>({});
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebouncedValue(searchTerm.trim().toLowerCase());

  // Update URL params
  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  const setSearchTerm = (value: string) => updateParams("search", value);
  const setSelectedType = (value: string) => updateParams("type", value);

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    fetchPokemonList()
      .then((results) => {
        setPokemonList(results);
        setFilteredList(results);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter by search + type
  useEffect(() => {
    let base = pokemonList;

    if (debouncedSearch) {
      base = base.filter((p) => p.name.toLowerCase().includes(debouncedSearch));
    }

    if (selectedType) {
      const cached = typeCache[selectedType];
      if (cached) {
        setFilteredList(base.filter((p) => cached.has(p.name)));
      } else {
        fetchPokemonByType(selectedType)
          .then((names) => {
            setTypeCache((prev) => ({ ...prev, [selectedType]: names }));
            setFilteredList(base.filter((p) => names.has(p.name)));
          })
          .catch(() => setFilteredList(base));
      }
    } else {
      setFilteredList(base);
    }
  }, [debouncedSearch, selectedType, pokemonList, typeCache]);

  return {
    filteredList,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    loading,
  };
}