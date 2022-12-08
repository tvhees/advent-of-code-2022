export default function chunkArray<T>(arr: T[], size: number) {
  return arr.reduce((chunks, item, index) => {
    const chunkIndex = Math.floor(index / size);
    if (!chunks[chunkIndex]) {
      chunks.push([]);
    }

    chunks[chunkIndex].push(item);

    return chunks;
  }, [] as T[][]);
}
