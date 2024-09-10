import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { Link } from 'react-router-dom';
import { clearHistory } from '../store/historySlice';
import '../styles/History.css';

const History: React.FC = () => {
  const history = useSelector((state: RootState) => state.history.history);
  const dispatch = useDispatch();

  //Function to extract the query from the URL
  const getQueryFromURL = (url: string) => {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    return urlParams.get('query') || '';
  };

  return (
    <div className="history-container">
      <h3 className="history-title">Search History</h3>
      <ul className="history-list">
        {history
          .map((url) => getQueryFromURL(url))
          .filter((query) => query) // Filter out empty strings
          .map((query, index) => (
            <li key={index}>
              <Link to={`/jobs/search?query=${query}`}>{query}</Link>
            </li>
          ))}
      </ul>
      <button className="clear-history-button" onClick={() => dispatch(clearHistory())}>
        Clear History
      </button>
    </div>
  );
};

export default History;
