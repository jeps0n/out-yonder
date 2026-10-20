import { gsap } from "gsap";
import {
  COLUMN_COUNT,
  ROW_COUNT,
  SYMBOL_COUNT,
} from "../config/gameConfig.ts";
import { randomIndex } from "../math/random.ts";
import { setSymbolImage } from "../ui/symbolAssets.ts";
import type { Board } from "../math/types.ts";

const ACTIVATION_SECONDS = 0.2;
const COLUMN_STOP_SECONDS = [1.65, 1.95, 2.25];
const LOCK_DURATION_SECONDS = 0.1;
const PHASE_INTERVAL_SECONDS = 0.085;

function columnPositions(column: number): number[] {
  return Array.from(
    { length: ROW_COUNT },
    (_, row) => row * COLUMN_COUNT + column,
  );
}

function reelSymbols(cells: HTMLElement[]): HTMLElement[] {
  return cells.map((cell) => {
    const symbol = cell.querySelector<HTMLElement>(".reel-symbol");

    if (!symbol) {
      throw new Error("Reel projection element is missing.");
    }

    return symbol;
  });
}

function lockColumn(
  positions: number[],
  cells: HTMLElement[],
  symbols: HTMLElement[],
  board: Board,
): void {
  positions.forEach((position) => {
    const cell = cells[position];
    const symbol = symbols[position];

    setSymbolImage(symbol, board[position]);
    cell.classList.remove("phasing");
    cell.classList.add("locking");

    gsap.fromTo(
      symbol,
      {
        opacity: 0.65,
        scale: 1.07,
        filter: "brightness(1.5)",
      },
      {
        opacity: 1,
        scale: 1,
        filter: "brightness(1)",
        duration: LOCK_DURATION_SECONDS,
        ease: "power2.out",
        onComplete: () => {
          cell.classList.remove("locking");
          gsap.set(symbol, { clearProps: "all" });
        },
      },
    );
  });
}

export async function animateSpin(
  reels: HTMLElement,
  board: Board,
  onStart?: () => void,
): Promise<void> {
  const cells = Array.from(reels.children) as HTMLElement[];
  const symbols = reelSymbols(cells);

  cells.forEach((cell) => {
    cell.classList.remove("winning", "locking", "phasing");
  });

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    onStart?.();

    symbols.forEach((symbol, index) => {
      setSymbolImage(symbol, board[index]);
    });

    return;
  }

  await new Promise<void>((resolve) => {
    const timeline = gsap.timeline({ onComplete: resolve });

    timeline.call(() => {
      cells.forEach((cell) => cell.classList.add("phasing"));
      onStart?.();
    }, [], 0);

    for (let column = 0; column < COLUMN_COUNT; column += 1) {
      const positions = columnPositions(column);
      const stopTime = COLUMN_STOP_SECONDS[column];
      const phase = { elapsed: 0 };
      let previousTick = -1;

      timeline.to(
        phase,
        {
          elapsed: stopTime - ACTIVATION_SECONDS,
          duration: stopTime - ACTIVATION_SECONDS,
          ease: "none",
          onUpdate: () => {
            const tick = Math.floor(
              phase.elapsed / PHASE_INTERVAL_SECONDS,
            );

            if (tick === previousTick) {
              return;
            }

            previousTick = tick;

            positions.forEach((position) => {
              setSymbolImage(
                symbols[position],
                randomIndex(SYMBOL_COUNT),
              );
            });
          },
        },
        ACTIVATION_SECONDS,
      );

      timeline.call(
        () => lockColumn(positions, cells, symbols, board),
        [],
        stopTime,
      );
    }

    timeline.to(
      {},
      { duration: LOCK_DURATION_SECONDS },
      COLUMN_STOP_SECONDS[COLUMN_COUNT - 1],
    );
  });
}
