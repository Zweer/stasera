import { describe, expect, it, vi } from "vitest";
import { genovaTodayScraper } from "./genovatoday";

const LISTING_HTML = `
<html><body>
<article class="c-card u-flex u-column">
  <figure>
    <span class="c-card__kicker c-card__kicker--inverse">Concerti</span>
    <a class="u-size-full" href="/eventi/jazz-fest-2026.html">
      <span class="c-card__gradient">
        <img src="//citynews-genovatoday.stgy.ovh/~media/test.jpg" alt="Jazz Fest">
      </span>
    </a>
  </figure>
  <div class="c-card__content">
    <header class="c-card__pull-down">
      <a href="/eventi/jazz-fest-2026.html" class="o-link-text">
        <h2 class="c-card__heading">Jazz Fest 2026 al Porto Antico</h2>
      </a>
    </header>
    <ul class="c-card__list-details u-p-none u-mb-none u-mt-small u-list-none">
      <li class="c-card__item-details u-relative ">
        <span class="u-label-07 u-ml-medium u-inline-block">12 giugno 2026</span>
      </li>
      <li class="c-card__item-details u-relative ">
        <a class="c-card__link" href="/eventi/location/porto-antico/">
          <span class="u-label-07 u-ml-medium u-inline-block">Porto Antico</span>
        </a>
      </li>
    </ul>
    Gratis
  </div>
</article>
</body></html>
`;

const DETAIL_HTML = `
<html><body>
<div class="c-entry u-p-small">
  <p>Il festival jazz più atteso dell'estate genovese.</p>
  <p>Tre giorni di musica dal vivo con artisti internazionali.</p>
</div>
</body></html>
`;

describe("genovaTodayScraper", () => {
  it("has correct meta", () => {
    expect(genovaTodayScraper.meta.id).toBe("genovatoday");
  });

  it("parses listing and detail pages", async () => {
    let callCount = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        callCount++;
        const html = callCount === 1 ? LISTING_HTML : DETAIL_HTML;
        return Promise.resolve({ text: () => Promise.resolve(html) });
      }),
    );

    const events = await genovaTodayScraper.scrape();

    expect(events.length).toBe(1);
    expect(events[0]).toMatchObject({
      title: "Jazz Fest 2026 al Porto Antico",
      date: "12 giugno 2026",
      location: "Porto Antico",
      url: "https://www.genovatoday.it/eventi/jazz-fest-2026.html",
      imageUrl: "https://citynews-genovatoday.stgy.ovh/~media/test.jpg",
      tags: ["Concerti"],
      price: "Gratis",
      description:
        "Il festival jazz più atteso dell'estate genovese.\nTre giorni di musica dal vivo con artisti internazionali.",
      source: "genovatoday",
    });

    vi.unstubAllGlobals();
  });
});
