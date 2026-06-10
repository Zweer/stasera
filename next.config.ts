import { withSerwist } from "@serwist/turbopack";

export default withSerwist({
  serverExternalPackages: ["@better-auth/kysely-adapter"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.mentelocale.it" },
      { protocol: "https", hostname: "www.genovatoday.it" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
});
