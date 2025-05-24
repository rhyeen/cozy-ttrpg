export function sleep(ms: number): Promise<void> {
  console.error(`Sleeping for ${ms} ms`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}
