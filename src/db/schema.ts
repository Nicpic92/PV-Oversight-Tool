import { pgTable, serial, text, timestamp, doublePrecision, integer } from 'drizzle-orm/pg-core';

export const audits = pgTable('audits', {
  id: serial('id').primaryKey(),
  runDate: timestamp('run_date').defaultNow(),
  payer: text('payer').notNull(),
  totalClaims: integer('total_claims').notNull(),
});

export const auditResults = pgTable('audit_results', {
  id: serial('id').primaryKey(),
  auditId: integer('audit_id').references(() => audits.id),
  claimNumber: text('claim_number').notNull(),
  taxId: text('tax_id'),
  npi: text('npi'),
  category: text('category'), // e.g., "W9 GAP", "READY (INN)"
  rootCause: text('root_cause'),
  solution: text('solution'),
  netPayment: doublePrecision('net_payment'),
  auditStatus: text('audit_status'), // e.g., "PEND", "MANAGEMENTREVIEW"
});
