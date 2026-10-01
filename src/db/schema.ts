import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const evaluaciones = pgTable('evaluaciones', {
  id: serial('id').primaryKey(),
  anonymousId: text('anonymous_id').notNull(),
  userId: text('user_id'),
  score: integer('score').notNull(),
  riskLevel: text('risk_level').notNull(),
  factors: text('factors').notNull(), // JSON string array of detected factors
  answers: text('answers').notNull(), // JSON string map of answers
  createdAt: timestamp('created_at').defaultNow(),
});
