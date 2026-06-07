export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function dedupKey(name: string, date: Date): string {
  return `${normalize(name)}::${date.toISOString().split("T")[0]}`;
}
