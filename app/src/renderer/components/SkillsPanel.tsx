import { InstalledSkill } from '../../services/skillsScanner';

interface SkillsPanelProps {
  skills: InstalledSkill[];
}

// Hardcoded eval scores from Tessl research
const KNOWN_EVAL_SCORES: Record<string, { score: number; lift: number }> = {
  'agent-browser': { score: 71, lift: 42.5 },
  'remotion-best-practices': { score: 100, lift: 25.5 },
  'remotion': { score: 100, lift: 25.5 },
  'frontend-design': { score: 90.3, lift: 24.6 },
  'vercel-react-best-practices': { score: 78.5, lift: 16.5 },
  'karpathy-guidelines': { score: 88.3, lift: -3.5 },
};

interface SkillEval {
  hasEval: boolean;
  lift?: number;
  icon: string;
  className: string;
}

function getSkillEval(skillName: string): SkillEval {
  const known = KNOWN_EVAL_SCORES[skillName];
  if (!known) {
    return { hasEval: false, icon: '\u2753', className: 'no-eval' };
  }

  const { lift } = known;
  if (lift < 0) {
    return { hasEval: true, lift, icon: '\u274C', className: 'negative' };
  }
  if (lift < 5) {
    return { hasEval: true, lift, icon: '\u26A0\uFE0F', className: 'warning' };
  }
  return { hasEval: true, lift, icon: '\u2705', className: 'positive' };
}

function formatLift(lift: number): string {
  const sign = lift >= 0 ? '+' : '';
  return `${sign}${lift}`;
}

export function SkillsPanel({ skills }: SkillsPanelProps) {
  const openTesslRegistry = () => {
    window.open('https://tessl.io/registry', '_blank');
  };

  return (
    <div className="skills-panel">
      <div className="skills-header">
        <span className="skills-title">
          <span className="skills-icon">&#x1F9E9;</span> Skills Health
        </span>
        <span className="skills-count">{skills.length} active</span>
      </div>

      <div className="skills-list">
        {skills.length === 0 ? (
          <div className="no-skills">No skills found</div>
        ) : (
          skills.map((skill) => {
            const evalData = getSkillEval(skill.name);
            return (
              <div key={skill.path} className="skill-item">
                <div className="skill-info">
                  <span className={`skill-badge ${evalData.className}`}>
                    {evalData.icon}
                  </span>
                  <span className="skill-name" title={skill.name}>
                    {truncateName(skill.name)}
                  </span>
                </div>
                <span className={`skill-status ${evalData.className}`}>
                  {evalData.hasEval ? formatLift(evalData.lift!) : 'no eval'}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="tessl-link" onClick={openTesslRegistry}>
        Free evals on tessl.io &rarr;
      </div>
    </div>
  );
}

function truncateName(name: string, maxLength: number = 20): string {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength - 3) + '...';
}
