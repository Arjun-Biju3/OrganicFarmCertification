import React, { useState } from 'react';
import './SearchBar.css'; 

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearch(searchTerm);  
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Search by Farm ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}  
            />
        </div>
    );
};

export default SearchBar;
