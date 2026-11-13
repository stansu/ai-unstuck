import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home'; params: URLSearchParams }
  | { name: 'wizard'; params: URLSearchParams }
  | { name: 'result'; params: URLSearchParams }
  | { name: 'notFound'; params: URLSearchParams };

export function parseRoute(hash: string): Route {
  const raw = hash.replace(/^#/, '');
  const [pathPart = '/', queryPart = ''] = raw.split('?');
  const params = new URLSearchParams(queryPart);
  const path = pathPart.replace(/\/+$/, '') || '/';

  if (path === '/' || path === '') return { name: 'home', params };
  if (path === '/start') return { name: 'wizard', params };
  if (path === '/result') return { name: 'result', params };
  return { name: 'notFound', params };
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onChange = () => {
      setRoute(parseRoute(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export function navigate(path: string): void {
  const next = path.startsWith('#') ? path : `#${path.startsWith('/') ? '' : '/'}${path}`;
  if (window.location.hash === next) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    window.location.hash = next;
  }
}

export function buildResultPath(
  goal: string,
  pain: string,
  lang: string,
  options: { includeLang?: boolean } = {},
): string {
  const params = new URLSearchParams({ goal, pain });
  if (options.includeLang ?? true) params.set('lang', lang);
  return `/result?${params.toString()}`;
}

export function readLangParam(params: URLSearchParams): 'zh' | 'en' | null {
  const value = params.get('lang');
  return value === 'zh' || value === 'en' ? value : null;
}
