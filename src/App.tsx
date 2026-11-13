import { useEffect, useState } from 'react';
import { Header } from './components/Chrome';
import { siteContent } from './content';
import { isGoalId, isPainId, type GoalId, type Lang, type PainId } from './content/types';
import type { Draft } from './lib/draft';
import { buildResultPath, navigate, parseRoute, readLangParam, useHashRoute } from './lib/router';
import { Home } from './pages/Home';
import { Result } from './pages/Result';
import { Wizard } from './pages/Wizard';

function detectLanguage(): Lang {
  const route = parseRoute(window.location.hash);
  const fromUrl = readLangParam(route.params);
  if (fromUrl) return fromUrl;

  try {
    const stored = window.localStorage.getItem('ai-unstuck-lang');
    if (stored === 'zh' || stored === 'en') return stored;
  } catch {
    // Storage can be unavailable in private or restricted contexts.
  }

  return window.navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

function validRelated(value: string | null): PainId | null {
  return isPainId(value) ? value : null;
}

function readSavedDraft(): Draft | null {
  try {
    const raw = window.sessionStorage.getItem('ai-unstuck-draft');
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object') return null;
    const record = value as Record<string, unknown>;
    const goalValue = typeof record.goal === 'string' ? record.goal : null;
    const painValue = typeof record.pain === 'string' ? record.pain : null;
    if (!isGoalId(goalValue) || !isPainId(painValue)) return null;
    return {
      goal: goalValue,
      pain: painValue,
      task: typeof record.task === 'string' ? record.task : '',
      tried: typeof record.tried === 'string' ? record.tried : '',
    };
  } catch {
    return null;
  }
}

function saveDraft(draft: Draft | null): void {
  try {
    if (draft) {
      window.sessionStorage.setItem('ai-unstuck-draft', JSON.stringify(draft));
    } else {
      window.sessionStorage.removeItem('ai-unstuck-draft');
    }
  } catch {
    // The diagnosis still works if storage is unavailable.
  }
}

export default function App() {
  const route = useHashRoute();
  const [lang, setLang] = useState<Lang>(detectLanguage);
  const [draft, setDraft] = useState<Draft | null>(readSavedDraft);
  const [pendingSection, setPendingSection] = useState<'pains' | 'how' | null>(null);
  const content = siteContent[lang];
  const ui = content.ui;

  const goalParam = route.name === 'result' ? route.params.get('goal') : null;
  const painParam = route.name === 'result' ? route.params.get('pain') : null;
  const goal: GoalId | null = isGoalId(goalParam) ? goalParam : null;
  const pain: PainId | null = isPainId(painParam) ? painParam : null;

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
    try {
      window.localStorage.setItem('ai-unstuck-lang', lang);
    } catch {
      // Ignore storage failures; language still works for this session.
    }
  }, [lang]);

  // A shared `?lang=` link should switch the UI even when it is opened as a
  // same-document hash navigation. Only react to route changes, not to the
  // language toggle (which rewrites the URL without changing the route state).
  useEffect(() => {
    const fromUrl = readLangParam(route.params);
    if (fromUrl) {
      setLang((current) => (current === fromUrl ? current : fromUrl));
    }
  }, [route]);

  useEffect(() => {
    if (route.name === 'home') {
      document.title =
        lang === 'zh' ? 'AI 解題室 · 卡住的時候，先別急著換一個 AI' : 'AI Unstuck · A field guide for everyday AI users';
    } else if (route.name === 'wizard') {
      document.title = lang === 'zh' ? `開始診斷 · ${ui.brand.name}` : `Start diagnosis · ${ui.brand.name}`;
    } else if (route.name === 'notFound' || (route.name === 'result' && (!goal || !pain))) {
      document.title = `${ui.result.notFoundTitle} · ${ui.brand.name}`;
    }
  }, [route, lang, ui.brand.name, goal, pain]);

  useEffect(() => {
    if (!pendingSection || route.name !== 'home') return;
    const timer = window.setTimeout(() => {
      const element = document.getElementById(pendingSection);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      setPendingSection(null);
    }, 80);
    return () => window.clearTimeout(timer);
  }, [pendingSection, route.name]);

  function startWizard(painId?: PainId) {
    setDraft(null);
    saveDraft(null);
    navigate(`/start${painId ? `?pain=${painId}` : ''}`);
  }

  function completeWizard(nextDraft: Draft) {
    setDraft(nextDraft);
    saveDraft(nextDraft);
    navigate(buildResultPath(nextDraft.goal, nextDraft.pain, lang));
  }

  function changeLanguage(nextLang: Lang) {
    setLang(nextLang);
    if (route.name === 'result' && goal && pain) {
      const nextPath = buildResultPath(goal, pain, nextLang);
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${nextPath}`);
    }
  }

  function goSection(section: 'pains' | 'how') {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (route.name === 'home') {
      document.getElementById(section)?.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      return;
    }
    setPendingSection(section);
    navigate('/');
  }

  return (
    <div className="app-shell">
      <button
        type="button"
        className="skip-link"
        onClick={() => document.getElementById('main')?.focus()}
      >
        {lang === 'zh' ? '跳至主要內容' : 'Skip to content'}
      </button>

      <Header
        lang={lang}
        ui={ui}
        onLangChange={changeLanguage}
        onStart={() => startWizard()}
        onGoSection={goSection}
        compact={route.name !== 'home'}
      />

      {route.name === 'home' && (
        <Home
          lang={lang}
          content={content}
          onStart={() => startWizard()}
          onPain={(painId) => startWizard(painId)}
        />
      )}

      {route.name === 'wizard' && (
        <Wizard
          key={route.params.toString() || 'start'}
          content={content}
          initialPain={validRelated(route.params.get('pain'))}
          onComplete={completeWizard}
          onExit={() => navigate('/')}
        />
      )}

      {route.name === 'result' && (
        <Result
          key={`${goal ?? 'none'}-${pain ?? 'none'}`}
          lang={lang}
          content={content}
          goal={goal}
          pain={pain}
          draft={draft}
          onRestart={() => startWizard()}
          onHome={() => navigate('/')}
        />
      )}

      {route.name === 'notFound' && (
        <main id="main" className="notfound" tabIndex={-1}>
          <p className="eyebrow">404 ／ NOT FOUND</p>
          <h1>{ui.result.notFoundTitle}</h1>
          <div className="notfound__actions">
            <button type="button" className="button button--primary" onClick={() => navigate('/')}>
              {ui.result.home}
            </button>
            <button type="button" className="button button--ghost" onClick={() => startWizard()}>
              {ui.nav.start}
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
