import { InstalledSkill } from '../../services/skillsScanner';
import { SkillEval } from '../../services/tesslCli';

interface SkillsPanelProps {
  skills: InstalledSkill[];
  evals: Record<string, SkillEval>;
  onOpenTessl: () => void;
}

export function SkillsPanel({ skills, evals, onOpenTessl }: SkillsPanelProps) {
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
            const evalData = evals[skill.name];
            const { icon, className, statusText } = getSkillDisplay(evalData);

            return (
              <div key={skill.path} className="skill-item">
                <div className="skill-info">
                  <span className={`skill-badge ${className}`}>{icon}</span>
                  <span className="skill-name" title={skill.name}>
                    {truncateName(skill.name)}
                  </span>
                </div>
                <span className={`skill-status ${className}`}>{statusText}</span>
              </div>
            );
          })
        )}
      </div>

      <button className="tessl-link" onClick={onOpenTessl}>
        Free evals on tessl.io &rarr;
      </button>
    </div>
  );
}

function getSkillDisplay(evalData?: SkillEval): {
  icon: string;
  className: string;
  statusText: string;
} {
  if (!evalData || !evalData.hasEval) {
    return { icon: '\u2753', className: 'no-eval', statusText: 'no eval' };
  }

  const lift = evalData.lift ?? 0;

  if (lift < 0) {
    // Red - negative lift
    return {
      icon: '\u274C',
      className: 'eval-negative',
      statusText: `${lift}`,
    };
  } else if (lift >= 5) {
    // Green - lift >= 5
    return {
      icon: '\u2705',
      className: 'eval-positive',
      statusText: `+${lift}`,
    };
  } else {
    // Yellow - lift 0 to 5
    return {
      icon: '\u26A0\uFE0F',
      className: 'eval-neutral',
      statusText: `+${lift}`,
    };
  }
}

function truncateName(name: string, maxLength: number = 20): string {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength - 3) + '...';
}
