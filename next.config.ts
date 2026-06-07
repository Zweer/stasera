import { withSerwist } from "@serwist/turbopack";

export default withSerwist({
  serverExternalPackages: ["@better-auth/kysely-adapter"],
});
