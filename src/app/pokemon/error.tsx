"use client"; // Los error boundaries deben ser Client Components

import { useEffect } from "react";
import { MdErrorOutline } from "react-icons/md";
import { IoReload } from "react-icons/io5";

interface PokemonErrorProps {
  error: unknown;
  reset: () => void;
}

export default function PokemonError({ error, reset }: PokemonErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const message =
    error instanceof Error ? error.message : "Ocurrió un error inesperado";

  return (
    <div className="p-8 flex items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border-t-8 border-purple-600">
        <MdErrorOutline size={72} className="mx-auto text-purple-600 mb-4" />
        <h2 className="text-3xl font-bold text-purple-900 mb-3">
          Algo salió mal
        </h2>
        <p className="text-gray-600 bg-purple-50 rounded-lg px-4 py-3 mb-6 wrap-break-word">
          {message}
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition hover:scale-105 cursor-pointer"
        >
          <IoReload size={20} /> Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
