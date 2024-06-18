import React from 'react';

const Filters = ({ filters, onFilterChange }) => {
    return (
        <div>
            <label>End Year:</label>
            <input type="text" name="endYear" value={filters.endYear} onChange={onFilterChange} />
            <label>Topic:</label>
            <input type="text" name="topic" value={filters.topic} onChange={onFilterChange} />
            <label>Sector:</label>
            <input type="text" name="sector" value={filters.sector} onChange={onFilterChange} />
            <label>Region:</label>
            <input type="text" name="region" value={filters.region} onChange={onFilterChange} />
            <label>PEST:</label>
            <input type="text" name="pestle" value={filters.pestle} onChange={onFilterChange} />
            <label>Source:</label>
            <input type="text" name="source" value={filters.source} onChange={onFilterChange} />
            <label>Country:</label>
            <input type="text" name="country" value={filters.country} onChange={onFilterChange} />
        </div>
    );
};

export default Filters;
