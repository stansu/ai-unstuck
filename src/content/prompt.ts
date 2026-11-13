import type { GoalCopy, Lang, PainCopy } from './types';

interface PromptInput {
  lang: Lang;
  goal: GoalCopy;
  pain: PainCopy;
  task?: string;
  tried?: string;
}

export function buildPrompt({ lang, goal, pain, task, tried }: PromptInput): string {
  const cleanTask = task?.trim();
  const cleanTried = tried?.trim();

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
