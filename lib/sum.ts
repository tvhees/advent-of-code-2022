export default function (array: number[]) {
  return array.reduce((sum, n) => sum + n, 0);
}
