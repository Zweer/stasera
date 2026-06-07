/** Raw event data extracted from a source (before LLM enrichment) */
export interface RawEvent {
  title: string;
  date: string;
  location?: string;
  url: string;
  imageUrl?: string;
  tags?: string[];
  price?: string;
  description?: string;
  rawText?: string;
  source: string;
}

/** Configuration for a scraper */
export interface ScraperMeta {
  id: string;
  name: string;
  baseUrl: string;
}

/** The contract every scraper must implement */
export interface Scraper {
  meta: ScraperMeta;
  scrape(): Promise<RawEvent[]>;
}
