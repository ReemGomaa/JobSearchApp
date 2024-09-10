import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../store/jobsSlice';
import JobCard from '../components/JobCard';
import SearchBox from '../components/SearchBox';
import { RootState } from '../store/store';
import { AppDispatch } from '../store/store';
import Header from '../components/Header';
import { Job } from '../store/jobsSlice';
import '../styles/JobCard.css'; 
import '../styles/SearchBox.css'; 

// Memoized JobCard to avoid unnecessary re-renders
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

  // Initial job fetch (on mount only)
  useEffect(() => {
    dispatch(fetchJobs({ cursor: cursorRef.current, limit: 12 }));
  }, [dispatch]);

  // Scroll handler for loading more jobs when the user scrolls to the bottom
  const handleScroll = useCallback(
    debounce(() => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        // Load more jobs if we haven't reached the total number of jobs yet and it's not already loading
        if (jobs.length < totalJobs && !loadingRef.current) {
          loadingRef.current = true;
          cursorRef.current = jobs.length;
          dispatch(fetchJobs({ cursor: cursorRef.current, limit: 12 }))
            .then(() => {
              loadingRef.current = false;
            });
        }
      }
    }, 200), // Debouncing the scroll handler to avoid excessive calls
    [dispatch, jobs.length, totalJobs]
  );

  // Adding and removing scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Update search box height after jobs or search results change
  useEffect(() => {
    if (searchBoxRef.current) {
      setSearchBoxHeight(searchBoxRef.current.offsetHeight);
    }
  }, [searchResults, jobs]);

  

  // Conditional rendering based on the loading status
  if (status === 'loading' && jobs.length === 0) return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (jobs.length === 0) return <div>No jobs found.</div>;

  return (
    <div>
      <Header />
      <div className="search-box-border">
        <div ref={searchBoxRef}>
          <SearchBox />
        </div>
      </div>
      <div className="all-jobs-container">
        <h2>Showing {jobs.length} of {totalJobs} Jobs Found</h2>
        <div className="job-card-container">
          {jobs.map((job) => (
            <JobCardMemo key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllJobs;