import {
  OUTCOMES,
  TOTAL_TICKETS,
} from "../config/gameConfig.ts";
import { decodeBoard, type BoardCatalog } from "./boardCatalog.ts";
import { evaluateBoard } from "./evaluateBoard.ts";
import { randomIndex } from "./random.ts";
import type { Board } from "./types.ts";

export function selectPayout(randomTicket: number): number {
  if (
    !Number.isInteger(randomTicket) ||
    randomTicket < 0 ||
    randomTicket >= TOTAL_TICKETS
  ) {
    throw new Error(`Ticket must be an integer from 0 to ${TOTAL_TICKETS - 1}.`);
  }

  let boundary = 0;

  for (const outcome of OUTCOMES) {
    boundary += outcome.tickets;

    if (randomTicket < boundary) {
      return outcome.payout;
    }
  }

  throw new Error("Outcome table does not cover all tickets.");
}

export function selectBoard(catalog: BoardCatalog, payout: number): Board {
  const matchingBoards = catalog.get(payout);

  if (!matchingBoards?.length) {
    throw new Error(`No board matches ${payout}×.`);
  }

  const encoded = matchingBoards[randomIndex(matchingBoards.length)];
  const board = decodeBoard(encoded);

  if (evaluateBoard(board).payout !== payout) {
    throw new Error("Selected board payout mismatch.");
  }

  return board;
}
