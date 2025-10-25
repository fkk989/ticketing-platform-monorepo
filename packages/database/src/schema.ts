import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  numeric,
  timestamp,
  json,
  uuid,
  index,
  boolean,
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

  pricing_config: json().notNull().$type<{
    time_based_weight: number;
    demand_based_weight: number;
    inventory_based_weight: number;
  }>(),

  is_active: boolean().notNull().default(true),

  created_at: timestamp().default(sql`now()`),
  updated_at: timestamp().default(sql`now()`),
});

export const bookings = pgTable(
  "bookings",
  {
    id: uuid().defaultRandom().primaryKey(),
    event_id: uuid().notNull().references(() => events.id),
    user_email: text().notNull(),
    quantity: integer().notNull().default(1),
    price_paid: numeric({ precision: 12, scale: 2 }).notNull(),
    created_at: timestamp().default(sql`now()`),
  },
  (table) => [index("event_idx").on(table.event_id)]
);

export const eventsRelations = relations(events, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  event: one(events, {
    fields: [bookings.event_id],
    references: [events.id],
  }),
}));

export type Event = typeof events.$inferSelect;
export type EventInput = typeof events.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type BookingInput = typeof bookings.$inferInsert;