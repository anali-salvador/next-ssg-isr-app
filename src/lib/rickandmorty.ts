// fetch resistente al límite de peticiones de la API de Rick and Morty (429 / 5xx de Cloudflare)

import { Character } from "@/types/character";

export const CHARACTER_CHUNK_SIZE = 100;

const MAX_RETRIES = 4; // 1 intento + 4 reintentos
const BASE_DELAY_MS = 1000; // 1s, 2s, 4s, 8s
const MAX_DELAY_MS = 30000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retry-After puede venir en segundos ("10") o como fecha HTTP
function parseRetryAfter(header: string | null): number | null {
  if (!header) return null;

  const seconds = Number(header);
  if (!Number.isNaN(seconds)) return seconds * 1000;

  const date = Date.parse(header);
  if (!Number.isNaN(date)) return Math.max(0, date - Date.now());

  return null;
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

export async function fetchWithRetry(url: string, options?: RequestInit): Promise<Response> {
  let lastProblem = "";

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let retryAfterMs: number | null = null;

    try {
      const res = await fetch(url, options);

      // Éxito o error definitivo (404, 400...): se devuelve sin reintentar
      if (!isRetryableStatus(res.status)) return res;

      lastProblem = `HTTP ${res.status}`;
      retryAfterMs = parseRetryAfter(res.headers.get("retry-after"));
    } catch (err) {
      // TypeError = fallo de red; cualquier otro error (p. ej. AbortError) no se reintenta
      if (!(err instanceof TypeError)) throw err;
      lastProblem = err.message;
    }

    if (attempt === MAX_RETRIES) break;

    const backoffMs = BASE_DELAY_MS * 2 ** attempt;
    await sleep(Math.min(Math.max(retryAfterMs ?? 0, backoffMs), MAX_DELAY_MS));
  }

  throw new Error(
    `No se pudo obtener ${url} tras ${MAX_RETRIES + 1} intentos (último error: ${lastProblem}). ` +
      "Probablemente la API de Rick and Morty está limitando las peticiones."
  );
}

// Pide un grupo de 100 personajes en una sola petición (grupo 0 = ids 1..100, grupo 1 = 101..200...).
// Con revalidate el resultado queda en la caché de datos y lo reutilizan todas las páginas del grupo
export async function getCharacterChunk(chunkIndex: number): Promise<Character[]> {
  const firstId = chunkIndex * CHARACTER_CHUNK_SIZE + 1;
  const ids = Array.from({ length: CHARACTER_CHUNK_SIZE }, (_, i) => firstId + i);

  const res = await fetchWithRetry(`https://rickandmortyapi.com/api/character/${ids.join(",")}`, {
    next: { revalidate: 864000 }, // ISR: se vuelve a pedir cada 10 días
  });

  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`Error ${res.status} al cargar el grupo de personajes ${chunkIndex}`);

  // La API devuelve un array, salvo cuando se pide un solo id: entonces devuelve un objeto
  const data: Character | Character[] = await res.json();
  return Array.isArray(data) ? data : [data];
}
