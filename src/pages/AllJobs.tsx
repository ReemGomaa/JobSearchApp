/*AllJobs.tsx- UI done functionality done(except rerendering bug) */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../store/jobsSlice';
import JobCard from '../components/JobCard';
import SearchBox from '../components/SearchBox';
import { RootState } from '../store/store';
import { AppDispatch } from '../store/store';
import Header from '../components/Header';
import { Job } from '../store/jobsSlice';
import '../styles/JobCard.css'; // Import the CSS file
import '../styles/SearchBox.css'; // Import the CSS file 

const JobCardMemo = React.memo(({ job }: { job: Job }) => (
  <JobCard
    key={job.id}
    title={job.attributes.title}
    jobId={job.id}
    skills={job.relationships.skills.map(skill => skill.id)}
  />
));

// Debounce function to limit how often the scroll handler runs
function debounce(func: Function, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const AllJobs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, status, error, totalJobs } = useSelector((state: RootState) => state.jobs);
  const [searchResults] = useState<Job[]>([]);
  const [searchBoxHeight, setSearchBoxHeight] = useState<number>(0);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<number>(0);
  const loadingRef = useRef<boolean>(false);

  useEffect(() => {
    dispatch(fetchJobs({ cursor: cursorRef.current, limit: 12 }));
  }, [dispatch]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (!loadingRef.current && jobs.length < totalJobs) {
        loadingRef.current = true;
        cursorRef.current = jobs.length;
        dispatch(fetchJobs({ cursor: cursorRef.current, limit: 12 }))
          .then(() => {
            loadingRef.current = false;
          });
      }
    }
  }, [dispatch, jobs.length, totalJobs]);

  useEffect(() => {
    const debouncedHandleScroll = debounce(handleScroll, 300);
    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [handleScroll]);

  const jobsToDisplay = searchResults.length > 0 ? searchResults : jobs;

  useEffect(() => {
    if (searchBoxRef.current) {
      setSearchBoxHeight(searchBoxRef.current.offsetHeight);
    }
  }, [searchResults, jobs]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (jobs.length === 0) return <div>No jobs found.</div>;

  return (
    <div>
      <Header />
        
      <div className = "search-box-border">
          <div ref={searchBoxRef}>
            <SearchBox />
          </div>
      </div>
         
          <div className="all-jobs-container">
            <h2 >Showing {jobs.length} of {totalJobs} Jobs Found</h2>
            <div className="job-card-container">
              {jobsToDisplay.map((job) => (
                <JobCardMemo key={job.id} job={job} />
              ))}
            </div>
        </div>
      
    </div>
  );
};

export default AllJobs;
