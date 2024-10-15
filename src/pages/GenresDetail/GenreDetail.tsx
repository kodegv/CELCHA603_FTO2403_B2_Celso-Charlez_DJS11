import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate} from 'react-router-dom';
import { Genre, ShowDetails } from '../../utils/Interfaces';
import { fetchShowDetails } from '../../utils/apiRequests';
import Loading from "../../components/Loading/Loading";

import './GenreDetail.css'
import { IoArrowBack } from "react-icons/io5";

export default function GenresDetail(){

    const location = useLocation();
    const navigate = useNavigate();
    const { genre } = location.state as { genre: Genre };
    const [shows, setShows] = useState<ShowDetails[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchShows = async () => {
          try {
            const showDetails = await Promise.all(
              genre.shows.map(showId => fetchShowDetails(showId))
            );
            setShows(showDetails);
            setLoading(false);
          } catch (error) {
            setLoading(false);
          }
        };
    
        fetchShows();
      }, [genre.shows]);
    
      if (loading) {
        return <Loading />;
      }

      const handleBack = () => {
        navigate('/genres'); 
      };

    

    return (
        <div className="genre-detail-page">
        <div className="genre-header">
          <button className="genre-button" onClick={handleBack}>
            <IoArrowBack />
          </button>
          <h2>{genre.title}</h2>
          <p>{genre.description}</p>
        </div>
        <div className="shows-list">
        {shows.map(show => (
          <Link to={`/show/${show.id}`} key={show.id} >
              <div className="show-item">
                <div className="show-header" 
                style={{ backgroundImage: 
                    `linear-gradient(to bottom, rgba(0, 0, 0, 0.8), 
                    rgba(0, 0, 0, 0.5)), 
                    url(${show.image})` }}>
                  <h1>{show.title}</h1>
                  <div>
                    <span>{show.seasons.length} {show.seasons.length > 1 ? 'Seasons' : 'Season'}</span>
                  </div>
                </div>
              </div>
          </Link>
          
        ))}
      </div>
      </div>
    )
}