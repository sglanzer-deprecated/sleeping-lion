export default function (array) {
  for (let index = array.length - 1; index > 0; index--) {
    let exchangeIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[exchangeIndex]] = [array[exchangeIndex], array[index]]
  }
  return array
}
