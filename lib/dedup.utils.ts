export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\b\d{4}\b/g, "") // remove years (2026, 2025...)
    .replace(/\s+/g, " ")
    .trim();
}

export function dedupKey(name: string, date: Date): string {
  const normalized = normalize(name).slice(0, 30);
  return `${normalized}::${date.toISOString().split("T")[0]}`;
}
