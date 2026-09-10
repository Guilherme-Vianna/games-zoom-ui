/**
 * Validacao client-side do que o usuario cola no campo "adicionar jogo".
 * A fonte da verdade continua sendo a API (`parseSteamAppId` no games-zoom-api);
 * aqui e so pra dar feedback imediato antes de enviar.
 */

const NUMERIC_ONLY = /^\d{1,7}$/;
const APP_PATH = /\/app\/(\d{1,7})(?:\/|\?|#|$)/;

export function extractSteamAppId(input: string | null | undefined): number | null {
  if (!input) return null;
  const value = input.trim();
  if (!value) return null;

  if (NUMERIC_ONLY.test(value)) {
    const n = Number(value);
    return n > 0 ? n : null;
  }
  if (!/steampowered\.com|steamcommunity\.com/i.test(value)) return null;

  const match = value.match(APP_PATH);
  if (!match) return null;
  const n = Number(match[1]);
  return n > 0 ? n : null;
}

export function looksLikeSteamInput(input: string): boolean {
  return extractSteamAppId(input) !== null;
}
