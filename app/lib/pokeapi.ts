import { EvolutionPokemon, PokemonDetails, PokemonListItem } from "../types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(limit = 151): Promise<PokemonListItem[]> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
  const data = await res.json();
  return data.results;
}

export async function fetchPokemonByType(type: string): Promise<Set<string>> {
  const res = await fetch(`${BASE_URL}/type/${type}`);
  const data = await res.json();
  return new Set((data.pokemon || []).map((x: any) => x.pokemon.name));
}

function getEvolutionNames(chain: any, acc: string[] = []): string[] {
  acc.push(chain.species.name);
  if (chain.evolves_to?.length) {
    chain.evolves_to.forEach((c: any) => getEvolutionNames(c, acc));
  }
  return acc;
}

function getBestImage(sprites: any): string {
  return (
    sprites.other["official-artwork"].front_default ||
    sprites.other["dream_world"].front_default ||
    sprites.other["home"].front_default ||
    sprites.front_default
  );
}

export async function fetchPokemonDetails(url: string): Promise<PokemonDetails> {
  const res = await fetch(url);
  const data = await res.json();

  const speciesRes = await fetch(data.species.url);
  const speciesData = await speciesRes.json();

  const flavorText =
    speciesData.flavor_text_entries
      .find((e: any) => e.language.name === "en")
      ?.flavor_text?.replace(/\f|\n|\r/g, " ") || "No description available.";

  const image = getBestImage(data.sprites);

  let evolutionChain: EvolutionPokemon[] = [];

  if (speciesData.evolution_chain?.url) {
    const evolutionRes = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionRes.json();
    const evolutionNames = getEvolutionNames(evolutionData.chain);

    const evolutionPromises = evolutionNames.map(async (name) => {
      try {
        const pokemonRes = await fetch(`${BASE_URL}/pokemon/${name}`);
        const pokemonData = await pokemonRes.json();
        return {
          id: pokemonData.id,
          name: pokemonData.name,
          image: getBestImage(pokemonData.sprites),
          types: pokemonData.types,
        };
      } catch (error) {
        console.error(`Failed to fetch evolution data for ${name}:`, error);
        return null;
      }
    });

    const results = await Promise.all(evolutionPromises);
    evolutionChain = results.filter(Boolean) as EvolutionPokemon[];
  }

  return {
    ...data,
    description: flavorText,
    image,
    evolutionChain,
  };
}