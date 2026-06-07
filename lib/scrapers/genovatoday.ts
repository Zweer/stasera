import * as cheerio from "cheerio";
import type { RawEvent, Scraper, ScraperMeta } from "./types";

const BASE_URL = "https://www.genovatoday.it";

export const genovaTodayScraper: Scraper = {
  meta: {
    id: "genovatoday",
    name: "GenovaToday Eventi",
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
  location?: string;
  url: string;
  imageUrl?: string;
  tags: string[];
  price?: string;
}

function buildDateRangeUrl(): string {
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() + 7);
  const fmt = (d: Date): string => d.toISOString().split("T")[0];
  return `${BASE_URL}/eventi/dal/${fmt(today)}/al/${fmt(end)}/`;
}

async function fetchListings(): Promise<ListingItem[]> {
  const url = buildDateRangeUrl();
  const html = await fetch(url).then((r) => r.text());
  const $ = cheerio.load(html);
  const items: ListingItem[] = [];

  $("article.c-card").each((_, el) => {
    const card = $(el);
    const anchor = card.find("a.o-link-text");
    const href = anchor.attr("href");
    if (!href) return;

    const title = card.find("h2.c-card__heading").text().trim();
    const kicker = card.find("span[class*='c-card__kicker']").text().trim();
    const dateText = card
      .find("li.c-card__item-details")
      .first()
      .find("span")
      .text()
      .trim()
      .replace(/\s+/g, " ");
    const locationText =
      card.find("li.c-card__item-details a.c-card__link span").text().trim() ||
      undefined;
    const img = card.find("img").attr("src") || undefined;
    const priceText = card.text().includes("Gratis") ? "Gratis" : undefined;

    items.push({
      title,
      date: dateText,
      location: locationText,
      url: href.startsWith("http") ? href : `${BASE_URL}${href}`,
      imageUrl: img?.startsWith("//") ? `https:${img}` : img,
      tags: kicker ? [kicker] : [],
      price: priceText,
    });
  });

  return items;
}

async function fetchDetail(item: ListingItem): Promise<RawEvent> {
  const html = await fetch(item.url).then((r) => r.text());
  const $ = cheerio.load(html);

  const description =
    $("div.c-entry")
      .find("p")
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean)
      .join("\n") || undefined;

  return {
    title: item.title,
    date: item.date,
    location: item.location,
    url: item.url,
    imageUrl: item.imageUrl,
    tags: item.tags.length > 0 ? item.tags : undefined,
    price: item.price,
    description,
    source: "genovatoday",
  };
}
