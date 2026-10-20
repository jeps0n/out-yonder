import { gsap } from "gsap";

const FADE_OUT_SECONDS = 0.15;
const FADE_IN_SECONDS = 0.2;

const activeTransitions = new WeakMap<HTMLElement, gsap.core.Timeline>();

function prefersReducedMotion(): boolean {
  return window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
}

export function setMeterNumber(
  element: HTMLElement,
  value: number,
  animate = true,
): void {
  const nextValue = String(value);
  const previousTransition = activeTransitions.get(element);

  previousTransition?.kill();
  activeTransitions.delete(element);

  if (element.textContent === nextValue) {
    gsap.set(element, { clearProps: "opacity" });
    return;
  }

  if (!animate || prefersReducedMotion()) {
    element.textContent = nextValue;
    gsap.set(element, { clearProps: "opacity" });
    return;
  }

  const transition = gsap.timeline({
    onComplete: () => {
      activeTransitions.delete(element);
      gsap.set(element, { clearProps: "opacity" });
    },
  });

  activeTransitions.set(element, transition);

  transition
    .to(element, {
      opacity: 0.3,
      duration: FADE_OUT_SECONDS,
      ease: "sine.inOut",
    })
    .call(() => {
      element.textContent = nextValue;
    })
    .to(element, {
      opacity: 1,
      duration: FADE_IN_SECONDS,
      ease: "sine.inOut",
    });
}
