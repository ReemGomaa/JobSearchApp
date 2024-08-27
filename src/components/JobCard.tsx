import React, { useState, useEffect, memo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/JobCard.css'; 

interface JobCardProps {
  title: string;
  jobId: string;
  skills: string[];
}

const JobCard: React.FC<JobCardProps> = memo(({ title, jobId, skills }) => {
  const [skillNames, setSkillNames] = useState<string[]>([]);

  useEffect(() => {
    const fetchSkillNames = async () => {
      try {
        const names = await Promise.all(
          skills.map(async (skill) => {
            const response = await fetch(`https://skills-api-zeta.vercel.app/skill/${skill}`);
            
            if (!response.ok) {
              throw new Error(`Error fetching skill ${skill}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error(`Expected JSON but got ${contentType}`);
            }

            const data = await response.json();
            return data.data.skill.attributes.name; 
          })
        );
        setSkillNames(names);
      } catch (error) {
        console.error('Error fetching skill names:', error);
        setSkillNames([]);
      }
    };

    fetchSkillNames();
  }, [skills]);

  if (skillNames.length !== skills.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="job-card">
      <h1 className="job-title">{title}</h1>
      <h2 className="skills-req">Required Skills:</h2>
      <div className="skills-list">
        {skillNames.map((name, index) => (
          <span key={skills[index]} className="skill-box">
            <Link to={`/skill/${skills[index]}`}>{name}</Link>
          </span>
        ))}
      </div>
      <div className = "view-jobs">
        <Link to={`/job/${jobId}`} className="view-job-link">View Job</Link>
      </div>
    </div>
  );
});

export default JobCard;
