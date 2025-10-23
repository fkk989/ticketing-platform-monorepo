import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  numeric,
  timestamp,
  json,
  uuid,
  index,
} from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: uuid().defaultRandom().primaryKey(),
  name: text().notNull(),
  description: text(),
  venue: text().notNull(),
  event_date: timestamp().notNull(),

  capacity_total: integer().notNull(),
  capacity_booked: integer().notNull().default(0),

  base_price: numeric({ precision: 12, scale: 2 }).notNull(),
  price_floor: numeric({ precision: 12, scale: 2 }).notNull(),
  price_ceiling: numeric({ precision: 12, scale: 2 }).notNull(),

  // TODO: give proper type for pricing config
  pricing_config: json().$type<{} | null>().notNull(),

  created_at: timestamp().default(sql`now()`),
  updated_at: timestamp().default(sql`now()`),
});

export const bookings = pgTable(
  "bookings",
  {
    id: uuid().defaultRandom().primaryKey(),
    event_id: uuid().references(() => events.id),
    user_email: text().notNull(),
    quantity: integer().notNull().default(1),
    price_paid: numeric({ precision: 12, scale: 2 }).notNull(),
    created_at: timestamp().default(sql`now()`),
  },
  (table) => [index("event_idx").on(table.event_id)]
);
