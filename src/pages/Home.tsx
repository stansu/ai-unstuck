import { useEffect, type CSSProperties } from 'react';
import type { Lang, PainId, SiteContent } from '../content/types';
import { GOAL_IDS, PAIN_IDS } from '../content/types';
import { goalIcons, Icon, painIcons } from '../components/Icons';
import { SiteFooter } from '../components/Chrome';

interface HomeProps {
  lang: Lang;
  content: SiteContent;
  onStart: () => void;
  onPain: (pain: PainId) => void;
}

function useReveal() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

const consolePains: [PainId, PainId, PainId] = ['unclear', 'generic', 'accuracy'];

export function Home({ lang, content, onStart, onPain }: HomeProps) {
  useReveal();
  const { ui, goals, pains } = content;
  const dirLabel = lang === 'zh' ? '任務 → 卡點 → 下一步' : 'TASK → BLOCK → NEXT STEP';

  return (
    <>
      <main id="main" tabIndex={-1}>
        <section className="hero">
          <div className="hero__copy">
            <p className="eyebrow hero__eyebrow">
              <span className="eyebrow__dot" aria-hidden="true" />
              {ui.hero.kicker}
            </p>
            <h1 className="hero__title">
              <span>{ui.hero.titleLead}</span>
              <span className="hero__title-accent">
                <em>{ui.hero.titleAccent}</em>
              </span>
              <span>{ui.hero.titleTail}</span>
            </h1>
            <p className="hero__intro">{ui.hero.intro}</p>
            <div className="hero__actions">
              <button type="button" className="button button--primary button--large" onClick={onStart}>
                {ui.hero.cta}
                <Icon name="arrowRight" size={20} />
              </button>
              <button
                type="button"
                className="text-link"
                onClick={() => document.getElementById('pains')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                {ui.hero.secondary}
                <span aria-hidden="true">↓</span>
              </button>
            </div>
            <p className="hero__note">
              <Icon name="check" size={15} />
              {ui.hero.note}
            </p>
          </div>

          <div className="hero__visual">
            <div className="hero__visual-grid" aria-hidden="true" />
            <div className="console-card">
              <div className="console-card__bar">
                <span>{ui.hero.consoleLabel}</span>
                <span className="console-card__lights" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <div className="console-card__body">
                <p className="console-card__kicker">{dirLabel}</p>
                <h2>{ui.hero.consoleTitle}</h2>
                <div className="console-card__options">
                  {consolePains.map((painId, index) => (
                    <button type="button" key={painId} onClick={() => onPain(painId)}>
                      <span className="console-card__option-index">0{index + 1}</span>
                      <span>{ui.hero.consoleOptions[index]}</span>
                      <Icon name="arrowRight" size={17} />
                    </button>
                  ))}
                </div>
                <button type="button" className="console-card__foot" onClick={onStart}>
                  {ui.hero.consoleFoot}
                  <Icon name="arrowUpRight" size={17} />
                </button>
              </div>
            </div>

            <div className="hero__annotation">
              <Icon name="spark" size={18} />
              <p>
                {ui.hero.annotation.split('\n').map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>
            <div className="hero__sticker" aria-hidden="true">
              <span>60</span>
              <small>SEC</small>
            </div>
          </div>
        </section>

        <div className="stat-strip" aria-label={ui.hero.chips.join(' / ')}>
          <div className="stat-strip__inner">
            <span className="stat-strip__label">{ui.hero.chips[0]}</span>
            <i aria-hidden="true" />
            <span className="stat-strip__label">{ui.hero.chips[1]}</span>
            <i aria-hidden="true" />
            <span className="stat-strip__label">{ui.hero.chips[2]}</span>
            <span className="stat-strip__tag">{dirLabel}</span>
          </div>
        </div>

        <section className="section section--pains" id="pains">
          <div className="section-head" data-reveal>
            <p className="section-index">{ui.pains.index}</p>
            <div className="section-head__copy">
              <h2>{ui.pains.title}</h2>
              <p>{ui.pains.intro}</p>
            </div>
          </div>

          <div className="pain-grid">
            {PAIN_IDS.map((painId, index) => {
              const pain = pains[painId];
              return (
                <button
                  type="button"
                  className={`pain-card pain-card--${painId}`}
                  key={painId}
                  onClick={() => onPain(painId)}
                  data-reveal
                  style={{ '--delay': `${index * 55}ms` } as CSSProperties}
                >
                  <span className="pain-card__top">
                    <span className="pain-card__num">{String(index + 1).padStart(2, '0')}</span>
                    <span className="pain-card__icon">
                      <Icon name={painIcons[painId]} size={23} />
                    </span>
                  </span>
                  <span className="pain-card__body">
                    <strong>{pain.label}</strong>
                    <span>{pain.shortLabel}</span>
                  </span>
                  <span className="pain-card__cta">
                    {ui.pains.cta}
                    <Icon name="arrowUpRight" size={18} />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="section section--how" id="how">
          <div className="section-head" data-reveal>
            <p className="section-index">{ui.how.index}</p>
            <div className="section-head__copy">
              <h2>{ui.how.title}</h2>
              <p>{ui.how.intro}</p>
            </div>
          </div>

          <div className="how-grid">
            {ui.how.steps.map((step, index) => (
              <article className="how-card" key={step.title} data-reveal style={{ '--delay': `${index * 80}ms` } as CSSProperties}>
                <span className="how-card__num" aria-hidden="true">
                  0{index + 1}
                </span>
                <div className="how-card__line" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <div className="goal-strip" data-reveal>
            <p>{lang === 'zh' ? '可以處理的任務' : 'Tasks you can bring'}</p>
            <div>
              {GOAL_IDS.map((goalId) => (
                <span key={goalId}>
                  <Icon name={goalIcons[goalId]} size={16} />
                  {goals[goalId].shortLabel}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="manifesto" data-reveal>
          <div className="manifesto__stamp" aria-hidden="true">
            <span>ASK</span>
            <span>BETTER</span>
            <span>THEN</span>
            <span>ANSWER</span>
          </div>
          <div className="manifesto__copy">
            <p className="section-index section-index--light">{ui.manifesto.kicker}</p>
            <h2>{ui.manifesto.title}</h2>
            <p className="manifesto__body">{ui.manifesto.body}</p>
            <blockquote>{ui.manifesto.quote}</blockquote>
          </div>
          <div className="manifesto__side" aria-hidden="true">
            <span>CHATGPT</span>
            <span>CLAUDE</span>
            <span>GEMINI</span>
            <i />
          </div>
        </section>
      </main>

      <SiteFooter ui={ui} onStart={onStart} />
    </>
  );
}
