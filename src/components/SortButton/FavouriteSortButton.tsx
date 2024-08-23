import { useState, useEffect } from 'react';
import { AiFillDownCircle } from "react-icons/ai";
import { FavouriteDetail } from '../../utils/Interfaces';
import './SortButton.css';

import { FaSortAlphaDown, FaSortAlphaDownAlt, FaSortNumericDownAlt, FaSortNumericUp } from "react-icons/fa";
import { LiaSortSolid } from "react-icons/lia";

interface FavouriteSortButtonProps {
  shows: FavouriteDetail[];
  setSortedShows: (shows: FavouriteDetail[]) => void;
}

const FavouriteSortButton: React.FC<FavouriteSortButtonProps> = ({ shows, setSortedShows }) => {
    const [sortMenuOpen, setSortMenuOpen] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState('Sort By: A-Z');

    useEffect(() => {
        handleSort('A-Z');
    }, []);

    function handleSort(option: string) {
        setSelectedSortOption(` ${option}`);
        setSortMenuOpen(false);
        sortShows(option);
    }

    function sortShows(option: string) {
        let sorted = [...shows];
        switch (option) {
            case 'A-Z':
                sorted = sorted.sort((a, b) => a.showTitle.localeCompare(b.showTitle));
                break;
            case 'Z-A':
                sorted = sorted.sort((a, b) => b.showTitle.localeCompare(a.showTitle));
                break;
            case 'Newest':
                sorted = sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                break;
            case 'Oldest':
                sorted = sorted.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                break;
            default:
                break;
        }
        setSortedShows(sorted);
    }

    function toggleSortMenu() {
        setSortMenuOpen(!sortMenuOpen);
    }

    return (
        <div className="sort-button-container">
            <button onClick={toggleSortMenu} className="sort-button">
            <LiaSortSolid /> {selectedSortOption} <AiFillDownCircle className="icon" />
            </button>
            {sortMenuOpen && (
                <div className="sort-menu">
                    <button onClick={() => handleSort('A-Z')}><FaSortAlphaDown /></button>
                    <button onClick={() => handleSort('Z-A')}><FaSortAlphaDownAlt /></button>
                    <button onClick={() => handleSort('Newest')}><FaSortNumericDownAlt /></button>
                    <button onClick={() => handleSort('Oldest')}><FaSortNumericUp /></button>
                </div>
            )}
        </div>
    );
};

export default FavouriteSortButton;