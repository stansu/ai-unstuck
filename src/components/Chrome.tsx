import type { Lang, UiCopy } from '../content/types';
import { Icon } from './Icons';

interface HeaderProps {
  lang: Lang;
  ui: UiCopy;
  onLangChange: (lang: Lang) => void;
  onStart: () => void;
  onGoSection: (id: 'pains' | 'how') => void;
  compact?: boolean;
}

export function Brand({ ui, tone = 'dark' }: { ui: UiCopy; tone?: 'dark' | 'light' }) {
  return (
    <span className={`brand brand--${tone}`}>
      <span className="brand__mark" aria-hidden="true">
        <span>{ui.brand.mark}</span>
        <i />
      </span>
      <span className="brand__words">
        <strong>{ui.brand.name}</strong>
        <small>{ui.brand.tagline}</small>
      </span>
    </span>
  );
}

export function Header({ lang, ui, onLangChange, onStart, onGoSection, compact = false }: HeaderProps) {
  return (
    <header className={`site-header${compact ? ' site-header--compact' : ''}`}>
      <div className="site-header__inner">
        <a className="brand-link" href="#/">
          <Brand ui={ui} />
        </a>

        {!compact && (
          <nav className="site-nav" aria-label={lang === 'zh' ? '主要導覽' : 'Main navigation'}>
            <button type="button" onClick={() => onGoSection('pains')}>
              {ui.nav.pains}
            </button>
            <button type="button" onClick={() => onGoSection('how')}>
              {ui.nav.how}
            </button>
          </nav>
        )}

        <div className="site-header__actions">
          <div className="lang-toggle" role="group" aria-label={ui.nav.language}>
            <button
              type="button"
              className={lang === 'zh' ? 'is-active' : ''}
              aria-pressed={lang === 'zh'}
              onClick={() => onLangChange('zh')}
            >
              <span aria-hidden="true">中</span>
              <span className="sr-only">{lang === 'zh' ? '中文' : 'Chinese'}</span>
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              className={lang === 'en' ? 'is-active' : ''}
              aria-pressed={lang === 'en'}
              onClick={() => onLangChange('en')}
            >
              <span aria-hidden="true">EN</span>
              <span className="sr-only">English</span>
            </button>
          </div>

          {compact ? (
            <a className="button button--small button--ghost" href="#/">
              {ui.result.home}
            </a>
          ) : (
            <button type="button" className="button button--small button--ink header-cta" onClick={onStart}>
              {ui.nav.start}
              <Icon name="arrowRight" size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({ ui, onStart }: { ui: UiCopy; onStart: () => void }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <Brand ui={ui} tone="light" />
          <p>{ui.footer.note}</p>
        </div>
        <button type="button" className="button button--paper" onClick={onStart}>
          {ui.nav.start}
          <Icon name="arrowUpRight" size={18} />
        </button>
      </div>
      <div className="site-footer__bottom">
        <span>{ui.footer.rights}</span>
        <span>{ui.footer.made}</span>
      </div>
    </footer>
  );
}
