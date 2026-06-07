import { genovaTodayScraper } from "./genovatoday";
import { menteLocaleScraper } from "./mentelocale";
import { registerScraper } from "./registry";

registerScraper(menteLocaleScraper);
registerScraper(genovaTodayScraper);

export { getScrapers } from "./registry";
export type { RawEvent, Scraper, ScraperMeta } from "./types";
