import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import History from '../components/History';
import '../styles/JobCard.css'; // Ensure you have this stylesheet for the new styles
import '../styles/History.css';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const [jobs, setJobs] = useState<any[]>([]);
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        const response = await fetch(`https://skills-api-zeta.vercel.app/jobs/search?query=${query}`);
        const data = await response.json();
        setJobs(data.data.jobs);
      }
    };

    fetchSearchResults();
  }, [query]);

  const jobCount = jobs.length;

  return (
    <div>
      <Header />
      <div className = "search-box-border">
          <SearchBox />
      </div>

      <div className="all-jobs-container">
          <div className="job-cards-container">
            {query ? (
              <>
                <h2 className="all-jobs-title">Search Results for "{query}"</h2>
                <h2 className="all-jobs-title">{jobCount} {jobCount === 1 ? 'Job' : 'Jobs'} Found</h2>
                <div className="search-card-container">
                  {jobCount > 0 ? (
                    jobs.map((job) => (
                      <JobCard
                        key={job.id}
                        title={job.attributes.title}
                        jobId={job.id}
                        skills={job.relationships.skills.map((skill: any) => skill.id)}
                      />
                    ))
                  ) : (
                    <p>No results found</p>
                  )}
                </div>
              </>
            ) : (
              <p>Please enter a query in the search box above.</p>
            )}
                  <div>
                  <History />
                  </div>
          </div>
      </div>
    </div>
  );
};

export default SearchResults;
