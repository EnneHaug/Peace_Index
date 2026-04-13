// src/screens/SummaryScreen.tsx
// Reactive summary of the most recent Peace Index assessment.
// Uses useLiveQuery so the view updates automatically if data changes (D-12, DATA-02).

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../data/db';
import { DIMENSIONS } from '../config/dimensions';
import { format } from 'date-fns';

interface SummaryScreenProps {
  onNewAssessment: () => void;
}

export function SummaryScreen({ onNewAssessment }: SummaryScreenProps) {
  // useLiveQuery: reactive read — re-renders automatically if data changes (D-12, DATA-02)
  // orderBy('date').last() returns the most recently saved record
  const latest = useLiveQuery(() =>
    db.assessments.orderBy('date').last()
  );

  // Loading state: useLiveQuery returns undefined while the query is in flight
  if (latest === undefined) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-slate-500 text-sm">Loading...</span>
      </div>
    );
  }

  // Safety guard: if navigated to summary with no data, offer to go back
  if (!latest) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-8">
        <p className="text-slate-900 text-[20px] font-semibold">No assessment found</p>
        <button
          onClick={onNewAssessment}
          className="text-blue-500 underline text-sm"
        >
          Start an assessment
        </button>
      </div>
    );
  }

  const formattedDate = format(new Date(latest.date), 'MMMM d, yyyy');

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* App bar */}
      <header className="h-14 flex items-center px-8 border-b border-slate-200">
        <span className="text-[28px] font-semibold text-slate-900 leading-[1.2]">
          Peace Index
        </span>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-8 pt-8 pb-12">
        <div className="w-full max-w-[560px] flex flex-col gap-6">

          {/* Summary heading — D-07 */}
          <div className="flex flex-col gap-1">
            <h1 className="text-[28px] font-semibold text-slate-900 leading-[1.2]">
              Your Peace Index
            </h1>
            {/* Date — UI-SPEC Label 14px/400, text-secondary */}
            <p className="text-sm text-slate-500">
              Scored on {formattedDate}
            </p>
          </div>

          {/* 5 score cards — D-08: simple card layout, no radar chart */}
          {/* Single column on mobile, 2-column grid on sm+ (UI-SPEC Layout Contract) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DIMENSIONS.map((dimension) => {
              const score = latest[dimension.key as keyof typeof latest] as number;
              return (
                <div
                  key={dimension.key}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex flex-col gap-2"
                >
                  {/* Dimension name — Heading: 20px/600 */}
                  <p className="text-[20px] font-semibold text-slate-900 leading-[1.2]">
                    {dimension.label}
                  </p>
                  {/* Score — Display: 28px/600, accent color */}
                  <p className="text-[28px] font-semibold text-blue-500 leading-[1.2]">
                    {score}%
                  </p>
                </div>
              );
            })}
          </div>

          {/* New assessment CTA */}
          <button
            onClick={onNewAssessment}
            className="w-full py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors duration-200"
          >
            Start New Assessment
          </button>

        </div>
      </main>
    </div>
  );
}
