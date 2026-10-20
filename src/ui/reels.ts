import {
  BOARD_SIZE,
  COLUMN_COUNT,
} from "../config/gameConfig.ts";
import {
  makeSymbolImage,
  SYMBOL_ART,
} from "./symbolAssets.ts";
import type {
  Board,
  Evaluation,
} from "../math/types.ts";

function boardCellLabel(index: number, symbol: number): string {
  const row = Math.floor(index / COLUMN_COUNT) + 1;
  const column = index % COLUMN_COUNT + 1;

  return `Row ${row}, column ${column}: ${SYMBOL_ART[symbol].name}`;
}

function getCells(reels: HTMLElement): HTMLElement[] {
  const cells = Array.from(reels.children) as HTMLElement[];

  if (cells.length !== BOARD_SIZE) {
    throw new Error(`Expected ${BOARD_SIZE} reel cells.`);
  }

  return cells;
}

export function renderBoard(
  reels: HTMLElement,
  board: Board,
): void {
  const cells = board.map((symbol, index) => {
    const cell = document.createElement("div");
    const projection = document.createElement("span");

    cell.className = "reel-cell";
    projection.className = "reel-symbol";
    projection.append(makeSymbolImage(symbol));

    cell.append(projection);
    cell.setAttribute(
      "aria-label",
      boardCellLabel(index, symbol),
    );

    return cell;
  });

  reels.replaceChildren(...cells);
}

export function updateBoardLabels(
  reels: HTMLElement,
  board: Board,
): void {
  getCells(reels).forEach((cell, index) => {
    cell.setAttribute(
      "aria-label",
      boardCellLabel(index, board[index]),
    );
  });
}

export function highlightWinningCells(
  reels: HTMLElement,
  evaluation: Evaluation,
): void {
  const winningPositions = new Set(
    evaluation.lines.flatMap((line) => [...line.positions]),
  );

  getCells(reels).forEach((cell, index) => {
    cell.classList.toggle("winning", winningPositions.has(index));
  });
}

export function renderWinningLines(
  summary: HTMLElement,
  evaluation: Evaluation,
): void {
  const lineCount = evaluation.lines.length;

  if (lineCount === 0) {
    summary.replaceChildren();
    return;
  }

  const lineLabel = lineCount === 1 ? "WINNING LINE" : "WINNING LINES";
  const indicator = document.createElement("span");

  indicator.className = "line-indicator";
  indicator.textContent =
    `${lineCount} ${lineLabel} · +${evaluation.payout}`;

  summary.replaceChildren(indicator);
}
