import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ReqSkills.css';

interface ReqSkillsProps {
  name: string;
  type: string;
  importance: string;
  level: string;
}

const ReqSkills: React.FC<{ skillId: string }> = ({ skillId }) => {
  const [skillAttributes, setSkillAttributes] = useState<ReqSkillsProps | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkillAttributes = async () => {
      setError(null); // Reset error state before making a request
      try {
        const response = await fetch(`https://skills-api-zeta.vercel.app/skill/${skillId}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.data || !data.data.skill || !data.data.skill.attributes) {
          throw new Error('Unexpected data format');
        }
        const attributes = data.data.skill.attributes;
        
        // Extracting the attributes and setting them to state
        setSkillAttributes({
          name: attributes.name,
          type: attributes.type,
          importance: attributes.importance,
          level: attributes.level,
        });
      } catch (error) {
        setError(`Error fetching skill attributes: ${(error as Error).message}`);
        console.error('Error fetching skill attributes:', error);
      }
    };

    fetchSkillAttributes();
  }, [skillId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!skillAttributes) {
    return <div>Loading...</div>;
  }

  return (
    <div className="req-skills-box">
      <h2 className="req-skills-name">
        <Link to={`/skill/${skillId}`}>{skillAttributes.name}</Link>
      </h2>
      <p className="req-skills-item">Type: {skillAttributes.type}</p>
      <p className="req-skills-item">Importance: {skillAttributes.importance}</p>
      <p className="req-skills-item">Level: {skillAttributes.level}</p>
    </div>
  );
};

export default ReqSkills;
