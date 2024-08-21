import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {  LocationState, Episode } from '../../utils/Interfaces';
import { useAudioPlayer } from '../../components/AudioPlayer/AudioPlayerContext';

import FavoriteButton from '../../components/FavoriteButton/FavoriteButton';
import './SeasonDetail.css'




export default function SeasonDetail(){

    const { id: showId } = useParams<{ id: string }>();
    const location = useLocation();
    const { season, showTitle } = location.state as LocationState 
    const { playEpisode, setEpisodes } = useAudioPlayer();
    const [favorites, setFavorites] = useState<{[key: string]: boolean}>({});

    

    useEffect(() => {
        if (season) {
          setEpisodes(season.episodes);
    
          // Load favorites from localStorage and update the state
          const storedFavorites = JSON.parse(localStorage.getItem('favoriteDetails') || '[]');
          const favoriteMap: { [key: string]: boolean } = {};
    
          storedFavorites.forEach((fav: any) => {
            if (fav.showId === showId && fav.season === season.title) {
              favoriteMap[`${season.title}-${fav.episode.episode_number}`] = true;
            }
          });
    
          setFavorites(favoriteMap);
        }
      }, [season.episodes, setEpisodes, showId]);
    
      const handleFavoriteToggle = (episode: Episode) => {
        const episodeKey = `${season.title}-${episode.episode}`;
        const updatedFavorites = { ...favorites, [episodeKey]: !favorites[episodeKey] };
    
        // Update state and localStorage
        setFavorites(updatedFavorites);
    
        // Check if favoriteDetails exists in localStorage, if not initialize it
        let storedFavorites = JSON.parse(localStorage.getItem('favoriteDetails') || '[]');
        if (!Array.isArray(storedFavorites)) {
          storedFavorites = [];
        }
    
        const favoriteExists = storedFavorites.some((fav: any) =>
          fav.showId === showId &&
          fav.season === season.title &&
          fav.episode.episode_number === episode.episode
        );
    
        if (updatedFavorites[episodeKey] && !favoriteExists) {
          // Add to favorites if not already there
          storedFavorites.push({
            showId,
            showTitle,
            season: season.title,
            season_image: season.image,
            episode: {
              title: episode.title,
              description: episode.description,
              episode_number: episode.episode,
            },
            timestamp: new Date().toISOString()
          });
        } else if (!updatedFavorites[episodeKey]) {
          // Remove from favorites
          storedFavorites = storedFavorites.filter((fav: any) =>
            !(fav.showId === showId && fav.season === season.title && fav.episode.episode_number === episode.episode)
          );
        }
        
        // console.log(storedFavorites)
        localStorage.setItem('favoriteDetails', JSON.stringify(storedFavorites));
      };
    
      return (
        <div className='season-detail'>
          <h1 className="season-title">{season.title}
            <span className="episode-count"> : {season.episodes.length} episodes</span>
          </h1>
          <div className='episode-list'>
            {season.episodes.map((episode: Episode) => {
              const episodeKey = `${season.title}-${episode.episode}`;
              return (
                <div
                  key={episode.episode}
                  className="episode-item"
                  onClick={() => playEpisode(episode, season.image)}
                >
                  <div className="episode-number">{episode.episode}</div>
                  <div className="episode-info">
                    <h2 className="episode-title">{episode.title}</h2>
                    <p className="episode-description">{episode.description}</p>
                  </div>
                  <div className="favorite-button-container" onClick={(e) => {
                    e.stopPropagation();
                    handleFavoriteToggle(episode);
                  }}>
                    <FavoriteButton isFavorite={favorites[episodeKey]} toggleFavorite={() => handleFavoriteToggle(episode)} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }


/*
    [
    {
        "season": 1,
        "title": "Season 1",
        "image": "https://res.cloudinary.com/dumslp4el/image/fetch/w_676,h_676/https://content.production.cdn.art19.com/images/ec/3b/a1/7a/ec3ba17a-7e3a-4ced-913b-3b13ecb1d3b8/f17fd8654df24c14989043e38adaeeed0e2a194abe0efd669261a98a12f5f4a63d831c4fb3391f2274ec882beebe77ca898209fab16bd28c513fd19f3c1fddad.jpeg",
        "episodes": [
            {
                "title": "Sic Semper Tyrannis",
                "description": "President Lincoln is mortally wounded. The nation is under attack. Secretary of War Edwin M. Stanton takes control and tries to protect Vice President Andrew Johnson.",
                "episode": 1,
                "file": "https://podcast-api.netlify.app/placeholder-audio.mp3"
            },
        ]
    },
    {
        "season": 2,
        "title": "Season 2",
        "image": "https://res.cloudinary.com/dumslp4el/image/fetch/w_676,h_676/https://content.production.cdn.art19.com/images/27/ef/a0/19/27efa019-8ce6-4e39-ac16-641e77fed02e/c91ba93f8c6e9b15a3a9bea7e20cd6e67d2292983ef54390ba84eefcb43edcb9c6b5b34db6ce7f0e3e673183e64b7f5cc4cd69769f249aba8bfb9e5212d2c1af.jpeg",
        "episodes": [
            {
                "title": "Prologue 1: The Man from Foggy Town",
                "description": "Edwin Stanton sits down with a famous scribe to tell the story of the events that led to Johnson’s impeachment. ",
                "episode": 1,
                "file": "https://podcast-api.netlify.app/placeholder-audio.mp3"
            },
        ]
    }
]

*/