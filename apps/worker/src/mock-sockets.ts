export function connect(options: any) {
  return {
    opened: Promise.resolve(),
    close: () => Promise.resolve(),
  };
}
