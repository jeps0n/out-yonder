import { requireElement } from "./elements.ts";

const BALANCE_FEEDBACK_CLASS = "meter-balance-change";
const BET_FEEDBACK_CLASS = "meter-bet-press";
const WIN_HIGHLIGHT_CLASS = "meter-win-highlight";
const PUSH_HIGHLIGHT_CLASS = "meter-push-highlight";

export function createMeterFeedback() {
  const balanceMeter = requireElement<HTMLElement>("#balance").closest<HTMLElement>(".meter");
  const betMeter = requireElement<HTMLElement>("#bet").closest<HTMLElement>(".meter");
  const winMeter = requireElement<HTMLElement>("#win").closest<HTMLElement>(".meter");

  if (!balanceMeter || !betMeter || !winMeter) {
    throw new Error("Missing meter container.");
  }

  function replayAnimation(meter: HTMLElement, className: string): void {
    meter.classList.remove(className);
    void meter.offsetWidth;
    meter.classList.add(className);
  }

  function clearAnimationOnEnd(
    meter: HTMLElement,
    className: string,
  ): void {
    meter.addEventListener("animationend", (event) => {
      if (
        event.target === meter ||
        event.target === meter.querySelector("strong")
      ) {
        meter.classList.remove(className);
      }
    });
  }

  clearAnimationOnEnd(balanceMeter, BALANCE_FEEDBACK_CLASS);
  clearAnimationOnEnd(betMeter, BET_FEEDBACK_CLASS);

  return {
    balanceChanged(): void {
      replayAnimation(balanceMeter, BALANCE_FEEDBACK_CLASS);
    },

    betPressed(): void {
      replayAnimation(betMeter, BET_FEEDBACK_CLASS);
    },

    showWin(result: "push" | "win"): void {
      winMeter.classList.toggle(
        PUSH_HIGHLIGHT_CLASS,
        result === "push",
      );
      winMeter.classList.toggle(
        WIN_HIGHLIGHT_CLASS,
        result === "win",
      );
    },

    clearWin(): void {
      winMeter.classList.remove(
        PUSH_HIGHLIGHT_CLASS,
        WIN_HIGHLIGHT_CLASS,
      );
    },
  };
}
