import { initializeGame } from "./game/spinController.ts";
import { initializeStarfield } from "./rendering/starfield.ts";
import { requireElement } from "./ui/elements.ts";
import { renderGameTemplate } from "./ui/template.ts";

const app = requireElement<HTMLDivElement>("#app");

renderGameTemplate(app);
initializeGame();

void initializeStarfield().catch((error: unknown) => {
  if (import.meta.env.DEV) {
    console.warn("Starfield initialization failed:", error);
  }
});
