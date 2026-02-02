import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface TesslStatus {
  installed: boolean;
  authenticated: boolean;
  username?: string;
}

export interface SkillEval {
  skillName: string;
  score?: number;
  lift?: number;
  hasEval: boolean;
}

// Hardcoded scores from Tessl research (fallback)
const KNOWN_EVAL_SCORES: Record<string, { score: number; lift: number }> = {
  'agent-browser': { score: 71, lift: 42.5 },
  'remotion-best-practices': { score: 100, lift: 25.5 },
  'remotion': { score: 100, lift: 25.5 },
  'frontend-design': { score: 90.3, lift: 24.6 },
  'vercel-react-best-practices': { score: 78.5, lift: 16.5 },
  'karpathy-guidelines': { score: 88.3, lift: -3.5 }, // NEGATIVE!
};

export async function checkTesslStatus(): Promise<TesslStatus> {
  // Check if CLI is installed
  try {
    await execAsync('tessl --version');
  } catch {
    return { installed: false, authenticated: false };
  }

  // Check if user is authenticated
  try {
    const { stdout } = await execAsync('tessl whoami');
    const username = stdout.trim();
    return { installed: true, authenticated: true, username };
  } catch {
    return { installed: true, authenticated: false };
  }
}

export async function runTesslLogin(): Promise<boolean> {
  try {
    await execAsync('tessl login');
    return true;
  } catch {
    return false;
  }
}

export function getKnownEvalScore(skillName: string): SkillEval {
  const known = KNOWN_EVAL_SCORES[skillName];
  if (known) {
    return {
      skillName,
      score: known.score,
      lift: known.lift,
      hasEval: true,
    };
  }
  return {
    skillName,
    hasEval: false,
  };
}

export async function getSkillEval(skillName: string): Promise<SkillEval> {
  // Use hardcoded scores as primary source
  return getKnownEvalScore(skillName);
}

// Get eval scores for multiple skills
export async function getSkillEvals(skillNames: string[]): Promise<Record<string, SkillEval>> {
  const evals: Record<string, SkillEval> = {};
  for (const name of skillNames) {
    evals[name] = await getSkillEval(name);
  }
  return evals;
}
