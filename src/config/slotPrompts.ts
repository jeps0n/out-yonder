/** Player-facing status messages, grouped by game event. */
export const SLOT_PROMPTS = {
  ready: [
    "LET'S WANDER",
    "THE STARS ARE CALLING",
    "ADVENTURE AWAITS",
  ],

  spinning: [
    "TRAVELING TO THE STARS...",
    "EXPLORING THE UNKNOWN...",
    "SOMEWHERE OUT YONDER...",
  ],

  noWin: [
    "NO WIN — KEEP WANDERING",
    "NO WIN — NOTHING BUT STARDUST",
    "NO WIN — VANISHED INTO THE VOID",
    "NO WIN — NOTHING ON THE RADAR",
    "NO WIN — A QUIET CORNER OF THE COSMOS",
    "NO WIN — MAYBE NEXT LAUNCH",
  ],

  push: [
    "PUSH — CREDIT RETURNED",
    "PUSH — SAME CREDIT, NEW HORIZONS",
    "PUSH — A ROUND TRIP THROUGH THE STARS",
    "PUSH — RIGHT BACK WHERE WE STARTED",
    "PUSH — NOTHING GAINED, NOTHING LOST",
    "PUSH — JUST ANOTHER ORBIT",
  ],

  niceWin: [
    "NICE WIN — A LITTLE LUCK GOES A LONG WAY! +{payout} CREDITS",
    "NICE WIN — A WELCOME DISCOVERY! +{payout} CREDITS",
    "NICE WIN — THE STARS LEFT A TIP! +{payout} CREDITS",
    "NICE WIN — A BIT EXTRA FOR ANOTHER LAUNCH! +{payout} CREDITS",
    "NICE WIN — LOOK WHAT TURNED UP OUT YONDER! +{payout} CREDITS",
    "NICE WIN — THAT'S WORTH KEEPING! +{payout} CREDITS",
  ],

  bigWin: [
    "BIG WIN — A SURPRISE FROM THE UNKNOWN! +{payout} CREDITS",
    "BIG WIN — A WORTHWHILE DETOUR! +{payout} CREDITS",
    "BIG WIN — THINGS ARE TAKING OFF! +{payout} CREDITS",
    "BIG WIN — NOW WE'RE GETTING SOMEWHERE! +{payout} CREDITS",
  ],

  greatWin: [
    "GREAT WIN — THE JOURNEY PAID OFF! +{payout} CREDITS",
    "GREAT WIN — FORTUNE AMONG THE STARS! +{payout} CREDITS",
    "GREAT WIN — A REMARKABLE ENCOUNTER! +{payout} CREDITS",
    "GREAT WIN — THIS CALLS FOR A CELEBRATION! +{payout} CREDITS",
  ],

  cosmicWin: [
    "COSMIC WIN — OUT OF THIS WORLD! +{payout} CREDITS",
    "COSMIC WIN — THE UNIVERSE DELIVERS! +{payout} CREDITS",
    "COSMIC WIN — A WONDER BEYOND THE STARS! +{payout} CREDITS",
  ],

  stellarWin: [
    "STELLAR WIN — A SPECTACULAR SIGHT! +{payout} CREDITS",
    "STELLAR WIN — A BRILLIANT BURST OF LIGHT! +{payout} CREDITS",
    "STELLAR WIN — THE STARS PUT ON A SHOW! +{payout} CREDITS",
  ],

  galacticWin: [
    "GALACTIC WIN — THE FIND OF A LIFETIME! +{payout} CREDITS",
    "GALACTIC WIN — A GALAXY OF RICHES! +{payout} CREDITS",
    "GALACTIC WIN — A SUPERNOVA OF FORTUNE! +{payout} CREDITS",
  ],

  reset: [
    "RESET — READY TO WANDER",
    "RESET — ANOTHER JOURNEY AWAITS",
    "RESET — A CLEAN SLATE",
  ],

  error: [
    "SPIN UNAVAILABLE — PLEASE TRY AGAIN",
  ],
} as const;

export type SlotPromptCategory = keyof typeof SLOT_PROMPTS;

export function randomSlotPrompt(
  category: SlotPromptCategory,
  values: { payout?: number } = {},
): string {
  const messages: readonly string[] = SLOT_PROMPTS[category];
  const message = messages[Math.floor(Math.random() * messages.length)];

  return message.replaceAll("{payout}", String(values.payout ?? 0));
}

export function payoutPromptCategory(payout: number): SlotPromptCategory {
  switch (payout) {
    case 0:
      return "noWin";
    case 1:
      return "push";
    case 2:
      return "niceWin";
    case 3:
      return "bigWin";
    case 5:
      return "greatWin";
    case 8:
      return "cosmicWin";
    case 10:
      return "stellarWin";
    case 20:
      return "galacticWin";
    default:
      throw new Error(`Unknown payout: ${payout}`);
  }
}
