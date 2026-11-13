import type { GoalId, PainId } from '../content/types';

export interface Draft {
  goal: GoalId;
  pain: PainId;
  task: string;
  tried: string;
}
