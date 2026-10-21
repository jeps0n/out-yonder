import { gsap } from "gsap";
import type { Evaluation } from "../math/types.ts";

export type CelebrationTier = "standard" | "stronger" | "major";

const CELEBRATION_SECONDS: Record<CelebrationTier, number> = {
  standard: 1,
  stronger: 2,
  major: 4,
};

const SIDE_ART_SELECTORS: Readonly<Record<number, string>> = {
  0: ".distant-world img",
  2: ".explorer img",
  3: ".alien img",
};

export function celebrationTier(payout: number): CelebrationTier | null {
  if (payout <= 0) {
    return null;
  }

  if (payout === 20) {
    return "major";
  }

  return payout >= 5 ? "stronger" : "standard";
}

function animateArtwork(
  timeline: gsap.core.Timeline,
  image: HTMLImageElement,
  symbol: number,
  tier: CelebrationTier,
): void {
  const motionDuration = Math.min(
    CELEBRATION_SECONDS[tier] * 0.75,
    tier === "major" ? 2.1 : 1.25,
  );

  if (symbol === 3) {
    const pulses = tier === "standard" ? 1 : 2;
    const pulseDuration = motionDuration / pulses;

    for (let pulse = 0; pulse < pulses; pulse += 1) {
      timeline.to(image, {
        scale: tier === "major" ? 1.08 : 1.06,
        rotation: tier === "major" ? (pulse === 0 ? 3 : -3) : 0,
        duration: pulseDuration / 2,
        ease: "sine.out",
      }, pulse * pulseDuration);

      timeline.to(image, {
        scale: 1,
        rotation: 0,
        duration: pulseDuration / 2,
        ease: "sine.inOut",
      }, pulse * pulseDuration + pulseDuration / 2);
    }

    return;
  }

  if (symbol === 0) {
    if (tier === "standard") {
      timeline.to(image, {
        rotation: 4,
        duration: motionDuration / 3,
        ease: "sine.inOut",
      }, 0);
      timeline.to(image, {
        rotation: -4,
        duration: motionDuration / 3,
        ease: "sine.inOut",
      });
      timeline.to(image, {
        rotation: 0,
        duration: motionDuration / 3,
        ease: "sine.inOut",
      });
    } else {
      timeline.to(image, {
        rotation: 360,
        scale: tier === "major" ? 1.06 : 1,
        duration: motionDuration * 0.75,
        ease: "sine.inOut",
      }, 0);
      timeline.to(image, {
        rotation: 360,
        scale: 1,
        duration: motionDuration * 0.25,
        ease: "sine.out",
      });
    }

    return;
  }

  const liftByTier: Record<CelebrationTier, number> = {
    standard: -8,
    stronger: -10,
    major: -12,
  };

  const lift = liftByTier[tier];

  timeline.to(image, {
    y: lift,
    rotation: tier === "stronger" ? -4 : 0,
    scale: tier === "major" ? 1.05 : 1,
    duration: motionDuration * 0.45,
    ease: "sine.out",
  }, 0);

  timeline.to(image, {
    y: 0,
    rotation: 0,
    scale: 1,
    duration: motionDuration * 0.55,
    ease: tier === "major" ? "back.out(1.4)" : "sine.inOut",
  });
}

export function playCelebration(
  evaluation: Evaluation,
  host: ParentNode = document,
): Promise<void> {
  const tier = celebrationTier(evaluation.payout);

  if (!tier) {
    return Promise.resolve();
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return Promise.resolve();
  }

  const winningSymbols = new Set(
    evaluation.lines.map((line) => line.symbol),
  );

  return new Promise<void>((resolve) => {
    const animatedImages: HTMLImageElement[] = [];
    const timeline = gsap.timeline({
      onComplete: () => {
        for (const image of animatedImages) {
          gsap.set(image, { clearProps: "transform,transformOrigin" });
        }

        resolve();
      },
    });

    for (const symbol of winningSymbols) {
      const selector = SIDE_ART_SELECTORS[symbol];

      if (!selector) {
        continue;
      }

      const image = host.querySelector<HTMLImageElement>(selector);

      if (!image) {
        continue;
      }

      animatedImages.push(image);
      gsap.set(image, { transformOrigin: "50% 50%" });
      animateArtwork(timeline, image, symbol, tier);
    }

    timeline.to(
      {},
      { duration: CELEBRATION_SECONDS[tier] },
      0,
    );
  });
}
