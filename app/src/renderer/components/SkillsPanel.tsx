import { useState, useEffect } from 'react';
import { InstalledSkill } from '../../services/skillsScanner';

interface SkillsPanelProps {
  skills: InstalledSkill[];
}

interface SkillEval {
  skillName: string;
  reviewScore: number | null;
  hasEval: boolean;
  source: string | null;
}

function getScoreClass(score: number | null): string {
  if (score === null) return 'no-eval';
  if (score >= 70) return 'high';
  if (score >= 50) return 'mid';
  return 'low';
}

function formatScore(score: number | null): string {
  if (score === null) return '—';
  return `${Math.round(score)}%`;
}

export function SkillsPanel({ skills }: SkillsPanelProps) {
  const [evals, setEvals] = useState<Record<string, SkillEval>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skills.length === 0) return;

    setLoading(true);
    const skillNames = skills.map((s) => s.name);

    window.electronAPI
      .fetchSkillEvals(skillNames)
      .then((result) => {
        setEvals(result);
      })
      .catch((err) => {
        console.error('Failed to fetch evals:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [skills]);

  const openTesslRegistry = () => {
    window.open('https://tessl.io/registry', '_blank');
  };

  const openSkillPage = (skillName: string) => {
    window.open(`https://tessl.io/registry?q=${encodeURIComponent(skillName)}`, '_blank');
  };

  return (
    <div className="skills-panel">
      <div className="skills-header">
        <div className="skills-title-row">
          <span className="skills-label">SKILLS</span>
          <span className="skills-count">{skills.length}</span>
        </div>
        {loading && <span className="skills-loading">syncing...</span>}
      </div>

      <div className="skills-grid">
        {skills.length === 0 ? (
          <div className="no-skills">No skills installed</div>
        ) : (
          skills.map((skill) => {
            const evalData = evals[skill.name];
            const score = evalData?.reviewScore ?? null;
            const scoreClass = getScoreClass(score);

            return (
              <div
                key={skill.path}
                className={`skill-chip ${scoreClass}`}
                onClick={() => openSkillPage(skill.name)}
                title={`${skill.name}${score !== null ? ` • ${score}% review score` : ' • No eval'}`}
              >
                <span className="skill-chip-name">{skill.name}</span>
                <span className={`skill-chip-score ${scoreClass}`}>
                  {formatScore(score)}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="tessl-cta" onClick={openTesslRegistry}>
        <span className="tessl-cta-text">Get evals on tessl.io</span>
        <span className="tessl-cta-arrow">→</span>
      </div>
    </div>
  );
}
