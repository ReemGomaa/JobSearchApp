import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReqSkills from '../components/ReqSkills';
import Header from '../components/Header';


interface Job {
  id: string;
  attributes: {
    title: string;
  };
  relationships: {
    skills: { id: string }[];
  };
}

const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>(); //Get jobId from URL params
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(`https://skills-api-zeta.vercel.app/job/${jobId}`);
        const data = await response.json();

        setJob(data.data.job);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header/>
      <h1 className = "req-skills-title">{job.attributes.title}</h1>
      <div className = "req-skills-container">
        <h2 className = "req-skills-dis">Required Skills:</h2>
        <ul>
          {job.relationships.skills.map(skill => (
              <li key={skill.id}>
                <ReqSkills skillId={skill.id} />
              </li>
          ))}
        </ul>
        </div>
    </div>
  );
};

export default JobDetails;
