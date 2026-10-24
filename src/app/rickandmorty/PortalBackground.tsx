// Fondo animado de la sección: gradiente en movimiento, portal girando y estrellas
const starColors = ["bg-lime-300", "bg-pink-400", "bg-yellow-300", "bg-purple-400", "bg-white"];

// Posiciones fijas (no aleatorias) para que el HTML sea siempre el mismo
const stars = Array.from({ length: 45 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: 2 + (i % 3) * 2,
  delay: (i % 9) * 0.45,
  duration: 3 + (i % 5),
  color: starColors[i % starColors.length],
}));

export default function PortalBackground() {
  return (
    <div aria-hidden className="rm-bg fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="rm-portal absolute left-1/2 top-1/2 w-[90vmin] h-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25" />
      <div className="absolute left-1/2 top-1/2 w-[40vmin] h-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/10 blur-3xl" />

      {stars.map((star, i) => (
        <span
          key={i}
          className={`rm-star absolute rounded-full ${star.color}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: star.size,
            height: star.size,
            boxShadow: "0 0 8px currentColor",
            ["--rm-delay" as string]: `${star.delay}s`,
            ["--rm-duration" as string]: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
