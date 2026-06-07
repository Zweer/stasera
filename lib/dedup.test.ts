import { describe, expect, it } from "vitest";
import { normalize } from "./dedup.utils";

describe("normalize", () => {
  it("lowercases and strips accents", () => {
    expect(normalize("Città di Genova")).toBe("citta di genova");
  });

  it("strips punctuation", () => {
    expect(normalize("Jazz: Live! @Porto")).toBe("jazz live porto");
  });

  it("collapses whitespace", () => {
    expect(normalize("  festa   del   mare  ")).toBe("festa del mare");
  });

  it("produces same key for similar titles", () => {
    expect(normalize("Vintage Fest Genova 2026")).toBe(
      normalize("VINTAGE FEST GENOVA 2026"),
    );
  });
});
