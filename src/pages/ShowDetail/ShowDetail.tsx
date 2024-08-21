import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import { ShowDetails } from "../../utils/Interfaces";
import { fetchShowDetails } from "../../utils/apiRequests";
import Loading from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";

import './ShowDetail.css'
import { AiFillRightCircle, AiFillLeftCircle } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";

export default function ShowDetail(){

    const { id } = useParams<{ id: string }>();
   
    const [show, setShow] = useState<ShowDetails | null>(null);
    const [error, setError] = useState<string | null>(null);


    const [showMore, setShowMore] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const seasonListRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
      const getShowDetails = async () => {
        if (id) {
          try {
            const data = await fetchShowDetails(id);
            setShow(data);
  
            if (!location.pathname.includes('season')) {
              navigate(`season/0`, { state: 
                { season: data.seasons[0], showTitle: data.title}});
            }
          } catch (err) {
            setError((err as Error).message);
          }
        }
      };
    
        getShowDetails();
      }, [id, location.pathname, navigate]);


      if (error) {
        return <Error message={error} />;
      }

        if (!show) {
        return <Loading />;
        }

        const headerStyle = {
            backgroundImage: 
            `linear-gradient(to bottom, rgba(0, 0, 0, 0.8), 
            rgba(0, 0, 0, 0.5)), 
            url(${show.image})`
          };

          const description = show.description;
          const shortDescription = description.split(' ')
            .slice(0, 30)
            .join(' ') + '...';

        
            const scroll = (direction: 'left' | 'right') => {
              if (seasonListRef.current) {
                const { scrollLeft, clientWidth } = seasonListRef.current;
                const scrollTo = direction === 'left' 
                  ? scrollLeft - clientWidth : scrollLeft + clientWidth;
                seasonListRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
              }
            };   

        const handleBack = () => {
          navigate('/'); 
        };

        const getFilteredGenres = (genres: string[]) => {
          const excludedGenres = ['All', 'Featured'];
          return genres.filter(genre => !excludedGenres.includes(genre));
      };
        


    return (
    <div className="show-details">
      <button className="back-button" onClick={handleBack}>
        <IoArrowBack />
      </button>
      <div className="show-header" style={headerStyle}>
        <h1>{show.title}</h1>
        <div>
          <span>{show.seasons.length} {show.seasons.length > 1 ? 'Seasons' : 'Season'}</span>
          <br></br>
          <span>{show.genres && getFilteredGenres(show.genres).join(', ')}</span>
        </div>
      </div>
      <div className={`show-description ${showMore ? 'full' : ''}`}>
        {showMore ? description : shortDescription}
        {description.split(' ').length > 30 && (
          <span className="show-more" onClick={() => setShowMore(!showMore)}>
            {showMore ? 'Show less' : 'Show more'}
          </span>
        )}
      </div>
      <div className="season-container">
        <button className="scroll-button left" onClick={() => scroll('left')}>
          <AiFillLeftCircle />
        </button>
        <div className="seasons" ref={seasonListRef}>
          {show.seasons.map((season, index) => (
            <div key={season.season} className="season-item" 
              onClick={() => 
                navigate(`/show/${id}/season/${index}`, 
              { state: { season, showTitle: show.title }  })}>
              <h2>{season.title}</h2>
              <img src={season.image} alt={season.title} />
            </div>
          ))}
        </div>
        <button className="scroll-button right" onClick={() => scroll('right')}>
          <AiFillRightCircle />
        </button>
      </div>
      <Outlet />
    </div>   
    )
}