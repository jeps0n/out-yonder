import {
  BOARD_SIZE,
  PAYLINES,
  SYMBOL_COUNT,
  SYMBOL_PAYS,
} from "../config/gameConfig.ts";
import type {
  Evaluation,
  WinLine,
} from "./types.ts";

export function evaluateBoard(board: readonly number[]): Evaluation {
  const hasInvalidSymbols = board.some(
    (symbol) => !Number.isInteger(symbol) || symbol < 0 || symbol >= SYMBOL_COUNT,
  );

  if (board.length !== BOARD_SIZE || hasInvalidSymbols) {
    throw new Error("Board must contain exactly nine valid symbols.");
  }

  const lines: WinLine[] = [];

  PAYLINES.forEach((positions, index) => {
    const [first, middle, last] = positions;
    const symbol = board[first];

    if (symbol === board[middle] && symbol === board[last]) {
      lines.push({
        index,
        symbol,
        payout: SYMBOL_PAYS[symbol],
        positions,
      });
    }
  });

  return {
    payout: lines.reduce(
      (total, line) => total + line.payout,
      0,
    ),
    lines,
  };
}
