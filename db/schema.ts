import {
  boolean,
  index,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ─── Auth (managed by better-auth, defined here for relations) ──────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ─── Events ────────────────────────────────────────────────────────────────────

export const events = pgTable(
  "events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    date: timestamp("date", { mode: "date" }).notNull(),
    time: text("time"),
    locationName: text("location_name"),
    locationLat: real("location_lat"),
    locationLng: real("location_lng"),
    genre: text("genre"),
    vibe: text("vibe"),
    energyLevel: text("energy_level"),
    indoorOutdoor: text("indoor_outdoor"),
    priceRange: text("price_range"),
    duration: text("duration"),
    dayMoment: text("day_moment"),
    source: text("source"),
    sourceUrl: text("source_url"),
    imageUrl: text("image_url"),
    rawText: text("raw_text"),
    metadata: jsonb("metadata"),
    status: text("status").default("active").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }),
  },
  (event) => [
    index("events_date_idx").on(event.date),
    index("events_status_idx").on(event.status),
  ],
);

// ─── Preferences ───────────────────────────────────────────────────────────────

export const userPreferences = pgTable("user_preferences", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  preferenceVector: jsonb("preference_vector").$type<Record<string, number>>(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const preferenceComparisons = pgTable(
  "preference_comparisons",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    optionA: jsonb("option_a").notNull(),
    optionB: jsonb("option_b").notNull(),
    chosen: text("chosen").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (comparison) => [index("comparisons_user_idx").on(comparison.userId)],
);

// ─── Recommendations ───────────────────────────────────────────────────────────

export const recommendations = pgTable(
  "recommendations",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    score: real("score").notNull(),
    reason: text("reason"),
    status: text("status").default("pending").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (rec) => [
    index("recommendations_user_idx").on(rec.userId),
    index("recommendations_status_idx").on(rec.userId, rec.status),
  ],
);

// ─── Chat ──────────────────────────────────────────────────────────────────────

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: text("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (msg) => [index("chat_user_idx").on(msg.userId)],
);

// ─── Push Subscriptions ────────────────────────────────────────────────────────

export const pushSubscriptions = pgTable(
  "push_subscriptions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (sub) => [index("push_user_idx").on(sub.userId)],
);
