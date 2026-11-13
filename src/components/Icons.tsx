import type { SVGProps } from 'react';
import type { GoalId, PainId } from '../content/types';

export type IconName =
  | 'arrowRight'
  | 'arrowUpRight'
  | 'arrowDown'
  | 'chevronLeft'
  | 'question'
  | 'waves'
  | 'shield'
  | 'layout'
  | 'loop'
  | 'lock'
  | 'pen'
  | 'layers'
  | 'bulb'
  | 'map'
  | 'grid'
  | 'globe'
  | 'check'
  | 'copy'
  | 'share'
  | 'printer'
  | 'spark';

const paths: Record<IconName, React.ReactNode> = {
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </>
  ),
  arrowDown: (
    <>
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </>
  ),
  chevronLeft: <path d="m14 6-6 6 6 6" />,
  question: (
    <>
      <path d="M9.2 9a3.1 3.1 0 1 1 4.9 2.5c-1.2.8-2.1 1.5-2.1 3" />
      <path d="M12 18h.01" />
      <circle cx="12" cy="12" r="9" />
    </>
  ),
  waves: (
    <>
      <path d="M4 8h16" />
      <path d="M4 12h10" />
      <path d="M4 16h13" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 4.4 2.9 7.7 7 9 4.1-1.3 7-4.6 7-9V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  layout: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 9v11" />
    </>
  ),
  loop: (
    <>
      <path d="M20 7h-5V2" />
      <path d="M20 7a9 9 0 1 0 1 5" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14v3" />
    </>
  ),
  pen: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M8.2 14.8A7 7 0 1 1 15.8 14.8C15 15.5 15 16.5 15 18H9c0-1.5 0-2.5-.8-3.2Z" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.5 3.7 5.6 3.7 9S14.5 18.5 12 21c-2.5-2.5-3.7-5.6-3.7-9S9.5 5.5 12 3Z" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  copy: (
    <>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4" />
      <path d="m8.6 13.5 6.8 4" />
    </>
  ),
  printer: (
    <>
      <path d="M7 8V3h10v5" />
      <rect x="4" y="8" width="16" height="9" rx="2" />
      <path d="M7 14h10v7H7z" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2v5" />
      <path d="M12 17v5" />
      <path d="M2 12h5" />
      <path d="M17 12h5" />
      <path d="m5 5 3.5 3.5" />
      <path d="m15.5 15.5 3.5 3.5" />
      <path d="m19 5-3.5 3.5" />
      <path d="m8.5 15.5-3.5 3.5" />
    </>
  ),
};

export const goalIcons: Record<GoalId, IconName> = {
  writing: 'pen',
  summarizing: 'layers',
  learning: 'bulb',
  planning: 'map',
  data: 'grid',
};

export const painIcons: Record<PainId, IconName> = {
  unclear: 'question',
  generic: 'waves',
  accuracy: 'shield',
  format: 'layout',
  loop: 'loop',
  privacy: 'lock',
};

export function Icon({
  name,
  size = 24,
  ...props
}: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
