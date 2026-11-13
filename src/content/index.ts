import { en } from './en';
import { zh } from './zh';
import type { Lang, SiteContent } from './types';

export const siteContent: Record<Lang, SiteContent> = { zh, en };

export * from './types';
