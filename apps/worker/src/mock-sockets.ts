export function connect(_options: any) {
  return {
    opened: Promise.resolve(),
    close: () => Promise.resolve(),
  };
}
