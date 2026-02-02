import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface SkillEval {
  skillName: string;
  reviewScore: number | null;
  hasEval: boolean;
  source: string | null;
}

// Known review scores from tessl.io (fallback when CLI unavailable)
const KNOWN_REVIEW_SCORES: Record<string, number> = {
  'frontend-design': 64,
  'karpathy-guidelines': 86,
  'remotion-best-practices': 78,
  'remotion': 78,
  'vercel-react-best-practices': 72,
  'agent-browser': 71,
  'expo-guidelines': 82,
  'react-native-skills': 75,
};

// Cache to avoid repeated lookups
const evalCache: Map<string, SkillEval> = new Map();

/**
 * Fetch review score for a skill using tessl CLI
 * Falls back to known scores if CLI not available
 */
export async function fetchSkillEval(skillName: string): Promise<SkillEval> {
  // Check cache first
  if (evalCache.has(skillName)) {
    return evalCache.get(skillName)!;
  }

  try {
    // Try tessl CLI search
    const { stdout } = await execAsync(`tessl search "${skillName}" --json`, {
      timeout: 10000,
    });

    const results = JSON.parse(stdout);

    // Find exact or close match
    if (results && Array.isArray(results) && results.length > 0) {
      // Look for exact name match first
      const exactMatch = results.find(
        (r: any) => r.name === skillName || r.slug === skillName
      );
      const match = exactMatch || results[0];

      if (match && match.reviewScore !== undefined) {
        const evalResult: SkillEval = {
          skillName,
          reviewScore: Math.round(match.reviewScore * 100) / 100,
          hasEval: true,
          source: match.url || null,
        };
        evalCache.set(skillName, evalResult);
        return evalResult;
      }
    }
  } catch (error) {
    // CLI not available or search failed - use fallback
    console.log(`Tessl CLI lookup failed for ${skillName}, using fallback`);
  }

  // Fallback to known review scores
  const knownScore = KNOWN_REVIEW_SCORES[skillName];
  if (knownScore !== undefined) {
    const evalResult: SkillEval = {
      skillName,
      reviewScore: knownScore,
      hasEval: true,
      source: `https://tessl.io/registry?q=${encodeURIComponent(skillName)}`,
    };
    evalCache.set(skillName, evalResult);
    return evalResult;
  }

  // Return no-eval result
  const noEval: SkillEval = {
    skillName,
    reviewScore: null,
    hasEval: false,
    source: null,
  };
  evalCache.set(skillName, noEval);
  return noEval;
}

/**
 * Fetch evaluations for multiple skills in parallel
 */
export async function fetchSkillEvals(skillNames: string[]): Promise<Map<string, SkillEval>> {
  const results = new Map<string, SkillEval>();

  // Fetch all in parallel
  const evals = await Promise.all(
    skillNames.map((name) => fetchSkillEval(name))
  );

  evals.forEach((evalResult) => {
    results.set(evalResult.skillName, evalResult);
  });

  return results;
}

/**
 * Clear the eval cache (useful for refresh)
 */
export function clearEvalCache(): void {
  evalCache.clear();
}
