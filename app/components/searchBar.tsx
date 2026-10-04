'use client'; // Enables client-side onInteraction interactions

import { useState } from "react";

const [searchQuery, setSearchQuery] = useState('');
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
};

export default function SearchBar() {
    return (
        <div>
            <input
                id="searchInput"
                type="text"
                placeholder="I know about a million things..."
                value={searchQuery}
                onChange={handleSearchChange}
            />
        </div>
    );
}
