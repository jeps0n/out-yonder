export type Board = number[];

export type WinLine = {
  index: number;
  symbol: number;
  payout: number;
  positions: readonly number[];
};

export type Evaluation = {
  payout: number;
  lines: WinLine[];
};
