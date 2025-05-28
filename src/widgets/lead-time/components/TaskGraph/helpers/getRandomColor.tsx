export function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  const countChar = 6;
  const countVariant = 16;
  for (let i = 0; i < countChar; i++) {
    color += letters[Math.floor(Math.random() * countVariant)];
  }
  return color;
}
