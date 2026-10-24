import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laboratorio 10 - Next.js",
  description: "Enrutamiento y páginas con SSG / ISR: Pokédex y Rick and Morty",
};

const labs = [
  {
    href: "/pokemon",
    emoji: "🔴",
    title: "Pokédex",
    description: "Lab guiado: ISR + rutas dinámicas",
    card: "border-purple-500/60 hover:border-purple-300 hover:shadow-purple-500/40",
    badge: "bg-purple-600/40 text-purple-100 border-purple-400/60",
  },
  {
    href: "/rickandmorty",
    emoji: "🌀",
    title: "Rick and Morty",
    description: "Tarea: SSR, CSR, SSG e ISR",
    card: "border-lime-400/60 hover:border-lime-300 hover:shadow-lime-400/40",
    badge: "bg-lime-500/25 text-lime-100 border-lime-400/60",
  },
];

export default function Home() {
  return (
    <main className="flex-1 min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-gray-950 via-purple-950 to-green-950 text-white">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-12">
          <p className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold tracking-wide text-gray-200 mb-6">
            ⚡ Next.js · App Router
          </p>
          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
            Laboratorio 10 - Next.js:{" "}
            <span className="bg-linear-to-r from-purple-400 to-lime-300 bg-clip-text text-transparent">
              Enrutamiento y Páginas (SSG / ISR)
            </span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl font-semibold text-gray-100">Anali Salvador</p>
          <p className="text-gray-300">Desarrollo de Aplicaciones Web Avanzado</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labs.map((lab) => (
            <Link
              key={lab.href}
              href={lab.href}
              className={`group rounded-3xl border-4 bg-black/40 backdrop-blur-sm p-8 shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60 ${lab.card}`}
            >
              <span className="block text-6xl mb-4 transition duration-300 group-hover:scale-110 group-hover:rotate-6">
                {lab.emoji}
              </span>
              <h2 className="text-3xl font-extrabold mb-3">{lab.title}</h2>
              <p className={`inline-block rounded-full border px-4 py-1 text-sm font-semibold ${lab.badge}`}>
                {lab.description}
              </p>
              <p className="mt-6 font-bold text-gray-200 group-hover:text-white transition">
                Entrar <span className="inline-block transition group-hover:translate-x-1">→</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
