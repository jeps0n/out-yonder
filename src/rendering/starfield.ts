import {
  Application,
  Graphics,
} from "pixi.js";
import { requireElement } from "../ui/elements.ts";

export async function initializeStarfield(): Promise<void> {
  const host = requireElement<HTMLDivElement>("#starfield");
  const pixi = new Application();

  await pixi.init({
    resizeTo: host,
    backgroundAlpha: 0,
    antialias: true,
    preference: "webgl",
  });

  host.appendChild(pixi.canvas);
  const stars = new Graphics();
  const points = Array.from({ length: 115 }, () => ({
    x: Math.random(),
    y: Math.random(),
    radius: Math.random() * 1.5 + 0.3,
    phase: Math.random() * Math.PI * 2,
  }));
  pixi.stage.addChild(stars);
  let elapsed = 0;

  pixi.ticker.add((ticker) => {
    elapsed += ticker.deltaTime * 0.012;
    stars.clear();

    for (const point of points) {
      const alpha = 0.3 + 0.4 * (0.5 + 0.5 * Math.sin(elapsed + point.phase));
      stars.circle(
        point.x * pixi.screen.width,
        point.y * pixi.screen.height,
        point.radius,
      );
      stars.fill({
        color: 0xe8f7ff,
        alpha,
      });
    }
  });
}

