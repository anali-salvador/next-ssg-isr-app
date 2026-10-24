import Link from "next/link";
import { TbPokeballOff } from "react-icons/tb";
import { IoArrowBack } from "react-icons/io5";

export default function NotFound() {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center p-8 bg-linear-to-br from-purple-500 to-purple-900">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border-t-8 border-purple-600">
        <TbPokeballOff size={80} className="mx-auto text-purple-600 mb-4" />
        <h1 className="text-3xl font-bold text-purple-900 mb-3">
          404 - Página no encontrada
        </h1>
        <p className="text-gray-600 mb-6">No encontramos lo que buscabas</p>
        <Link
          href="/pokemon"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition hover:scale-105"
        >
          <IoArrowBack size={20} /> Volver al Pokédex
        </Link>
      </div>
    </div>
  );
}
