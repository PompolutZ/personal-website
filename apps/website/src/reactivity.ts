// Even the simplest implementation of signals and effects in Solid
// is way more complex than this, but I do not understand why yet.

// Heavily stolen from: https://gist.github.com/1Marc/09e739caa6a82cc176ab4c2abd691814
type Effect = () => void;
const context: Effect[] = [];

export function createSignal<T>(value: T) {
  const subscriptions = new Set<Effect>();
  let currentValue = value;

  const read = () => {
    const lastObserver = context[context.length - 1]; // not sure why this should work..
    if (lastObserver) {
      subscriptions.add(lastObserver);
    }

    return currentValue;
  };

  const write = (newValue: T | ((value: T) => T)) => {
    if (typeof newValue === "function") {
      currentValue = (newValue as (value: T) => T)(currentValue);
    } else {
      currentValue = newValue;
    }
    subscriptions.forEach((effect) => effect());
  };

  return [read, write] as const;
}

export function createEffect(fn: Effect) {
  const execute = () => {
    context.push(execute);
    fn();
    context.pop();
  };

  execute(); // Run the effect immediately
}
