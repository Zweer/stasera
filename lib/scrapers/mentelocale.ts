import * as cheerio from "cheerio";
import type { RawEvent, Scraper, ScraperMeta } from "./types";

const BASE_URL = "https://www.mentelocale.it";

export const menteLocaleScraper: Scraper = {
  meta: {
    id: "mentelocale",
    name: "MenteLocale Genova",
    baseUrl: BASE_URL,
  } satisfies ScraperMeta,

  async scrape(): Promise<RawEvent[]> {
    const listings = await fetchListings();
    const events = await Promise.all(listings.map((item) => fetchDetail(item)));
    return events;
  },
};

interface ListingItem {
  title: string;
  date: string;
  url: string;
  imageUrl?: string;
  tags: string[];
}

async function fetchListings(): Promise<ListingItem[]> {
  const items: ListingItem[] = [];
  // Fetch first 3 pages (covers ~45 events, enough for 7-day horizon)
  for (let page = 1; page <= 3; page++) {
    const url =
      page === 1
        ? `${BASE_URL}/genova/eventi/`
        : `${BASE_URL}/genova/eventi/${page}/`;
    const html = await fetch(url).then((r) => r.text());
    const $ = cheerio.load(html);

    $("div.Evento").each((_, el) => {
      const anchor = $(el).find("> a");
      const href = anchor.attr("href");
      if (!href) return;

      const title = anchor.find("span.Titolo").text().trim();
      const date = anchor.find("span.Date").text().trim();
      const imageUrl =
        anchor.find("img").attr("data-src") ||
        anchor.find("img").attr("src") ||
        undefined;

      const tags: string[] = [];
      $(el)
        .next("ul.Tags")
        .find("li a:not(.Provincia)")
        .each((_, tag) => {
          tags.push($(tag).text().trim());
        });

      items.push({
        title,
        date,
        url: href.startsWith("http") ? href : `${BASE_URL}${href}`,
        imageUrl: imageUrl?.startsWith("http")
          ? imageUrl
          : imageUrl
            ? `${BASE_URL}${imageUrl}`
            : undefined,
        tags,
      });
    });
  }
  return items;
}

async function fetchDetail(item: ListingItem): Promise<RawEvent> {
  const html = await fetch(item.url).then((r) => r.text());
  const $ = cheerio.load(html);

  const location = $("span.LuogoNome").first().text().trim() || undefined;
  const description =
    $("div.Testo")
      .find("p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean)
      .join("\n") || undefined;

  return {
    title: item.title,
    date: item.date,
    location,
    url: item.url,
    imageUrl: item.imageUrl,
    tags: item.tags.length > 0 ? item.tags : undefined,
    description,
    source: "mentelocale",
  };
}
