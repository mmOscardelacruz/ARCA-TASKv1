

async function concurrentMap(items: any[], fn: Function, concurrency: number) {
  let index = 0;
  const results = new Array(items.length);
  const executing = new Array(concurrency).fill(Promise.resolve());

  for await (let result of executing) {
    if (index >= items.length) {
      return results;
    }

    const currentIndex = index++;
    const item = items[currentIndex];

    results[currentIndex] = result;
    executing.push(fn(item).finally(() => executing.shift()));
  }
}