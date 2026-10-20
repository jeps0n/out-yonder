import {
  BOARD_SIZE,
  STARTING_BALANCE,
  SYMBOL_COUNT,
  TOTAL_TICKETS,
  WAGER,
} from "../config/gameConfig.ts";
import {
  payoutPromptCategory,
  randomSlotPrompt,
} from "../config/slotPrompts.ts";
import { buildBoardCatalog } from "../math/boardCatalog.ts";
import { evaluateBoard } from "../math/evaluateBoard.ts";
import { randomIndex } from "../math/random.ts";
import {
  selectBoard,
  selectPayout,
} from "../math/selectOutcome.ts";
import type { Board } from "../math/types.ts";
import { animateSpin } from "../rendering/spinAnimation.ts";
import { requireElement } from "../ui/elements.ts";
import { createMeterFeedback } from "../ui/meterFeedback.ts";
import { setMeterNumber } from "../ui/meterNumber.ts";
import {
  highlightWinningCells,
  renderBoard,
  renderWinningLines,
  updateBoardLabels,
} from "../ui/reels.ts";

export function initializeGame(): void {
  const reels = requireElement<HTMLDivElement>("#reels");
  const balanceLabel = requireElement<HTMLElement>("#balance");
  const winLabel = requireElement<HTMLElement>("#win");
  const statusLabel = requireElement<HTMLElement>("#status");
  const lineSummary = requireElement<HTMLDivElement>("#line-summary");
  const spinButton = requireElement<HTMLButtonElement>("#spin");
  const resetButton = requireElement<HTMLButtonElement>("#reset");
  const infoButton = requireElement<HTMLButtonElement>("#info");
  const closeInfoButton = requireElement<HTMLButtonElement>("#close-info");
  const infoDialog = requireElement<HTMLDialogElement>("#paytable-dialog");
  const catalog = buildBoardCatalog();
  const meterFeedback = createMeterFeedback();

  let balance = STARTING_BALANCE;
  let spinning = false;
  const initialBoard: Board = Array.from(
    { length: BOARD_SIZE },
    () => randomIndex(SYMBOL_COUNT),
  );

  function updateBalance(animate = true): void {
    setMeterNumber(balanceLabel, balance, animate);
    spinButton.disabled = spinning || balance < WAGER;
  }

  function setWinValue(payout: number, animate = true): void {
    setMeterNumber(winLabel, payout, animate);
  }

  function revealOutcome(
    payout: number,
    board: Board,
    evaluation: ReturnType<typeof evaluateBoard>,
  ): void {
    updateBoardLabels(reels, board);
    highlightWinningCells(reels, evaluation);
    renderWinningLines(lineSummary, evaluation);

    balance += payout;
    updateBalance();
    setWinValue(payout);

    if (payout > 0) {
      meterFeedback.showWin(payout === WAGER ? "push" : "win");
      meterFeedback.balanceChanged();
    }

    statusLabel.textContent = randomSlotPrompt(
      payoutPromptCategory(payout),
      { payout },
    );
  }

  async function spin(): Promise<void> {
    if (spinning || balance < WAGER) {
      return;
    }

    spinning = true;
    meterFeedback.clearWin();
    balance -= WAGER;
    meterFeedback.betPressed();
    lineSummary.replaceChildren();
    statusLabel.textContent = randomSlotPrompt("spinning");
    updateBalance();

    try {
      const payout = selectPayout(randomIndex(TOTAL_TICKETS));
      const board = selectBoard(catalog, payout);
      const evaluation = evaluateBoard(board);

      if (evaluation.payout !== payout) {
        throw new Error("Displayed board does not match selected payout.");
      }

      await animateSpin(reels, board, () => {
        setWinValue(0);
      });

      revealOutcome(payout, board, evaluation);
    } catch {
      balance += WAGER;
      updateBalance();
      statusLabel.textContent = randomSlotPrompt("error");
    } finally {
      spinning = false;
      updateBalance();
    }
  }

  spinButton.addEventListener("click", () => {
    void spin();
  });

  resetButton.addEventListener("click", () => {
    if (spinning) {
      return;
    }

    balance = STARTING_BALANCE;
    meterFeedback.clearWin();
    setWinValue(0);
    statusLabel.textContent = randomSlotPrompt("reset");
    updateBalance();
  });

  infoButton.addEventListener("click", () => {
    infoDialog.showModal();
  });

  closeInfoButton.addEventListener("click", () => {
    infoDialog.close();
  });

  infoDialog.addEventListener("click", (event) => {
    if (event.target === infoDialog) {
      infoDialog.close();
    }
  });

  renderBoard(reels, initialBoard);
  statusLabel.textContent = randomSlotPrompt("ready");
  updateBalance(false);
}
