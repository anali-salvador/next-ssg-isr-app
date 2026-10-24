import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Character, CharacterResponse } from "@/types/character";
import { chipColors, getSpeciesEmoji } from "../characterMeta";
import StatusBadge from "../StatusBadge";
import { CHARACTER_CHUNK_SIZE, fetchWithRetry, getCharacterChunk } from "@/lib/rickandmorty";

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

// En vez de una petición por página, se pide el grupo de 100 personajes al que pertenece el id.
// ISR: getCharacterChunk usa revalidate: 864000, así que la página se regenera cada 10 días
async function getCharacter(id: string): Promise<Character> {
  if (!/^\d+$/.test(id) || Number(id) < 1) notFound();

  const numericId = Number(id);
  const chunk = await getCharacterChunk(Math.floor((numericId - 1) / CHARACTER_CHUNK_SIZE));
  const character = chunk.find((item) => item.id === numericId);

  if (!character) notFound();
  return character;
}

// SSG: genera en el build una página estática por cada personaje (1..count)
export async function generateStaticParams() {
  const res = await fetchWithRetry("https://rickandmortyapi.com/api/character");
  if (!res.ok) throw new Error(`Error ${res.status} al obtener la lista de personajes`);

  const data: CharacterResponse = await res.json();

  return Array.from({ length: data.info.count }, (_, index) => ({
    id: String(index + 1),
  }));
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);

  return {
    title: `${character.name} - Rick and Morty`,
    description: `Información sobre ${character.name}`,
  };
}

export default async function CharacterDetail({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  // Número de episodio tomado del final de cada URL (.../episode/28 → 28)
  const episodes = character.episode.map((url) => url.split("/").pop());

  const created = new Date(character.created).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  const info = [
    { emoji: getSpeciesEmoji(character.species), label: "Especie", value: character.species },
    { emoji: "🏷️", label: "Tipo", value: character.type || "Sin tipo" },
    { emoji: "⚧", label: "Género", value: character.gender },
    { emoji: "🌍", label: "Origen", value: character.origin.name },
    { emoji: "📍", label: "Ubicación", value: character.location.name },
    { emoji: "📅", label: "Creado", value: created },
  ];

  const tileBorders = [
    "border-lime-400/70 hover:shadow-lime-400/40",
    "border-pink-400/70 hover:shadow-pink-400/40",
    "border-purple-400/70 hover:shadow-purple-400/40",
    "border-yellow-300/70 hover:shadow-yellow-300/40",
  ];

  return (
    <div className="px-4 py-8 sm:p-8">
      <article className="rm-card-in max-w-5xl mx-auto rounded-[2rem] border-4 border-lime-400/60 bg-gray-950/75 backdrop-blur-xl overflow-hidden shadow-[0_0_50px_rgba(163,230,53,0.3)]">
        <header className="rm-gradient-anim bg-linear-to-r from-purple-700 via-pink-600 to-lime-500 px-6 py-8 text-center">
          <p className="text-3xl mb-1" aria-hidden>🧪🛸👽</p>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wider text-white leading-none drop-shadow-[3px_3px_0_rgba(0,0,0,0.6)]">
            {character.name}
          </h1>
          <span className="mt-3 inline-block -rotate-3 rounded-xl bg-yellow-300 text-gray-950 font-display text-2xl px-4 shadow-lg">
            #{character.id.toString().padStart(3, "0")}
          </span>
        </header>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col items-center gap-6">
            <div className="rm-float relative mt-4">
              <div className="rm-halo absolute -inset-5 rounded-full opacity-80" aria-hidden />
              <Image
                width={300}
                height={300}
                src={character.image}
                alt={character.name}
                className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-8 border-gray-950 object-cover"
              />
            </div>
            <StatusBadge status={character.status} size="lg" />
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="font-display text-3xl tracking-wider text-lime-300 mb-4">📋 Información</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {info.map(({ emoji, label, value }, index) => (
                  <div
                    key={label}
                    className={`rounded-2xl border-4 bg-black/40 px-4 py-3 transition hover:shadow-lg ${tileBorders[index % tileBorders.length]}`}
                  >
                    <dt className="text-sm font-extrabold uppercase tracking-wide text-gray-300">
                      {emoji} {label}
                    </dt>
                    <dd className="text-lg font-bold text-white break-words">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <h2 className="font-display text-3xl tracking-wider text-pink-300 mb-4">
                📺 Episodios ({episodes.length})
              </h2>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                {episodes.map((episode, index) => (
                  <span
                    key={episode}
                    className={`rm-pop inline-block rounded-full px-3 py-1 text-sm font-extrabold shadow-md transition motion-safe:hover:scale-110 ${chipColors[index % chipColors.length]}`}
                    style={{ animationDelay: `${Math.min(index, 40) * 35}ms` }}
                  >
                    Ep. {episode}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-display text-3xl tracking-wider text-yellow-300 mb-2">🔗 URL</h2>
              <a
                href={character.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lime-200 hover:text-pink-300 underline break-all"
              >
                {character.url}
              </a>
            </section>
          </div>
        </div>

        <footer className="p-6 sm:p-8 bg-black/40 border-t-2 border-lime-400/30 flex justify-center sm:justify-start">
          <Link
            href="/rickandmorty"
            className="rm-bounce-hover inline-block rounded-full bg-lime-400 border-4 border-lime-200 px-8 py-3 font-display text-2xl tracking-wider text-gray-950 shadow-[0_0_25px_rgba(163,230,53,0.6)] transition hover:bg-pink-400 hover:border-pink-200 hover:shadow-[0_0_25px_rgba(236,72,153,0.6)]"
          >
            ← Volver a personajes
          </Link>
        </footer>
      </article>
    </div>
  );
}
