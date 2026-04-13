// src/screens/AssessmentScreen.tsx
// Step-by-step assessment wizard implementing decisions D-01 through D-06.
// One dimension per screen; scores persist across back/forward navigation (D-06).
// All writes go through saveAssessment() — no direct db access here.

import { useState } from 'react';
import { DIMENSIONS, type DimensionKey } from '../config/dimensions';
import { saveAssessment } from '../data/assessments';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface AssessmentScreenProps {
  /** Called after saveAssessment() resolves — triggers navigation to SummaryScreen */
  onComplete: () => void;
}

// Scores keyed by DimensionKey — persists across step navigation (D-06)
type Scores = Record<DimensionKey, number>;

function buildInitialScores(): Scores {
  return Object.fromEntries(
    DIMENSIONS.map((d) => [d.key, 50])
  ) as Scores;
}

export function AssessmentScreen({ onComplete }: AssessmentScreenProps) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Scores>(buildInitialScores);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const current = DIMENSIONS[step];
  const isFirst = step === 0;
  const isLast = step === DIMENSIONS.length - 1;
  const currentScore = scores[current.key];

  // base-ui Slider: onValueChange receives (value: number, eventDetails) when value prop is number
  function handleSliderChange(value: number | readonly number[]) {
    const numericValue = Array.isArray(value) ? (value as readonly number[])[0] : (value as number);
    setScores((prev) => ({ ...prev, [current.key]: numericValue }));
  }

  function handleBack() {
    if (!isFirst) {
      setSaveError(false);
      setStep((s) => s - 1);
    }
  }

  async function handleNext() {
    if (saving) return;
    setSaveError(false);

    if (isLast) {
      // T-03-02: saving flag prevents double-submit while IndexedDB write is in progress
      setSaving(true);
      try {
        await saveAssessment(scores);
        onComplete();
      } catch {
        setSaveError(true);
        setSaving(false);
      }
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* App bar — Display: 28px/600, height 56px */}
      <header className="h-14 flex items-center px-8 border-b border-slate-200">
        <span className="text-[28px] font-semibold text-slate-900 leading-[1.2]">
          Peace Index
        </span>
      </header>

      {/* Main content — centered single column, max 560px (all breakpoints) */}
      <main className="flex-1 flex flex-col items-center px-8 pt-8 pb-8">
        <div className="w-full max-w-[560px] flex flex-col gap-6">

          {/* Progress indicator — D-05: "Step N of 5" with 5-dot visual */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-slate-500">
              Step {step + 1} of {DIMENSIONS.length}
            </span>
            {/* 5 dots: completed = accent 60%, active = accent, future = border */}
            <div className="flex gap-2" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={DIMENSIONS.length}>
              {DIMENSIONS.map((d, i) => (
                <div
                  key={d.key}
                  aria-label={i < step ? 'completed' : i === step ? 'current' : 'upcoming'}
                  className={[
                    'w-2 h-2 rounded-full transition-colors duration-200',
                    i < step
                      ? 'bg-blue-500/60'
                      : i === step
                        ? 'bg-blue-500'
                        : 'bg-slate-200',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>

          {/* Dimension card — key={step} triggers remount for slide-style feel */}
          <div
            key={step}
            className="rounded-lg border border-slate-200 bg-white p-6 flex flex-col gap-6 transition-opacity duration-200"
          >
            {/* Dimension name — Heading: 20px/600 */}
            <h2 className="text-[20px] font-semibold text-slate-900 leading-[1.2]">
              {current.label}
            </h2>

            {/* Dimension description — Body: 16px/400, text-secondary */}
            <p className="text-base text-slate-500 leading-relaxed">
              {current.description}
            </p>

            {/* Slider section — D-01, D-02, D-03 */}
            <div className="flex flex-col gap-3">
              {/* Numeric readout ABOVE slider — always visible, never occluded by thumb (D-03) */}
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-slate-500">Your score</span>
                <span className="text-[28px] font-semibold text-blue-500 leading-[1.2]">
                  {Math.round(currentScore)}%
                </span>
              </div>

              {/* shadcn Slider (base-ui underneath): continuous 1-100 (D-02), step=1 for integer precision */}
              {/* min-h-[44px] ensures 44px touch target height (D-03, UI-SPEC mobile occlusion) */}
              <div className="min-h-[44px] flex items-center">
                <Slider
                  min={1}
                  max={100}
                  step={1}
                  value={currentScore}
                  onValueChange={handleSliderChange}
                  className="w-full"
                  aria-label={`${current.label} score`}
                  aria-valuemin={1}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(currentScore)}
                />
              </div>

              {/* Scale endpoint labels */}
              <div className="flex justify-between text-xs text-slate-400 select-none">
                <span>1%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Save error message — UI-SPEC Copywriting Contract */}
          {saveError && (
            <p className="text-sm text-red-500 text-center" role="alert">
              Your assessment couldn't be saved. Please try again.
            </p>
          )}

          {/* Navigation row — D-06: back navigation, Back disabled on step 1 */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={isFirst}
              className="flex-1 min-h-[44px]"
              aria-label="Go to previous dimension"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={saving}
              className="flex-1 min-h-[44px] bg-blue-500 hover:bg-blue-600 text-white"
              aria-label={isLast ? 'Save your assessment' : 'Go to next dimension'}
            >
              {saving ? 'Saving\u2026' : isLast ? 'Save Assessment' : 'Next'}
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
