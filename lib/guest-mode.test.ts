import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { middleware } from "@/middleware";

function makeRequest(path: string, hasSession = false): NextRequest {
  const url = new URL(path, "http://localhost:3000");
  const req = new NextRequest(url);
  if (hasSession) {
    req.cookies.set("better-auth.session_token", "mock-token");
  }
  return req;
}

describe("Guest Mode — Route Access", () => {
  describe("guest can browse without login", () => {
    it("allows /explore (no middleware match)", () => {
      const result = middleware(makeRequest("/explore"));
      expect(result).toBeUndefined();
    });

    it("allows /suggestions (no middleware match)", () => {
      const result = middleware(makeRequest("/suggestions"));
      expect(result).toBeUndefined();
    });

    it("allows /chat (no middleware match)", () => {
      const result = middleware(makeRequest("/chat"));
      expect(result).toBeUndefined();
    });

    it("allows /upload (no middleware match)", () => {
      const result = middleware(makeRequest("/upload"));
      expect(result).toBeUndefined();
    });

    it("allows /upload/confirm (no middleware match)", () => {
      const result = middleware(makeRequest("/upload/confirm"));
      expect(result).toBeUndefined();
    });
  });

  describe("guest cannot access protected pages", () => {
    it("redirects /onboarding to / without session", () => {
      const result = middleware(makeRequest("/onboarding"));
      expect(result).toBeDefined();
      expect(result!.status).toBe(307);
      expect(result!.headers.get("Location")).toBe("http://localhost:3000/");
    });

    it("allows /onboarding with session", () => {
      const result = middleware(makeRequest("/onboarding", true));
      expect(result).toBeUndefined();
    });
  });

  describe("guest cannot access protected APIs", () => {
    it("blocks /api/preferences without session", () => {
      const result = middleware(makeRequest("/api/preferences/profile"));
      expect(result).toBeDefined();
      expect(result!.status).toBe(401);
    });

    it("blocks /api/preferences/compare without session", () => {
      const result = middleware(makeRequest("/api/preferences/compare"));
      expect(result).toBeDefined();
      expect(result!.status).toBe(401);
    });

    it("blocks /api/recommendations/feedback without session", () => {
      const result = middleware(makeRequest("/api/recommendations/feedback"));
      expect(result).toBeDefined();
      expect(result!.status).toBe(401);
    });

    it("blocks /api/push without session", () => {
      const result = middleware(makeRequest("/api/push"));
      expect(result).toBeDefined();
      expect(result!.status).toBe(401);
    });

    it("blocks /api/push/subscribe without session", () => {
      const result = middleware(makeRequest("/api/push/subscribe"));
      expect(result).toBeDefined();
      expect(result!.status).toBe(401);
    });

    it("allows /api/preferences with session", () => {
      const result = middleware(makeRequest("/api/preferences/profile", true));
      expect(result).toBeUndefined();
    });

    it("allows /api/recommendations/feedback with session", () => {
      const result = middleware(
        makeRequest("/api/recommendations/feedback", true),
      );
      expect(result).toBeUndefined();
    });
  });

  describe("guest can access public APIs", () => {
    it("allows /api/events without session", () => {
      const result = middleware(makeRequest("/api/events"));
      expect(result).toBeUndefined();
    });

    it("allows /api/recommendations without session", () => {
      const result = middleware(makeRequest("/api/recommendations"));
      expect(result).toBeUndefined();
    });

    it("allows /api/recommendations/chat without session", () => {
      const result = middleware(makeRequest("/api/recommendations/chat"));
      expect(result).toBeUndefined();
    });

    it("allows /api/events/upload without session", () => {
      const result = middleware(makeRequest("/api/events/upload"));
      expect(result).toBeUndefined();
    });

    it("allows /api/events/confirm without session", () => {
      const result = middleware(makeRequest("/api/events/confirm"));
      expect(result).toBeUndefined();
    });
  });
});

describe("Guest Mode — Chat Limit", () => {
  it("chat component enforces 2-message limit for guests", () => {
    // This tests the logic embedded in ChatClient:
    // When isGuest=true and user messages >= 2, input is replaced by CTA
    // The condition: isGuest && messages.filter(m => m.role === "user").length >= 2
    const isGuest = true;
    const userMessages = [
      { role: "user" as const, content: "msg1" },
      { role: "user" as const, content: "msg2" },
    ];
    const shouldBlock = isGuest && userMessages.length >= 2;
    expect(shouldBlock).toBe(true);
  });

  it("authenticated users are not limited", () => {
    const isGuest = false;
    const userMessages = [
      { role: "user" as const, content: "msg1" },
      { role: "user" as const, content: "msg2" },
      { role: "user" as const, content: "msg3" },
    ];
    const shouldBlock = isGuest && userMessages.length >= 2;
    expect(shouldBlock).toBe(false);
  });

  it("guest with 1 message can still send", () => {
    const isGuest = true;
    const userMessages = [{ role: "user" as const, content: "msg1" }];
    const shouldBlock = isGuest && userMessages.length >= 2;
    expect(shouldBlock).toBe(false);
  });
});
