import type { Scraper } from "./types";

const scrapers: Scraper[] = [];

export function registerScraper(scraper: Scraper): void {
  scrapers.push(scraper);
}

export function getScrapers(): Scraper[] {
  return scrapers;
}
