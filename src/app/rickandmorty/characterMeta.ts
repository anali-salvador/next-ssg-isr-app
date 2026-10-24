// Emojis y colores compartidos por la lista, las tarjetas y el detalle

interface StatusMeta {
  emoji: string;
  dot: string;
  badge: string;
}

export const statusMeta: Record<string, StatusMeta> = {
  Alive: {
    emoji: "💚",
    dot: "bg-lime-400 rm-pulse-dot",
    badge: "bg-gray-950/85 text-lime-300 border-lime-400",
  },
  Dead: {
    emoji: "💀",
    dot: "bg-red-500",
    badge: "bg-gray-950/85 text-red-300 border-red-400",
  },
  unknown: {
    emoji: "❓",
    dot: "bg-gray-400",
    badge: "bg-gray-950/85 text-gray-200 border-gray-400",
  },
};

export function getStatusMeta(status: string): StatusMeta {
  return statusMeta[status] ?? statusMeta.unknown;
}

const speciesEmojis: Record<string, string> = {
  Human: "🧑",
  Alien: "👽",
  Robot: "🤖",
  Humanoid: "🦾",
  Animal: "🐾",
  Cronenberg: "🧟",
  Disease: "🦠",
  Poopybutthole: "💩",
  "Mythological Creature": "🐉",
  Planet: "🪐",
  unknown: "❓",
};

export function getSpeciesEmoji(species: string): string {
  return speciesEmojis[species] ?? "✨";
}

// Colores que rotan para chips y etiquetas
export const chipColors = [
  "bg-lime-400 text-gray-950 shadow-lime-400/50",
  "bg-pink-500 text-white shadow-pink-500/50",
  "bg-purple-500 text-white shadow-purple-500/50",
  "bg-yellow-300 text-gray-950 shadow-yellow-300/50",
  "bg-cyan-400 text-gray-950 shadow-cyan-400/50",
];
