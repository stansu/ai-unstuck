export type Lang = 'zh' | 'en';

export type GoalId = 'writing' | 'summarizing' | 'learning' | 'planning' | 'data';

export type PainId = 'unclear' | 'generic' | 'accuracy' | 'format' | 'loop' | 'privacy';

export interface Step {
  title: string;
  body: string;
}

export interface GoalCopy {
  label: string;
  shortLabel: string;
  blurb: string;
  role: string;
  task: string;
  output: string;
  tip: string;
}

export interface PainCopy {
  label: string;
  shortLabel: string;
  headline: string;
  summary: string;
  steps: [Step, Step, Step];
  promptRules: string[];
  avoid: string[];
  related: PainId[];
}

export interface UiCopy {
  langName: string;
  nav: {
    pains: string;
    how: string;
    start: string;
    language: string;
  };
  brand: {
    name: string;
    mark: string;
    tagline: string;
  };
  hero: {
    kicker: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    intro: string;
    cta: string;
    secondary: string;
    note: string;
    consoleLabel: string;
    consoleTitle: string;
    consoleOptions: [string, string, string];
    consoleFoot: string;
    annotation: string;
    chips: [string, string, string];
  };
  pains: {
    index: string;
    title: string;
    intro: string;
    cta: string;
  };
  how: {
    index: string;
    title: string;
    intro: string;
    steps: [Step, Step, Step];
  };
  manifesto: {
    kicker: string;
    title: string;
    body: string;
    quote: string;
  };
  footer: {
    note: string;
    made: string;
    rights: string;
  };
  wizard: {
    back: string;
    step: string;
    of: string;
    stepLabels: [string, string, string];
    step1Eyebrow: string;
    step1Title: string;
    step1Help: string;
    step2Eyebrow: string;
    step2Title: string;
    step2Help: string;
    step3Eyebrow: string;
    step3Title: string;
    step3Help: string;
    taskLabel: string;
    taskPlaceholder: string;
    triedLabel: string;
    triedPlaceholder: string;
    generate: string;
    selectedTask: string;
    selectedPain: string;
    change: string;
    optional: string;
    privacyNote: string;
  };
  result: {
    eyebrow: string;
    forLabel: string;
    taskLabel: string;
    painLabel: string;
    diagnosisLabel: string;
    playbookEyebrow: string;
    playbookTitle: string;
    promptEyebrow: string;
    promptTitle: string;
    promptHelp: string;
    copy: string;
    copied: string;
    copyFailed: string;
    share: string;
    shared: string;
    shareFailed: string;
    restart: string;
    print: string;
    avoidTitle: string;
    relatedTitle: string;
    relatedHelp: string;
    shareHint: string;
    customTask: string;
    defaultTask: string;
    notFound: string;
    home: string;
    footNote: string;
    stepWord: string;
    copyAria: string;
    actionTitle: string;
    taskNote: string;
    notFoundTitle: string;
  };
}

export interface SiteContent {
  goals: Record<GoalId, GoalCopy>;
  pains: Record<PainId, PainCopy>;
  ui: UiCopy;
}

export const GOAL_IDS: GoalId[] = ['writing', 'summarizing', 'learning', 'planning', 'data'];

export const PAIN_IDS: PainId[] = ['unclear', 'generic', 'accuracy', 'format', 'loop', 'privacy'];

export function isGoalId(value: string | null | undefined): value is GoalId {
  return value != null && (GOAL_IDS as string[]).includes(value);
}

export function isPainId(value: string | null | undefined): value is PainId {
  return value != null && (PAIN_IDS as string[]).includes(value);
}
