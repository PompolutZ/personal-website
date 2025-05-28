// Even the simplest implementation of signals and effects in Solid
// is way more complex than this, but I do not understand why yet.
type Effect = () => void;
const context: Effect[] = [];

export function createSignal<T>(value: T) {
  const subscriptions = new Set<Effect>();
  let currentValue = value;

  const read = () => {
    console.log("Context:", context);
    const lastObserver = context[context.length - 1]; // not sure why this should work..
    if (lastObserver) {
      subscriptions.add(lastObserver);
    }

    return currentValue;
  };

  const write = (newValue: T) => {
    currentValue = newValue;
    subscriptions.forEach((effect) => effect());
  };

  return [read, write] as const;
}

export function createEffect(fn: Effect) {
  console.log("Creating effect", fn);
  const execute = () => {
    context.push(execute);
    fn();
    context.pop();
  };

  execute(); // Run the effect immediately
}
