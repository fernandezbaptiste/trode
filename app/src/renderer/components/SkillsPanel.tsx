import { InstalledSkill } from '../../services/skillsScanner';

interface SkillsPanelProps {
  skills: InstalledSkill[];
}

export function SkillsPanel({ skills }: SkillsPanelProps) {
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
          skills.map((skill) => (
            <div key={skill.path} className="skill-item">
              <div className="skill-info">
                <span className="skill-badge no-eval">&#x2753;</span>
                <span className="skill-name" title={skill.name}>
                  {truncateName(skill.name)}
                </span>
              </div>
              <span className="skill-status no-eval">no eval</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function truncateName(name: string, maxLength: number = 20): string {
  if (name.length <= maxLength) return name;
  return name.slice(0, maxLength - 3) + '...';
}
