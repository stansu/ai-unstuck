import type { SiteContent } from './types';

export const en: SiteContent = {
  goals: {
    writing: {
      label: 'Writing & communication',
      shortLabel: 'Writing',
      blurb: 'Emails, reports, copy and resumes—words that still sound like you.',
      role: 'business writing and communication',
      task: 'Write an email to my manager explaining a project delay and proposing a recovery plan',
      output:
        'Explain the current situation, cause, impact and next step—honest in tone, without being apologetic',
      tip: 'Give the AI a sample of your own writing first so it can match your voice.',
    },
    summarizing: {
      label: 'Summaries & synthesis',
      shortLabel: 'Summaries',
      blurb: 'Turn meeting notes, long articles and interviews into usable highlights.',
      role: 'information synthesis and summarization',
      task: 'Turn a 45-minute meeting transcript into highlights and action items for the team',
      output:
        'Start with a five-sentence summary, then list decisions, action items (owner / due date) and open questions',
      tip: 'Tell the AI who the reader is. That is how it knows what to leave out.',
    },
    learning: {
      label: 'Learning & explaining',
      shortLabel: 'Learning',
      blurb: 'Break down hard concepts and explain them at your level.',
      role: 'instructional design and knowledge translation',
      task: 'Explain retrieval-augmented generation (RAG) in a way I can actually understand',
      output:
        'Start with an everyday analogy, then a formal definition, common misconceptions and a short quiz',
      tip: 'Tell the AI your background so it does not explain one mystery with another.',
    },
    planning: {
      label: 'Planning & decisions',
      shortLabel: 'Planning',
      blurb: 'Turn fuzzy goals into milestones, options and a next step.',
      role: 'project planning and strategic thinking',
      task: 'Plan a four-week personal project where I can only invest five hours per week',
      output:
        'Show a week-by-week schedule, deliverables, risks and a fallback plan if I fall behind',
      tip: 'State the constraints clearly: time, budget and what cannot be compromised.',
    },
    data: {
      label: 'Data & spreadsheets',
      shortLabel: 'Data',
      blurb: 'Read the numbers, clean the sheet and let AI surface what matters.',
      role: 'data analysis and spreadsheets',
      task: 'Audit a monthly sales sheet, find anomalies and write a three-point summary for my manager',
      output:
        'Explain how you checked the data, list anomalies with possible causes, then give three findings and a recommendation',
      tip: 'Ask the AI to describe the columns and data range first. It catches misreads early.',
    },
  },
  pains: {
    unclear: {
      label: 'Can’t frame the ask',
      shortLabel: 'The AI doesn’t get what I want',
      headline: 'The AI isn’t the problem. Your brief is still too vague.',
      summary:
        'If you only say “make it better,” the model has to guess. Add the goal, audience, constraints and definition of done—and the answer often jumps a level.',
      steps: [
        {
          title: 'Define what “good” means',
          body: 'Write down what the finished work looks like: length, reader and what they should do next. “Professional” or “engaging” are not acceptance criteria.',
        },
        {
          title: 'Add three constraints',
          body: 'Word count, tone and anything that must not appear. Constraints are not handcuffs; they remove wrong turns.',
        },
        {
          title: 'Let the AI interview you',
          body: 'Start with “Ask me three questions that would improve the result.” Thirty seconds of answers often beats five rounds of edits.',
        },
      ],
      promptRules: [
        'Ask me three questions that would materially improve the result, one at a time.',
        'After I answer, show me a skeleton outline for approval before writing.',
        'If my brief contradicts itself, point it out instead of filling the gap yourself.',
      ],
      avoid: [
        'Saying “make it better” or “more professional” without defining what that means.',
        'Dropping ten requirements at once without saying which one matters most.',
        'Leaving out the audience, forcing the AI to guess who it is writing for.',
      ],
      related: ['generic', 'format'],
    },
    generic: {
      label: 'Answers feel generic',
      shortLabel: 'Correct but useless advice',
      headline: '“Be more specific” is a wish, not an instruction.',
      summary:
        'AI mirrors the level of abstraction in your question. Give it a broad topic and you get an answer that sounds right but could apply to anyone.',
      steps: [
        {
          title: 'Shrink the question to one real scene',
          body: 'Don’t ask “How can I be more productive?” Ask “How do I protect two hours of focus when Teams messages keep interrupting me?” Narrower questions produce answers that can land.',
        },
        {
          title: 'Force a trade-off',
          body: 'Add “Give me three options and explain why you rejected two others.” A recommendation without a trade-off is just a list.',
        },
        {
          title: 'Demand one action for today',
          body: 'Ask for the first 15-minute step, not a beautiful list that never leaves the page.',
        },
      ],
      promptRules: [
        'Do not give generic advice. Every recommendation must include: the concrete action, expected effect and possible downside.',
        'Give at least three competing options and explain when each one is the right choice.',
        'End with exactly one 15-minute action I can start today.',
      ],
      avoid: [
        'Asking a context-free question like “How can I be more efficient?”',
        'Feeling satisfied by a long list without asking for priorities.',
        'Leaving out your constraints, which leaves the AI with only averages.',
      ],
      related: ['unclear', 'loop'],
    },
    accuracy: {
      label: 'Can’t trust the facts',
      shortLabel: 'Not sure if it’s true',
      headline: 'Confidence is not correctness.',
      summary:
        'Language models are good at producing things that sound true, not at guaranteeing truth. Treat the AI like a capable intern: let it draft, but verify the facts together.',
      steps: [
        {
          title: 'Ask how sure it is',
          body: 'Have it label confidence and evidence for each factual claim. You are not worshipping the score; you are making uncertainty visible.',
        },
        {
          title: 'Make verification part of the task',
          body: 'Require clickable primary sources—official docs, papers, original data—not “studies show.”',
        },
        {
          title: 'Try to break the answer',
          body: 'Paste it into another model or search engine and ask “What could be wrong here?” Adversarial checking beats asking the same model again.',
        },
      ],
      promptRules: [
        'For every factual claim, label confidence as [high / medium / low] and explain the basis.',
        'Do not invent sources. If you cannot verify something, say “unverified” and name the official source I should check.',
        'End by listing the three places you are most likely to be wrong so I can verify them first.',
      ],
      avoid: [
        'Treating the AI as a search engine and trusting any citation it offers.',
        'Deciding after a single answer without cross-checking.',
        'Demanding “you must give me an answer,” which encourages fabrication.',
      ],
      related: ['unclear', 'loop'],
    },
    format: {
      label: 'The format keeps missing',
      shortLabel: 'Output doesn’t look right',
      headline: 'The AI cannot see the format in your head.',
      summary:
        'Format is a hidden specification. You have a table in mind; the AI sees only words. Hand over an example, the fields and the prohibitions—it beats describing it ten times.',
      steps: [
        {
          title: 'Give a tiny example',
          body: 'Paste three lines that look right. That beats ten sentences describing “a formal report.”',
        },
        {
          title: 'Turn the format into a checklist',
          body: 'Columns, order, length, tone, punctuation, headings. Write it as a checklist the model can tick off.',
        },
        {
          title: 'Approve the skeleton first',
          body: 'Ask for an empty table or outline, confirm the structure, then fill it in. Don’t generate the whole thing and rebuild.',
        },
      ],
      promptRules: [
        'Follow the example format exactly. Do not add or remove fields on your own.',
        'First return only the skeleton and field names. Wait for my approval before filling in content.',
        'If a field lacks information, write “to be confirmed.” Do not invent it.',
      ],
      avoid: [
        'Saying “more formal” or “more concise” without an example.',
        'Asking for content and format in one pass, then having to fix both.',
        'Failing to say which fields must never change.',
      ],
      related: ['unclear', 'loop'],
    },
    loop: {
      label: 'Going in circles',
      shortLabel: 'Endless edits, no progress',
      headline: 'You’re not being difficult. The conversation is lost.',
      summary:
        'The longer a thread gets, the more the AI clings to earlier mistakes. Instead of circling, reset, change the angle and ask it to diagnose the problem first.',
      steps: [
        {
          title: 'Stop before you edit again',
          body: 'Compress what you have, what is wrong and what must stay into five lines. That forces you out of the weeds and back to the real blocker.',
        },
        {
          title: 'Change the angle, not just the wording',
          body: 'Ask for an opponent’s view, five whys or three genuinely different approaches. “Try again” is not a method.',
        },
        {
          title: 'Open a clean thread',
          body: 'Paste the five-line brief and new instruction into a new chat. Old context often carries more baggage than the problem itself.',
        },
      ],
      promptRules: [
        'Do not rewrite yet. In five lines, summarize what you actually understand and what you think I am really unhappy with.',
        'Propose three genuinely different approaches, not rephrasings of the same one.',
        'Once we pick a direction, give me a minimum viable version so I can decide quickly whether to continue.',
      ],
      avoid: [
        'Repeating “no, change it again” in the same thread.',
        'Saying you are unhappy without pointing to the sentence or judgment that is wrong.',
        'Changing too many variables at once, so you cannot tell what worked.',
      ],
      related: ['generic', 'format'],
    },
    privacy: {
      label: 'Afraid to share data',
      shortLabel: 'Want to use AI, but worried about leaks',
      headline: 'You don’t have to paste the whole contract to ask a good question.',
      summary:
        'The real question is not “can we use AI?” but “which data, sent where, retained for how long?” Strip the identifiers first, then talk about speed.',
      steps: [
        {
          title: 'Classify before you share',
          body: 'Sort information into public, internal and confidential. Public data can be used as-is, internal data should be de-identified, and confidential data should stay out of unapproved tools.',
        },
        {
          title: 'De-identify the relationships, not just the names',
          body: 'Remove names, companies, clients, amounts, addresses, project codes and combinations that can re-identify someone. Keep the structure; change the specifics.',
        },
        {
          title: 'Check the policy and the plan',
          body: 'Read your company’s AI policy and the tool’s data-training settings. Don’t use a personal account for company data—or assume free and enterprise plans behave the same.',
        },
      ],
      promptRules: [
        'I will only provide de-identified data. Do not ask me to add names, companies, clients or anything that identifies a person.',
        'If the task needs more sensitive information, explain why first and offer an alternative that does not require real data.',
        'Use abstract labels such as “Client A” and “Project X.” Do not reconstruct or guess real identities in the output.',
      ],
      avoid: [
        'Pasting customer lists, contracts or financials straight into a free-tier tool.',
        'Changing only the names while leaving addresses and amounts untouched.',
        'Using a personal account to process internal company data.',
      ],
      related: ['accuracy', 'unclear'],
    },
  },
  ui: {
    langName: 'English',
    nav: {
      pains: 'Common blocks',
      how: 'How it works',
      start: 'Start diagnosis',
      language: 'Switch language',
    },
    brand: {
      name: 'AI Unstuck',
      mark: 'U',
      tagline: 'A field guide for everyday AI users',
    },
    hero: {
      kicker: 'AI FIELD GUIDE ／ FOR PEOPLE WHO USE AI EVERY DAY',
      titleLead: 'When AI gets stuck,',
      titleAccent: 'don’t rush to',
      titleTail: 'switch tools.',
      intro:
        'The problem is rarely that the model isn’t smart enough. It’s that the brief is fuzzy. Take a 60-second diagnosis and leave with a next step you can use immediately.',
      cta: 'Start the 60-second diagnosis',
      secondary: 'Browse the 6 common blocks',
      note: 'No sign-up · Nothing uploaded · Bilingual',
      consoleLabel: 'DIAGNOSTIC ／ 001',
      consoleTitle: 'Where are you stuck?',
      consoleOptions: ['I can’t frame the ask', 'The answer is generic', 'I can’t trust the facts'],
      consoleFoot: 'Pick one to break it down',
      annotation: 'You don’t need a better AI.\nYou need a better brief.',
      chips: ['5 tasks', '6 blockers', '30 diagnostic paths'],
    },
    pains: {
      index: '01 ／ COMMON BLOCKS',
      title: 'Name the block first.',
      intro:
        'Most AI frustration isn’t “the tool is bad.” It is one of these six situations. Pick one and start where it actually hurts.',
      cta: 'Start here',
    },
    how: {
      index: '02 ／ HOW IT WORKS',
      title: 'Not more prompts. A clearer brief.',
      intro: 'Three steps. No account, no API key.',
      steps: [
        {
          title: 'Pick a task',
          body: 'What are you trying to finish? Writing, summarizing, learning, planning or working with data?',
        },
        {
          title: 'Pick the block',
          body: 'The AI doesn’t get it, the answer is generic, the facts are shaky, or the format keeps missing?',
        },
        {
          title: 'Leave with a next step',
          body: 'Get three concrete moves, a prompt you can copy, and the traps to avoid—then take a handoff pack to another model if needed.',
        },
      ],
    },
    manifesto: {
      kicker: '03 ／ WHAT WE BELIEVE',
      title: 'AI is not a wishing well. It’s a colleague who needs a brief.',
      body: 'Instead of memorizing a hundred magic prompts, learn to state the goal, audience, constraints and definition of done. This works with ChatGPT, Claude, Gemini and whatever arrives next.',
      quote: 'Ask a better question first. Then the answer has a chance.',
    },
    footer: {
      note: 'Runs entirely in your browser. No API key required. Your input is never sent to or stored on a server.',
      made: 'Made for curious humans.',
      rights: 'AI Unstuck · Free to use and share',
    },
    wizard: {
      back: 'Back',
      step: 'Step',
      of: '/',
      stepLabels: ['Task', 'Block', 'Context'],
      step1Eyebrow: 'Define the task',
      step1Title: 'What are you trying to get done?',
      step1Help: 'Pick the closest one. You can change it later.',
      step2Eyebrow: 'Locate the block',
      step2Title: 'Which sentence sounds most like you?',
      step2Help: 'Don’t pick the “correct” one. Pick the one that annoys you most.',
      step3Eyebrow: 'Add a little context',
      step3Title: 'Make the advice fit your situation.',
      step3Help:
        'Optional. Do not paste confidential, personal or internal company data; you can still get a complete result with this blank.',
      taskLabel: 'What are you working on?',
      taskPlaceholder: 'e.g. Write an email to my manager explaining a project delay',
      triedLabel: 'What have you already tried?',
      triedPlaceholder: 'e.g. I asked for more specifics, but it still sounds generic',
      generate: 'Generate my diagnosis',
      selectedTask: 'Task',
      selectedPain: 'Block',
      change: 'Change',
      optional: 'Optional',
      privacyNote: 'Stays in this tab. Nothing is uploaded.',
    },
    handoff: {
      eyebrow: 'AI HANDOFF ／ CONTINUATION PACK',
      title: 'Let the next AI pick up from here.',
      intro:
        'Package the task, blocker, three-step plan, starter prompt and your latest progress into one pasted thread. Switch models without explaining everything again.',
      includesLabel: 'The pack includes',
      includes: ['Task & blocker', 'Playbook & traps', 'Starter prompt', 'Your latest progress'],
      progressLabel: 'Current progress or AI response',
      progressPlaceholder:
        'e.g. I tried step one, but it still gave generic advice. Here is its last response…',
      progressHelp: 'Paste the reply you received, where you are stuck, or what you want to ask next.',
      privacyNote: 'Stays in this tab. It is never added to the share link or uploaded.',
      copy: 'Copy handoff pack',
      copied: 'Handoff copied',
      download: 'Download Markdown',
      downloaded: 'Markdown downloaded',
      preview: 'Preview handoff prompt',
      previewHint: 'Paste it into a new chat with ChatGPT, Claude, Gemini or any other model.',
      emptyNote: 'No progress yet? The pack will ask the next AI to continue from the diagnosis above.',
      jump: 'Switching models? Use the handoff pack',
      copyAria: 'Copy the AI handoff pack to clipboard',
    },
    result: {
      eyebrow: 'YOUR DIAGNOSIS ／ DIAGNOSTIC 001',
      forLabel: 'For',
      taskLabel: 'Task',
      painLabel: 'Block',
      diagnosisLabel: 'The diagnosis',
      playbookEyebrow: 'THE PLAYBOOK',
      playbookTitle: 'Do these three things first',
      promptEyebrow: 'COPY & PASTE',
      promptTitle: 'Paste this into your AI',
      promptHelp:
        'Assembled from your task and block. Before sending, replace the example task and the “what I’ve tried” line with your real details. If the AI is still stuck, use the handoff pack below with another model.',
      copy: 'Copy prompt',
      copied: 'Copied',
      copyFailed: 'Copy failed. Please select the text manually.',
      share: 'Share this diagnosis',
      shared: 'Link copied',
      shareFailed: 'Could not copy automatically. Please copy the URL manually.',
      restart: 'Start over',
      print: 'Print / save as PDF',
      avoidTitle: 'The traps to avoid',
      relatedTitle: 'Next, you might also look at',
      relatedHelp: 'Same task, a different way to get stuck.',
      shareHint: 'The shared link contains only your task and block—not the text you typed.',
      customTask: 'Your description',
      defaultTask: 'Default example',
      notFound: 'We couldn’t find that diagnosis. Just pick again.',
      home: 'Back home',
      footNote:
        'This is a static guide. It does not connect to an AI model; everything is generated in your browser.',
      stepWord: 'Step',
      copyAria: 'Copy prompt to clipboard',
      actionTitle: 'Turn this page into progress.',
      taskNote: 'TASK NOTE',
      notFoundTitle: 'This page is not in the guide.',
    },
  },
};
