// src/data/db.ts
// Dexie database definition. This is the only file that imports Dexie directly.
// All other files that need DB access import `db` from this file.

import Dexie, { type EntityTable } from 'dexie';

// AssessmentRecord: flat record per D-09.
// schemaVersion is a literal type (not number) per D-10 — enables future migration guards.
// date is ISO 8601 UTC string per D-11 — sortable and locale-independent.
export interface AssessmentRecord {
  id?: number;            // auto-increment primary key (omit on write; Dexie assigns it)
  schemaVersion: 1;       // D-10: literal 1 — always hardcoded by saveAssessment()
  date: string;           // D-11: ISO 8601 UTC — new Date().toISOString()
  purpose: number;        // 1-100
  people: number;         // 1-100
  place: number;          // 1-100
  personalHealth: number; // 1-100 — camelCase matches DimensionKey in config/dimensions.ts
  provision: number;      // 1-100
}

class PeaceIndexDB extends Dexie {
  assessments!: EntityTable<AssessmentRecord, 'id'>;

  constructor() {
    super('PeaceIndexDB');
    this.version(1).stores({
      // id: auto-increment primary key
      // date: indexed for orderBy('date') in history queries (Phase 2)
      assessments: '++id, date',
    });
  }
}

export const db = new PeaceIndexDB();
