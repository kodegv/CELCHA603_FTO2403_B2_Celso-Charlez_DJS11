import { useState, useRef, useEffect  } from 'react';
import { FaSearch } from "react-icons/fa";
import { MdOutlineClear } from "react-icons/md";
import './SearchQuery.css';
import { SearchQueryProps } from '../../utils/Interfaces';


const SearchQuery: React.FC<SearchQueryProps> = ({ searchQuery, setSearchQuery }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function toggleSearch() {
    setSearchOpen(!searchOpen);
  }

  function clearSearch() {
    if (inputRef.current) {
      inputRef.current.value = '';
      setSearchQuery('');
    }
  }

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <div className="search-container">
      {searchOpen && (
        <div className="search-form">
          <input
            type="text"
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for podcasts..."
          />
          <MdOutlineClear className="clear-icon" onClick={clearSearch} />
        </div>
      )}
      <span className="search-icon" onClick={toggleSearch}>
        <FaSearch className="icon" />
      </span>
    </div>
  );
};

export default SearchQuery;