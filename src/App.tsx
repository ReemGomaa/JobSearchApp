import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AllJobs from './pages/AllJobs'; // Adjust the import path
import SearchResults from './pages/SearchResults'; // Adjust the import path
import JobDetails from './pages/JobDetail'; // Adjust the import path
import SkillDetails from './pages/SkillDetails';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
       <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<AllJobs />} />
        <Route path="/jobs/search" element={<SearchResults />} /> 
        <Route path="/job/:jobId" element={<JobDetails />} />
        <Route path="/skill/:skillId" element={<SkillDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
