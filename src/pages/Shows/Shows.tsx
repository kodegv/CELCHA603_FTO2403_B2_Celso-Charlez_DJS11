import { useState, useEffect } from "react";
import './Shows.css'
import {  Show, Genre } from "../../utils/Interfaces";
import { fetchShowsAndGenres } from "../../utils/apiRequests";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import { isErrorWithMessage } from "../../utils/funstionsUtils";
import SortButton from "../../components/SortButton/SortButton";
import SearchQuery from "../../components/SearchQuery/SearchQuery";
import { format } from 'date-fns';
import Fuse from 'fuse.js';


export default function Shows(){

    const[shows, setShows] = useState<Show[]>([])
    const [genres, setGenres] = useState<Genre[]>([]);
    const [sortedShows, setSortedShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
      fetchShows();
    }, []);

    async function fetchShows() {
      try {
          const { shows, genres } = await fetchShowsAndGenres();
          const showsWithGenres = shows.map(show => ({
              ...show,
              genreTitles: show.genres
                  .map(genreId => genres.find(genre => genre.id === genreId)?.title)
                  .filter((title): title is string => title !== undefined)
          }));

          showsWithGenres.sort((a, b) => a.title.localeCompare(b.title));

          setShows(showsWithGenres);
          setGenres(genres);
          setSortedShows(showsWithGenres);
          setLoading(false);
      } catch (error: unknown) {
          if (isErrorWithMessage(error)) {
              setError(error.message);
          } else {
              setError('An unknown error occurred');
          }
      } finally {
          setLoading(false);
      }
  }

      const fuse = new Fuse(sortedShows, {
        keys: ['title', 'description', 'genreTitles'],
        threshold: 0.5
    });

    const filteredShows = searchTerm
    ? fuse.search(searchTerm).map(result => result.item)
    : sortedShows;


      function getGenreTitles(genreIds: number[]): string[] {
        return genreIds.map((id) => 
            genres.find((genre) => 
            genre.id === id)?.title).
            filter(Boolean) as string[];
      }


      if (loading) {
        return (
          <Loading />
        );
      }

      if (error) {
        return <Error message={error} />;
      }


    return (
        <>
        <div className="user-input">
        <div className="sort-button-container">
          <SortButton shows={shows} setSortedShows={setSortedShows} />
        </div>
        <div className="search-query-container">
          <SearchQuery searchQuery={searchTerm} setSearchQuery={setSearchTerm} />
        </div>
          
        </div>
         
        <div className="home">

                {filteredShows.map( show => (
                  <Link to={`/show/${show.id}`} key={show.id} >
                      <div className="show-container" 
                        style={{ backgroundImage: `url(${show.image})` }}>
                        <div className="show-content">
                            <h1 className="show-title">{show.title}</h1>
                        </div>
                            <p className="show-seasons">
                            {getGenreTitles(show.genres).join(' • ')} 
                            <br></br>
                            {show.seasons} {show.seasons > 1 ? 'Seasons' : 'Season'}
                            <br></br>
                            Updated: {format(new Date(show.updated), 'PPP')}
                            </p>
                           
                            
                      </div> 
                  </Link>
                    
                )) }
            </div> 
        </>
    )
}


// {
//     "id": "10716",
//     "title": "Something Was Wrong",
//     "description": "Something Was Wrong is an Iris Award-winning true-crime docuseries about the discovery, trauma, and recovery from shocking life events and abusive relationships.",
//     "seasons": 14,
//     "image": "https://content.production.cdn.art19.com/images/cc/e5/0a/08/cce50a08-d77d-490e-8c68-17725541b0ca/9dcebd4019d57b9551799479fa226e2a79026be5e2743c7aef19eac53532a29d66954da6e8dbdda8219b059a59c0abe6dba6049892b10dfb2f25ed90d6fe8d9a.jpeg",
//     "genres": [
//         1,
//         2
//     ],
//     "updated": "2022-11-03T07:00:00.000Z"
// }