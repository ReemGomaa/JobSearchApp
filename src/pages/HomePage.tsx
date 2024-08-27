import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Welcome to the Job Search Application!</h1>
        
        <Link to="/jobs">
          <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            View All Jobs
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
