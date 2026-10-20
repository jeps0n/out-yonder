const SYMBOL_BASE_URL = `${import.meta.env.BASE_URL}symbols/`;

function symbolUrl(filename: string): string {
  return `${SYMBOL_BASE_URL}${filename}`;
}

export const SYMBOL_ART = [
  { name: "PLANET", url: symbolUrl("planet.png") },
  { name: "ROCKET", url: symbolUrl("rocket.png") },
  { name: "EXPLORER", url: symbolUrl("explorer.png") },
  { name: "NEIGHBOR", url: symbolUrl("neighbor.png") },
] as const;

export const MOON_ART = symbolUrl("moon.png");

export function makeSymbolImage(symbol: number): HTMLImageElement {
  const art = SYMBOL_ART[symbol];
  const image = document.createElement("img");

  image.className = "symbol-art";
  image.src = art.url;
  image.alt = "";
  image.draggable = false;

  return image;
}

export function setSymbolImage(
  projection: HTMLElement,
  symbol: number,
): void {
  const image = projection.querySelector<HTMLImageElement>("img");

  if (!image) {
    throw new Error("Symbol artwork element is missing.");
  }

  image.src = SYMBOL_ART[symbol].url;
}
