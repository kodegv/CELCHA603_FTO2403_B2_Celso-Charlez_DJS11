import { useEffect, useState } from 'react';
import { FavouriteDetail } from '../../utils/Interfaces';
import FavouriteSortButton from '../../components/SortButton/FavourtieSortButton';
import './Favourites.css';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import { AiFillDownCircle } from "react-icons/ai";
import { LuFilter } from "react-icons/lu";

export default function Favourites() {
  const [favouriteEpisodes, setFavouriteEpisodes] = useState<FavouriteDetail[]>([]);
  const [sortedFavourites, setSortedFavourites] = useState<FavouriteDetail[]>([]);
  const [filteredShowTitle, setFilteredShowTitle] = useState<string | null>(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterLabel, setFilterLabel] = useState('All Shows');

  useEffect(() => {
    try {
      const storedFavourites = JSON.parse(localStorage.getItem('favoriteDetails') || '[]');
      if (Array.isArray(storedFavourites)) {
        setFavouriteEpisodes(storedFavourites);
        setSortedFavourites(storedFavourites);
        // console.log('Favourites loaded from localStorage:', storedFavourites);
      } else {
        console.warn('Stored favourites is not an array:', storedFavourites);
      }
    } catch (error) {
      console.error('Error loading favourites from localStorage:', error);
    }
  }, []);

  const handleDelete = (showId: string, season: string, episodeNumber: number) => {
    const updatedFavourites = favouriteEpisodes.filter(fav =>
      !(fav.showId === showId && fav.season === season && fav.episode.episode_number === episodeNumber)
    );
    setFavouriteEpisodes(updatedFavourites);
    setSortedFavourites(updatedFavourites);
    localStorage.setItem('favoriteDetails', JSON.stringify(updatedFavourites));
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const groupByShowAndSeason = (favourites: FavouriteDetail[]) => {
    const grouped: { [key: string]: { [key: string]: FavouriteDetail[] } } = {};
    favourites.forEach(fav => {
      if (!grouped[fav.showTitle]) {
        grouped[fav.showTitle] = {};
      }
      if (!grouped[fav.showTitle][fav.season]) {
        grouped[fav.showTitle][fav.season] = [];
      }
      grouped[fav.showTitle][fav.season].push(fav);
    });
    return grouped;
  };

  const groupedFavourites = groupByShowAndSeason(sortedFavourites);

  const uniqueShowTitles = Array.from(new Set(favouriteEpisodes.map(fav => fav.showTitle)));

  const handleFilterChange = (showTitle: string | null) => {
    setFilteredShowTitle(showTitle);
    setSortMenuOpen(false);
    setFilterLabel(showTitle ? showTitle : 'All Shows');
  };

  const filteredGroupedFavourites = filteredShowTitle
    ? { [filteredShowTitle]: groupedFavourites[filteredShowTitle] }
    : groupedFavourites;

  if (sortedFavourites.length === 0) {
    return <div className="favourites">No favourite episodes yet.</div>;
  }

  return (
    <div className="favourites">
      <h1>Your Favourite Episodes</h1>
      <div className="controls">
        <FavouriteSortButton shows={favouriteEpisodes} setSortedShows={setSortedFavourites} />
        <div className="filter-button-container">
          <button onClick={() => setSortMenuOpen(!sortMenuOpen)} className="sort-button">
          <LuFilter /> {filterLabel}<AiFillDownCircle className="icon" />
          </button>
          {sortMenuOpen && (
            <div className="sort-menu">
              <button onClick={() => handleFilterChange(null)}>All Shows</button>
              {uniqueShowTitles.map(showTitle => (
                <button key={showTitle} onClick={() => handleFilterChange(showTitle)}>{showTitle}</button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="favourite-list">
        {Object.entries(filteredGroupedFavourites).map(([showTitle, seasons]) => (
          <div key={showTitle} className="show-group">
            <h2>{showTitle}</h2>
            {Object.entries(seasons).map(([seasonTitle, episodes]) => (
              <div key={seasonTitle} className="season-group">
                <h3>{seasonTitle}</h3>
                {episodes.map(fav => (
                  <div key={`${fav.showId}-${fav.season}-${fav.episode.episode_number}`} className="favourite-item">
                    <div className="favourite-info">
                      <img src={fav.season_image} alt="Show" className="show-image" />
                      <div className="episode-details">
                        <h4>Episode {fav.episode.episode_number}: {fav.episode.title}</h4>
                        <p>{fav.episode.description || 'No description available.'}</p>
                        <p className="timestamp">Added on: {formatDate(fav.timestamp)}</p>
                      </div>
                      <button onClick={() => handleDelete(fav.showId, fav.season, fav.episode.episode_number)} className="delete-button">
                        <RiDeleteBin2Fill />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}