const RANDOM_RANGE = 0x1_0000_0000;

export function randomIndex(upperExclusive: number): number {
  if (
    !Number.isSafeInteger(upperExclusive) ||
    upperExclusive < 1 ||
    upperExclusive > RANDOM_RANGE
  ) {
    throw new Error("Invalid random range.");
  }

  // Reject the unused tail of the 32-bit range to avoid modulo bias.
  const limit = Math.floor(RANDOM_RANGE / upperExclusive) * upperExclusive;
  const sample = new Uint32Array(1);

  do {
    crypto.getRandomValues(sample);
  } while (sample[0] >= limit);

  return sample[0] % upperExclusive;
}
