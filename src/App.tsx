// src/App.tsx
import { useState } from 'react';
import { ClipboardList, History, TrendingUp } from 'lucide-react';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { SummaryScreen } from './screens/SummaryScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { TrendsScreen } from './screens/TrendsScreen';

type Tab = 'assessment' | 'history' | 'trends';
type AssessmentStep = 'welcome' | 'assessment' | 'summary';

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'assessment', label: 'Assessment', Icon: ClipboardList },
  { id: 'history',    label: 'History',    Icon: History },
  { id: 'trends',     label: 'Trends',     Icon: TrendingUp },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('assessment');
  const [assessmentStep, setAssessmentStep] = useState<AssessmentStep>('welcome');

  function renderTabContent() {
    if (activeTab === 'history') return <HistoryScreen />;
    if (activeTab === 'trends') return <TrendsScreen />;

    // Assessment tab — internal sub-flow
    if (assessmentStep === 'summary') {
      return (
        <SummaryScreen
          onNewAssessment={() => setAssessmentStep('welcome')}
        />
      );
    }
    if (assessmentStep === 'assessment') {
      return (
        <AssessmentScreen
          onComplete={() => setAssessmentStep('summary')}
        />
      );
    }

    // Welcome / landing step
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-8 gap-6">
        <div className="w-full max-w-[560px] flex flex-col items-center gap-6 text-center">
          <div className="flex flex-col gap-3">
            <h1 className="text-[28px] font-semibold text-slate-900 leading-[1.2]">
              Welcome to Peace Index
            </h1>
            <p className="text-[16px] text-slate-500 leading-[1.5]">
              Score yourself across five life dimensions to get your Peace Index.
              It takes about two minutes.
            </p>
          </div>
          <button
            onClick={() => setAssessmentStep('assessment')}
            className="w-full max-w-xs py-3 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm transition-colors duration-200"
          >
            Begin Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* App bar */}
      <header className="h-14 flex items-center px-8 border-b border-slate-200 shrink-0">
        <span className="text-[28px] font-semibold text-slate-900 leading-[1.2]">
          Peace Index
        </span>
      </header>

      {/* Tab content — pb-16 prevents content hiding behind fixed tab bar */}
      <main className="flex-1 flex flex-col overflow-y-auto pb-16">
        {renderTabContent()}
      </main>

      {/* Bottom tab bar — fixed, 64px tall */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex z-10">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors duration-150 ${
              activeTab === id ? 'text-blue-500' : 'text-slate-400'
            }`}
            aria-current={activeTab === id ? 'page' : undefined}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
