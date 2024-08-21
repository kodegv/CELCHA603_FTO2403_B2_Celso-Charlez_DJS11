import { useState, useEffect } from "react";
import {Genre, Show} from '../../utils/Interfaces'
import { fetchShowsAndGenres } from "../../utils/apiRequests";

import { Link } from 'react-router-dom';
import Loading from "../../components/Loading/Loading";


import './Genres.css'


export default function Genres(){
    
  const [genres, setGenres] = useState<Genre[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

   
  useEffect(() => {
    fetchData();
  }, []);


  async function fetchData() {
    try {
      const { shows, genres } = await fetchShowsAndGenres();
      setShows(shows);
      setGenres(genres);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  function getGenreImage(genre: Genre): string {
    const randomIndex = Math.floor(Math.random() * genre.shows.length);
    const genreShowId = genre.shows[randomIndex];
    const genreShow = shows.find(show => show.id === genreShowId);
    return genreShow ? genreShow.image : '';
  }



  return (
    <div className="genres-page">
      {loading ? (
        <Loading />
      ) : (
        <div className="genres-list">
          {genres.map(genre => {
            const genreSlug = genre.title.toLowerCase().replace(/ /g, '-');
            return (
              <Link
                key={genre.id}
                to={`/genre/${genreSlug}`}
                state={{ genre }}
                className="genre-link"
              >
                <div
                  className="genre-container"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.5)), url(${getGenreImage(genre)})`
                  }}
                >
                  <h2 className="genre-title">{genre.title}</h2>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}


// {
//   "id": 1,
//   "title": "Personal Growth",
//   "description": "Looking to improve yourself and reach your full potential? Look no further than our collection of personal growth podcasts! Our curated selection features a wide range of experts and thought leaders sharing their insights and strategies on everything from goal setting and productivity to mindfulness and self-care. Whether you're looking to advance your career, improve your relationships, or simply live a happier and more fulfilling life, our podcasts offer practical, actionable advice to help you achieve your goals.",
//   "shows": [
//       "10716",
//       "10276",
//       "6756",
//       "10660"
//   ]
// }