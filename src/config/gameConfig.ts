export const SYMBOLS = [
  "🪐",
  "🚀",
  "👨‍🚀",
  "👽",
] as const;

export const SYMBOL_PAYS = [
  1,
  2,
  3,
  5,
] as const;

export const PAYLINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export const OUTCOMES = [
  { payout: 0, tickets: 4700, category: "NO WIN" },
  { payout: 1, tickets: 2700, category: "PUSH" },
  { payout: 2, tickets: 1900, category: "NICE WIN" },
  { payout: 3, tickets: 400, category: "BIG WIN" },
  { payout: 5, tickets: 200, category: "GREAT WIN" },
  { payout: 8, tickets: 50, category: "COSMIC WIN" },
  { payout: 10, tickets: 40, category: "STELLAR WIN" },
  { payout: 20, tickets: 10, category: "GALACTIC WIN" },
] as const;

export const COLUMN_COUNT = 3;
export const ROW_COUNT = 3;
export const BOARD_SIZE = COLUMN_COUNT * ROW_COUNT;
export const SYMBOL_COUNT = SYMBOLS.length;
export const TOTAL_TICKETS = 10_000;
export const STARTING_BALANCE = 100;
export const WAGER = 1;

export const THEORETICAL_RTP = OUTCOMES.reduce(
  (total, outcome) => total + outcome.payout * outcome.tickets,
  0,
) / TOTAL_TICKETS;
