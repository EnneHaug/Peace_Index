// src/App.tsx
// Simple screen switcher using useState — no router library needed for 2 screens (Phase 1).
// React Router will be introduced in Phase 2 when the History screen is added.

import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './data/db';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { SummaryScreen } from './screens/SummaryScreen';

type Screen = 'welcome' | 'assessment' | 'summary';

export default function App() {
  // Check if any assessments exist — determines whether to show "View last assessment" shortcut
  const assessmentCount = useLiveQuery(() => db.assessments.count(), [], 0);
  const [screen, setScreen] = useState<Screen>('welcome');

  if (screen === 'summary') {
    return <SummaryScreen onNewAssessment={() => setScreen('assessment')} />;
  }

  if (screen === 'assessment') {
    return <AssessmentScreen onComplete={() => setScreen('summary')} />;
  }

  // Welcome / empty state screen (first-time and returning users)
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* App bar */}
      <header className="h-14 flex items-center px-8 border-b border-slate-200">
        <span className="text-[28px] font-semibold text-slate-900 leading-[1.2]">
          Peace Index
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
        <div className="w-full max-w-[560px] flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col gap-3">
            {/* Welcome heading — Display: 28px/600 */}
            <h1 className="text-[28px] font-semibold text-slate-900 leading-[1.2]">
              Welcome to Peace Index
            </h1>
            {/* Welcome body — Body: 16px/400, text-secondary */}
            <p className="text-[16px] text-slate-500 leading-[1.5]">
              Score yourself across five life dimensions to get your Peace Index.
              It takes about two minutes.
            </p>
          </div>

          {/* Begin CTA */}
          <button
            onClick={() => setScreen('assessment')}
            className="w-full max-w-xs py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors duration-200"
          >
            Begin Assessment
          </button>

          {/* Returning user shortcut — only shown when prior assessments exist */}
          {assessmentCount !== undefined && assessmentCount > 0 && (
            <button
              onClick={() => setScreen('summary')}
              className="text-sm text-blue-500 underline"
            >
              View last assessment
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
