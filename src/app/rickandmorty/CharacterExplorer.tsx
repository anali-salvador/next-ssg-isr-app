"use client";

import { useEffect, useState } from "react";
import { Character, CharacterResponse } from "@/types/character";
import CharacterCard from "./CharacterCard";

interface CharacterExplorerProps {
  initialCharacters: Character[];
}

interface Filters {
  name: string;
  status: string;
  type: string;
  gender: string;
}

const emptyFilters: Filters = { name: "", status: "", type: "", gender: "" };

// Espera `ms` milisegundos; si la señal se cancela antes, rechaza con AbortError
function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timeoutId);
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );
  });
}

interface ChipOption {
  value: string;
  label: string;
}

const statusOptions: ChipOption[] = [
  { value: "", label: "Todos 🌈" },
  { value: "alive", label: "Alive 💚" },
  { value: "dead", label: "Dead 💀" },
  { value: "unknown", label: "Unknown ❓" },
];

const genderOptions: ChipOption[] = [
  { value: "", label: "Todos 🌈" },
  { value: "female", label: "Female ♀️" },
  { value: "male", label: "Male ♂️" },
  { value: "genderless", label: "Genderless ⚪" },
  { value: "unknown", label: "Unknown ❓" },
];

const inputClass =
  "w-full bg-black/50 border-4 border-purple-500/60 text-white text-lg font-semibold placeholder-gray-400 rounded-2xl px-4 py-3 transition focus:outline-none focus:border-lime-400 focus:shadow-[0_0_24px_rgba(163,230,53,0.55)] hover:border-pink-400";

const labelClass = "block font-display text-xl tracking-wider text-yellow-300 mb-2";

interface ChipGroupProps {
  label: string;
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
}

// Grupo de chips grandes que reemplaza a los <select>
function ChipGroup({ label, options, value, onChange }: ChipGroupProps) {
  return (
    <fieldset>
      <legend className={labelClass}>{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`rm-bounce-hover rounded-full border-4 px-4 py-2 font-extrabold transition cursor-pointer ${
                active
                  ? "bg-lime-400 text-gray-950 border-lime-200 shadow-[0_0_20px_rgba(163,230,53,0.7)]"
                  : "bg-black/40 text-white border-purple-500/60 hover:border-pink-400 hover:text-pink-200"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function CharacterExplorer({ initialCharacters }: CharacterExplorerProps) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [results, setResults] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasFilters = Object.values(filters).some((value) => value.trim() !== "");

  // Sin filtros: se muestra la lista inicial que llegó del servidor, sin fetch
  const characters = hasFilters ? results : initialCharacters;
  const isLoading = hasFilters && loading;
  const currentError = hasFilters ? error : null;

  useEffect(() => {
    if (!hasFilters) return;

    const controller = new AbortController();

    // Debounce: espera 400 ms desde la última tecla antes de buscar
    const timeoutId = setTimeout(async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim() !== "") params.set(key, value.trim());
      });

      setLoading(true);
      setError(null);

      const url = `https://rickandmortyapi.com/api/character/?${params.toString()}`;

      try {
        let res: Response;
        try {
          res = await fetch(url, { signal: controller.signal });
        } catch (err) {
          // TypeError ("Failed to fetch"): suele ser el rate limit de la API sin header CORS.
          // Se reintenta una sola vez tras 2 s; una cancelación (AbortError) no se reintenta
          if (!(err instanceof TypeError)) throw err;
          await wait(2000, controller.signal);
          res = await fetch(url, { signal: controller.signal });
        }

        if (res.status === 404) {
          setResults([]);
          return;
        }
        if (!res.ok) throw new Error(`Error ${res.status} al buscar personajes`);

        const data: CharacterResponse = await res.json();
        setResults(data.results);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setResults([]);
        if (err instanceof TypeError) {
          setError("La API está limitando las peticiones, espera unos segundos e intenta de nuevo.");
        } else {
          setError(err instanceof Error ? err.message : "Error al buscar personajes");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 400);

    // Al cambiar un filtro se cancela el temporizador y la petición anterior
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [filters, hasFilters]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setLoading(true); // "Buscando..." desde que el usuario escribe, también durante el debounce
  };

  const clearFilters = () => setFilters(emptyFilters);

  const showList = !isLoading && !currentError && characters.length > 0;

  return (
    <div>
      <section className="mb-8 rounded-3xl border-4 border-purple-500/50 bg-black/40 backdrop-blur-xl p-5 sm:p-6 shadow-[0_0_40px_rgba(168,85,247,0.25)] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="filter-name" className={labelClass}>🔎 Nombre</label>
            <input
              id="filter-name"
              type="text"
              placeholder="Escribe un nombre (ej. rick)"
              value={filters.name}
              onChange={(e) => updateFilter("name", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="filter-type" className={labelClass}>🧬 Tipo</label>
            <input
              id="filter-type"
              type="text"
              placeholder="Ej. parasite, robot..."
              value={filters.type}
              onChange={(e) => updateFilter("type", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <ChipGroup
          label="💓 Estado"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
        />

        <ChipGroup
          label="⚧ Género"
          options={genderOptions}
          value={filters.gender}
          onChange={(value) => updateFilter("gender", value)}
        />

        <div className="flex flex-wrap items-center justify-between gap-4 border-t-2 border-purple-500/30 pt-5">
          <p className="text-lg font-extrabold text-lime-200" aria-live="polite">
            {isLoading
              ? "🌀 Buscando en el multiverso..."
              : showList
                ? `Mostrando ${characters.length} personajes 🎉`
                : "Sin resultados por ahora 👀"}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            disabled={!hasFilters}
            className="rm-bounce-hover rounded-full bg-pink-500 border-4 border-pink-300 px-6 py-2 font-display text-xl tracking-wider text-white shadow-lg shadow-pink-500/40 transition hover:bg-pink-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:animate-none cursor-pointer"
          >
            🧹 Limpiar filtros
          </button>
        </div>
      </section>

      {isLoading && (
        <div className="flex flex-col items-center gap-3 py-12">
          <span className="rm-spin text-6xl" aria-hidden>🌀</span>
          <p className="font-display text-3xl tracking-wider text-lime-300 rm-neon-text">Buscando...</p>
        </div>
      )}

      {currentError && (
        <div className="mx-auto max-w-xl rounded-3xl border-4 border-yellow-300 bg-yellow-300/15 backdrop-blur-md p-6 text-center shadow-[0_0_30px_rgba(253,224,71,0.35)]">
          <p className="rm-wiggle text-6xl mb-3" aria-hidden>⏳</p>
          <p className="text-lg font-bold text-yellow-100">{currentError}</p>
        </div>
      )}

      {!isLoading && !currentError && characters.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="rm-float text-7xl" aria-hidden>🛸😵</p>
          <p className="font-display text-3xl tracking-wider text-pink-300">
            No se encontraron personajes
          </p>
          <p className="text-gray-300 font-semibold">Prueba con otro nombre o quita algún filtro</p>
        </div>
      )}

      {showList && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {characters.map((character, index) => (
            <CharacterCard key={character.id} character={character} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
