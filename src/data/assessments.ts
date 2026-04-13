// src/data/assessments.ts
// All writes to the assessments table go through this file.
// Screens NEVER call db.assessments.add() directly — they call saveAssessment().
// This ensures schemaVersion and date are always set correctly.

import { db, type AssessmentRecord } from './db';

// ScoreMap: the 5 dimension scores the caller provides.
// id, schemaVersion, and date are set by saveAssessment() — callers cannot override them.
type ScoreMap = Omit<AssessmentRecord, 'id' | 'schemaVersion' | 'date'>;

/**
 * Saves a completed Peace Index assessment to IndexedDB.
 * Always writes schemaVersion: 1 (D-10) and ISO 8601 UTC date (D-11).
 * @returns The auto-assigned id of the new record.
 */
export async function saveAssessment(scores: ScoreMap): Promise<number | undefined> {
  return db.assessments.add({
    schemaVersion: 1,
    date: new Date().toISOString(),  // D-11: UTC ISO string — sortable, locale-independent
    ...scores,
  });
}
