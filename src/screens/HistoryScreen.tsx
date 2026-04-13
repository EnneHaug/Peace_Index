// src/screens/HistoryScreen.tsx
// History list — TRAK-01.
// Displays all past assessments newest-first as expandable cards.

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { format } from 'date-fns';
import { db, type AssessmentRecord } from '../data/db';
import { DIMENSIONS } from '../config/dimensions';

// Peace Index = average of all 5 dimension scores, rounded
function calcPeaceIndex(record: AssessmentRecord): number {
  return Math.round(
    DIMENSIONS.reduce((sum, d) => sum + (record[d.key as keyof AssessmentRecord] as number), 0)
    / DIMENSIONS.length
  );
}

interface HistoryCardProps {
  record: AssessmentRecord;
}

function HistoryCard({ record }: HistoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const peaceIndex = calcPeaceIndex(record);
  const formattedDate = format(new Date(record.date), 'MMMM d, yyyy');

  return (
    <div
      className="rounded-lg border border-slate-200 bg-slate-50 p-4 cursor-pointer select-none"
      onClick={() => setExpanded(e => !e)}
      role="button"
      aria-expanded={expanded}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpanded(v => !v); }}
    >
      {/* Summary row — date on left, Peace Index on right */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{formattedDate}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-[20px] font-semibold text-blue-500 leading-[1.2]">
            {peaceIndex}%
          </span>
          <span className="text-xs text-slate-400">Peace Index</span>
        </div>
      </div>

      {/* Expanded dimension breakdown — D-03 */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-x-4 gap-y-2">
          {DIMENSIONS.map(dim => (
            <div key={dim.key} className="flex justify-between items-center text-sm">
              <span className="text-slate-600">{dim.label}</span>
              <span className="font-medium text-slate-900">
                {record[dim.key as keyof AssessmentRecord] as number}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function HistoryScreen() {
  // D-02: newest-first via reverse(); useLiveQuery returns undefined while loading
  const records = useLiveQuery(
    () => db.assessments.orderBy('date').reverse().toArray(),
    []
  );

  // Loading state — useLiveQuery returns undefined on first render before async resolves
  if (records === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-slate-400 text-sm">Loading...</span>
      </div>
    );
  }

  // D-04: Empty state — prompt to take first assessment
  if (records.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-4 text-center">
        <p className="text-[20px] font-semibold text-slate-900">No assessments yet</p>
        <p className="text-sm text-slate-500">
          Switch to the Assessment tab to take your first Peace Index.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 pt-6">
      <h2 className="text-[20px] font-semibold text-slate-900 leading-[1.2] mb-1">
        Assessment History
      </h2>
      {records.map(record => (
        <HistoryCard key={record.id} record={record} />
      ))}
    </div>
  );
}
