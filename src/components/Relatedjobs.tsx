import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RelatedJobs.css';

interface SkillCardProps {
  title: string;
  skillId: string;
  jobs: string[];
}

const SkillCard: React.FC<SkillCardProps> = ({ title, skillId, jobs }) => {
  const [jobNames, setJobNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobNames = async () => {
      setError(null); //Reset error state before making a request
      try {
        const names = await Promise.all(
          jobs.map(async (job) => {
            const response = await fetch(`https://skills-api-zeta.vercel.app/job/${job}`);
            if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            if (!data.data || !data.data.skill || !data.data.skill.attributes) {
              throw new Error('Unexpected data format');
            }
            return data.data.skill.attributes.title;
          })
        );
        setJobNames(names);
      } catch (error) {
        setError(`Error fetching job names: ${(error as Error).message}`);
        console.error('Error fetching job names:', error);
      }
    };

    fetchJobNames();
  }, [jobs]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (jobNames.length !== jobs.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="related-jobs-container">
        <h3 className="related-jobs-title">Related Jobs</h3>
        <ul className="related-jobs-list">
          {jobNames.map((name, index) => (
            <Link key={jobs[index]} to={`/job/${jobs[index]}`}>
              {name}
              {index < jobNames.length - 1 ? ', ' : ''}
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SkillCard;
