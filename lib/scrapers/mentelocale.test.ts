import { describe, expect, it, vi } from "vitest";
import { menteLocaleScraper } from "./mentelocale";

const LISTING_HTML = `
<html><body>
<div class="Evento">
  <a href="/genova/12345-test-event.htm">
    <img class="lazy" data-src="/repository/contenuti/horizontal/12345_half.jpg">
    <span class="Testi">
      <span class="Titolo">Concerto Jazz al Porto Antico</span>
      <span class="Date">07/06/2026</span>
    </span>
  </a>
</div>
<ul class="Tags">
  <li><a class="Provincia" href="/genova/">Genova</a></li>
  <li><a href="/genova/eventi/arg/2/">Musica</a></li>
  <li><a href="/genova/eventi/arg/2/">Concerti</a></li>
</ul>
<div class="Paginazione"></div>
</body></html>
`;

const DETAIL_HTML = `
<html><body>
<div class="LuogoBox">
  <span class="LuogoNome">Porto Antico</span>
</div>
<div class="Testo">
  <p>Un concerto jazz straordinario con artisti internazionali.</p>
  <p>Ingresso libero dalle ore 21.</p>
</div>
</body></html>
`;

describe("menteLocaleScraper", () => {
  it("has correct meta", () => {
    expect(menteLocaleScraper.meta.id).toBe("mentelocale");
  });

  it("parses listing and detail pages", async () => {
    let callCount = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(() => {
        callCount++;
        // First 3 calls = list pages, rest = detail pages
        const html = callCount <= 3 ? LISTING_HTML : DETAIL_HTML;
        return Promise.resolve({ text: () => Promise.resolve(html) });
      }),
    );

    const events = await menteLocaleScraper.scrape();

    // 3 pages × 1 event each = 3 events (same event repeated)
    expect(events.length).toBe(3);
    expect(events[0]).toMatchObject({
      title: "Concerto Jazz al Porto Antico",
      date: "07/06/2026",
      location: "Porto Antico",
      url: "https://www.mentelocale.it/genova/12345-test-event.htm",
      tags: ["Musica", "Concerti"],
      description:
        "Un concerto jazz straordinario con artisti internazionali.\nIngresso libero dalle ore 21.",
      source: "mentelocale",
    });

    vi.unstubAllGlobals();
  });
});
