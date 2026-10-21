import { SLOT_PROMPTS } from "../config/slotPrompts.ts";
import {
  MOON_ART,
  SYMBOL_ART,
} from "./symbolAssets.ts";

import {
  COLUMN_COUNT,
  OUTCOMES,
  PAYLINES,
  ROW_COUNT,
  STARTING_BALANCE,
  SYMBOL_PAYS,
  THEORETICAL_RTP,
  TOTAL_TICKETS,
  WAGER,
} from "../config/gameConfig.ts";

function countLabel(count: number): string {
  const names: Record<number, string> = {
    3: "THREE",
    4: "FOUR",
    5: "FIVE",
  };

  return names[count] ?? String(count);
}

function paytableRows(): string {
  return SYMBOL_ART.map((symbol, index) => `
    <tr>
      <td>
        <span class="paytable-symbol">
          <img src="${symbol.url}" alt="" draggable="false" />
          ${symbol.name}
        </span>
      </td>
      <td>${SYMBOL_PAYS[index]}×</td>
    </tr>
  `).join("");
}

function outcomeRows(): string {
  return OUTCOMES.map((outcome) => `
    <tr>
      <td>${outcome.payout}× — ${outcome.category}</td>
      <td>${(outcome.tickets / TOTAL_TICKETS * 100).toFixed(1)}%</td>
    </tr>
  `).join("");
}

export function renderGameTemplate(host: HTMLElement): void {
  host.innerHTML = `
    <main class="world">
      <div id="starfield" aria-hidden="true"></div>
      <section class="scene scene-left" aria-label="Explorer landscape">
        <div class="scene-caption">SOMEWHERE BEYOND THE KNOWN… AND THE UNKNOWN!</div>
        <div class="distant-world" aria-hidden="true"><img src="${SYMBOL_ART[0].url}" alt="" draggable="false" /></div>
        <div class="landscape landscape-left" aria-hidden="true"></div>
        <div class="explorer" aria-hidden="true"><img src="${SYMBOL_ART[2].url}" alt="" draggable="false" /></div>
        <div class="scene-note">A UNIVERSE OF UNTOLD WONDERS.</div>
      </section>

      <section class="machine" aria-label="Out Yonder slot game">
        <header class="machine-header">
          <p class="eyebrow">A SMALL SPIN BEYOND THE STARS</p>
          <h1>OUT <span>YONDER</span></h1>
          <p class="tagline">There's always something worth finding out there.</p>
        </header>

        <div class="machine-content">
          <div class="reel-heading">
            <span>✦ &nbsp; ${countLabel(SYMBOL_ART.length)} SYMBOLS</span>
            <span>${countLabel(PAYLINES.length)} PAYLINES &nbsp; ✦</span>
          </div>
          <div class="reel-housing">
            <div id="reels" class="reels" aria-label="${ROW_COUNT} by ${COLUMN_COUNT} slot reels"></div>
          </div>
          <div id="line-summary" class="line-summary" aria-live="polite"></div>
          <div id="status" class="status" role="status" aria-live="polite">${SLOT_PROMPTS.ready[0]}</div>
          <div class="meter-row">
            <div class="meter">
              <span>BALANCE</span>
              <strong id="balance">${STARTING_BALANCE}</strong>
            </div>
            <div class="meter">
              <span>BET</span>
              <strong id="bet">${WAGER}</strong>
            </div>
            <div class="meter">
              <span>WIN</span>
              <strong id="win">0</strong>
            </div>
          </div>
          <button id="spin" class="spin-button" type="button">SPIN <span>✦</span></button>
          <div class="secondary-actions">
            <button id="info" type="button">PAYTABLE / INFO</button>
            <button id="reset" type="button">RESET BALANCE</button>
          </div>
        </div>
        <footer class="technical-signature" aria-label="Technical demonstration credits">
          <span class="signature-content">
            <span class="signature-label">TECHNICAL DEMONSTRATION BY</span>
            <span class="signature-author">jeff samson</span>
            <span class="signature-divider" aria-hidden="true">|</span>
            <span class="signature-stack">TypeScript · Vite · PixiJS · GSAP</span>
          </span>
        </footer>
      </section>

      <section class="scene scene-right" aria-label="Neighbor landscape">
        <div class="scene-caption">THE STRANGEST ENCOUNTERS AWAIT.</div>
        <div class="planet-small" aria-hidden="true"><img src="${MOON_ART}" alt="" draggable="false" /></div>
        <div class="landscape landscape-right" aria-hidden="true"></div>
        <div class="alien" aria-hidden="true"><img src="${SYMBOL_ART[3].url}" alt="" draggable="false" /></div>
        <div class="scene-note">WHO KNOWS WHAT FORTUNE LIES BEYOND?</div>
      </section>
    </main>

    <dialog id="paytable-dialog">
      <div class="dialog-top">
        <h2>THE FIELD GUIDE</h2>
        <button id="close-info" aria-label="Close info" type="button">✕</button>
      </div>
      <p>Match three identical symbols across any of the ${PAYLINES.length} active paylines. Every winning line pays; line wins are added together.</p>
      <table class="paytable">
        <thead>
          <tr>
            <th>SYMBOL</th>
            <th>THREE MATCHING</th>
          </tr>
        </thead>
        <tbody>
          ${paytableRows()}
        </tbody>
      </table>
      <h3>OUTCOME PROBABILITIES</h3>
      <table class="paytable">
        <thead>
          <tr>
            <th>PAYOUT</th>
            <th>CHANCE</th>
          </tr>
        </thead>
        <tbody>${outcomeRows()}</tbody>
      </table>
      <div class="guide-details">
        <p><strong>THEORETICAL RTP:</strong> ${(THEORETICAL_RTP * 100).toFixed(0)}%</p>
        <p><strong>WAGER:</strong> Fixed at ${WAGER} credit per spin</p>
        <p><strong>DEMO:</strong> Fictional credits only. No real-money gambling.</p>
      </div>
    </dialog>
  `;
}
