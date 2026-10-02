function mix(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/** Stable shuffle so the list looks random without changing between renders. */
export function randomOrderOptions(min: number, max: number) {
  const values: number[] = [];
  for (let value = min; value <= max; value += 1) values.push(value);

  const random = mix(0xc0ffee);
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    const current = values[index]!;
    values[index] = values[swap]!;
    values[swap] = current;
  }

  return values.map((value) => ({ value, label: String(value) }));
}
