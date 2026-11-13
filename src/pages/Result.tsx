import { useEffect, useRef, useState } from 'react';
import type { GoalId, Lang, PainId, SiteContent } from '../content/types';
import { goalIcons, Icon, painIcons } from '../components/Icons';
import { buildDiagnosisMarkdown, buildHandoffPrompt, buildPrompt } from '../content/prompt';
import { copyText, shareOrCopy } from '../lib/clipboard';
import { downloadTextFile } from '../lib/download';
import { buildResultPath } from '../lib/router';
import type { Draft } from '../lib/draft';

interface ResultProps {
  lang: Lang;
  content: SiteContent;
  goal: GoalId | null;
  pain: PainId | null;
  draft: Draft | null;
  onRestart: () => void;
  onHome: () => void;
}

function readSavedProgress(goal: GoalId | null, pain: PainId | null): string {
  if (!goal || !pain) return '';
  try {
    const raw = window.sessionStorage.getItem('ai-unstuck-handoff');
    if (!raw) return '';
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return '';
    const record = value as Record<string, unknown>;
    if (record.goal !== goal || record.pain !== pain || typeof record.progress !== 'string') return '';
    return record.progress;
  } catch {
    return '';
  }
}

export function Result({ lang, content, goal, pain, draft, onRestart, onHome }: ResultProps) {
  const { ui, goals, pains } = content;
  const [copied, setCopied] = useState(false);
  const [handoffCopied, setHandoffCopied] = useState(false);
  const [progress, setProgress] = useState(() => readSavedProgress(goal, pain));
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef<number | undefined>(undefined);
  const copiedTimer = useRef<number | undefined>(undefined);
  const handoffTimer = useRef<number | undefined>(undefined);

  const validDraft = draft && goal && pain && draft.goal === goal && draft.pain === pain ? draft : null;

  useEffect(
    () => () => {
      window.clearTimeout(noticeTimer.current);
      window.clearTimeout(copiedTimer.current);
      window.clearTimeout(handoffTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (goal && pain) {
      document.title = `${pains[pain].headline} · ${ui.brand.name}`;
    }
  }, [goal, pain, pains, ui.brand.name]);

  useEffect(() => {
    setCopied(false);
    setHandoffCopied(false);
  }, [lang]);

  useEffect(() => {
    setHandoffCopied(false);
  }, [progress]);

  useEffect(() => {
    if (!goal || !pain) return;
    try {
      window.sessionStorage.setItem('ai-unstuck-handoff', JSON.stringify({ goal, pain, progress }));
    } catch {
      // The handoff pack still works if storage is unavailable.
    }
  }, [goal, pain, progress]);

  if (!goal || !pain) {
    return (
      <main id="main" className="notfound" tabIndex={-1}>
        <p className="eyebrow">404 ／ DIAGNOSIS NOT FOUND</p>
        <h1>{ui.result.notFound}</h1>
        <div className="notfound__actions">
          <button type="button" className="button button--primary" onClick={onHome}>
            {ui.result.home}
          </button>
          <button type="button" className="button button--ghost" onClick={onRestart}>
            {ui.result.restart}
          </button>
        </div>
      </main>
    );
  }

  const goalCopy = goals[goal];
  const painCopy = pains[pain];
  const customTask = validDraft?.task.trim() ?? '';
  const tried = validDraft?.tried.trim() ?? '';
  const displayTask = customTask || goalCopy.task;
  const prompt = buildPrompt({ lang, goal: goalCopy, pain: painCopy, task: customTask, tried });
  const handoffPrompt = buildHandoffPrompt({
    lang,
    goal: goalCopy,
    pain: painCopy,
    task: customTask,
    tried,
    progress,
  });

  function announce(message: string) {
    window.clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 2800);
  }

  async function handleCopy() {
    const ok = await copyText(prompt);
    if (!ok) {
      announce(ui.result.copyFailed);
      return;
    }
    setCopied(true);
    announce(ui.result.copied);
    window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(false), 2200);
  }

  async function handleCopyHandoff() {
    const ok = await copyText(handoffPrompt);
    if (!ok) {
      announce(ui.result.copyFailed);
      return;
    }
    setHandoffCopied(true);
    announce(ui.handoff.copied);
    window.clearTimeout(handoffTimer.current);
    handoffTimer.current = window.setTimeout(() => setHandoffCopied(false), 2200);
  }

  function handleDownload() {
    const markdown = buildDiagnosisMarkdown({
      lang,
      goal: goalCopy,
      pain: painCopy,
      task: customTask,
      tried,
      progress,
      prompt,
      handoff: handoffPrompt,
      sourceUrl: `${window.location.origin}${window.location.pathname}`,
    });
    downloadTextFile(`ai-unstuck-${goal}-${pain}-${lang}.md`, markdown);
    announce(ui.handoff.downloaded);
  }

  function scrollToHandoff() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('handoff')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  async function handleShare() {
    if (!goal || !pain) return;
    const params = new URLSearchParams({ goal, pain, lang });
    const url = `${window.location.origin}${window.location.pathname}#/result?${params.toString()}`;
    const outcome = await shareOrCopy(url, painCopy.headline, `${goalCopy.label} · ${painCopy.label}`);
    if (outcome === 'copied') announce(ui.result.shared);
    if (outcome === 'failed') announce(ui.result.shareFailed);
  }

  return (
    <main id="main" className="result-page" tabIndex={-1}>
      <div className="result-shell">
        <div className="result-topline">
          <button type="button" className="back-button" onClick={onRestart}>
            <Icon name="chevronLeft" size={18} />
            {ui.result.restart}
          </button>
          <span className="result-topline__stamp">
            <i aria-hidden="true" />
            DIAGNOSIS ／ 001
          </span>
        </div>

        <header className="result-hero">
          <p className="eyebrow result-hero__eyebrow">{ui.result.eyebrow}</p>
          <div className="result-hero__grid">
            <div className="result-hero__copy">
              <h1>{painCopy.headline}</h1>
              <p className="result-hero__summary">{painCopy.summary}</p>
              <div className="result-hero__tags">
                <span className="meta-tag">
                  <Icon name={goalIcons[goal]} size={15} />
                  {goalCopy.label}
                </span>
                <span className="meta-tag">
                  <Icon name={painIcons[pain]} size={15} />
                  {painCopy.label}
                </span>
              </div>
            </div>

            <aside className="diagnosis-card" aria-label={ui.result.eyebrow}>
              <div className="diagnosis-card__head">
                <span>{ui.result.diagnosisLabel}</span>
                <span className="diagnosis-card__mark" aria-hidden="true">
                  <Icon name={painIcons[pain]} size={22} />
                </span>
              </div>
              <div className="diagnosis-card__row">
                <span>{ui.result.taskLabel}</span>
                <strong>{goalCopy.label}</strong>
              </div>
              <div className="diagnosis-card__row">
                <span>{ui.result.painLabel}</span>
                <strong>{painCopy.label}</strong>
              </div>
              <div className="diagnosis-card__task">
                <span>{customTask ? ui.result.customTask : ui.result.defaultTask}</span>
                <p>{displayTask}</p>
              </div>
            </aside>
          </div>
        </header>

        <div className="result-layout">
          <div className="result-main">
            <section className="playbook" aria-labelledby="playbook-title">
              <div className="block-head">
                <p className="section-index">{ui.result.playbookEyebrow}</p>
                <h2 id="playbook-title">{ui.result.playbookTitle}</h2>
              </div>
              <ol className="playbook-list">
                {painCopy.steps.map((step, index) => (
                  <li key={step.title}>
                    <span className="playbook-list__num" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="prompt-section" aria-labelledby="prompt-title">
              <div className="block-head block-head--row">
                <div>
                  <p className="section-index">{ui.result.promptEyebrow}</p>
                  <h2 id="prompt-title">{ui.result.promptTitle}</h2>
                </div>
                <button type="button" className={`copy-button${copied ? ' is-copied' : ''}`} onClick={handleCopy}>
                  <Icon name={copied ? 'check' : 'copy'} size={18} />
                  {copied ? ui.result.copied : ui.result.copy}
                </button>
              </div>
              <div className="prompt-card">
                <div className="prompt-card__bar">
                  <span className="prompt-card__dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span>PROMPT.TXT</span>
                  <span className="prompt-card__ready">
                    <i aria-hidden="true" />
                    READY
                  </span>
                </div>
                <pre tabIndex={0} aria-label={ui.result.promptTitle}>
                  <code>{prompt}</code>
                </pre>
              </div>
              <p className="prompt-section__help">{ui.result.promptHelp}</p>
            </section>

            <section className="handoff" id="handoff" aria-labelledby="handoff-title">
              <div className="block-head">
                <p className="section-index">{ui.handoff.eyebrow}</p>
                <h2 id="handoff-title">{ui.handoff.title}</h2>
                <p className="handoff__intro">{ui.handoff.intro}</p>
              </div>

              <div className="handoff-card">
                <div className="handoff-card__context">
                  <p className="handoff-card__label">{ui.handoff.includesLabel}</p>
                  <ul className="handoff-includes">
                    {ui.handoff.includes.map((item, index) => (
                      <li key={item}>
                        <span aria-hidden="true">0{index + 1}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="handoff-card__form">
                  <label className="field handoff-field" htmlFor="handoff-progress">
                    <span className="field__label">
                      {ui.handoff.progressLabel}
                      <span className="field__optional">{ui.wizard.optional}</span>
                    </span>
                    <textarea
                      id="handoff-progress"
                      value={progress}
                      onChange={(event) => setProgress(event.target.value)}
                      placeholder={ui.handoff.progressPlaceholder}
                      maxLength={4000}
                      rows={4}
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <span className="field__count">{progress.length} / 4000</span>
                  </label>
                  <p className="handoff__help">{ui.handoff.progressHelp}</p>
                  <p className="handoff__privacy">
                    <Icon name="lock" size={15} />
                    {ui.handoff.privacyNote}
                  </p>
                </div>
              </div>

              <div className="handoff-actions">
                <button type="button" className="button button--primary" onClick={handleCopyHandoff}>
                  <Icon name={handoffCopied ? 'check' : 'copy'} size={18} />
                  {handoffCopied ? ui.handoff.copied : ui.handoff.copy}
                </button>
                <button type="button" className="button button--ghost" onClick={handleDownload}>
                  <Icon name="arrowDown" size={18} />
                  {ui.handoff.download}
                </button>
                <p>{ui.handoff.previewHint}</p>
              </div>

              <details className="handoff-preview">
                <summary>
                  <span>{ui.handoff.preview}</span>
                  <span className="handoff-preview__meta">TXT ／ {handoffPrompt.length} CHARS</span>
                </summary>
                <pre tabIndex={0} aria-label={ui.handoff.preview}>
                  <code>{handoffPrompt}</code>
                </pre>
              </details>

              <p className="handoff__empty">{ui.handoff.emptyNote}</p>
            </section>

            <section className="traps" aria-labelledby="traps-title">
              <div className="block-head">
                <p className="section-index">WATCH OUT</p>
                <h2 id="traps-title">{ui.result.avoidTitle}</h2>
              </div>
              <ul className="traps-list">
                {painCopy.avoid.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">×</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="result-aside">
            <div className="action-card">
              <p className="action-card__label">NEXT ACTION</p>
              <h2>{ui.result.actionTitle}</h2>
              <div className="action-card__buttons">
                <button type="button" className="button button--primary button--full" onClick={handleCopy}>
                  <Icon name={copied ? 'check' : 'copy'} size={18} />
                  {copied ? ui.result.copied : ui.result.copy}
                </button>
                <button type="button" className="button button--ink button--full" onClick={handleShare}>
                  <Icon name="share" size={18} />
                  {ui.result.share}
                </button>
                <button type="button" className="button button--ghost button--full" onClick={() => window.print()}>
                  <Icon name="printer" size={18} />
                  {ui.result.print}
                </button>
              </div>
              <button type="button" className="action-card__jump" onClick={scrollToHandoff}>
                {ui.handoff.jump}
                <Icon name="arrowDown" size={15} />
              </button>
              <p className="action-card__hint">{ui.result.shareHint}</p>
            </div>

            <div className="tip-card">
              <span className="tip-card__icon">
                <Icon name="spark" size={19} />
              </span>
              <div>
                <p>{ui.result.taskNote}</p>
                <span>{goalCopy.tip}</span>
              </div>
            </div>

            <div className="aside-meta">
              <span>{ui.result.footNote}</span>
            </div>
          </aside>
        </div>

        <section className="related" aria-labelledby="related-title">
          <div className="block-head block-head--row">
            <div>
              <p className="section-index">KEEP GOING</p>
              <h2 id="related-title">{ui.result.relatedTitle}</h2>
            </div>
            <p>{ui.result.relatedHelp}</p>
          </div>
          <div className="related-grid">
            {painCopy.related.map((relatedId) => {
              const related = pains[relatedId];
              return (
                <a
                  className="related-card"
                  key={relatedId}
                  href={`#${buildResultPath(goal, relatedId, lang)}`}
                >
                  <span className="related-card__icon">
                    <Icon name={painIcons[relatedId]} size={22} />
                  </span>
                  <span>
                    <strong>{related.label}</strong>
                    <span>{related.shortLabel}</span>
                  </span>
                  <Icon name="arrowUpRight" size={18} />
                </a>
              );
            })}
            <button type="button" className="related-card related-card--restart" onClick={onRestart}>
              <span className="related-card__icon">
                <Icon name="loop" size={22} />
              </span>
              <span>
                <strong>{ui.result.restart}</strong>
                <span>{lang === 'zh' ? '從另一個任務或卡點開始' : 'Start from another task or block'}</span>
              </span>
              <Icon name="arrowRight" size={18} />
            </button>
          </div>
        </section>

        <div className="result-foot">
          <span>{ui.result.footNote}</span>
          <span>{ui.footer.rights}</span>
        </div>
      </div>

      <div className={`toast${notice ? ' is-visible' : ''}`} role="status" aria-live="polite">
        {notice}
      </div>
    </main>
  );
}
