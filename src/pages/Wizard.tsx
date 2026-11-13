import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { GoalId, PainId, SiteContent } from '../content/types';
import { GOAL_IDS, PAIN_IDS } from '../content/types';
import { goalIcons, Icon, painIcons } from '../components/Icons';
import type { Draft } from '../lib/draft';

interface WizardProps {
  content: SiteContent;
  initialPain: PainId | null;
  onComplete: (draft: Draft) => void;
  onExit: () => void;
}

type WizardStep = 1 | 2 | 3;

const MAX_TASK = 600;
const MAX_TRIED = 400;

export function Wizard({ content, initialPain, onComplete, onExit }: WizardProps) {
  const { ui, goals, pains } = content;
  const [step, setStep] = useState<WizardStep>(1);
  const [goal, setGoal] = useState<GoalId | null>(null);
  const [pain, setPain] = useState<PainId | null>(initialPain);
  const [task, setTask] = useState('');
  const [tried, setTried] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasMounted = useRef(false);
  const skipPainStep = useRef(Boolean(initialPain));

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const stepCopies: Record<WizardStep, { eyebrow: string; title: string; help: string }> = {
    1: {
      eyebrow: ui.wizard.step1Eyebrow,
      title: ui.wizard.step1Title,
      help: ui.wizard.step1Help,
    },
    2: {
      eyebrow: ui.wizard.step2Eyebrow,
      title: ui.wizard.step2Title,
      help: ui.wizard.step2Help,
    },
    3: {
      eyebrow: ui.wizard.step3Eyebrow,
      title: ui.wizard.step3Title,
      help: ui.wizard.step3Help,
    },
  };
  const stepCopy = stepCopies[step];

  function goBack() {
    if (step === 1) {
      onExit();
      return;
    }
    setStep((current) => (current - 1) as WizardStep);
  }

  function chooseGoal(nextGoal: GoalId) {
    setGoal(nextGoal);
    if (skipPainStep.current && pain) {
      skipPainStep.current = false;
      setStep(3);
      return;
    }
    setStep(2);
  }

  function choosePain(nextPain: PainId) {
    setPain(nextPain);
    setStep(3);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!goal || !pain) return;
    onComplete({ goal, pain, task: task.trim(), tried: tried.trim() });
  }

  return (
    <main id="main" className="wizard-page" tabIndex={-1}>
      <div className="wizard-shell">
        <div className="wizard-toolbar">
          <button type="button" className="back-button" onClick={goBack}>
            <Icon name="chevronLeft" size={18} />
            {ui.wizard.back}
          </button>

          <div className="wizard-progress">
            <div className="wizard-progress__meta">
              <span>
                {ui.wizard.step} {step} {ui.wizard.of} 3
              </span>
              <span>{ui.wizard.stepLabels[step - 1]}</span>
            </div>
            <div
              className="wizard-progress__track"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={3}
              aria-valuenow={step}
              aria-label={`${ui.wizard.step} ${step} / 3`}
            >
              <span style={{ width: `${(step / 3) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="wizard-layout">
          <aside className="wizard-aside">
            <p className="section-index">DIAGNOSTIC ／ 001</p>
            <ol className="step-list">
              {ui.wizard.stepLabels.map((label, index) => {
                const itemStep = (index + 1) as WizardStep;
                const state = step === itemStep ? 'current' : step > itemStep ? 'done' : 'todo';
                return (
                  <li key={label} className={`step-list__item is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
                    <span className="step-list__num">
                      {state === 'done' ? <Icon name="check" size={14} /> : `0${itemStep}`}
                    </span>
                    <span>{label}</span>
                  </li>
                );
              })}
            </ol>

            <div className="selection-summary">
              <div>
                <span>{ui.wizard.selectedTask}</span>
                <strong>{goal ? goals[goal].shortLabel : '—'}</strong>
                {goal && step !== 1 && (
                  <button type="button" onClick={() => setStep(1)}>
                    {ui.wizard.change}
                  </button>
                )}
              </div>
              <div>
                <span>{ui.wizard.selectedPain}</span>
                <strong>{pain ? pains[pain].label : '—'}</strong>
                {pain && step === 3 && (
                  <button type="button" onClick={() => setStep(2)}>
                    {ui.wizard.change}
                  </button>
                )}
              </div>
            </div>

            <p className="wizard-aside__note">
              <Icon name="lock" size={15} />
              {ui.wizard.privacyNote}
            </p>
          </aside>

          <section className="wizard-card" aria-labelledby="wizard-title">
            <div className="wizard-card__inner">
              <div className="wizard-step" key={step}>
                <p className="eyebrow">{stepCopy.eyebrow}</p>
                <h1 id="wizard-title" ref={headingRef} tabIndex={-1}>
                  {stepCopy.title}
                </h1>
                <p className="wizard-step__help">{stepCopy.help}</p>

                {step === 1 && (
                  <div className="goal-grid">
                    {GOAL_IDS.map((goalId, index) => {
                      const item = goals[goalId];
                      return (
                        <button
                          type="button"
                          key={goalId}
                          className={`goal-card${goal === goalId ? ' is-selected' : ''}`}
                          onClick={() => chooseGoal(goalId)}
                          aria-pressed={goal === goalId}
                        >
                          <span className="goal-card__top">
                            <span className="goal-card__icon">
                              <Icon name={goalIcons[goalId]} size={23} />
                            </span>
                            <span className="goal-card__num">0{index + 1}</span>
                          </span>
                          <span className="goal-card__body">
                            <strong>{item.label}</strong>
                            <span>{item.blurb}</span>
                          </span>
                          <span className="goal-card__arrow">
                            <Icon name="arrowRight" size={18} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {step === 2 && (
                  <>
                    {goal && (
                      <div className="context-chip">
                        <span>
                          {ui.wizard.selectedTask}：<strong>{goals[goal].shortLabel}</strong>
                        </span>
                        <button type="button" onClick={() => setStep(1)}>
                          {ui.wizard.change}
                        </button>
                      </div>
                    )}
                    <div className="pain-picker">
                      {PAIN_IDS.map((painId, index) => {
                        const item = pains[painId];
                        return (
                          <button
                            type="button"
                            key={painId}
                            className={`pain-option${pain === painId ? ' is-selected' : ''}`}
                            onClick={() => choosePain(painId)}
                            aria-pressed={pain === painId}
                          >
                            <span className="pain-option__icon">
                              <Icon name={painIcons[painId]} size={22} />
                            </span>
                            <span className="pain-option__copy">
                              <span className="pain-option__num">0{index + 1}</span>
                              <strong>{item.label}</strong>
                              <span>{item.shortLabel}</span>
                            </span>
                            <Icon name="arrowRight" size={18} />
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <form className="context-form" onSubmit={submit}>
                    <div className="selection-cards">
                      <div>
                        <span>{ui.wizard.selectedTask}</span>
                        <strong>{goal ? goals[goal].label : '—'}</strong>
                        <button type="button" onClick={() => setStep(1)}>
                          {ui.wizard.change}
                        </button>
                      </div>
                      <div>
                        <span>{ui.wizard.selectedPain}</span>
                        <strong>{pain ? pains[pain].label : '—'}</strong>
                        <button type="button" onClick={() => setStep(2)}>
                          {ui.wizard.change}
                        </button>
                      </div>
                    </div>

                    <label className="field" htmlFor="wizard-task">
                      <span className="field__label">
                        {ui.wizard.taskLabel}
                        <span className="field__optional">{ui.wizard.optional}</span>
                      </span>
                      <textarea
                        id="wizard-task"
                        value={task}
                        onChange={(event) => setTask(event.target.value)}
                        placeholder={ui.wizard.taskPlaceholder}
                        maxLength={MAX_TASK}
                        rows={3}
                        autoComplete="off"
                        spellCheck={false}
                      />
                      <span className="field__count">
                        {task.length} / {MAX_TASK}
                      </span>
                    </label>

                    <label className="field" htmlFor="wizard-tried">
                      <span className="field__label">
                        {ui.wizard.triedLabel}
                        <span className="field__optional">{ui.wizard.optional}</span>
                      </span>
                      <textarea
                        id="wizard-tried"
                        value={tried}
                        onChange={(event) => setTried(event.target.value)}
                        placeholder={ui.wizard.triedPlaceholder}
                        maxLength={MAX_TRIED}
                        rows={2}
                        autoComplete="off"
                        spellCheck={false}
                      />
                      <span className="field__count">
                        {tried.length} / {MAX_TRIED}
                      </span>
                    </label>

                    <div className="context-form__foot">
                      <p>
                        <Icon name="lock" size={15} />
                        {ui.wizard.privacyNote}
                      </p>
                      <button type="submit" className="button button--primary button--large" disabled={!goal || !pain}>
                        {ui.wizard.generate}
                        <Icon name="arrowRight" size={20} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
