import {
  BOARD_SIZE,
  OUTCOMES,
  SYMBOL_COUNT,
} from "../config/gameConfig.ts";
import { evaluateBoard } from "./evaluateBoard.ts";
import type { Board } from "./types.ts";

const BOARD_COUNT = SYMBOL_COUNT ** BOARD_SIZE;

export type BoardCatalog = Map<number, number[]>;

export function decodeBoard(encoded: number): Board {
  if (!Number.isInteger(encoded) || encoded < 0 || encoded >= BOARD_COUNT) {
    throw new Error("Invalid board encoding.");
  }

  const board: Board = [];
  let remaining = encoded;

  for (let index = 0; index < BOARD_SIZE; index += 1) {
    board.push(remaining % SYMBOL_COUNT);
    remaining = Math.floor(remaining / SYMBOL_COUNT);
  }

  return board;
}

export function buildBoardCatalog(): BoardCatalog {
  const catalog: BoardCatalog = new Map();

  for (let encoded = 0; encoded < BOARD_COUNT; encoded += 1) {
    const payout = evaluateBoard(decodeBoard(encoded)).payout;
    const matchingBoards = catalog.get(payout);

    if (matchingBoards) {
      matchingBoards.push(encoded);
    } else {
      catalog.set(payout, [encoded]);
    }
  }

  for (const outcome of OUTCOMES) {
    if (!catalog.get(outcome.payout)?.length) {
      throw new Error(`No valid boards for payout ${outcome.payout}×.`);
    }
  }

  return catalog;
}
