# Out Yonder

**A lighthearted space-themed slot game with four cosmic symbols, five paylines, and clearly defined payout probabilities—all wrapped in a playful sense of discovery.**

[**▶ PLAY DEMO**](https://jeps0n.github.io/out-yonder/) · [**View Source**](https://github.com/jeps0n/out-yonder)

*Take a spin and see what's out yonder...*

## Your Game Guide

| At a glance | Details |
| --- | --- |
| Board | 3 × 3 grid |
| Wager | 1 credit per spin |
| Paylines | 5: three horizontal and two diagonal |
| Starting balance | 100 credits |
| Symbols | 4 |
| Theoretical return to player (RTP) | 97% |

### Meet the Symbols

Match three of the same symbol across a payline to earn its listed payout. Each winning line contributes to the total for that spin.

| Symbol | Name | Payout per matching line |
| --- | --- | ---: |
| 🪐 | Planet | 1× |
| 🚀 | Rocket | 2× |
| 👨‍🚀 | Explorer | 3× |
| 👽 | Neighbor | 5× |

The five paylines run across the top, middle, and bottom rows, plus the two diagonals. More than one line can win on the same board; their payouts add together.

### What a Spin Can Bring

A spin costs 1 credit. **No Win (0×)** returns nothing; **Push (1×)** returns your wager; **Win (2×–20×)** awards the listed payout in credits.

| Result | Payout | Chance |
| --- | ---: | ---: |
| No Win | 0× | 47% |
| Push | 1× | 27% |
| Nice Win | 2× | 19% |
| Big Win | 3× | 4% |
| Great Win | 5× | 2% |
| Cosmic Win | 8× | 0.5% |
| Stellar Win | 10× | 0.4% |
| Galactic Win | 20× | 0.1% |

These are all possible total payouts, including boards with multiple winning lines.

## Behind the Spins: How the Math Works

Out Yonder uses **outcome-first math**, rather than relying on weighted reels and predefined reel sequences to determine the result.

1. **Choose the payout.** One of 10,000 equally likely tickets selects an outcome from the probability table above.
2. **Find a matching board.** The game chooses from a catalog of 3 × 3 boards whose evaluated paylines add up to exactly that payout.
3. **Reveal the board.** The reel animation reveals the selected board. It doesn't change the payout.

This separates **how often an outcome happens** from **which valid symbol arrangement displays it**. This makes the payout distribution explicit while keeping the visible paylines honest: every displayed board evaluates to the amount awarded.

The probabilities add up to **100%**. The theoretical RTP is **97%**, meaning the configured payouts average 0.97 credits returned per 1 credit wagered over the long run. That is a mathematical average, not a promise about any particular session.

## Under the Hood

Built with **TypeScript**, **Vite**, **PixiJS**, and **GSAP**.

| Location | Purpose |
| --- | --- |
| `src/config/` | Game settings, outcome probabilities, and player-facing messages |
| `src/math/` | Board catalog, payline evaluation, and outcome selection |
| `src/game/` | Spin flow, balance, and input handling |
| `src/rendering/` | Reel animation and starfield |
| `src/ui/` | Game interface and symbol presentation |
| `public/symbols/` | Artwork served directly by Vite |
| `public/favicon.*` | Game favicon assets |
| `src/style.css` | Layout and visual styling |
| `tests/` | Checks for probability and board math |

## Launch Commands

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

---

*Keep wandering. The stars are calling.*
