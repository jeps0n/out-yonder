import {
  BOARD_SIZE,
  SYMBOL_COUNT,
  TOTAL_TICKETS,
} from "../src/config/gameConfig.ts";
import assert from "node:assert/strict";
import test from "node:test";
import {
  OUTCOMES,
  THEORETICAL_RTP,
  buildBoardCatalog,
  decodeBoard,
  evaluateBoard,
  selectPayout,
} from "../src/math.ts";

const EXPECTED_COUNTS = new Map([
  [0, 189540],
  [1, 16029],
  [2, 17427],
  [3, 16536],
  [5, 16396],
  [8, 390],
  [10, 1405],
  [20, 21],
]);

test("locked probability totals and exact 97% RTP", () => {
  assert.equal(
    OUTCOMES.reduce((sum, outcome) => sum + outcome.tickets, 0),
    TOTAL_TICKETS,
  );
  assert.equal(THEORETICAL_RTP, 0.97);
});

test("all 10,000 probability tickets select correct payouts", () => {
  const counts = new Map<number, number>();

  for (let ticket = 0; ticket < TOTAL_TICKETS; ticket += 1) {
    const payout = selectPayout(ticket);
    counts.set(payout, (counts.get(payout) ?? 0) + 1);
  }

  for (const outcome of OUTCOMES) {
    assert.equal(counts.get(outcome.payout), outcome.tickets);
  }
});

test("exhaustive 262,144 board enumeration and correct payouts", () => {
  const catalog = buildBoardCatalog();
  const total = [...catalog.values()].reduce(
    (sum, boards) => sum + boards.length,
    0,
  );

  assert.equal(total, SYMBOL_COUNT ** BOARD_SIZE);

  for (const [payout, expectedCount] of EXPECTED_COUNTS) {
    const matchingBoards = catalog.get(payout) ?? [];
    assert.equal(matchingBoards.length, expectedCount);

    for (const encoded of matchingBoards) {
      assert.equal(evaluateBoard(decodeBoard(encoded)).payout, payout);
    }
  }
});
