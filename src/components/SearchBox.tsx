import React, { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { useDispatch } from 'react-redux';
import { addToHistory } from '../store/historySlice';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBox.css';

interface Job {
  id: string;
  attributes: {
    title: string;
  };
}

const SearchBox: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Job[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchSuggestions = async (searchTerm: string) => {
    if (searchTerm.length >= 3) {
      try {
        const response = await fetch(`https://skills-api-zeta.vercel.app/jobs/search?query=${searchTerm}`);
        const data = await response.json();
        setSuggestions(data.data.jobs);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 300),
    []
  );

  useEffect(() => {
    debouncedFetchSuggestions(query);
  }, [query, debouncedFetchSuggestions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim().length > 0) {
      const searchURL = `/jobs/search?query=${query.trim()}`;
      dispatch(addToHistory(searchURL)); // Add search URL to history
      navigate(searchURL);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (jobId: string) => {
    setQuery('');
    setSuggestions([]);
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="search-box-container">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for jobs"
        className="search-box-input"
      />
      <button className="search-button" onClick={handleSearch}>Search</button>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((job) => (
            <li
              key={job.id}
              onClick={() => handleSuggestionClick(job.id)}
            >
              {job.attributes.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;
