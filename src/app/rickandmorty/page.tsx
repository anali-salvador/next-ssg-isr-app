import { Character, CharacterResponse } from "@/types/character";
import CharacterExplorer from "./CharacterExplorer";
import { fetchWithRetry } from "@/lib/rickandmorty";

async function getCharacters(): Promise<Character[]> {
  const res = await fetchWithRetry("https://rickandmortyapi.com/api/character", {
    cache: "force-cache", // Caché forzado: se obtiene una vez y se reutiliza (SSG)
  });

  if (!res.ok) throw new Error("Error al cargar personajes");

  const data: CharacterResponse = await res.json();
  return data.results;
}

export default async function CharacterList() {
  const characters = await getCharacters();

  return (
    <div className="px-4 py-8 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Esta página se renderiza en el servidor (SSR) con caché forzado (SSG) */}
        <header className="mb-10 text-center">
          <p className="text-4xl sm:text-5xl mb-2" aria-hidden>
            <span className="inline-block rm-wiggle">🧪</span>{" "}
            <span className="inline-block rm-float">🛸</span>{" "}
            <span className="inline-block rm-wiggle">👽</span>
          </p>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wider text-lime-300 rm-neon-text leading-none">
            Personajes de Rick and Morty
          </h1>
          <p className="mt-4 inline-block rounded-full bg-purple-600/50 border-2 border-purple-400/70 px-5 py-1 font-extrabold text-purple-100">
            ⚡ Generado con SSG · Busca en tiempo real
          </p>
        </header>

        {/* La búsqueda en tiempo real se hace en el cliente a partir de la lista inicial */}
        <CharacterExplorer initialCharacters={characters} />
      </div>
    </div>
  );
}
