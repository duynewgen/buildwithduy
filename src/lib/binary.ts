export function toBinary(value: number) {
  const n = Math.trunc(Math.abs(value));
  return n.toString(2);
}

export function binaryOptions(min: number, max: number) {
  const options: { value: number; label: string }[] = [];
  for (let value = min; value <= max; value += 1) {
    options.push({ value, label: toBinary(value) });
  }
  return options;
}
