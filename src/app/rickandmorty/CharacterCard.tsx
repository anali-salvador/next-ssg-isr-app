import Link from "next/link";
import Image from "next/image";
import { Character } from "@/types/character";
import { getSpeciesEmoji } from "./characterMeta";
import StatusBadge from "./StatusBadge";

interface CharacterCardProps {
  character: Character;
  index?: number;
}

export default function CharacterCard({ character, index = 0 }: CharacterCardProps) {
  return (
    <Link
      href={`/rickandmorty/${character.id}`}
      className="rm-card-in group block rounded-3xl focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-400"
      // Entrada escalonada: cada tarjeta aparece un poco después que la anterior
      style={{ animationDelay: `${Math.min(index, 20) * 60}ms` }}
    >
      <div className="h-full bg-gray-950/80 backdrop-blur-sm border-4 border-lime-400/60 rounded-3xl overflow-hidden shadow-[0_0_24px_rgba(163,230,53,0.25)] transition duration-300 group-hover:border-pink-400 group-hover:shadow-[0_0_36px_rgba(236,72,153,0.55)] motion-safe:group-hover:-translate-y-2 motion-safe:group-hover:-rotate-1">
        <div className="relative overflow-hidden">
          <Image
            width={300}
            height={300}
            src={character.image}
            alt={character.name}
            className="w-full h-auto transition duration-500 motion-safe:group-hover:scale-110"
            priority={false} // carga bajo demanda (lazy loading)
          />
          <div className="absolute top-3 left-3">
            <StatusBadge status={character.status} />
          </div>
          <span className="absolute top-3 right-3 rotate-6 rounded-xl bg-yellow-300 text-gray-950 font-display text-lg px-2 shadow-lg shadow-yellow-300/40">
            #{character.id}
          </span>
        </div>

        <div className="p-4">
          <h2 className="font-display text-2xl tracking-wide text-white leading-tight truncate group-hover:text-lime-300 transition">
            {character.name}
          </h2>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-purple-600/50 border-2 border-purple-400/60 px-3 py-0.5 text-sm font-bold text-purple-100">
            {getSpeciesEmoji(character.species)} {character.species}
          </span>
        </div>
      </div>
    </Link>
  );
}
