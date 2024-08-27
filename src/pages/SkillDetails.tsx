import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/SkillDetails.css';

interface Job {
  id: string;
  attributes: { title: string };
}

interface Skill {
  id: string;
  attributes: {
    name: string;
    type: string;
    importance: string;
    level: string;
  };
  relationships: {
    jobs: { id: string }[];
    skills: { id: string }[];
  };
}

const SkillDetails: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [relatedSkills, setRelatedSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkillDetails = async () => {
      try {
        const response = await fetch(`https://skills-api-zeta.vercel.app/skill/${skillId}`);
        const data = await response.json();
        setSkill(data.data.skill);

        // Fetch related jobs
        const jobPromises = data.data.skill.relationships.jobs.map((job: { id: string }) =>
          fetch(`https://skills-api-zeta.vercel.app/job/${job.id}`).then((res) => res.json())
        );
        const jobs = await Promise.all(jobPromises);
        setRelatedJobs(jobs.map((jobData) => jobData.data.job));

        // Fetch related skills
        const skillPromises = data.data.skill.relationships.skills.map((relatedSkill: { id: string }) =>
          fetch(`https://skills-api-zeta.vercel.app/skill/${relatedSkill.id}`).then((res) => res.json())
        );
        const skills = await Promise.all(skillPromises);
        setRelatedSkills(skills.map((skillData) => skillData.data.skill));

      } catch (error) {
        console.error('Error fetching skill details:', error);
      }
    };

    fetchSkillDetails();
  }, [skillId]);

  if (!skill) {
    return <div>Loading...</div>;
  }

  return (
    <div>
    <Header />
    <div className="skill-details-container">
      
      <h1 className="skill-title">{skill.attributes.name}</h1>

      <div className="skill-attributes-box">
        <p>Type: {skill.attributes.type}</p>
        <p>Importance: {skill.attributes.importance}</p>
        <p>Level: {skill.attributes.level}</p>
      </div>

      <div className="related-boxes-container">
        <div className="related-jobs-box">
          <h2>Related Jobs:</h2>
          <ul>
            {relatedJobs.map((job) => (
              <li key={job.id}>
                <Link to={`/job/${job.id}`}>{job.attributes.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="related-skills-box">
          <h2>Related Skills:</h2>
          <ul>
            {relatedSkills.map((relatedSkill) => (
              <li key={relatedSkill.id}>
                <Link to={`/skill/${relatedSkill.id}`}>{relatedSkill.attributes.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SkillDetails;
