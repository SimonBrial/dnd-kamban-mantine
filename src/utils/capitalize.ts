function capitalize(text: string): string {
  const firstLetter = text.charAt(0);
  const rest = text.slice(1);
  return firstLetter.toUpperCase() + rest;
}

export default capitalize;
