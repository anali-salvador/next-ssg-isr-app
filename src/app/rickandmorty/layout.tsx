import { ReactNode } from "react";
import { Metadata } from "next";
import { Bangers, Nunito } from "next/font/google";
import { GiPortal } from "react-icons/gi";
import Link from "next/link";
import PortalBackground from "./PortalBackground";

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Rick and Morty - Next.js",
  description: "Explora los personajes de Rick and Morty",
};

interface RickAndMortyLayoutProps {
  children: ReactNode;
}

export default function RickAndMortyLayout({ children }: RickAndMortyLayoutProps) {
  return (
    <div
      className={`${bangers.variable} ${nunito.variable} font-body relative isolate min-h-screen text-white`}
    >
      <PortalBackground />

      <nav className="sticky top-0 z-50 bg-black/35 backdrop-blur-xl border-b-2 border-lime-400/40 shadow-[0_6px_30px_rgba(163,230,53,0.15)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link
            href="/rickandmorty"
            className="group flex items-center gap-3 font-display text-2xl sm:text-3xl tracking-wider text-lime-300 hover:text-pink-300 transition"
          >
            <span className="rm-spin-slow inline-flex rounded-full p-1 bg-lime-400/20 shadow-[0_0_20px_rgba(163,230,53,0.6)]">
              <GiPortal size={34} className="text-lime-300 group-hover:text-pink-300" />
            </span>
            <span className="rm-neon-text">Rick and Morty</span>
          </Link>
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-purple-600/40 border-2 border-purple-400/60 px-4 py-1 text-sm font-extrabold">
            🧪 Multiverso Next.js
          </span>
        </div>
      </nav>

      <div className="relative">{children}</div>
    </div>
  );
}
