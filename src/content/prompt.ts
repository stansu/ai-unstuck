import type { GoalCopy, Lang, PainCopy } from './types';

interface PromptInput {
  lang: Lang;
  goal: GoalCopy;
  pain: PainCopy;
  task?: string;
  tried?: string;
}

export interface HandoffInput extends PromptInput {
  progress?: string;
}

interface MarkdownInput extends HandoffInput {
  prompt: string;
  handoff: string;
  sourceUrl: string;
}

function clean(value: string | undefined): string {
  return value?.trim() ?? '';
}

function indentedCode(text: string): string {
  return text
    .split('\n')
    .map((line) => (line.length > 0 ? `    ${line}` : ''))
    .join('\n');
}

export function buildPrompt({ lang, goal, pain, task, tried }: PromptInput): string {
  const cleanTask = clean(task);
  const cleanTried = clean(tried);

  if (lang === 'zh') {
    return [
      `你是一位擅長${goal.role}的資深顧問。`,
      '',
      `我的任務：${cleanTask || goal.task}`,
      `我已經試過：${cleanTried || '還沒有具體嘗試。'}`,
      `我目前卡在：${pain.label}。`,
      '',
      '請先不要急著產出完整答案。依照以下規則協助我：',
      ...pain.promptRules.map((rule, index) => `${index + 1}. ${rule}`),
      '',
      `完成標準：${goal.output}`,
      '如果資訊不足，請先問我最多 3 個關鍵問題；不要自行假設。',
    ].join('\n');
  }

  return [
    `You are a senior consultant in ${goal.role}.`,
    '',
    `My task: ${cleanTask || goal.task}`,
    `What I've tried: ${cleanTried || 'Nothing concrete yet.'}`,
    `Where I'm stuck: ${pain.label}.`,
    '',
    'Do not produce the full answer immediately. Follow these rules:',
    ...pain.promptRules.map((rule, index) => `${index + 1}. ${rule}`),
    '',
    `Definition of done: ${goal.output}`,
    'If you need more information, ask up to three key questions first. Do not invent assumptions.',
  ].join('\n');
}

export function buildHandoffPrompt({ lang, goal, pain, task, tried, progress }: HandoffInput): string {
  const prompt = buildPrompt({ lang, goal, pain, task, tried });
  const cleanProgress = clean(progress);
  const steps = pain.steps
    .map((step, index) => `${index + 1}. ${step.title}\n   ${step.body}`)
    .join('\n');
  const traps = pain.avoid.map((item) => `- ${item}`).join('\n');

  if (lang === 'zh') {
    return [
      '你正在接手一個已經做過初步診斷的任務。請從現有脈絡繼續，不要從頭重問。',
      '',
      '## 先前給 AI 的起始提示詞',
      prompt,
      '',
      '## 目前已完成的診斷',
      steps,
      '',
      '## 要避免的雷',
      traps,
      '',
      '## 目前進展／新的 AI 回覆',
      cleanProgress || '目前還沒有新的進展；請直接從上面的診斷接續。',
      '',
      '## 請你接手',
      '1. 先用 3 句話總結你理解的任務、卡點與目前進展。',
      '2. 指出上述診斷中可能不適用、已過時或需要修正的地方。不要假設我已經完成所有步驟。',
      '3. 只問最多 2 個真正缺少的關鍵問題，不要一次丟出一長串。',
      '4. 等我回答後，給我一個最小可行的下一步，並說明完成標準。',
      '5. 不要重複我已經試過的建議；如果需要換方向，先說明為什麼與代價。',
    ].join('\n');
  }

  return [
    'You are taking over a task that has already received an initial diagnosis. Continue from the existing context; do not start over.',
    '',
    '## Starter prompt given to the previous AI',
    prompt,
    '',
    '## Diagnosis completed so far',
    steps,
    '',
    '## Traps to avoid',
    traps,
    '',
    '## Current progress / new AI response',
    cleanProgress || 'No new progress yet. Continue from the diagnosis above.',
    '',
    '## Your handoff instructions',
    '1. Summarize the task, the blocker and the current progress in three sentences.',
    '2. Point out anything in the diagnosis that may no longer fit, is outdated, or needs correction. Do not assume I completed every step.',
    '3. Ask at most two genuinely missing questions. Do not dump a long list.',
    '4. After I answer, give me one minimum viable next step and define what done looks like.',
    '5. Do not repeat advice I have already tried. If a change of direction is needed, explain why and what it costs.',
  ].join('\n');
}

export function buildDiagnosisMarkdown({
  lang,
  goal,
  pain,
  task,
  tried,
  progress,
  prompt,
  handoff,
  sourceUrl,
}: MarkdownInput): string {
  const cleanTask = clean(task);
  const cleanTried = clean(tried);
  const cleanProgress = clean(progress);

  if (lang === 'zh') {
    return [
      '# AI 解題室 · 診斷交接包',
      '',
      `> 任務：${goal.label}`,
      `> 卡點：${pain.label}`,
      `> 來源：${sourceUrl}`,
      '',
      '## 我的情境',
      cleanTask || goal.task,
      '',
      '## 我已經試過',
      cleanTried || '還沒有具體嘗試。',
      '',
      '## 一句話診斷',
      pain.summary,
      '',
      '## 三步行動',
      ...pain.steps.map((step, index) => `${index + 1}. **${step.title}**\n   ${step.body}`),
      '',
      '## 要避免的雷',
      ...pain.avoid.map((item) => `- ${item}`),
      '',
      '## 任務小抄',
      goal.tip,
      '',
      '## 起始提示詞',
      indentedCode(prompt),
      '',
      '## 目前進展',
      cleanProgress || '尚未填寫新的進展。',
      '',
      '## 接手提示詞（貼給下一個 AI）',
      indentedCode(handoff),
      '',
    ].join('\n');
  }

  return [
    '# AI Unstuck · Diagnosis Handoff',
    '',
    `> Task: ${goal.label}`,
    `> Blocker: ${pain.label}`,
    `> Source: ${sourceUrl}`,
    '',
    '## My situation',
    cleanTask || goal.task,
    '',
    "## What I've tried",
    cleanTried || 'Nothing concrete yet.',
    '',
    '## The diagnosis',
    pain.summary,
    '',
    '## Three-step plan',
    ...pain.steps.map((step, index) => `${index + 1}. **${step.title}**\n   ${step.body}`),
    '',
    '## Traps to avoid',
    ...pain.avoid.map((item) => `- ${item}`),
    '',
    '## Task note',
    goal.tip,
    '',
    '## Starter prompt',
    indentedCode(prompt),
    '',
    '## Current progress',
    cleanProgress || 'No new progress recorded yet.',
    '',
    '## Handoff prompt (paste into the next AI)',
    indentedCode(handoff),
    '',
  ].join('\n');
}
